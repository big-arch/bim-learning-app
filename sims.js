// Интерактивные тренажёры: ползунки меняют параметры, схема и вывод пересчитываются сразу.
// Каждый тренажёр — { title, lesson, intro, mount(el) }. Цвета берутся из CSS-переменных приложения.
(function () {
  "use strict";

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  let uid = 0;

  function slider(id, label, min, max, step, value, unit) {
    return (
      '<label class="sim-row" for="' + id + '"><span>' + esc(label) + '</span><b id="' + id + '-v">' + value + " " + unit + "</b></label>" +
      '<input class="sim-range" type="range" id="' + id + '" min="' + min + '" max="' + max + '" step="' + step + '" value="' + value + '">'
    );
  }

  /* ---------- Диапазон вида Revit ---------- */
  const VR_OBJECTS = [
    { name: "Стена", from: 0, to: 3000, x: 20, w: 16 },
    { name: "Стол", from: 0, to: 750, x: 60, w: 50 },
    { name: "Окно", from: 900, to: 2100, x: 20, w: 16, win: true },
    { name: "Навесной шкаф", from: 1450, to: 2150, x: 130, w: 40 },
    { name: "Балка", from: 2550, to: 3000, x: 190, w: 70 },
    { name: "Приямок в полу", from: -600, to: 0, x: 230, w: 40 }
  ];

  function vrStatus(o, p) {
    if (o.from <= p.cut && o.to >= p.cut) return { k: "cut", t: "в разрезе — жирные линии" };
    if (o.to < p.cut) {
      if (o.to > p.bottom) return { k: "proj", t: "в проекции — видно сверху" };
      if (o.to > p.depth) return { k: "beyond", t: "ниже низа, но в глубине вида — стиль «Дальше»" };
      return { k: "hidden", t: "ниже глубины вида — не видно" };
    }
    return { k: "hidden", t: "выше секущей плоскости — обычно не видно" };
  }

  function mountViewRange(el) {
    const n = ++uid;
    const ids = { top: "vrT" + n, cut: "vrC" + n, bottom: "vrB" + n, depth: "vrD" + n };
    el.innerHTML =
      '<div class="sim-stage" id="vrS' + n + '"></div>' +
      '<div class="sim-controls">' +
      slider(ids.top, "Верх", 1500, 3000, 50, 2300, "мм") +
      slider(ids.cut, "Секущая плоскость", 300, 2900, 50, 1200, "мм") +
      slider(ids.bottom, "Низ", -300, 1500, 50, 0, "мм") +
      slider(ids.depth, "Глубина вида", -900, 1500, 50, 0, "мм") +
      "</div>" +
      '<div class="sim-out" id="vrO' + n + '"></div>' +
      '<div class="btn-row mt"><button class="btn small" type="button" id="vrR' + n + '">Как по умолчанию</button>' +
      '<button class="btn small" type="button" id="vrQ' + n + '">Задача: покажите шкаф на плане</button></div>';
    const $ = (id) => el.querySelector("#" + id);
    const Y = (mm) => 200 - mm * 0.05; // 3000 мм → 150 px, уровень пола на y = 200

    function update(changed) {
      let p = { top: +$(ids.top).value, cut: +$(ids.cut).value, bottom: +$(ids.bottom).value, depth: +$(ids.depth).value };
      // Revit требует порядок: глубина ≤ низ ≤ секущая ≤ верх
      if (changed === ids.cut) { if (p.cut > p.top) p.top = p.cut; if (p.cut < p.bottom) p.bottom = p.cut; }
      if (changed === ids.top && p.top < p.cut) p.cut = p.top;
      if (changed === ids.bottom) { if (p.bottom > p.cut) p.cut = p.bottom; if (p.bottom < p.depth) p.depth = p.bottom; }
      if (changed === ids.depth && p.depth > p.bottom) p.bottom = p.depth;
      if (p.bottom > p.cut) p.bottom = p.cut;
      if (p.depth > p.bottom) p.depth = p.bottom;
      Object.keys(ids).forEach((k) => {
        $(ids[k]).value = p[k];
        $(ids[k] + "-v").textContent = p[k] + " мм";
      });

      let svg = '<svg viewBox="0 0 300 250" class="sim-svg" role="img" aria-label="Разрез помещения и границы диапазона вида">';
      svg += '<rect x="0" y="' + Y(3000) + '" width="300" height="' + (Y(-900) - Y(3000)) + '" class="sim-bg"/>';
      svg += '<rect x="0" y="' + Y(p.bottom) + '" width="300" height="' + (Y(p.depth) - Y(p.bottom)) + '" class="sim-band2"/>';
      svg += '<rect x="0" y="' + Y(p.top) + '" width="300" height="' + (Y(p.bottom) - Y(p.top)) + '" class="sim-band"/>';
      svg += '<rect x="0" y="200" width="300" height="6" class="sim-slab"/><rect x="0" y="' + (Y(3000) - 6) + '" width="300" height="6" class="sim-slab"/>';
      VR_OBJECTS.forEach((o) => {
        const s = vrStatus(o, p);
        const y1 = Y(o.to);
        const h = Y(o.from) - Y(o.to);
        if (o.win) {
          svg += '<rect x="' + o.x + '" y="' + y1 + '" width="' + o.w + '" height="' + h + '" class="sim-win sim-' + s.k + '"/>';
        } else {
          svg += '<rect x="' + o.x + '" y="' + y1 + '" width="' + o.w + '" height="' + h + '" rx="2" class="sim-obj sim-' + s.k + '"/>';
        }
      });
      const line = (mm, cls, label) =>
        '<line x1="0" x2="300" y1="' + Y(mm) + '" y2="' + Y(mm) + '" class="' + cls + '"/><text x="296" y="' + (Y(mm) - 3) + '" class="sim-lbl" text-anchor="end">' + label + "</text>";
      svg += line(p.top, "sim-l-top", "Верх");
      svg += line(p.cut, "sim-l-cut", "Секущая");
      svg += line(p.bottom, "sim-l-bot", "Низ");
      if (p.depth < p.bottom) svg += line(p.depth, "sim-l-depth", "Глубина");
      svg += '<text x="4" y="196" class="sim-lbl">±0.000</text></svg>';
      $("vrS" + n).innerHTML = svg;

      $("vrO" + n).innerHTML =
        '<ul class="sim-list">' +
        VR_OBJECTS.map((o) => {
          const s = vrStatus(o, p);
          return '<li><span class="sim-dot sim-' + s.k + '"></span><b>' + o.name + "</b><span>" + s.t + "</span></li>";
        }).join("") +
        "</ul>" +
        (vrStatus(VR_OBJECTS[3], p).k === "cut"
          ? '<p class="sim-ok">Шкаф попал в разрез — теперь он на плане. Так и решают задачу «навесная мебель не видна».</p>'
          : "") +
        '<p class="sim-note">Упрощённая модель: в Revit для отдельных категорий (например, окон и мебели) есть свои правила отображения выше секущей плоскости.</p>';
    }

    el.querySelectorAll(".sim-range").forEach((r) => r.addEventListener("input", () => update(r.id)));
    $("vrR" + n).addEventListener("click", () => {
      $(ids.top).value = 2300; $(ids.cut).value = 1200; $(ids.bottom).value = 0; $(ids.depth).value = 0;
      update();
    });
    $("vrQ" + n).addEventListener("click", () => {
      $("vrO" + n).insertAdjacentHTML("afterbegin", '<p class="sim-task">Шкаф висит на высоте 1450–2150 мм. Поднимите секущую плоскость так, чтобы она его пересекла, и посмотрите, что станет со столом.</p>');
    });
    update();
  }

  /* ---------- Коллизии: допуск и зазор ---------- */
  function mountClash(el) {
    const n = ++uid;
    const ids = { d: "clD" + n, tol: "clT" + n, clr: "clC" + n };
    const R1 = 80; // радиус воздуховода, мм
    const R2 = 50; // радиус трубы, мм
    el.innerHTML =
      '<div class="sim-stage" id="clS' + n + '"></div>' +
      '<div class="sim-controls">' +
      slider(ids.d, "Расстояние между осями", 60, 260, 5, 140, "мм") +
      slider(ids.tol, "Допуск проверки", 0, 40, 1, 10, "мм") +
      slider(ids.clr, "Требуемый зазор", 0, 80, 5, 30, "мм") +
      "</div>" +
      '<div class="sim-out" id="clO' + n + '"></div>';
    const $ = (id) => el.querySelector("#" + id);

    function update() {
      const d = +$(ids.d).value;
      const tol = +$(ids.tol).value;
      const clr = +$(ids.clr).value;
      [ids.d, ids.tol, ids.clr].forEach((k) => ($(k + "-v").textContent = $(k).value + " мм"));
      const gap = d - R1 - R2;
      let k, title, text;
      if (gap < -tol) {
        k = "bad"; title = "Жёсткая коллизия";
        text = "Элементы пересекаются на " + -gap + " мм — больше допуска. Попадёт в отчёт Clash Detective, нужно перетрассировать.";
      } else if (gap < 0) {
        k = "warn"; title = "Пересечение в пределах допуска";
        text = "Касание " + -gap + " мм не больше допуска " + tol + " мм — проверка его не покажет. Удобно против мелочи, опасно, если допуск слишком большой.";
      } else if (gap < clr) {
        k = "warn"; title = "Коллизия по зазору";
        text = "Пересечения нет, но зазор " + gap + " мм меньше требуемого " + clr + " мм — монтажник или изоляция не поместятся.";
      } else {
        k = "ok"; title = "Коллизии нет";
        text = "Зазор " + gap + " мм — не меньше требуемых " + clr + " мм.";
      }
      const S = 0.6; // мм → px
      const cx1 = 150 - (d * S) / 2;
      const cx2 = 150 + (d * S) / 2;
      let svg = '<svg viewBox="0 0 300 170" class="sim-svg" role="img" aria-label="Сечение воздуховода и трубы">';
      svg += '<rect x="0" y="0" width="300" height="170" class="sim-bg"/>';
      svg += '<circle cx="' + cx1 + '" cy="85" r="' + (R1 + clr) * S + '" class="sim-clr"/>';
      svg += '<circle cx="' + cx1 + '" cy="85" r="' + R1 * S + '" class="sim-duct"/>';
      svg += '<circle cx="' + cx2 + '" cy="85" r="' + R2 * S + '" class="sim-pipe sim-st-' + k + '"/>';
      svg += '<text x="' + cx1 + '" y="89" class="sim-lbl" text-anchor="middle">Ø' + R1 * 2 + "</text>";
      svg += '<text x="' + cx2 + '" y="89" class="sim-lbl" text-anchor="middle">Ø' + R2 * 2 + "</text>";
      svg += '<text x="8" y="162" class="sim-lbl">пунктир — требуемый зазор вокруг воздуховода</text></svg>';
      $("clS" + n).innerHTML = svg;
      $("clO" + n).innerHTML = '<div class="sim-verdict sim-v-' + k + '"><b>' + title + "</b><p>" + text + "</p></div>";
    }
    el.querySelectorAll(".sim-range").forEach((r) => r.addEventListener("input", update));
    update();
  }

  /* ---------- Шкала LOD на примере двери ---------- */
  const LOD = [
    { v: 100, t: "Условный объём", geo: "Прямоугольник-заполнитель: «здесь будет проём».", data: "Количество и место, примерная площадь." },
    { v: 200, t: "Типовой элемент", geo: "Обобщённая дверь: размер и положение приблизительны.", data: "Тип «дверь однопольная», ориентировочные размеры." },
    { v: 300, t: "Точная геометрия", geo: "Точные размеры, коробка, направление открывания.", data: "Марка, размер 900×2100, предел огнестойкости." },
    { v: 350, t: "Стыковка с соседями", geo: "Узел примыкания к стене, зазоры, наличники.", data: "Требования к монтажу и сопряжению." },
    { v: 400, t: "Для изготовления", geo: "Фурнитура: петли, доводчик, ручка с привязками.", data: "Артикулы, производитель, сборочные данные." },
    { v: 500, t: "Как построено", geo: "Геометрия по факту монтажа.", data: "Серийный номер, дата установки, гарантия, обслуживание." }
  ];

  function doorSvg(v) {
    let s = '<svg viewBox="0 0 220 230" class="sim-svg" role="img" aria-label="Дверь на уровне LOD ' + v + '">';
    s += '<rect x="0" y="0" width="220" height="230" class="sim-bg"/>';
    s += '<rect x="20" y="20" width="22" height="190" class="sim-slab"/><rect x="178" y="20" width="22" height="190" class="sim-slab"/>';
    if (v === 100) {
      s += '<rect x="42" y="30" width="136" height="180" class="sim-mass"/>';
      s += '<text x="110" y="125" class="sim-lbl" text-anchor="middle">проём</text>';
    } else {
      if (v >= 300) s += '<rect x="42" y="20" width="136" height="190" class="sim-frame"/>';
      s += '<rect x="' + (v >= 300 ? 52 : 46) + '" y="' + (v >= 300 ? 30 : 28) + '" width="' + (v >= 300 ? 116 : 128) + '" height="' + (v >= 300 ? 180 : 182) + '" class="sim-leaf"/>';
      if (v >= 300) {
        s += '<circle cx="152" cy="122" r="5" class="sim-handle"/>';
        s += '<path d="M52 210 A116 116 0 0 1 168 94" class="sim-swing"/>';
        s += '<text x="110" y="226" class="sim-lbl" text-anchor="middle">900 × 2100</text>';
      }
      if (v >= 350) s += '<path d="M42 20 h-8 v190 h8 M178 20 h8 v190 h-8" class="sim-trim"/>';
      if (v >= 400) {
        s += '<rect x="54" y="48" width="6" height="16" class="sim-hw"/><rect x="54" y="176" width="6" height="16" class="sim-hw"/>';
        s += '<rect x="70" y="34" width="60" height="6" rx="3" class="sim-hw"/>';
      }
      if (v >= 500) {
        s += '<rect x="122" y="38" width="40" height="22" rx="3" class="sim-tag"/><text x="142" y="53" class="sim-lbl sim-lbl-tag" text-anchor="middle">QR</text>';
      }
    }
    return s + "</svg>";
  }

  function mountLod(el) {
    const n = ++uid;
    el.innerHTML =
      '<div class="sim-lod"><div class="sim-stage" id="lodS' + n + '"></div><div id="lodO' + n + '"></div></div>' +
      '<div class="sim-controls"><label class="sim-row" for="lodR' + n + '"><span>Уровень проработки</span><b id="lodR' + n + '-v">LOD 300</b></label>' +
      '<input class="sim-range" type="range" id="lodR' + n + '" min="0" max="5" step="1" value="2">' +
      '<div class="sim-ticks">' + LOD.map((l) => "<span>" + l.v + "</span>").join("") + "</div></div>";
    const r = el.querySelector("#lodR" + n);
    function update() {
      const l = LOD[+r.value];
      el.querySelector("#lodR" + n + "-v").textContent = "LOD " + l.v;
      el.querySelector("#lodS" + n).innerHTML = doorSvg(l.v);
      el.querySelector("#lodO" + n).innerHTML =
        '<div class="sim-verdict sim-v-ok"><b>LOD ' + l.v + " — " + l.t + "</b><p><b>Геометрия:</b> " + l.geo + "</p><p><b>Информация:</b> " + l.data + "</p></div>" +
        '<p class="sim-note">LOD назначают под задачу стадии, а не «чем выше, тем лучше»: лишняя проработка стоит денег и тормозит модель.</p>';
    }
    r.addEventListener("input", update);
    update();
  }

  window.BIM_SIMS = {
    "view-range": {
      title: "Диапазон вида Revit",
      lesson: "revit-05",
      intro: "Двигайте границы диапазона и смотрите, что попадает на план: в разрез, в проекцию или пропадает.",
      mount: mountViewRange
    },
    clash: {
      title: "Допуск и зазор в проверке коллизий",
      lesson: "navis-04",
      intro: "Меняйте расстояние между воздуховодом и трубой, допуск и требуемый зазор — и смотрите, что покажет проверка.",
      mount: mountClash
    },
    lod: {
      title: "Шкала LOD на примере двери",
      lesson: "bim-03",
      intro: "Одна и та же дверь на уровнях от 100 до 500: что добавляется в геометрию и в данные.",
      mount: mountLod
    }
  };
})();
