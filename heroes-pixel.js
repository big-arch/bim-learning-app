// Пиксельная версия персонажей: спрайт 20×22 на холсте 32×30, анимация — два кадра.
// Заглавные буквы — цвета конкретного персонажа, строчные — общие предметы и эффекты.
// Контур (K) дорисовывается автоматически вокруг всего, что не является эффектом.
(function () {
  "use strict";

  const W = 32;
  const H = 30;
  const OX = 6;
  const OY = 5;
  const INK = "#1d2133";

  const PROPS = {
    m: "#ffffff", n: "#8a5a3c", s: "#d6deec", p: "#ffffff", l: "#bccbe8", v: "#d4508a",
    t: "#3a4256", u: "#6b7a92", i: "#c9d5e6", c: "#5fe1ff", b: "#3b6fd8", w: "#eef4ff",
    y: "#ffd166", r: "#ff6b8b", g: "#7ee08a", q: "#b69cff", o: "#b98352", e: "#e0b98a",
    h: "#f5c542", j: "#c8f3ff", x: "#7fd3ea", k: "#d4508a", d: "#b23a70", a: "rgba(10,14,30,.18)",
    f: "#7a2f2f", z: "currentColor"
  };

  const CHARS = {
    engineer: {
      pal: { Y: "#f5a524", O: "#d9861a", H: "#ffd27a", S: "#f3c9a4", P: "#ee9d8b", B: "#3b6fd8", D: "#2c4f9e", W: "#eef2fb", G: "#f5a524", N: "#3a2f2a" },
      sprite: [
        "......YYYYYYYY......",
        "....YYYYYHHYYYYY....",
        "...YYYYYYHHYYYYYY...",
        "..YYYYYYYHHYYYYYYY..",
        ".OOOOOOOOOOOOOOOOOO.",
        "..SSSSSSSSSSSSSSSS..",
        "..SSSSSSSSSSSSSSSS..",
        "..SSSSSSSSSSSSSSSS..",
        "..SSSSSSSSSSSSSSSS..",
        "..SSPSSSSSSSSSSPSS..",
        "...SSSSSSSSSSSSSS...",
        ".....SSSSSSSSSS.....",
        "...BBWWWWWWWWWWBB...",
        "..BBBBWWWWWWWWBBBB..",
        "..BBBBBBBBBBBBBBBB..",
        "..BBBBDDDDDDDDBBBB..",
        "..BBBBDGDDDDDDBBBB..",
        "..BBBBBBBBBBBBBBBB..",
        "...BBBBBBBBBBBBBB...",
        "...DDDD......DDDD...",
        "...DDDD......DDDD...",
        "..NNNNN......NNNNN.."
      ],
      eyes: [[6, 6], [13, 6]],
      eyeColor: "K",
      mouth: { smile: [[8, 9], [9, 10], [10, 10], [11, 9]], open: [[9, 9], [10, 9], [9, 10], [10, 10]], small: [[9, 10], [10, 10]] },
      mouthColor: "f",
      shoulder: [0, 13], armW: 2,
      arm: "W",
      hand: "S",
      top: 0, neck: 12, badge: [4, 14]
    },
    cat: {
      pal: { F: "#f0a35a", L: "#fbd9b0", E: "#f6b5b5", T: "#d27f36", N: "#e6828a" },
      sprite: [
        "...F............F...",
        "...FF..........FF...",
        "...FEF........FEF...",
        "..FFFFFFFFFFFFFFFF..",
        "..FFFFFFTFFTFFFFFF..",
        "..FFFFFFTFFTFFFFFF..",
        "..FFFFFFFFFFFFFFFF..",
        "..FFFFFFFFFFFFFFFF..",
        "..FFFFFFFFFFFFFFFF..",
        "..FFFFFFFFNNFFFFFF..",
        "...FFFFFFFFFFFFFF...",
        "....FFFFFFFFFFFF....",
        "...FFFFLLLLLLFFFF...",
        "..FFFFLLLLLLLLFFFF..",
        "..FFFFLLLLLLLLFFFF..",
        "..FFFFLLLLLLLLFFFF..",
        "..FFFFFLLLLLLFFFFF..",
        "..FFFFFFFFFFFFFFFF..",
        "...FFFFFFFFFFFFFF...",
        "...LLLL......LLLL...",
        "...LLLL......LLLL...",
        "...................."
      ],
      eyes: [[6, 7], [13, 7]],
      eyeColor: "K",
      mouth: { smile: [[8, 10], [9, 11], [10, 11], [11, 10]], open: [[9, 10], [10, 10], [9, 11], [10, 11]], small: [[9, 10], [10, 10]] },
      mouthColor: "f",
      tail: [
        [[18, 17], [19, 16], [20, 15], [20, 14], [20, 13], [21, 12]],
        [[18, 17], [19, 16], [19, 15], [20, 14], [20, 13], [20, 12]]
      ],
      tailColor: "F",
      shoulder: [0, 13], armW: 2,
      arm: "T",
      hand: "L",
      top: 1, neck: 12, badge: [4, 15]
    },
    bot: {
      pal: { R: "#ff6b8b", G: "#c9d5e6", E: "#9fb0c8", S: "#1f2a44", C: "#5fe1ff", D: "#3a4256", Y: "#ffd166", V: "#7ee08a" },
      sprite: [
        ".........RR.........",
        ".........EE.........",
        "...GGGGGGGGGGGGGG...",
        "..GGGGGGGGGGGGGGGG..",
        "..GGSSSSSSSSSSSSGG..",
        ".EGGSSSSSSSSSSSSGGE.",
        ".EGGSSSSSSSSSSSSGGE.",
        "..GGSSSSSSSSSSSSGG..",
        "..GGSSSSSSSSSSSSGG..",
        "..GGGGGGGGGGGGGGGG..",
        "...GGGGGGGGGGGGGG...",
        "........EEEE........",
        "...GGGGGGGGGGGGGG...",
        "..GGGGGGGGGGGGGGGG..",
        "..GGGDDDDDDDDDDGGG..",
        "..GGGDCDDYDDVDDGGG..",
        "..GGGDDDDDDDDDDGGG..",
        "..GGGGGGGGGGGGGGGG..",
        "...GGGGGGGGGGGGGG...",
        "....DDDDDDDDDDDD....",
        "...DDEDDDEDDDEDDD...",
        "....DDDDDDDDDDDD...."
      ],
      eyes: [[7, 5], [12, 5]],
      eyeColor: "C",
      mouth: { smile: [[7, 7], [8, 8], [9, 8], [10, 8], [11, 8], [12, 7]], open: [[8, 7], [9, 7], [10, 7], [11, 7], [8, 8], [9, 8], [10, 8], [11, 8]], small: [[9, 8], [10, 8]] },
      mouthColor: "C",
      blinkLed: [[9, 0], [10, 0]],
      shoulder: [0, 13], armW: 2,
      arm: "E",
      hand: "D",
      top: 1, neck: 11, badge: null
    },
    owl: {
      pal: { B: "#9a7350", D: "#7d5a3c", L: "#e6cfa8", F: "#f3e3c4", O: "#f5a524", M: "#b8956a" },
      sprite: [
        "..BB............BB..",
        "..BBB..........BBB..",
        "...BBBBBBBBBBBBBB...",
        "..BBBBBBBBBBBBBBBB..",
        "..BFFFFFBBBBFFFFFB..",
        ".BFFFFFFFBBFFFFFFFB.",
        ".BFFFFFFFBBFFFFFFFB.",
        ".BFFFFFFFBBFFFFFFFB.",
        ".BBFFFFFBOOBFFFFFBB.",
        ".BBBBBBBBOOBBBBBBBB.",
        ".BBBBBLLLLLLLLBBBBB.",
        ".BBBBLLLLLLLLLLBBBB.",
        ".BBBBLLMLLLLMLLBBBB.",
        ".BBBBLLLLLLLLLLBBBB.",
        ".BBBBLLLMLLMLLLBBBB.",
        ".BBBBLLLLLLLLLLBBBB.",
        "..BBBBLLLLLLLLBBBB..",
        "..BBBBBLLLLLLBBBBB..",
        "...BBBBBBBBBBBBBB...",
        "....BBBBBBBBBBBB....",
        "......O.O..O.O......",
        "...................."
      ],
      big: true,
      eyes: [[4, 5], [14, 5]],
      eyeColor: "K",
      mouth: { smile: [], open: [[9, 10], [10, 10]], small: [] },
      mouthColor: "f",
      shoulder: [1, 10],
      armW: 2,
      arm: "D",
      hand: "D",
      top: 2, neck: 10, badge: [3, 13]
    },
    beaver: {
      pal: { B: "#a8743f", D: "#5b3a22", L: "#e8c49a", N: "#2b1d14", W: "#ffffff", A: "#8a5a2c", Y: "#f5c542", T: "#3f2816" },
      sprite: [
        "....................",
        "...BB..........BB...",
        "..BBBBBBBBBBBBBBBB..",
        "..BBBBBBBBBBBBBBBB..",
        ".BBBBBBBBBBBBBBBBBB.",
        ".BBBBBBBBBBBBBBBBBB.",
        ".BBBBBBBBBBBBBBBBBB.",
        ".BBBBBLLLLLLLLBBBBB.",
        ".BBBBLLLLNNLLLLBBBB.",
        "..BBBLLLLLLLLLLBBB..",
        "...BBBLLLWWLLLBBB...",
        ".....BBBBBBBBBB.....",
        "...BBBBBBBBBBBBBB...",
        "..BBBBBLLLLLLBBBBB..",
        "..BBBBLLLLLLLLBBBB..",
        "..BBBBLLLLLLLLBBBB..",
        "..BBBBLLLLLLLLBBBB..",
        "..BBBBBLLLLLLBBBBB..",
        "...BBBBBBBBBBBBBB...",
        "...DDDD......DDDD...",
        "...DDDD......DDDD...",
        "...................."
      ],
      eyes: [[6, 5], [13, 5]],
      eyeColor: "K",
      mouth: { smile: [], open: [[9, 11], [10, 11]], small: [] },
      mouthColor: "f",
      tailBack: [[18, 16], [19, 16], [20, 16], [21, 16], [18, 17], [19, 17], [20, 17], [21, 17], [22, 17], [18, 18], [19, 18], [20, 18], [21, 18], [22, 18], [19, 19], [20, 19], [21, 19]],
      tailColor: "D",
      pencil: [[16, 0, "Y"], [17, -1, "Y"], [18, -2, "Y"], [19, -3, "L"]],
      shoulder: [0, 13], armW: 2,
      arm: "D",
      hand: "L",
      top: 1, neck: 12, badge: [4, 15]
    }
  };

  // Позы левой руки относительно плеча; правая — зеркально.
  const POSES = {
    down: [[0, 0], [0, 1], [0, 2], [0, 3]],
    out: [[0, 0], [0, 1], [-1, 2], [-1, 3]],
    front: [[0, 0], [1, 1], [2, 2], [3, 3]],
    front2: [[0, 0], [1, 1], [2, 2], [3, 2]],
    up: [[0, -1], [-1, -2], [-1, -3], [-2, -4]],
    up2: [[0, -1], [0, -2], [-1, -3], [-1, -4]],
    wave: [[0, -1], [0, -2], [0, -3], [1, -4]],
    sipLow: [[0, 0], [1, 1], [2, 2]],
    sipHigh: [[0, 0], [1, -1], [2, -2]],
    side: [[0, 0], [-1, 0], [-2, 0], [-3, 0]],
    reach: [[0, 0], [-1, 1], [-2, 2], [-3, 2]],
    reach2: [[0, 0], [-1, 0], [-2, 0], [-3, -1]]
  };

  function armCells(ch, side, pose) {
    const [lx, sy] = ch.shoulder;
    const cells = POSES[pose] || POSES.down;
    const pts = cells.map(([dx, dy]) => [lx + dx, sy + dy]);
    const last = pts[pts.length - 1];
    const prev = pts.length > 1 ? pts[pts.length - 2] : [lx, sy];
    const hand = [last[0] + (last[0] - prev[0]), last[1] + (last[1] - prev[1])];
    if (hand[0] === last[0] && hand[1] === last[1]) hand[1]++;
    const mir = (p) => (side === "l" ? p : [19 - p[0], p[1]]);
    const out = [];
    pts.forEach((p) => {
      out.push([...mir(p), ch.arm]);
      if (ch.armW === 2) out.push([...mir([p[0] + 1, p[1]]), ch.arm]);
    });
    out.push([...mir(hand), ch.hand]);
    if (ch.armW === 2) out.push([...mir([hand[0] + 1, hand[1]]), ch.hand]);
    return { cells: out, hand: mir(hand) };
  }

  const mouthCol = (ch, mood) => (mood === "open" ? ch.mouthColor : ch.mouthColor === "C" ? "C" : "K");

  function eyeCells(ch, style) {
    const out = [];
    const col = ch.eyeColor;
    ch.eyes.forEach(([x, y], idx) => {
      const dir = idx === 0 ? -1 : 1;
      if (ch.big) {
        if (style === "open") out.push([x, y, col], [x + 1, y, col], [x, y + 1, col], [x + 1, y + 1, col], [x + 1, y, "m"]);
        else if (style === "down") out.push([x, y + 1, col], [x + 1, y + 1, col], [x, y + 2, col], [x + 1, y + 2, col]);
        else if (style === "closed") out.push([x - 1, y + 1, col], [x, y + 1, col], [x + 1, y + 1, col], [x + 2, y + 1, col]);
        else out.push([x - 1, y + 1, col], [x, y, col], [x + 1, y, col], [x + 2, y + 1, col]);
        return;
      }
      if (style === "open") out.push([x, y, col], [x, y + 1, col]);
      else if (style === "down") out.push([x, y + 1, col], [x, y + 2, col]);
      else if (style === "closed") out.push([x, y + 1, col], [x + dir, y + 1, col]);
      else out.push([x - 1, y + 1, col], [x, y, col], [x + 1, y + 1, col]);
    });
    return out;
  }

  const ZPIX = [[0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2]];
  const HEART = [[0, 0], [1, 0], [3, 0], [4, 0], [0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [1, 2], [2, 2], [3, 2], [2, 3]];
  const STAR = [[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]];
  const at = (shape, x, y, col, fx) => shape.map(([dx, dy]) => [x + dx, y + dy, col, fx]);

  // Предметы и эффекты одного кадра. fx = true — без контура (дым, буквы, искры).
  function props(id, ch, state, frame, hands) {
    const sy = ch.shoulder[1];
    const cy = sy + 2;
    const out = [];
    const rect = (x0, y0, w, h, col) => {
      for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) out.push([x, y, col]);
    };
    if (state === "coffee") {
      const [hx, hy] = hands.r;
      rect(hx - 4, hy - 1, 3, 3, "m");
      out.push([hx - 4, hy - 1, "n"], [hx - 3, hy - 1, "n"], [hx - 2, hy - 1, "n"]);
      if (frame === 0) out.push(...at([[0, 0], [1, -1], [0, -2]], hx - 4, hy - 3, "s", true), ...at([[1, 0], [0, -1]], hx - 2, hy - 3, "s", true));
    }
    if (state === "work") {
      if (id === "bot") {
        rect(23, 17, 3, 3, "x");
        rect(23, 16, 3, 1, "j");
        const [hx, hy] = hands.r;
        out.push([hx, hy + 1, "c", true], [hx + 1, hy + 2, "c", true]);
        if (frame === 0) out.push([hx, hy + 2, "c", true], [24, 18, "r", true]);
      } else if (id === "beaver") {
        rect(-6, 19, 3, 1, "o"); rect(-3, 19, 3, 1, "o"); out.push([-6, 19, "e"], [-3, 19, "e"]);
        rect(-5, 18, 3, 1, "o"); out.push([-5, 18, "e"]);
        if (frame === 1) { rect(-6, 17, 3, 1, "o"); out.push([-6, 17, "e"]); }
      } else {
        rect(5, cy, 10, 6, "w");
        out.push([7, cy + 1, "b"], [8, cy + 1, "b"], [9, cy + 1, "b"], [7, cy + 2, "b"], [7, cy + 3, "b"]);
        if (frame === 1) out.push([10, cy + 1, "b"], [11, cy + 1, "b"], [11, cy + 2, "b"], [11, cy + 3, "b"], [8, cy + 3, "b"], [9, cy + 3, "b"]);
        const [hx, hy] = hands.r;
        out.push([hx - 1, hy + 1, "h"], [hx - 2, hy + 2, "h"]);
      }
    }
    if (state === "read") {
      rect(4, cy, 6, 5, "p");
      rect(10, cy, 6, 5, "p");
      for (let y = cy; y < cy + 5; y++) out.push([9, y, "v"], [10, y, "v"]);
      out.push([5, cy + 1, "l"], [6, cy + 1, "l"], [7, cy + 1, "l"], [5, cy + 3, "l"], [6, cy + 3, "l"]);
      if (frame === 0) out.push([12, cy + 1, "l"], [13, cy + 1, "l"], [14, cy + 1, "l"], [12, cy + 3, "l"], [13, cy + 3, "l"]);
      else out.push([12, cy + 2, "l"], [13, cy + 2, "l"], [12, cy + 4, "l"]);
    }
    if (state === "game") {
      rect(5, cy - 1, 10, 5, "t");
      out.push([9, cy + 1, "i"], [10, cy + 1, "i"], [9, cy, "i"], [10, cy + 2, "i"]);
      rect(4, cy + 4, 12, 1, "u");
      if (frame === 0) out.push(...at(STAR, 20, 3, "y", true));
      else out.push(...at(HEART, -4, 6, "r", true));
    }
    if (state === "sleep") {
      out.push(...at(ZPIX, 18, 1, "z", true));
      if (frame === 1) out.push(...at(ZPIX, 22, -3, "z", true));
    }
    if (state === "cheer") {
      out.push(...at(HEART, 21, frame ? 0 : 1, "r", true));
      if (frame === 0) out.push(...at(STAR, -4, 2, "y", true));
    }
    if (state === "celebrate") {
      const cols = ["r", "y", "c", "g", "q"];
      for (let i = 0; i < 16; i++) {
        const x = ((i * 7 + frame * 3) % 30) - OX;
        const y = ((i * 5 + frame * 4) % 14) - OY;
        out.push([x, y, cols[i % cols.length], true]);
      }
    }
    return out;
  }

  function accessories(ch, level) {
    const out = [];
    if (level >= 2 && ch.badge) {
      const [x, y] = ch.badge;
      out.push([x, y, "y"], [x + 1, y, "y"], [x, y + 1, "y"], [x + 1, y + 1, "y"]);
    }
    if (level >= 4) {
      const n = ch.neck;
      out.push([7, n - 1, "k"], [7, n, "k"], [7, n + 1, "k"], [8, n, "k"], [9, n, "d"], [10, n, "d"], [11, n, "k"], [12, n - 1, "k"], [12, n, "k"], [12, n + 1, "k"]);
    }
    if (level >= 6) {
      const t = ch.top - 1;
      for (let x = 7; x <= 12; x++) out.push([x, t, "y"]);
      out.push([7, t - 1, "y"], [9, t - 1, "y"], [10, t - 1, "y"], [12, t - 1, "y"], [7, t - 2, "y"], [12, t - 2, "y"], [9, t - 2, "r"]);
    }
    return out;
  }

  // Кадры состояния: позы рук, глаза, рот и смещение спрайта.
  function frames(id, state) {
    const F = (l, r, eyes, mouth, dy) => ({ l: l, r: r, eyes: eyes, mouth: mouth, dy: dy || 0 });
    switch (state) {
      case "coffee": return [F("down", "sipLow", "open", "small"), F("down", "sipHigh", "closed", "small")];
      case "work":
        if (id === "bot") return [F("down", "side", "open", "small"), F("down", "side", "down", "small")];
        if (id === "beaver") return [F("reach", "down", "down", "small"), F("reach2", "down", "down", "small")];
        return [F("front", "front", "down", "small"), F("front", "front2", "down", "small")];
      case "read": return [F("front", "front", "down", "small"), F("front", "front", "down", "small")];
      case "game": return [F("front", "front2", "open", "open"), F("front2", "front", "open", "open")];
      case "sleep": return [F("down", "down", "closed", "small"), F("down", "down", "closed", "small", 1)];
      case "cheer": return [F("down", "up", "happy", "smile"), F("down", "wave", "happy", "smile")];
      case "celebrate": return [F("up", "up", "happy", "open"), F("up2", "up2", "happy", "open", -2)];
      default: return [F("down", "down", "open", "smile"), F("out", "out", "closed", "smile")];
    }
  }

  const TIMING = { idle: "px-blink", coffee: "px-slow", work: "px-mid", read: "px-slow", game: "px-fast", sleep: "px-slow", cheer: "px-mid", celebrate: "px-fast" };

  function renderFrame(id, ch, state, fr, frameIdx, level) {
    const grid = {};
    const put = (x, y, col, fx) => {
      const X = x + OX;
      const Y = y + OY + fr.dy;
      if (X < 0 || Y < 0 || X >= W || Y >= H) return;
      grid[X + "," + Y] = { c: col, fx: !!fx };
    };
    // хвосты позади тела
    if (ch.tailBack) ch.tailBack.forEach(([x, y]) => put(x, y, ch.tailColor));
    if (ch.tail) ch.tail[frameIdx % 2].forEach(([x, y]) => put(x, y, ch.tailColor));
    ch.sprite.forEach((row, y) => {
      for (let x = 0; x < row.length; x++) if (row[x] !== ".") put(x, y, row[x]);
    });
    if (ch.pencil) ch.pencil.forEach(([x, y, c]) => put(x, y, c));
    if (ch.blinkLed && frameIdx === 1) ch.blinkLed.forEach(([x, y]) => put(x, y, "Y"));
    eyeCells(ch, fr.eyes).forEach(([x, y, c]) => put(x, y, c));
    (ch.mouth[fr.mouth] || []).forEach(([x, y]) => put(x, y, mouthCol(ch, fr.mouth)));
    accessories(ch, level).forEach(([x, y, c]) => put(x, y, c));
    const L = armCells(ch, "l", fr.l);
    const R = armCells(ch, "r", fr.r);
    const behind = state === "work" && id !== "bot" && id !== "beaver";
    const pr = props(id, ch, state, frameIdx, { l: L.hand, r: R.hand });
    if (behind) pr.forEach(([x, y, c, fx]) => put(x, y, c, fx));
    L.cells.concat(R.cells).forEach(([x, y, c]) => put(x, y, c));
    if (!behind) pr.forEach(([x, y, c, fx]) => put(x, y, c, fx));

    // автоматический контур
    const outline = [];
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        if (grid[x + "," + y]) continue;
        const near = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => {
          const g = grid[x + dx + "," + (y + dy)];
          return g && !g.fx;
        });
        if (near) outline.push([x, y]);
      }
    }
    outline.forEach(([x, y]) => (grid[x + "," + y] = { c: "K", fx: false }));

    // строки одного цвета склеиваются в прямоугольники
    let s = "";
    for (let y = 0; y < H; y++) {
      let x = 0;
      while (x < W) {
        const g = grid[x + "," + y];
        if (!g) { x++; continue; }
        let x2 = x + 1;
        while (x2 < W && grid[x2 + "," + y] && grid[x2 + "," + y].c === g.c) x2++;
        const col = g.c === "K" ? INK : ch.pal[g.c] || PROPS[g.c] || INK;
        s += '<rect x="' + x + '" y="' + y + '" width="' + (x2 - x) + '" height="1" fill="' + col + '"/>';
        x = x2;
      }
    }
    return s;
  }

  function svg(id, state, level) {
    const ch = CHARS[id] || CHARS.engineer;
    const fr = frames(id, state);
    const shadow = '<rect x="10" y="' + (OY + 22) + '" width="20" height="1" fill="' + PROPS.a + '"/><rect x="12" y="' + (OY + 23) + '" width="16" height="1" fill="' + PROPS.a + '"/>';
    return (
      '<svg class="px-svg ' + (TIMING[state] || "px-mid") + '" viewBox="0 0 ' + W + " " + H + '" shape-rendering="crispEdges" role="img">' +
      shadow +
      '<g class="pxA">' + renderFrame(id, ch, state, fr[0], 0, level || 0) + "</g>" +
      '<g class="pxB">' + renderFrame(id, ch, state, fr[1], 1, level || 0) + "</g>" +
      "</svg>"
    );
  }

  window.BIM_HEROES_PX = { svg: svg };
})();
