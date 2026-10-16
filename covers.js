// Векторные обложки курсов и сцена для баннера главной.
// Всё рисуется кодом: работает офлайн и ничего не весит.
(function () {
  "use strict";

  function shade(hex, k) {
    const n = parseInt(hex.slice(1), 16);
    const f = (c) => Math.max(0, Math.min(255, Math.round(k < 0 ? c * (1 + k) : c + (255 - c) * k)));
    const r = f(n >> 16);
    const g = f((n >> 8) & 255);
    const b = f(n & 255);
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  let uid = 0;

  // Изометрический блок здания с окнами: x, y — нижний ближний угол.
  function block(x, y, w, d, h, c, lit) {
    const top = shade(c, 0.35);
    const left = shade(c, -0.05);
    const right = shade(c, -0.35);
    const wx = w * 0.866;
    const dx = d * 0.866;
    let s =
      '<path d="M' + x + " " + y + " l" + -wx + " " + -w / 2 + " v" + -h + " l" + wx + " " + w / 2 + ' z" fill="' + left + '"/>' +
      '<path d="M' + x + " " + y + " l" + dx + " " + -d / 2 + " v" + -h + " l" + -dx + " " + d / 2 + ' z" fill="' + right + '"/>' +
      '<path d="M' + x + " " + (y - h) + " l" + -wx + " " + -w / 2 + " l" + dx + " " + -d / 2 + " l" + wx + " " + w / 2 + ' z" fill="' + top + '"/>';
    // окна на левой грани
    const cols = Math.max(2, Math.round(w / 9));
    const rows = Math.max(2, Math.round(h / 10));
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const t = (i + 0.5) / cols;
        const px = x - wx * t;
        const py = y - (w / 2) * t - h * ((j + 0.35) / rows);
        const on = lit && (i * 7 + j * 3) % 5 === 0;
        s += '<path d="M' + px.toFixed(1) + " " + py.toFixed(1) + " l-2.6 -1.5 v-4 l2.6 1.5z" + '" fill="' + (on ? "#ffd166" : "rgba(255,255,255,.32)") + '"/>';
      }
    }
    for (let i = 0; i < Math.max(2, Math.round(d / 9)); i++) {
      for (let j = 0; j < rows; j++) {
        const t = (i + 0.5) / Math.max(2, Math.round(d / 9));
        const px = x + dx * t;
        const py = y - (d / 2) * t - h * ((j + 0.35) / rows);
        s += '<path d="M' + px.toFixed(1) + " " + py.toFixed(1) + " l2.6 -1.5 v-4 l-2.6 1.5z" + '" fill="rgba(255,255,255,.18)"/>';
      }
    }
    return s;
  }

  const MOTIF = {
    bim: (c) => block(58, 96, 22, 22, 62, c, true) + block(86, 102, 16, 16, 30, shade(c, -0.15), true),
    revit: (c) => block(52, 100, 30, 22, 34, c, true) + block(82, 92, 14, 14, 54, shade(c, 0.1), true),
    navisworks: (c) =>
      block(52, 98, 22, 22, 26, c, false) + block(72, 92, 20, 20, 26, shade(c, 0.15), false) +
      '<circle cx="64" cy="58" r="6" fill="#ff6b8b" opacity=".9"/><circle cx="64" cy="58" r="11" fill="none" stroke="#ff6b8b" stroke-width="1.5" opacity=".5"/>',
    autocad: (c) =>
      '<path d="M22 86 l46 -26 l40 23 l-46 26z" fill="' + shade(c, 0.75) + '"/>' +
      '<path d="M34 86 l34 -19 M42 91 l34 -19 M50 96 l34 -19 M40 76 l26 15" stroke="' + shade(c, -0.2) + '" stroke-width="1.3" opacity=".8"/>' +
      block(88, 70, 12, 12, 30, c, true) +
      '<path d="M70 34 l-12 30 M70 34 l10 30" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/><circle cx="70" cy="34" r="3" fill="#fff"/>',
    civil3d: (c) =>
      '<path d="M8 96 Q30 64 52 80 T96 70 T120 76 V110 H8z" fill="' + shade(c, -0.25) + '"/>' +
      '<path d="M8 104 Q36 80 60 90 T120 84 V110 H8z" fill="' + c + '"/>' +
      '<path d="M14 108 C44 92 70 100 116 86" stroke="#ffd166" stroke-width="3" fill="none" stroke-dasharray="6 5"/>' +
      block(86, 74, 10, 10, 18, shade(c, 0.25), true),
    practice: (c) =>
      block(50, 100, 26, 20, 30, c, true) +
      '<path d="M66 44 q0 -16 18 -16 q18 0 18 16z" fill="#ffd166"/><rect x="62" y="42" width="44" height="6" rx="3" fill="#f5a524"/>',
    manager: (c) =>
      block(56, 100, 22, 22, 50, c, true) +
      '<path d="M86 30 v26" stroke="#fff" stroke-width="2"/><path d="M86 30 h18 l-5 6 l5 6 h-18z" fill="#ffd166"/>' +
      '<circle cx="96" cy="78" r="5" fill="#fff" opacity=".85"/><circle cx="110" cy="88" r="5" fill="#fff" opacity=".6"/><path d="M96 78 L110 88" stroke="#fff" stroke-width="1.5" opacity=".6"/>',
    revitserver: (c) => {
      let s = "";
      for (let i = 0; i < 3; i++) s += block(46 + i * 22, 102 - i * 4, 14, 14, 44, shade(c, i * 0.08), false);
      for (let i = 0; i < 6; i++) s += '<circle cx="' + (38 + (i % 3) * 22) + '" cy="' + (66 + Math.floor(i / 3) * 12) + '" r="1.8" fill="' + (i % 2 ? "#7ee08a" : "#5fe1ff") + '"/>';
      return s;
    },
    english: (c) =>
      '<rect x="18" y="34" width="62" height="38" rx="10" fill="' + shade(c, 0.2) + '"/><path d="M30 72 l-4 12 l14 -12z" fill="' + shade(c, 0.2) + '"/>' +
      '<text x="49" y="60" text-anchor="middle" font-family="system-ui,sans-serif" font-weight="800" font-size="18" fill="#fff">EN</text>' +
      '<rect x="56" y="62" width="54" height="34" rx="10" fill="#fff" opacity=".92"/><path d="M98 96 l6 10 l-14 -10z" fill="#fff" opacity=".92"/>' +
      '<text x="83" y="85" text-anchor="middle" font-family="system-ui,sans-serif" font-weight="800" font-size="15" fill="' + shade(c, -0.3) + '">RU</text>',
    software: (c) =>
      '<rect x="22" y="32" width="84" height="56" rx="7" fill="' + shade(c, -0.35) + '" stroke="#fff" stroke-opacity=".5" stroke-width="2"/>' +
      '<rect x="30" y="40" width="30" height="20" rx="3" fill="' + c + '"/><rect x="64" y="40" width="34" height="8" rx="3" fill="#fff" opacity=".7"/>' +
      '<rect x="64" y="52" width="24" height="8" rx="3" fill="#fff" opacity=".45"/><rect x="30" y="64" width="68" height="16" rx="3" fill="#fff" opacity=".25"/>' +
      '<path d="M52 88 h24 l4 12 h-32z" fill="' + shade(c, -0.2) + '"/>'
  };

  function cover(course) {
    const c = course.accent || "#4f7cf7";
    const id = "cv" + ++uid;
    const motif = (MOTIF[course.id] || MOTIF.bim)(c);
    return (
      '<svg class="cover-svg" viewBox="0 0 128 112" preserveAspectRatio="xMidYMid slice" role="img" aria-label="' + String(course.title).replace(/"/g, "") + '">' +
      '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + shade(c, -0.55) + '"/><stop offset="1" stop-color="' + shade(c, -0.2) + '"/></linearGradient>' +
      '<radialGradient id="' + id + 'g" cx=".5" cy=".9" r=".6"><stop offset="0" stop-color="' + shade(c, 0.4) + '" stop-opacity=".55"/><stop offset="1" stop-color="' + c + '" stop-opacity="0"/></radialGradient></defs>' +
      '<rect x="-40" y="-20" width="208" height="152" fill="url(#' + id + ')"/>' +
      '<rect x="-40" y="-20" width="208" height="152" fill="url(#' + id + 'g)"/>' +
      '<g opacity=".35" fill="#fff"><circle cx="14" cy="16" r="1"/><circle cx="104" cy="12" r="1.2"/><circle cx="118" cy="40" r=".9"/><circle cx="30" cy="30" r=".8"/></g>' +
      motif +
      "</svg>"
    );
  }

  // Сцена баннера: ночной город за окном, голограмма здания, стол с ноутбуком.
  function scene() {
    let city = "";
    const towers = [[0, 70], [34, 110], [62, 80], [96, 140], [130, 92], [168, 124], [204, 76], [236, 150], [276, 96], [310, 130], [350, 84], [384, 118], [420, 90]];
    towers.forEach(([x, h], i) => {
      city += '<rect x="' + x + '" y="' + (196 - h) + '" width="' + (28 + (i % 3) * 6) + '" height="' + h + '" fill="rgba(40,60,140,' + (0.35 + (i % 4) * 0.08) + ')"/>';
      for (let k = 0; k < 6; k++) {
        if ((i + k) % 3 === 0) city += '<rect x="' + (x + 5 + (k % 3) * 8) + '" y="' + (196 - h + 10 + Math.floor(k / 3) * 14) + '" width="3" height="5" fill="#ffd166" opacity=".55"/>';
      }
    });
    let holo = "";
    // голограмма: каркас здания из трёх ярусов
    const levels = [0, 1, 2, 3];
    const hx = 128;
    const hy = 176;
    levels.forEach((l) => {
      const y = hy - l * 24;
      holo += '<path d="M' + hx + " " + y + " l-38 -19 l34 -17 l38 19z" + '" class="holo-floor" style="--d:' + l * 0.25 + 's"/>';
    });
    holo +=
      '<path d="M' + hx + " " + hy + " v-72 M" + (hx - 38) + " " + (hy - 19) + " v-72 M" + (hx - 4) + " " + (hy - 36) + " v-72 M" + (hx + 34) + " " + (hy - 17) + ' v-72" class="holo-edge"/>' +
      '<path d="M' + hx + " " + (hy - 72) + " l-38 -19 l34 -17 l38 19z" + '" class="holo-roof"/>' +
      '<path d="M' + (hx - 38) + " " + (hy - 19) + " L" + hx + " " + (hy - 132) + " L" + (hx + 34) + " " + (hy - 17) + '" class="holo-beam"/>' +
      '<rect class="holo-scan" x="' + (hx - 40) + '" y="' + (hy - 100) + '" width="76" height="3" rx="1.5"/>';
    return (
      '<svg class="scene-svg" viewBox="0 0 460 260" preserveAspectRatio="xMidYMax slice" aria-hidden="true">' +
      '<defs><linearGradient id="skyG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b2a6b"/><stop offset="1" stop-color="#2a3f9a"/></linearGradient>' +
      '<radialGradient id="lampG" cx=".78" cy=".55" r=".45"><stop offset="0" stop-color="#ffd27a" stop-opacity=".45"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></radialGradient></defs>' +
      '<rect x="0" y="0" width="460" height="260" fill="url(#skyG)" opacity=".55"/>' +
      city +
      '<path d="M0 0 h460 v6 h-460z M150 0 v196 M300 0 v196" stroke="rgba(160,190,255,.25)" stroke-width="4"/>' +
      '<rect x="0" y="0" width="460" height="260" fill="url(#lampG)"/>' +
      '<g class="holo">' + holo + "</g>" +
      // растение
      '<rect x="20" y="186" width="26" height="22" rx="4" fill="#2b3a74"/><path d="M33 186 q-16 -24 -6 -40 q4 18 6 40 q2 -26 16 -34 q-6 22 -16 34" fill="#3fbf8a"/>' +
      "</svg>"
    );
  }

  // Передняя часть стола: перекрывает нижнюю половину героя за столом.
  function desk() {
    return (
      '<svg class="desk-svg" viewBox="0 0 260 120" preserveAspectRatio="xMaxYMax meet" aria-hidden="true">' +
      '<rect x="0" y="64" width="260" height="14" rx="4" fill="#3a2f5f"/><rect x="0" y="78" width="260" height="42" fill="#2a2347"/>' +
      '<path d="M70 64 l8 -40 h70 l8 40z" fill="#3a4256"/><path d="M76 60 l7 -32 h60 l7 32z" fill="#5fe1ff" opacity=".18"/>' +
      '<path d="M104 40 l9 -5 l9 5 l-9 5z M104 40 v8 l9 5 v-8z M122 40 v8 l-9 5" fill="#c9d5e6" opacity=".9"/>' +
      '<rect x="60" y="62" width="106" height="5" rx="2.5" fill="#6b7a92"/>' +
      '<rect x="196" y="38" width="22" height="26" rx="4" fill="#e9eef8"/><path d="M218 44 q8 0 8 7 t-8 7" fill="none" stroke="#e9eef8" stroke-width="3"/>' +
      '<text x="207" y="56" text-anchor="middle" font-family="system-ui,sans-serif" font-size="8" font-weight="800" fill="#3b6fd8">BIM</text>' +
      '<path class="mug-steam" d="M202 32 q-3 -5 0 -10 t0 -10 M210 32 q-3 -5 0 -10 t0 -10" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="1.8" stroke-linecap="round"/>' +
      '<path d="M236 64 v-40 l-18 -12" stroke="#c9d5e6" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M206 8 l20 0 l-6 14 h-10z" fill="#ffd166"/>' +
      "</svg>"
    );
  }

  window.BIM_COVERS = { cover: cover, scene: scene, desk: desk, shade: shade };
})();
