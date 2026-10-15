// Персонажи-компаньоны BIM Academy. Каждый собирается из SVG-частей:
// тело и лицо у каждого свои, а позы, предметы и эффекты общие —
// поэтому все пятеро двигаются одинаково и выглядят в одном стиле.
(function () {
  "use strict";

  // Общая система координат: viewBox 0 0 160 150, персонаж стоит по центру (x = 80).
  const O = 'class="o"'; // контур в мультяшном стиле

  const eyeDot = (x, y, r) => ({
    open: '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="#1d2133"/><circle cx="' + (x + r * 0.35) + '" cy="' + (y - r * 0.35) + '" r="' + r * 0.35 + '" fill="#fff"/>',
    down: '<circle cx="' + x + '" cy="' + (y + 1.6) + '" r="' + r + '" fill="#1d2133"/>',
    closed: '<path d="M' + (x - r - 1) + " " + y + " q" + (r + 1) + " " + (r + 0.5) + " " + (2 * r + 2) + ' 0" class="ln"/>',
    happy: '<path d="M' + (x - r - 1) + " " + (y + 1) + " q" + (r + 1) + " " + -(r + 2) + " " + (2 * r + 2) + ' 0" class="ln"/>'
  });

  const CHARS = [
    {
      id: "engineer",
      name: "Инженер",
      role: "Трудяга в каске",
      desc: "Чертит, сверяет оси, пьёт кофе и всегда знает, что делать дальше.",
      anchors: { crown: 27, neck: 81, chest: 100, shoulderL: [58, 86], shoulderR: [102, 86] },
      armColor: "#3b6fd8",
      handColor: "#f3c9a4",
      back: "",
      body:
        '<rect x="65" y="118" width="11" height="19" rx="5" fill="#2c4f9e" ' + O + '/>' +
        '<rect x="84" y="118" width="11" height="19" rx="5" fill="#2c4f9e" ' + O + '/>' +
        '<ellipse cx="69" cy="138" rx="8" ry="4" fill="#3a2f2a" ' + O + '/>' +
        '<ellipse cx="91" cy="138" rx="8" ry="4" fill="#3a2f2a" ' + O + '/>' +
        '<rect x="56" y="78" width="48" height="46" rx="16" fill="#3b6fd8" ' + O + '/>' +
        '<path d="M66 78 L80 90 L94 78" fill="#f7f7fb" ' + O + '/>' +
        '<rect x="68" y="98" width="24" height="14" rx="4" fill="#4d82ea" ' + O + '/>' +
        '<rect x="71" y="101" width="6" height="2" rx="1" fill="#f5a524"/>',
      head:
        '<circle cx="58" cy="58" r="5" fill="#f3c9a4" ' + O + '/>' +
        '<circle cx="102" cy="58" r="5" fill="#f3c9a4" ' + O + '/>' +
        '<circle cx="80" cy="57" r="22" fill="#f3c9a4" ' + O + '/>' +
        '<path d="M56 50 Q56 28 80 28 Q104 28 104 50 Z" fill="#f5a524" ' + O + '/>' +
        '<rect x="52" y="47" width="56" height="6" rx="3" fill="#e8941a" ' + O + '/>' +
        '<rect x="77" y="29" width="6" height="18" rx="2" fill="#ffd27a"/>' +
        '<circle cx="68" cy="67" r="3.5" fill="#f2a08f" opacity=".6"/><circle cx="92" cy="67" r="3.5" fill="#f2a08f" opacity=".6"/>',
      eyes: [eyeDot(72, 60, 2.8), eyeDot(88, 60, 2.8)],
      mouth: {
        smile: '<path d="M74 69 q6 5 12 0" class="ln"/>',
        open: '<path d="M73 68 q7 9 14 0 Z" fill="#7a2f2f" class="ln"/>',
        small: '<circle cx="80" cy="70" r="2" fill="#7a2f2f"/>'
      },
      phrases: [
        "Сначала оси и уровни — потом всё остальное.",
        "Синхронизировался? Тогда можно и за кофе.",
        "Ошибка в тесте дешевле ошибки на стройке.",
        "Ещё пара вопросов — и цель дня закрыта!"
      ]
    },
    {
      id: "cat",
      name: "Кот-архитектор",
      role: "Ленивый и милый",
      desc: "Спит на клавиатуре, сидит в коробке-кубе и иногда даже помогает.",
      anchors: { crown: 37, neck: 82, chest: 104, shoulderL: [62, 92], shoulderR: [98, 92] },
      armColor: "#f0a35a",
      handColor: "#fbd9b0",
      armLen: 20,
      back: '<path class="tail" d="M100 126 Q132 122 126 96 Q122 82 131 72" fill="none" stroke="#1d2133" stroke-width="12" stroke-linecap="round"/>' +
        '<path class="tail" d="M100 126 Q132 122 126 96 Q122 82 131 72" fill="none" stroke="#f0a35a" stroke-width="8" stroke-linecap="round"/>',
      body:
        '<ellipse cx="80" cy="108" rx="26" ry="28" fill="#f0a35a" ' + O + '/>' +
        '<ellipse cx="80" cy="114" rx="15" ry="18" fill="#fbd9b0"/>' +
        '<ellipse cx="68" cy="135" rx="9" ry="5" fill="#fbd9b0" ' + O + '/>' +
        '<ellipse cx="92" cy="135" rx="9" ry="5" fill="#fbd9b0" ' + O + '/>',
      head:
        '<path d="M58 50 L59 29 L75 42 Z" fill="#f0a35a" ' + O + '/><path d="M61 46 L62 34 L71 42 Z" fill="#f6b5b5"/>' +
        '<path d="M102 50 L101 29 L85 42 Z" fill="#f0a35a" ' + O + '/><path d="M99 46 L98 34 L89 42 Z" fill="#f6b5b5"/>' +
        '<ellipse cx="80" cy="60" rx="26" ry="22" fill="#f0a35a" ' + O + '/>' +
        '<path d="M74 40 q2 5 0 9 M80 39 q2 5 0 10 M86 40 q2 5 0 9" stroke="#d27f36" stroke-width="2.4" fill="none" stroke-linecap="round"/>' +
        '<path d="M80 66 l-3 -3 h6 z" fill="#e6828a"/>' +
        '<path d="M56 66 h12 M56 71 l12 -2 M104 66 h-12 M104 71 l-12 -2" stroke="#1d2133" stroke-width="1.2" stroke-linecap="round"/>',
      eyes: [eyeDot(71, 59, 3.4), eyeDot(89, 59, 3.4)],
      mouth: {
        smile: '<path d="M74 68 q3 3 6 0 q3 3 6 0" class="ln"/>',
        open: '<path d="M75 68 q5 9 10 0 Z" fill="#7a2f2f" class="ln"/>',
        small: '<path d="M77 69 q3 2 6 0" class="ln"/>'
      },
      phrases: [
        "Мур. Можно я полежу на твоей модели?",
        "Purge unused — это я про свою миску.",
        "Коллизия: я и твоя клавиатура.",
        "Ещё один урок — и спим. Вместе."
      ]
    },
    {
      id: "bot",
      name: "BIM-бот",
      role: "Технарь",
      desc: "Сканирует модель лучом, ищет коллизии, мигает антенной и подзаряжается.",
      anchors: { crown: 31, neck: 79, chest: 99, shoulderL: [57, 86], shoulderR: [103, 86] },
      armColor: "#9fb0c8",
      handColor: "#6b7a92",
      back: "",
      body:
        '<rect x="60" y="121" width="40" height="15" rx="7" fill="#3a4256" ' + O + '/>' +
        '<circle cx="68" cy="128.5" r="4" fill="#6b7a92"/><circle cx="80" cy="128.5" r="4" fill="#6b7a92"/><circle cx="92" cy="128.5" r="4" fill="#6b7a92"/>' +
        '<rect x="74" y="73" width="12" height="9" fill="#9fb0c8" ' + O + '/>' +
        '<rect x="57" y="80" width="46" height="42" rx="10" fill="#c9d5e6" ' + O + '/>' +
        '<rect x="66" y="88" width="28" height="18" rx="4" fill="#3a4256" ' + O + '/>' +
        '<circle class="led led1" cx="73" cy="97" r="3" fill="#5fe1ff"/><circle class="led led2" cx="80" cy="97" r="3" fill="#ffd166"/><circle class="led led3" cx="87" cy="97" r="3" fill="#7ee08a"/>' +
        '<rect x="67" y="110" width="26" height="4" rx="2" fill="#9fb0c8"/>',
      head:
        '<path d="M80 34 V22" stroke="#1d2133" stroke-width="2.4"/>' +
        '<circle class="antenna" cx="80" cy="19" r="4.5" fill="#ff6b8b" ' + O + '/>' +
        '<circle cx="53" cy="54" r="5" fill="#9fb0c8" ' + O + '/><circle cx="107" cy="54" r="5" fill="#9fb0c8" ' + O + '/>' +
        '<rect x="54" y="33" width="52" height="42" rx="12" fill="#c9d5e6" ' + O + '/>' +
        '<rect x="60" y="39" width="40" height="30" rx="8" fill="#1f2a44"/>',
      eyes: [
        {
          open: '<rect x="68" y="47" width="7" height="10" rx="3" fill="#5fe1ff"/>',
          down: '<rect x="68" y="51" width="7" height="7" rx="3" fill="#5fe1ff"/>',
          closed: '<path d="M68 53 h7" stroke="#5fe1ff" stroke-width="2.4" stroke-linecap="round"/>',
          happy: '<path d="M68 54 l3.5 -4 l3.5 4" stroke="#5fe1ff" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
        },
        {
          open: '<rect x="85" y="47" width="7" height="10" rx="3" fill="#5fe1ff"/>',
          down: '<rect x="85" y="51" width="7" height="7" rx="3" fill="#5fe1ff"/>',
          closed: '<path d="M85 53 h7" stroke="#5fe1ff" stroke-width="2.4" stroke-linecap="round"/>',
          happy: '<path d="M85 54 l3.5 -4 l3.5 4" stroke="#5fe1ff" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
        }
      ],
      mouth: {
        smile: '<path d="M73 62 q7 4 14 0" stroke="#5fe1ff" stroke-width="2.2" fill="none" stroke-linecap="round"/>',
        open: '<rect x="73" y="60" width="14" height="5" rx="2.5" fill="#5fe1ff"/>',
        small: '<path d="M76 63 h8" stroke="#5fe1ff" stroke-width="2.2" stroke-linecap="round"/>'
      },
      phrases: [
        "Сканирую… прогресс дня: в норме.",
        "Коллизий не обнаружено. Продолжаем.",
        "Рекомендация: 10 вопросов в день.",
        "Заряд 100%. А у тебя?"
      ]
    },
    {
      id: "owl",
      name: "Сова-наставник",
      role: "Мудрая",
      desc: "Читает книгу, поправляет очки, днём дремлет, а вечером оживляется.",
      anchors: { crown: 52, neck: 89, chest: 108, shoulderL: [52, 92], shoulderR: [108, 92] },
      armColor: "#7d5a3c",
      handColor: "#7d5a3c",
      armLen: 30,
      armWidth: 13,
      back: "",
      body:
        '<path d="M70 134 l-4 5 M70 134 l0 6 M70 134 l4 5 M90 134 l-4 5 M90 134 l0 6 M90 134 l4 5" stroke="#e8941a" stroke-width="3" stroke-linecap="round"/>' +
        '<path d="M58 66 L54 47 L70 58 Z" fill="#9a7350" ' + O + '/>' +
        '<path d="M102 66 L106 47 L90 58 Z" fill="#9a7350" ' + O + '/>' +
        '<ellipse cx="80" cy="95" rx="32" ry="41" fill="#9a7350" ' + O + '/>' +
        '<ellipse cx="80" cy="110" rx="20" ry="23" fill="#e6cfa8"/>' +
        '<path d="M72 102 l3 3 l3 -3 M82 102 l3 3 l3 -3 M76 112 l3 3 l3 -3 M86 112 l3 3 l3 -3 M72 122 l3 3 l3 -3 M82 122 l3 3 l3 -3" stroke="#b8956a" stroke-width="1.6" fill="none" stroke-linecap="round"/>',
      head:
        '<circle cx="68" cy="72" r="13" fill="#f3e3c4" ' + O + '/>' +
        '<circle cx="92" cy="72" r="13" fill="#f3e3c4" ' + O + '/>' +
        '<path d="M80 79 l-5 -4 h10 z" fill="#f5a524" ' + O + '/>',
      front:
        '<circle cx="68" cy="72" r="10" fill="none" stroke="#3a3a4a" stroke-width="2"/>' +
        '<circle cx="92" cy="72" r="10" fill="none" stroke="#3a3a4a" stroke-width="2"/>' +
        '<path d="M78 72 h4" stroke="#3a3a4a" stroke-width="2"/>',
      eyes: [
        {
          open: '<circle cx="68" cy="72" r="5.5" fill="#1d2133"/><circle cx="70" cy="70" r="2" fill="#fff"/>',
          down: '<circle cx="68" cy="75" r="5.5" fill="#1d2133"/>',
          closed: '<path d="M62 72 q6 5 12 0" class="ln"/>',
          happy: '<path d="M62 74 q6 -7 12 0" class="ln"/>'
        },
        {
          open: '<circle cx="92" cy="72" r="5.5" fill="#1d2133"/><circle cx="94" cy="70" r="2" fill="#fff"/>',
          down: '<circle cx="92" cy="75" r="5.5" fill="#1d2133"/>',
          closed: '<path d="M86 72 q6 5 12 0" class="ln"/>',
          happy: '<path d="M86 74 q6 -7 12 0" class="ln"/>'
        }
      ],
      mouth: { smile: "", open: '<path d="M77 82 l3 4 l3 -4 z" fill="#7a2f2f"/>', small: "" },
      phrases: [
        "Повторение — мать учения. И LOD 300.",
        "Мудрый инженер сначала читает EIR.",
        "Ночью лучше спать, а не синхронизироваться.",
        "Хороший вопрос — половина ответа."
      ]
    },
    {
      id: "beaver",
      name: "Бобр-строитель",
      role: "Весёлый",
      desc: "Строит стену из брёвен, грызёт карандаш и подбадривает не сдаваться.",
      anchors: { crown: 37, neck: 83, chest: 100, shoulderL: [60, 90], shoulderR: [100, 90] },
      armColor: "#a8743f",
      handColor: "#7a5228",
      armLen: 24,
      back:
        '<g class="tail"><ellipse cx="114" cy="128" rx="20" ry="9" transform="rotate(-18 114 128)" fill="#5b3a22" ' + O + '/>' +
        '<path d="M102 126 l20 -6 M105 132 l20 -7 M110 122 l8 14 M118 119 l8 14" stroke="#3f2816" stroke-width="1.4"/></g>',
      body:
        '<ellipse cx="80" cy="106" rx="27" ry="30" fill="#a8743f" ' + O + '/>' +
        '<ellipse cx="80" cy="112" rx="16" ry="20" fill="#e8c49a"/>' +
        '<ellipse cx="68" cy="135" rx="9" ry="5" fill="#5b3a22" ' + O + '/>' +
        '<ellipse cx="92" cy="135" rx="9" ry="5" fill="#5b3a22" ' + O + '/>',
      head:
        '<circle cx="61" cy="41" r="6.5" fill="#a8743f" ' + O + '/><circle cx="99" cy="41" r="6.5" fill="#a8743f" ' + O + '/>' +
        '<circle cx="80" cy="59" r="23" fill="#a8743f" ' + O + '/>' +
        '<ellipse cx="80" cy="70" rx="13" ry="9.5" fill="#e8c49a" ' + O + '/>' +
        '<ellipse cx="80" cy="64" rx="5" ry="3.6" fill="#2b1d14"/>' +
        '<rect x="76" y="76" width="4" height="6.5" rx="1" fill="#fff" ' + O + '/><rect x="80" y="76" width="4" height="6.5" rx="1" fill="#fff" ' + O + '/>' +
        '<g transform="rotate(-25 104 40)"><rect x="96" y="37" width="20" height="4.5" rx="1.5" fill="#f5c542" ' + O + '/><path d="M116 37 l5 2.25 l-5 2.25 z" fill="#f3d9b0"/></g>',
      eyes: [eyeDot(71, 55, 2.8), eyeDot(89, 55, 2.8)],
      mouth: { smile: '<path d="M73 71 q7 4 14 0" class="ln"/>', open: '<path d="M73 71 q7 6 14 0" class="ln"/>', small: "" },
      phrases: [
        "Бревно к бревну — урок к уроку!",
        "Стену строю. Многослойную, как учили.",
        "Плотину тоже не за день строят. Не сдавайся!",
        "Проём в стене? Сейчас прогрызу."
      ]
    }
  ];

  const STATES = [
    { id: "idle", title: "Ждёт", eyes: "open", mouth: "smile" },
    { id: "coffee", title: "Пьёт кофе", eyes: "open", mouth: "small" },
    { id: "work", title: "Работает", eyes: "down", mouth: "small" },
    { id: "read", title: "Читает", eyes: "down", mouth: "small" },
    { id: "game", title: "Играет в комп", eyes: "open", mouth: "open" },
    { id: "sleep", title: "Спит", eyes: "closed", mouth: "small" },
    { id: "cheer", title: "Подбадривает", eyes: "happy", mouth: "smile" },
    { id: "celebrate", title: "Празднует", eyes: "happy", mouth: "open" }
  ];

  const RANKS = [
    { level: 0, title: "Стажёр" },
    { level: 2, title: "Моделлер" },
    { level: 4, title: "BIM-координатор" },
    { level: 6, title: "BIM-эксперт" }
  ];

  // Что персонаж держит в руке в данном состоянии. Предмет рисуется вокруг кисти
  // и вложен в группу руки, поэтому движется вместе с ней.
  function heldItem(c, side, state, hx, hy) {
    if (side === "r" && state === "coffee") {
      return (
        '<rect x="' + (hx - 15) + '" y="' + (hy - 7) + '" width="13" height="14" rx="3" fill="#fff" ' + O + "/>" +
        '<rect x="' + (hx - 13) + '" y="' + (hy - 4.5) + '" width="9" height="2.6" fill="#8a5a3c"/>' +
        '<path d="M' + (hx - 2) + " " + (hy - 3) + " q5 0 5 3.5 t-5 3.5" + '" fill="none" stroke="#1d2133" stroke-width="2"/>' +
        '<path class="steam s1" d="M' + (hx - 11) + " " + (hy - 9) + ' q-3 -4 0 -8 t0 -8" fill="none" stroke="#d6deec" stroke-width="2" stroke-linecap="round"/>' +
        '<path class="steam s2" d="M' + (hx - 6) + " " + (hy - 9) + ' q-3 -4 0 -8 t0 -8" fill="none" stroke="#d6deec" stroke-width="2" stroke-linecap="round"/>'
      );
    }
    if (side === "r" && state === "work" && c.id !== "bot" && c.id !== "beaver") {
      return '<rect x="' + (hx - 2) + '" y="' + (hy - 2) + '" width="4" height="15" rx="1.5" transform="rotate(35 ' + hx + " " + hy + ')" fill="#f5c542" ' + O + "/>" +
        '<path d="M' + (hx - 6.3) + " " + (hy + 10.3) + " l-1.6 4 3.3 -2.3z" + '" fill="#1d2133"/>';
    }
    if (side === "l" && state === "work" && c.id === "beaver") {
      return '<rect x="' + (hx - 16) + '" y="' + (hy - 4) + '" width="20" height="8" rx="4" fill="#b98352" ' + O + "/>" +
        '<circle cx="' + (hx - 12) + '" cy="' + hy + '" r="2.4" fill="#e0b98a"/>';
    }
    return "";
  }

  function arm(c, side, state) {
    const [sx, sy] = side === "l" ? c.anchors.shoulderL : c.anchors.shoulderR;
    const len = c.armLen || 27;
    const w = c.armWidth || 11;
    const owl = c.id === "owl";
    const hx = sx;
    const hy = sy + len - 3;
    const shape = owl
      ? '<path d="M' + sx + " " + sy + " q" + (side === "l" ? -9 : 9) + " " + len * 0.55 + " 0 " + len + " q" + (side === "l" ? 6 : -6) + " " + -len * 0.5 + " 0 " + -len + 'z" fill="' + c.armColor + '" ' + O + "/>"
      : '<rect x="' + (sx - w / 2) + '" y="' + (sy - 3) + '" width="' + w + '" height="' + len + '" rx="' + w / 2 + '" fill="' + c.armColor + '" ' + O + "/>" +
        '<circle cx="' + hx + '" cy="' + hy + '" r="' + (w / 2 + 0.6) + '" fill="' + c.handColor + '" ' + O + "/>";
    const held = heldItem(c, side, state, hx, hy);
    return (
      '<g class="arm arm-' + side + '" style="transform-origin:' + sx + "px " + sy + 'px">' +
      shape +
      (held ? '<g class="held" style="transform-origin:' + hx + "px " + hy + 'px">' + held + "</g>" : "") +
      "</g>"
    );
  }

  // Предметы в руках и эффекты вокруг — общие для всех персонажей.
  function prop(c, state) {
    if (state === "work") {
      if (c.id === "bot") {
        return (
          '<g class="scan"><path class="beam" d="M126 94 L124 104 L150 104 Z" fill="#5fe1ff" opacity=".35"/>' +
          '<path d="M126 108 l11 -6 l11 6 l-11 6 z" fill="#c8f3ff" ' + O + '/>' +
          '<path d="M126 108 v13 l11 6 v-13 z" fill="#7fd3ea" ' + O + '/><path d="M148 108 v13 l-11 6 v-13 z" fill="#a9e6f5" ' + O + '/>' +
          '<circle class="hit" cx="137" cy="112" r="3" fill="#ff6b8b"/></g>'
        );
      }
      if (c.id === "beaver") {
        const log = (x, y, i) =>
          '<g class="log" style="--i:' + i + '"><rect x="' + x + '" y="' + y + '" width="22" height="8" rx="4" fill="#b98352" ' + O + '/><circle cx="' + (x + 4) + '" cy="' + (y + 4) + '" r="2.4" fill="#e0b98a"/></g>';
        return '<g class="wall">' + log(10, 130, 0) + log(32, 130, 1) + log(21, 122, 2) + log(10, 114, 3) + log(32, 114, 4) + "</g>";
      }
      return (
        '<g class="board"><rect x="57" y="97" width="46" height="30" rx="4" fill="#eef4ff" ' + O + '/>' +
        '<path d="M62 120 h36 M66 104 v19 M62 112 h20" stroke="#bccbe8" stroke-width="1"/>' +
        '<path class="draw" d="M66 118 L66 104 L88 104 L88 118 Z M66 111 H88 M77 104 V118" fill="none" stroke="#3b6fd8" stroke-width="1.8" stroke-linejoin="round"/></g>'
      );
    }
    if (state === "read") {
      return (
        '<g class="book"><path d="M58 102 Q69 98 80 103 V125 Q69 120 58 124 Z" fill="#fff" ' + O + '/>' +
        '<path d="M102 102 Q91 98 80 103 V125 Q91 120 102 124 Z" fill="#fff" ' + O + '/>' +
        '<path d="M62 108 h13 M62 112 h13 M62 116 h10 M85 108 h13 M85 112 h13 M85 116 h9" stroke="#bccbe8" stroke-width="1.4"/>' +
        '<path class="page" d="M80 103 Q91 98 101 102 V124 Q91 120 80 125 Z" fill="#f4f6fb" ' + O + '/>' +
        '<path d="M56 104 V127 Q68 122 80 127 Q92 122 104 127 V104" fill="none" stroke="#d4508a" stroke-width="3" stroke-linejoin="round"/></g>'
      );
    }
    if (state === "game") {
      return (
        '<g class="laptop"><path d="M60 96 h40 l3 24 h-46 z" fill="#3a4256" ' + O + '/>' +
        '<path d="M75 104 l5 -3 l5 3 l-5 3 z M75 104 v5 l5 3 v-5 z M85 104 v5 l-5 3" fill="#c9d5e6"/>' +
        '<rect x="52" y="119" width="56" height="6" rx="3" fill="#6b7a92" ' + O + "/></g>" +
        '<g class="pop"><path d="M116 70 l2.5 5 5.5 .8 -4 3.9 1 5.5 -5 -2.6 -5 2.6 1 -5.5 -4 -3.9 5.5 -.8 z" fill="#ffd166" ' + O + '/></g>' +
        '<g class="pop pop2"><path d="M38 80 c0-4 6-4 6 0 c0-4 6-4 6 0 c0 4-6 8-6 8 s-6-4-6-8z" fill="#ff6b8b" ' + O + "/></g>"
      );
    }
    if (state === "sleep") {
      return (
        '<g class="zzz"><text class="z z1" x="108" y="40">z</text><text class="z z2" x="116" y="30">z</text><text class="z z3" x="125" y="18">Z</text></g>'
      );
    }
    if (state === "cheer") {
      return (
        '<g class="spark"><path d="M128 40 c0-5 7-5 7 0 c0-5 7-5 7 0 c0 5-7 10-7 10 s-7-5-7-10z" fill="#ff6b8b" ' + O + '/>' +
        '<path class="tw" d="M30 46 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2 z" fill="#ffd166"/>' +
        '<path class="tw tw2" d="M120 18 l1.5 4 4 1.5 -4 1.5 -1.5 4 -1.5 -4 -4 -1.5 4 -1.5 z" fill="#ffd166"/></g>'
      );
    }
    if (state === "celebrate") {
      const colors = ["#ff6b8b", "#ffd166", "#5fe1ff", "#7ee08a", "#b69cff"];
      let s = '<g class="confetti">';
      for (let i = 0; i < 14; i++) {
        const x = 12 + ((i * 37) % 136);
        s +=
          '<rect class="cf" style="--d:' + ((i * 0.23) % 1.6).toFixed(2) + "s;--r:" + ((i * 47) % 360) + 'deg" x="' + x + '" y="-8" width="5" height="8" rx="1" fill="' + colors[i % colors.length] + '"/>';
      }
      return s + "</g>";
    }
    return "";
  }

  function accessories(c, level) {
    let s = "";
    const a = c.anchors;
    if (level >= 2) {
      s += '<path d="M80 ' + (a.chest - 6) + " l2 4 4.5 .6 -3.3 3.1 .8 4.5 -4 -2.2 -4 2.2 .8 -4.5 -3.3 -3.1 4.5 -.6z" + '" fill="#ffd166" ' + O + "/>";
    }
    if (level >= 4) {
      s +=
        '<path d="M80 ' + a.neck + " l-9 -5 v10 z M80 " + a.neck + ' l9 -5 v10 z" fill="#d4508a" ' + O + "/>" +
        '<circle cx="80" cy="' + a.neck + '" r="2.6" fill="#b23a70" ' + O + "/>";
    }
    if (level >= 6) {
      const y = a.crown;
      s += '<path d="M68 ' + y + " l3 -13 6 7 3 -10 3 10 6 -7 3 13 z" + '" fill="#ffd166" ' + O + "/>";
    }
    return s;
  }

  function face(c, st) {
    return (
      '<g class="eyes">' + c.eyes.map((e) => e[st.eyes] || e.open).join("") + "</g>" +
      (c.mouth[st.mouth] || c.mouth.smile || "") +
      (c.front || "")
    );
  }

  // Готовый SVG персонажа в нужном состоянии и с аксессуарами звания.
  function svg(id, state, level) {
    const c = CHARS.filter((x) => x.id === id)[0] || CHARS[0];
    const st = STATES.filter((x) => x.id === state)[0] || STATES[0];
    // Стена бобра стоит позади, лист чертежа — между телом и руками (карандаш поверх),
    // остальные предметы — перед персонажем.
    const all = prop(c, st.id);
    const beaverWall = c.id === "beaver" && st.id === "work";
    const board = st.id === "work" && c.id !== "bot" && !beaverWall;
    const behindProp = beaverWall ? all : "";
    const midProp = board ? all : "";
    const frontProp = beaverWall || board ? "" : all;
    return (
      '<svg class="hero-svg hero-' + c.id + " st-" + st.id + '" viewBox="0 0 160 150" role="img" aria-label="' + c.name + ": " + st.title.toLowerCase() + '">' +
      '<ellipse class="shadow" cx="80" cy="141" rx="34" ry="5"/>' +
      behindProp +
      '<g class="figure-root"><g class="breath">' +
      c.back +
      c.body +
      '<g class="head">' + c.head + face(c, st) + "</g>" +
      accessories(c, level || 0) +
      midProp +
      arm(c, "l", st.id) +
      arm(c, "r", st.id) +
      "</g></g>" +
      frontProp +
      "</svg>"
    );
  }

  // Какое состояние показать сейчас: время суток, цель дня и последние ответы.
  function pickState(ctx) {
    const h = ctx.hour;
    if (ctx.justFinishedGoal) return "celebrate";
    if (ctx.lastWrong) return "cheer";
    if (h >= 23 || h < 6) return "sleep";
    if (h < 10) return "coffee";
    if (ctx.goalPct === 0) return Math.random() < 0.5 ? "idle" : "cheer";
    const pool = ["work", "work", "read", "game", "idle"];
    return pool[Math.floor(Math.random() * pool.length)];
  }

  window.BIM_HEROES = { chars: CHARS, states: STATES, ranks: RANKS, svg: svg, pickState: pickState };
})();
