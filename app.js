/* BIM Academy — офлайн-приложение для изучения BIM, Revit, Navisworks, AutoCAD и Civil 3D */
(function () {
  "use strict";

  const APP_VERSION = "2026-07-29-v1";
  const STORE_KEY = "bim-academy-state-v1";
  const CONTENT = window.BIM_CONTENT || { courses: [], glossary: [], videos: [] };
  const FIGURES = window.BIM_FIGURES || {};

  const view = document.getElementById("view");
  const topTitle = document.getElementById("topTitle");
  const topSubtitle = document.getElementById("topSubtitle");
  const backBtn = document.getElementById("backBtn");
  const themeBtn = document.getElementById("themeBtn");
  const toastEl = document.getElementById("toast");

  /* ================= вспомогательные функции ================= */

  const esc = (s) =>
    String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const norm = (s) =>
    String(s || "")
      .toLowerCase()
      .replace(/ё/g, "е")
      .replace(/\s+/g, " ")
      .trim();

  const hardNorm = (s) => norm(s).replace(/[^a-zа-я0-9]/g, "");

  const todayKey = (d) => {
    const x = d || new Date();
    return (
      x.getFullYear() +
      "-" +
      String(x.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(x.getDate()).padStart(2, "0")
    );
  };

  const shiftDay = (key, delta) => {
    const p = key.split("-").map(Number);
    const d = new Date(p[0], p[1] - 1, p[2]);
    d.setDate(d.getDate() + delta);
    return todayKey(d);
  };

  const shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const plural = (n, one, few, many) => {
    const a = Math.abs(n) % 100;
    const b = a % 10;
    if (a > 10 && a < 20) return many;
    if (b > 1 && b < 5) return few;
    if (b === 1) return one;
    return many;
  };

  function toast(text) {
    toastEl.textContent = text;
    toastEl.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => toastEl.classList.remove("show"), 2200);
  }

  const ICONS = {
    cube: '<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M4 7.5l8 4.5 8-4.5M12 12v9"/>',
    revit: '<path d="M4 20V9l8-5 8 5v11"/><path d="M9 20v-6h6v6"/>',
    clash: '<circle cx="9.5" cy="12" r="5.5"/><circle cx="15" cy="12" r="5.5"/>',
    cad: '<path d="M4 17L17 4l3 3L7 20H4z"/><path d="M14 7l3 3"/>',
    terrain: '<path d="M3 19l6-9 4 5 2-3 6 7z"/><path d="M3 19h18"/>',
    qa: '<path d="M9.2 9a2.8 2.8 0 115.3 1.3c-.5.9-1.6 1.3-2.1 2.1-.3.4-.4.8-.4 1.4"/><circle cx="12" cy="17.6" r="1.2"/><path d="M12 3a9 9 0 100 18 9 9 0 000-18z"/>',
    manage: '<circle cx="12" cy="5.5" r="2.5"/><circle cx="5.5" cy="17" r="2.5"/><circle cx="18.5" cy="17" r="2.5"/><path d="M12 8v3.5M12 11.5H5.5v3M12 11.5h6.5v3"/>',
    soft: '<rect x="3" y="4.5" width="18" height="13" rx="2"/><path d="M8 21h8M12 17.5V21"/><path d="M9.5 9L7.5 11l2 2M14.5 9l2 2-2 2"/>',
    lang: '<path d="M4 5h9M8.5 3v2M6 5c.6 3.2 2.6 5.8 5.5 7.2M11 5c-.6 3.2-2.6 5.8-5.5 7.2"/><path d="M12.5 21l4.25-10L21 21M14 17.5h5.5"/>',
    server: '<rect x="3.5" y="4" width="17" height="6.5" rx="1.8"/><rect x="3.5" y="13.5" width="17" height="6.5" rx="1.8"/><path d="M7 7.25h.01M7 16.75h.01"/><path d="M11 7.25h6M11 16.75h6"/>',
    news: '<path d="M4 5h13v14H5.5A1.5 1.5 0 014 17.5z"/><path d="M17 9h3v8.5a1.5 1.5 0 01-3 0z"/><path d="M7 8.5h7M7 12h7M7 15.5h4"/>',
    play: '<path d="M8 5l12 7-12 7z"/>',
    arrow: '<path d="M9 5l7 7-7 7"/>'
  };

  const RANKS = [
    { min: 0, title: "Стажёр" },
    { min: 60, title: "Чертёжник" },
    { min: 160, title: "Моделлер" },
    { min: 320, title: "BIM-специалист" },
    { min: 560, title: "BIM-координатор" },
    { min: 900, title: "BIM-менеджер" },
    { min: 1400, title: "BIM-эксперт" }
  ];

  const BADGES = [
    { id: "first", em: "🎯", title: "Первый шаг", desc: "пройден первый урок", test: (s) => lessonsDone() >= 1 },
    { id: "ten", em: "📚", title: "Десятка", desc: "10 уроков пройдено", test: () => lessonsDone() >= 10 },
    { id: "course", em: "🏆", title: "Курс закрыт", desc: "все уроки одного курса", test: () => CONTENT.courses.some((c) => courseProgress(c).done === c.lessons.length) },
    { id: "all", em: "👑", title: "Полный охват", desc: "все уроки всех курсов", test: () => CONTENT.courses.every((c) => courseProgress(c).done === c.lessons.length) },
    { id: "q100", em: "🧠", title: "Сто вопросов", desc: "100 ответов в тестах", test: (s) => s.answers.total >= 100 },
    { id: "exam", em: "🎓", title: "Экзамен сдан", desc: "экзамен на 90% и выше", test: (s) => !!s.flags.exam90 },
    { id: "perfect", em: "💎", title: "Без ошибок", desc: "тест из 10+ вопросов на 100%", test: (s) => !!s.flags.perfect },
    { id: "streak", em: "🔥", title: "Неделя подряд", desc: "7 дней с выполненной целью", test: (s) => s.streak.best >= 7 },
    { id: "terms", em: "📖", title: "Знаток терминов", desc: "открыто 25 терминов", test: (s) => s.terms.length >= 25 },
    { id: "fix", em: "🧹", title: "Работа над ошибками", desc: "пройден тест по ошибкам", test: (s) => !!s.flags.mistakes },
    { id: "gamer", em: "🎮", title: "Игрок", desc: "сыграно 10 игр", test: (s) => s.games.played >= 10 },
    { id: "blitz", em: "⏱", title: "Блиц-мастер", desc: "15 верных за минуту в блице", test: (s) => Object.keys(s.games.blitzBest).some((k) => s.games.blitzBest[k] >= 15) },
    { id: "interview", em: "💼", title: "Готов к собеседованию", desc: "собеседование на 80% и выше", test: (s) => s.games.interviewBest >= 80 },
    { id: "cert", em: "🎓", title: "Сертификат", desc: "пройдена траектория или курс целиком", test: (s) => !!s.flags.cert },
    { id: "cases", em: "🧩", title: "Решала", desc: "все кейсы на «сильное решение»", test: (s) => (CONTENT.cases || []).length > 0 && (CONTENT.cases || []).every((c) => (s.cases[c.id] || 0) >= c.steps.length * 2 - 1) }
  ];

  const MISTAKE_HOURS = [0, 8, 24, 72, 168];

  /* ================= состояние ================= */

  const defaultState = () => ({
    v: 1,
    lessons: {},
    bookmarks: [],
    answers: { total: 0, correct: 0 },
    byCourse: {},
    mistakes: {},
    history: [],
    days: {},
    streak: { current: 0, best: 0, last: "", freezes: 0, frozen: [] },
    settings: { theme: "auto", goal: 10, newsProxy: "", hero: "engineer", heroStyle: "vec", heroCount: 3, name: "", remindAt: "19:00" },
    mastery: {},
    quests: {},
    cases: {},
    companion: { celebratedDay: "", lastQuizAt: 0, lastQuizPct: 100 },
    myVideos: [],
    mySources: [],
    checkProjects: [],
    checkDone: {},
    checkCurrent: "",
    cards: {},
    terms: [],
    flags: {},
    games: { played: 0, blitzBest: {}, matchBest: {}, orderSolved: 0, interviewBest: 0 },
    xp: 0,
    lastLesson: ""
  });

  let state = load();

  function load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return defaultState();
      const parsed = JSON.parse(raw);
      const base = defaultState();
      return Object.assign(base, parsed, {
        answers: Object.assign(base.answers, parsed.answers),
        streak: Object.assign(base.streak, parsed.streak),
        settings: Object.assign(base.settings, parsed.settings),
        flags: Object.assign(base.flags, parsed.flags),
        games: Object.assign(base.games, parsed.games)
      });
    } catch (e) {
      return defaultState();
    }
  }

  function persist() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(state));
    } catch (e) {
      /* приватный режим — просто работаем без сохранения */
    }
  }

  // Пока применяются изменения с другого устройства, перерисовка экрана не должна
  // отправлять их обратно — иначе устройства перекидывались бы данными бесконечно.
  let applyingRemote = false;

  function save() {
    if (applyingRemote) return persist();
    state.updatedAt = Date.now();
    persist();
    schedulePush();
  }

  /* ================= индексы контента ================= */

  const courseById = {};
  const lessonById = {};
  const lessonCourse = {};
  const allQuestions = [];
  const allLessons = [];

  // Дополнительный банк вопросов из data/questions-extra.js прирастает к урокам
  // до того, как им раздаются идентификаторы. Туда же удобно дописывать свои.
  const EXTRA_Q = window.BIM_EXTRA_QUESTIONS || {};

  CONTENT.courses.forEach((course) => {
    courseById[course.id] = course;
    course.lessons.forEach((lesson, li) => {
      if (EXTRA_Q[lesson.id]) lesson.questions = (lesson.questions || []).concat(EXTRA_Q[lesson.id]);
      lessonById[lesson.id] = lesson;
      lessonCourse[lesson.id] = course.id;
      lesson.index = li;
      allLessons.push(lesson);
      (lesson.questions || []).forEach((q, qi) => {
        q.id = lesson.id + "#" + qi;
        q.courseId = course.id;
        q.lessonId = lesson.id;
        allQuestions.push(q);
      });
    });
  });

  const questionById = {};
  allQuestions.forEach((q) => (questionById[q.id] = q));

  function lessonText(lesson) {
    const parts = [lesson.title, lesson.goal || "", (lesson.tags || []).join(" ")];
    (lesson.blocks || []).forEach((b) => {
      if (b.text) parts.push(b.text);
      if (b.title) parts.push(b.title);
      if (b.items) parts.push(b.items.join(" "));
      if (b.caption) parts.push(b.caption);
      if (b.rows) parts.push(b.rows.map((r) => r.join(" ")).join(" "));
    });
    return parts.join(" ");
  }

  const searchIndex = [];
  allLessons.forEach((lesson) => {
    searchIndex.push({
      kind: "Урок",
      title: lesson.title,
      sub: (courseById[lessonCourse[lesson.id]] || {}).title + " · " + lesson.minutes + " мин",
      href: "#/lesson/" + lesson.id,
      hay: norm(lessonText(lesson)),
      course: lessonCourse[lesson.id]
    });
  });
  CONTENT.glossary.forEach((t) => {
    searchIndex.push({
      kind: "Термин",
      title: t.term + (t.full ? " — " + t.full : ""),
      sub: t.text,
      href: "#/glossary?q=" + encodeURIComponent(t.term),
      hay: norm(t.term + " " + (t.full || "") + " " + t.text),
      course: t.course
    });
  });
  (CONTENT.warnings || []).forEach((w) => {
    searchIndex.push({
      kind: w.kind === "error" ? "Ошибка Revit" : "Предупреждение",
      title: w.ru,
      sub: w.en + " · " + w.why,
      href: "#/warnings?q=" + encodeURIComponent(w.ru.slice(0, 30)),
      hay: norm(w.ru + " " + w.en + " " + w.why + " " + w.fix.join(" ") + " " + (w.tags || []).join(" ")),
      course: "revit"
    });
  });
  ((CONTENT.news && CONTENT.news.digest) || []).forEach((d) => {
    searchIndex.push({
      kind: "Дайджест",
      title: d.title,
      sub: d.lead,
      href: "#/news?tab=digest&region=" + d.region,
      hay: norm(d.title + " " + d.lead + " " + d.points.join(" ") + " " + d.soWhat + " " + d.tag),
      course: "manager"
    });
  });
  (CONTENT.checklists || []).forEach((c) => {
    searchIndex.push({
      kind: "Чек-лист",
      title: c.title,
      sub: c.intro,
      href: "#/checks?list=" + c.id,
      hay: norm(c.title + " " + c.intro + " " + checkItems(c).map((i) => i.text).join(" ")),
      course: "practice"
    });
  });
  CONTENT.videos.forEach((v) => {
    searchIndex.push({
      kind: "Видео",
      title: v.title,
      sub: v.description,
      href: "#/videos?q=" + encodeURIComponent(v.title),
      hay: norm(v.title + " " + v.description + " " + v.query),
      course: v.course
    });
  });
  allQuestions.forEach((q) => {
    searchIndex.push({
      kind: "Вопрос",
      title: q.q,
      sub: q.explain || "",
      href: "#/lesson/" + q.lessonId,
      hay: norm(q.q + " " + (q.explain || "")),
      course: q.courseId
    });
  });

  /* ================= прогресс ================= */

  function lessonsDone() {
    return Object.keys(state.lessons).filter((k) => state.lessons[k] && state.lessons[k].done).length;
  }

  function courseProgress(course) {
    const done = course.lessons.filter((l) => state.lessons[l.id] && state.lessons[l.id].done).length;
    return { done: done, total: course.lessons.length, pct: Math.round((done / course.lessons.length) * 100) };
  }

  function totalProgress() {
    const total = allLessons.length;
    const done = lessonsDone();
    return { done: done, total: total, pct: total ? Math.round((done / total) * 100) : 0 };
  }

  function accuracy() {
    if (!state.answers.total) return 0;
    return Math.round((state.answers.correct / state.answers.total) * 100);
  }

  function rank() {
    let cur = RANKS[0];
    let next = null;
    for (let i = 0; i < RANKS.length; i++) {
      if (state.xp >= RANKS[i].min) cur = RANKS[i];
      else {
        next = RANKS[i];
        break;
      }
    }
    return { cur: cur, next: next };
  }

  function todayStats() {
    return state.days[todayKey()] || { lessons: 0, questions: 0 };
  }

  function bumpDay(field, n) {
    const key = todayKey();
    if (!state.days[key]) state.days[key] = { lessons: 0, questions: 0 };
    state.days[key][field] = (state.days[key][field] || 0) + n;
    checkStreak();
  }

  function checkStreak() {
    const key = todayKey();
    const day = state.days[key] || { questions: 0 };
    if (day.questions < state.settings.goal) return;
    if (state.streak.last === key) return;
    const s = state.streak;
    const gap = s.last ? daysBetween(s.last, key) : 0;
    if (gap === 1) s.current++;
    else if (gap > 1 && gap - 1 <= (s.freezes || 0)) {
      // пропущенные дни закрываются заморозками — серия продолжается
      s.freezes -= gap - 1;
      s.frozen = s.frozen || [];
      for (let i = 1; i < gap; i++) s.frozen.push(shiftDay(s.last, i));
      s.frozen = s.frozen.slice(-60);
      s.current++;
      toast("Заморозка спасла серию ❄️");
    } else s.current = 1;
    s.last = key;
    if (s.current % 7 === 0 && (s.freezes || 0) < 2) {
      s.freezes = (s.freezes || 0) + 1;
      setTimeout(() => toast("7 дней подряд: +1 заморозка серии ❄️"), 2300);
    }
    if (state.streak.current > state.streak.best) state.streak.best = state.streak.current;
    toast("Цель дня выполнена! Серия: " + state.streak.current + " " + plural(state.streak.current, "день", "дня", "дней"));
  }

  function dueMistakes() {
    const now = Date.now();
    return Object.keys(state.mistakes)
      .filter((id) => questionById[id] && state.mistakes[id].dueAt <= now)
      .sort((a, b) => state.mistakes[a].dueAt - state.mistakes[b].dueAt);
  }

  function nextLesson() {
    if (state.lastLesson && lessonById[state.lastLesson] && !(state.lessons[state.lastLesson] || {}).done) {
      return lessonById[state.lastLesson];
    }
    for (const l of allLessons) if (!(state.lessons[l.id] || {}).done) return l;
    return allLessons[0];
  }

  /* ================= общие компоненты разметки ================= */

  function ringHtml(pct, size) {
    const r = 32;
    const c = 2 * Math.PI * r;
    const v = Math.max(0, Math.min(100, pct));
    return (
      '<div class="ring"><svg viewBox="0 0 74 74"><circle class="track" cx="37" cy="37" r="' +
      r +
      '"/><circle class="bar" cx="37" cy="37" r="' +
      r +
      '" stroke-dasharray="' +
      ((v / 100) * c).toFixed(1) +
      " " +
      c.toFixed(1) +
      '"/></svg><b>' +
      Math.round(v) +
      "%</b></div>"
    );
  }

  function courseIcon(course) {
    return (
      '<div class="course-icon"><svg viewBox="0 0 24 24">' + (ICONS[course.icon] || ICONS.cube) + "</svg></div>"
    );
  }

  function courseCard(course) {
    const p = courseProgress(course);
    return (
      '<a class="course-card' +
      (p.pct === 100 ? " is-done" : "") +
      '" href="#/course/' +
      course.id +
      '" style="--accent:' +
      course.accent +
      '">' +
      (p.pct === 100 ? '<span class="cc-done">✓ пройден</span>' : "") +
      '<div class="cc-head">' +
      courseIcon(course) +
      "<div><h3>" +
      esc(course.title) +
      '</h3><div class="cc-sub">' +
      esc(course.subtitle) +
      "</div></div></div>" +
      '<p class="cc-text">' +
      esc(course.summary) +
      "</p>" +
      '<div class="progress"><i style="width:' +
      p.pct +
      '%"></i></div><div class="progress-meta"><span>' +
      p.done +
      " из " +
      p.total +
      " " +
      plural(p.total, "урока", "уроков", "уроков") +
      "</span><span>" +
      p.pct +
      "%</span></div></a>"
    );
  }

  function lessonRow(lesson, n) {
    const done = (state.lessons[lesson.id] || {}).done;
    const qn = (lesson.questions || []).length;
    const faded = needsReview(lesson.id);
    return (
      '<a class="lesson' +
      (done ? " is-done" : "") +
      (faded ? " is-faded" : "") +
      '" href="#/lesson/' +
      lesson.id +
      '"><div class="lesson-num">' +
      (done ? "✓" : n) +
      '</div><div class="lesson-body"><b>' +
      esc(lesson.title) +
      "</b><span>" +
      lesson.minutes +
      " мин · " +
      esc(lesson.level) +
      " · " +
      qn +
      " " +
      plural(qn, "вопрос", "вопроса", "вопросов") +
      (masteryTag(lesson.id) ? " · " + masteryTag(lesson.id) : "") +
      '</span></div><div class="lesson-arrow"><svg viewBox="0 0 24 24">' +
      ICONS.arrow +
      "</svg></div></a>"
    );
  }

  /* ================= экраны ================= */

  function renderHome() {
    setTop("BIM Academy", "Главная");
    const COV = window.BIM_COVERS;
    const hour = new Date().getHours();
    const hello = hour < 5 ? "Доброй ночи" : hour < 12 ? "Доброе утро" : hour < 18 ? "Добрый день" : "Добрый вечер";
    const name = displayName();
    const t = todayStats();
    const goal = state.settings.goal;
    const cont = nextLesson();
    const cc = courseById[lessonCourse[cont.id]];
    const cp = courseProgress(cc);
    const left = cc.lessons.filter((l) => !(state.lessons[l.id] || {}).done).reduce((a, l) => a + (l.minutes || 0), 0);
    const r = rank();
    const ri = Math.max(0, RANKS.indexOf(r.cur));
    const xpPct = r.next ? Math.round(((state.xp - r.cur.min) / (r.next.min - r.cur.min)) * 100) : 100;
    const quote = HOME_QUOTES[seedOf(todayKey()) % HOME_QUOTES.length];
    const due = dueMistakes().length;
    const chip = (em, v, label) => '<div class="nh-chip-stat"><span class="nh-em">' + em + "</span><b>" + v + "</b><small>" + label + "</small></div>";

    // ---- баннер ----
    let html =
      '<section class="nh-banner">' +
      '<div class="nh-hello"><p class="nh-hi">' +
      hello +
      (name ? "," : "") +
      "</p><h1>" +
      (name ? esc(name) + "! 👋" : "Рады вас видеть! 👋") +
      '</h1><p class="nh-quote">«' +
      esc(quote) +
      '»</p><div class="nh-actions"><a class="btn-glow" href="#/lesson/' +
      cont.id +
      '"><span class="bg-ico">▶</span>Продолжить обучение</a><a class="nh-link" href="#/paths"><span class="nh-em">📊</span>Моя траектория <span class="nh-arr">→</span></a></div></div>' +
      '<div class="nh-path"><div class="nh-path-head"><b>Твой путь в BIM</b><a href="#/ranks">Все уровни →</a></div>' +
      '<div class="nh-rank"><span class="nh-hex"><svg viewBox="0 0 40 44" aria-hidden="true"><path d="M20 2 L37 12 V32 L20 42 L3 32 V12 Z"/></svg><b>' +
      (ri + 1) +
      '</b></span><div class="nh-rank-body"><div class="nh-rank-top"><b>' +
      esc(r.cur.title) +
      "</b><span>" +
      state.xp +
      (r.next ? " / " + r.next.min : "") +
      ' XP</span></div><div class="nh-xpbar"><i style="width:' +
      Math.max(2, Math.min(100, xpPct)) +
      '%"></i></div><small>' +
      (r.next ? "Следующий уровень: " + esc(r.next.title) : "Высший уровень — вы BIM-эксперт") +
      "</small></div></div>" +
      '<div class="nh-chips">' +
      chip("🔥", streakNow(), plural(streakNow(), "день подряд", "дня подряд", "дней подряд")) +
      chip("📘", t.questions + " / " + goal, "вопросов сегодня") +
      chip("🎯", accuracy() + "%", "точность ответов") +
      "</div></div>" +
      (COV
        ? '<div class="nh-scene"><div class="nh-scene-bg">' + COV.scene() + "</div>" + heroStageHtml("desk") + '<div class="nh-desk">' + COV.desk() + "</div></div>"
        : "") +
      "</section>";

    // ---- продолжить · задания · активность ----
    const qk = todayKey();
    const quests = todayQuests(qk);
    const qDone = state.quests[qk] || [];
    const qDay = state.days[qk] || {};
    const qn = quests.filter((q) => qDone.indexOf(q.id) >= 0).length;
    const ringC = 2 * Math.PI * 34;
    const toReview = reviewLessons().length;
    const dailyDone = (t.daily || 0) > 0;
    const names = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
    const wk = weekDays(weekStart(qk));
    const mini = (em, v, label) => '<div class="nh-mini"><span class="nh-em">' + em + "</span><div><b>" + v + "</b><small>" + label + "</small></div></div>";

    html +=
      '<div class="nh-row2">' +
      '<section class="nh-card nh-continue"><div class="nh-card-head"><h2>Продолжить обучение</h2><a href="#/courses">Смотреть все →</a></div>' +
      '<a class="nh-cont" href="#/lesson/' +
      cont.id +
      '" style="--accent:' +
      cc.accent +
      '"><div class="nh-cover">' +
      (COV ? COV.cover(cc) : "") +
      '</div><div class="nh-cont-body"><span class="chip accent">' +
      esc(cc.title) +
      "</span><h3>" +
      esc(cont.title) +
      "</h3><p>" +
      esc(cont.goal || "") +
      '</p><div class="nh-prog"><div class="progress"><i style="width:' +
      cp.pct +
      '%"></i></div><b>' +
      cp.pct +
      '%</b></div><div class="nh-meta"><span>📘 ' +
      cp.done +
      " из " +
      cp.total +
      " " +
      plural(cp.total, "урока", "уроков", "уроков") +
      "</span><span>⏱ Осталось: " +
      fmtMinutes(left) +
      '</span></div></div><span class="nh-play" aria-hidden="true">▶</span></a>' +
      '<a class="nh-daily' +
      (dailyDone ? " done" : "") +
      '" href="#/quiz/daily/1"><span class="nh-em">' +
      (dailyDone ? "✓" : "⚡") +
      "</span><b>Тренировка дня</b><small>" +
      (dailyDone ? "пройдена — можно ещё раз" : "10 вопросов · +10 XP") +
      "</small></a>" +
      (toReview ? '<a class="nh-review" href="#/review">↻ Пора повторить: ' + toReview + " " + plural(toReview, "тема", "темы", "тем") + "</a>" : "") +
      "</section>" +
      '<section class="nh-card nh-quests"><div class="nh-card-head"><h2>Задания на сегодня</h2><span class="muted small">+10 XP за каждое</span></div><div class="nh-q">' +
      '<div class="nh-qring"><svg viewBox="0 0 80 80" aria-hidden="true"><circle cx="40" cy="40" r="34" class="qr-track"/><circle cx="40" cy="40" r="34" class="qr-bar' + (qn ? "" : " zero") + '" stroke-dasharray="' +
      ((qn / 3) * ringC).toFixed(1) +
      " " +
      ringC.toFixed(1) +
      '"/></svg><b>' +
      qn +
      "/3</b><small>выполнено</small></div><ul>" +
      quests
        .map((q) => {
          const ok = qDone.indexOf(q.id) >= 0;
          const v = Math.min(q.need, qDay[q.f] || 0);
          return (
            '<li class="' +
            (ok ? "on" : "") +
            '"><span class="q-box">' +
            (ok ? "✓" : "") +
            '</span><span class="q-t">' +
            esc(q.t) +
            '</span><span class="q-n">' +
            (q.need > 1 ? v + "/" + q.need : "") +
            "</span></li>"
          );
        })
        .join("") +
      "</ul></div></section>" +
      '<section class="nh-card nh-activity"><div class="nh-card-head"><h2>Ваша активность</h2><a href="#/more">Смотреть больше →</a></div><div class="nh-week">' +
      wk
        .map((k, i) => {
          const q = (state.days[k] || {}).questions || 0;
          const met = q >= goal;
          const today = k === qk;
          return (
            '<div class="nh-day' +
            (met ? " met" : "") +
            (today ? " today" : "") +
            (q > 0 && !met ? " some" : "") +
            '"><span>' +
            (met ? "✓" : today ? names[i] : "") +
            "</span><small>" +
            names[i] +
            "</small></div>"
          );
        })
        .join("") +
      '</div><div class="nh-minis">' +
      mini("🔥", streakNow(), plural(streakNow(), "день подряд", "дня подряд", "дней подряд")) +
      mini("⭐", state.xp, "всего XP") +
      mini("📊", lessonsDone(), "пройдено уроков") +
      mini("🎯", accuracy() + "%", "средняя точность") +
      "</div></section></div>";

    // ---- мои курсы ----
    html += '<section class="nh-courses" id="nhCourses">' + homeCoursesHtml() + "</section>";

    // ---- быстрый доступ ----
    const QA = [
      ["#/games", "🎮", "Игры и тренажёры", "пары, блиц, тренажёры", "#7c5cff"],
      ["#/quiz/mistakes/all", "🎯", "Мои ошибки", due ? due + " к повтору" : "всё закрыто", "#ff4f7b"],
      ["#/paths", "🧭", "Траектории", "путь к роли и сертификат", "#ff8a3d"],
      ["#/cases", "🧩", "Кейсы", "решения на проекте", "#22c55e"],
      ["#/cards", "🃏", "Карточки", dueCards().length ? dueCards().length + " к повтору" : "термины", "#3b82f6"],
      ["#/interview", "💼", "Собеседование", INTERVIEW_SIZE + " вопросов на время", "#a855f7"]
    ];
    html +=
      '<section class="nh-quick"><div class="nh-card-head"><h2>Быстрый доступ</h2></div><div class="nh-qa">' +
      QA.map(
        (x) =>
          '<a class="nh-qa-tile" href="' +
          x[0] +
          '" style="--c:' +
          x[4] +
          '"><span class="nh-qa-ico">' +
          x[1] +
          '</span><span class="nh-qa-text"><b>' +
          esc(x[2]) +
          "</b><small>" +
          esc(x[3]) +
          '</small></span><span class="nh-qa-go" aria-hidden="true">›</span></a>'
      ).join("") +
      "</div></section>";

    view.innerHTML = '<div class="nh">' + html + "</div>";
    startHero();
  }

  const HOME_QUOTES = [
    "Больше практики — ближе к экспертности. Продолжай в том же духе!",
    "Модель без порядка — просто красивая картинка. Порядок начинается с тебя.",
    "Один урок в день — это 30 уроков в месяц.",
    "Ошибка в тесте дешевле ошибки на стройке.",
    "Сначала оси и уровни — потом всё остальное.",
    "Каждая синхронизация — маленький шаг команды вперёд.",
    "Хороший координатор находит причину, а не тысячу коллизий."
  ];
  let homeTab = "all";

  function fmtMinutes(m) {
    if (!m) return "всё пройдено";
    const h = Math.floor(m / 60);
    return (h ? h + " ч " : "") + (m % 60) + " мин";
  }

  function displayName() {
    if (state.settings.name) return state.settings.name.split(/\s+/)[0];
    return "";
  }

  function homeCoursesHtml() {
    const all = CONTENT.courses.map((c) => ({ c: c, p: courseProgress(c) }));
    const inProg = all.filter((x) => x.p.done > 0 && x.p.pct < 100);
    const done = all.filter((x) => x.p.pct === 100);
    // «Все курсы» на главной — четыре самых актуальных: начатые, затем новые, завершённые в конце
    const rankOf = (x) => (x.p.pct === 100 ? 2 : x.p.done > 0 ? 0 : 1);
    const top = all.slice().sort((x, y) => rankOf(x) - rankOf(y)).slice(0, 4);
    const list = homeTab === "progress" ? inProg : homeTab === "done" ? done : top;
    const tab = (id, label, n) =>
      '<button class="nh-tab' + (homeTab === id ? " on" : "") + '" data-act="home-tab" data-t="' + id + '">' + label + (n != null ? ' <span class="nh-badge">' + n + "</span>" : "") + "</button>";
    return (
      '<div class="nh-courses-head"><h2>Мои курсы</h2><div class="nh-tabs" role="tablist">' +
      tab("all", "Все курсы") +
      tab("progress", "В процессе", inProg.length) +
      tab("done", "Завершённые", done.length) +
      '</div><a class="nh-all" href="#/courses">Смотреть все →</a></div>' +
      (list.length
        ? '<div class="nh-course-row">' + list.map((x) => nhCourseCard(x.c, x.p)).join("") + "</div>"
        : '<div class="nh-empty">' + (homeTab === "done" ? "Завершённых курсов пока нет — первый уже близко." : "Начните любой курс — он появится здесь.") + "</div>")
    );
  }

  function nhCourseCard(c, p) {
    const COV = window.BIM_COVERS;
    return (
      '<a class="nh-course' +
      (p.pct === 100 ? " is-done" : "") +
      '" href="#/course/' +
      c.id +
      '" style="--accent:' +
      c.accent +
      '"><div class="nh-course-top"><div class="nh-cover">' +
      (COV ? COV.cover(c) : "") +
      '</div><div class="nh-course-body"><span class="nh-tag">' +
      esc(c.title) +
      "</span><h3>" +
      esc(c.subtitle) +
      "</h3><p>" +
      esc(c.summary) +
      '</p></div></div><div class="nh-course-foot"><div class="nh-prog"><div class="progress"><i style="width:' +
      p.pct +
      '%"></i></div><b>' +
      p.pct +
      '%</b></div><div class="nh-course-meta"><span>📘 ' +
      p.done +
      " из " +
      p.total +
      " " +
      plural(p.total, "урока", "уроков", "уроков") +
      '</span><span class="nh-go" aria-hidden="true">→</span></div></div></a>'
    );
  }

  function renderRanks() {
    setTop("Уровни", "твой путь в BIM");
    const r = rank();
    const idx = Math.max(0, RANKS.indexOf(r.cur));
    view.innerHTML =
      '<section class="section">' +
      RANKS.map((x, i) => {
        const next = RANKS[i + 1];
        const state_ = i < idx ? "passed" : i === idx ? "current" : "locked";
        return (
          '<div class="rank-row ' +
          state_ +
          '"><span class="nh-hex small"><svg viewBox="0 0 40 44" aria-hidden="true"><path d="M20 2 L37 12 V32 L20 42 L3 32 V12 Z"/></svg><b>' +
          (i + 1) +
          "</b></span><div><b>" +
          esc(x.title) +
          "</b><small>" +
          (next ? x.min + "–" + (next.min - 1) + " XP" : "от " + x.min + " XP") +
          (i === idx ? " · вы здесь, " + state.xp + " XP" : "") +
          "</small></div><span>" +
          (i < idx ? "✓" : i === idx ? "●" : "🔒") +
          "</span></div>"
        );
      }).join("") +
      '</section><section class="section"><div class="card"><h3>Как получать XP</h3><ul class="bullets"><li>Верный ответ в тесте — 3 XP</li><li>Пройденный урок — 12 XP</li><li>Задание дня — 10 XP, тренировка дня — ещё 10</li><li>Экзамен на 80% и выше — 25 XP, собеседование — 30</li><li>Игры и кейсы — от 2 до 15 XP</li></ul></div></section>';
  }


  function actionTile(href, em, title, sub) {
    return (
      '<a class="stat-tile" href="' +
      href +
      '"><b style="font-size:24px">' +
      em +
      '</b><b style="font-size:14px;margin-top:4px">' +
      esc(title) +
      "</b><span>" +
      esc(sub) +
      "</span></a>"
    );
  }

  function renderCourses() {
    setTop("Курсы", allLessons.length + " уроков · " + allQuestions.length + " вопросов");
    const tp = totalProgress();
    view.innerHTML =
      '<section class="section"><div class="card"><div class="row spread"><div><h3>Общий прогресс</h3><p>' +
      tp.done +
      " из " +
      tp.total +
      " уроков пройдено</p></div><b style=\"font-size:24px\">" +
      tp.pct +
      '%</b></div><div class="progress" style="margin-top:12px"><i style="width:' +
      tp.pct +
      '%"></i></div></div></section>' +
      (PATHS.length
        ? '<section class="section"><div class="section-head"><h2>Траектории</h2><a href="#/paths">все</a></div><div class="path-strip">' +
          PATHS.map(pathCard).join("") +
          "</div></section>"
        : "") +
      '<section class="section"><div class="section-head"><h2>Курсы</h2></div><div class="grid course-grid">' +
      CONTENT.courses.map(courseCard).join("") +
      "</div></section>";
  }

  function renderCourse(id) {
    const course = courseById[id];
    if (!course) return renderNotFound();
    setTop(course.title, course.subtitle);
    const p = courseProgress(course);
    const terms = CONTENT.glossary.filter((t) => t.course === id);
    const videos = CONTENT.videos.filter((v) => v.course === id);
    const qn = course.lessons.reduce((a, l) => a + (l.questions || []).length, 0);

    view.innerHTML =
      '<div style="--accent:' +
      course.accent +
      '">' +
      '<section class="section"><div class="card"><div class="cc-head row">' +
      courseIcon(course) +
      "<div><h3>" +
      esc(course.title) +
      '</h3><div class="cc-sub muted small">' +
      esc(course.level || course.subtitle) +
      "</div></div></div><p style=\"margin-top:10px\">" +
      esc(course.summary) +
      '</p><div class="progress" style="margin-top:12px"><i style="width:' +
      p.pct +
      '%"></i></div><div class="progress-meta"><span>' +
      p.done +
      " / " +
      p.total +
      " уроков</span><span>" +
      qn +
      " вопросов</span></div></div></section>" +
      (p.pct === 100 ? '<section class="section"><a class="btn primary block" href="#/cert/course/' + id + '">🎓 Курс пройден — получить сертификат</a></section>' : "") +
      '<section class="section"><div class="btn-row">' +
      '<a class="btn primary" href="#/quiz/course/' +
      id +
      '">Тест по курсу</a>' +
      '<a class="btn soft" href="#/quiz/exam/' +
      id +
      '">Экзамен</a></div></section>' +
      '<section class="section"><div class="section-head"><h2>Уроки</h2><span class="muted small">' +
      p.total +
      "</span></div>" +
      course.lessons.map((l, i) => lessonRow(l, i + 1)).join("") +
      "</section>" +
      '<section class="section"><div class="grid grid-2">' +
      actionTile("#/videos?course=" + id, "▶️", "Видеоуроки", videos.length + " " + plural(videos.length, "видео", "видео", "видео")) +
      actionTile("#/glossary?course=" + id, "📖", "Термины курса", terms.length + " " + plural(terms.length, "термин", "термина", "терминов")) +
      (id === "english" ? actionTile("#/vocab", "🔊", "Словарь", VOCAB.length + " слов с озвучкой") : "") +
      Object.keys(SIMS)
        .filter((k) => lessonCourse[SIMS[k].lesson] === id)
        .map((k) => actionTile("#/sim/" + k, "🎛", "Тренажёр", SIMS[k].title))
        .join("") +
      "</div></section></div>";
  }

  function renderLesson(id) {
    const lesson = lessonById[id];
    if (!lesson) return renderNotFound();
    const course = courseById[lessonCourse[id]];
    setTop(lesson.title, course.title);
    state.lastLesson = id;
    save();

    const done = (state.lessons[id] || {}).done;
    const marked = state.bookmarks.indexOf(id) >= 0;
    const list = course.lessons;
    const prev = list[lesson.index - 1];
    const next = list[lesson.index + 1];
    const qn = (lesson.questions || []).length;

    let html = '<div class="lesson-page" style="--accent:' + course.accent + '">';
    html +=
      '<section class="lesson-hero"><div class="row row-wrap"><span class="chip accent">' +
      esc(course.title) +
      '</span><span class="chip">' +
      lesson.minutes +
      ' мин</span><span class="chip">' +
      esc(lesson.level) +
      "</span>" +
      (done ? '<span class="chip done">✓ пройден</span>' : "") +
      (lessonLevel(id) >= 3 ? '<span class="chip done">мастер ★</span>' : lessonLevel(id) === 2 ? '<span class="chip done">освоено</span>' : "") +
      "</div><h1>" +
      esc(lesson.title) +
      "</h1>" +
      (lesson.goal ? '<div class="goal"><b>Цель урока: </b>' + esc(lesson.goal) + "</div>" : "") +
      "</section>";

    const blocks = lesson.blocks || [];
    const mid = blocks.length >= 4 ? Math.floor(blocks.length / 2) : -1;
    const isEn = course.id === "english";
    blocks.forEach((b, bi) => {
      html += '<section class="block">' + renderBlock(b, { en: isEn }) + "</section>";
      if (bi === mid - 1) html += inlineCheckHtml(lesson);
    });

    if (lesson.terms && lesson.terms.length) {
      html +=
        '<section class="block"><h4>Термины урока</h4><div class="row row-wrap">' +
        lesson.terms
          .map(
            (t) =>
              '<a class="chip accent" href="#/glossary?q=' + encodeURIComponent(t) + '">' + esc(t) + "</a>"
          )
          .join("") +
        "</div></section>";
    }

    html += '<section class="section mt">';
    if (needsReview(id)) {
      html += '<a class="btn soft block mb" href="#/quiz/review/' + id + '">↻ Тема выцветает — проверка из 3 вопросов</a>';
    }
    if (qn) {
      html +=
        '<a class="btn primary block" href="#/quiz/lesson/' +
        id +
        '">Пройти мини-тест · ' +
        qn +
        " " +
        plural(qn, "вопрос", "вопроса", "вопросов") +
        "</a>";
    }
    html +=
      '<div class="btn-row mt"><button class="btn' +
      (done ? "" : " soft") +
      '" data-act="toggle-done" data-id="' +
      id +
      '">' +
      (done ? "Пройден ✓" : "Отметить пройденным") +
      '</button><button class="btn" data-act="bookmark" data-id="' +
      id +
      '">' +
      (marked ? "★ В закладках" : "☆ В закладки") +
      "</button></div>";

    html += '<div class="btn-row mt">';
    if (prev) html += '<a class="btn" href="#/lesson/' + prev.id + '">← Назад</a>';
    if (next) html += '<a class="btn" href="#/lesson/' + next.id + '">Далее →</a>';
    if (!next) html += '<a class="btn soft" href="#/quiz/exam/' + course.id + '">Экзамен по курсу</a>';
    html += "</div></section></div>";

    view.innerHTML = html;
    mountSims(view);
  }

  function renderBlock(b, opts) {
    const en = opts && opts.en;
    // В английском курсе у английских фраз появляется кнопка озвучки.
    const sayItem = (i) => {
      if (!en) return esc(i);
      const at = i.indexOf(" — ");
      return at > 0 ? esc(i) + speakBtn(i.slice(0, at)) : esc(i);
    };
    switch (b.type) {
      case "sim":
        return simBlockHtml(b.sim);
      case "text":
        return "<p>" + esc(b.text) + "</p>";
      case "list":
        return (
          (b.title ? "<h4>" + esc(b.title) + "</h4>" : "") +
          '<ul class="bullets">' +
          b.items.map((i) => "<li>" + sayItem(i) + "</li>").join("") +
          "</ul>"
        );
      case "steps":
        return (
          (b.title ? "<h4>" + esc(b.title) + "</h4>" : "") +
          '<ol class="steps">' +
          b.items.map((i) => "<li>" + esc(i) + "</li>").join("") +
          "</ol>"
        );
      case "note":
        return (
          '<div class="note ' +
          (b.kind || "tip") +
          '">' +
          (b.title ? "<b>" + esc(b.title) + "</b>" : "") +
          "<p>" +
          esc(b.text) +
          "</p></div>"
        );
      case "key":
        return (
          '<div class="keybox"><b>Запомнить</b><ul>' +
          b.items.map((i) => "<li>" + esc(i) + "</li>").join("") +
          "</ul></div>"
        );
      case "figure":
        return (
          '<figure class="figure"><div class="fig-box" data-act="zoom-fig" data-fig="' +
          esc(b.figure) +
          '" role="button" tabindex="0" aria-label="Открыть схему крупно">' +
          (FIGURES[b.figure] || "") +
          '<span class="fig-zoom" aria-hidden="true">⤢</span></div>' +
          (b.caption ? "<figcaption>" + esc(b.caption) + "</figcaption>" : "") +
          "</figure>"
        );
      case "table":
        // Таблицы из трёх и более столбцов на узком экране превращаются в карточки:
        // подпись столбца берётся из data-label, поэтому ничего не обрезается.
        return (
          (b.title ? "<h4>" + esc(b.title) + "</h4>" : "") +
          '<div class="table-wrap' +
          (b.head.length >= 3 ? " t-cards" : "") +
          '"><table><thead><tr>' +
          b.head.map((h) => "<th>" + esc(h) + "</th>").join("") +
          "</tr></thead><tbody>" +
          b.rows
            .map(
              (r) =>
                "<tr>" +
                r.map((c, i) => '<td data-label="' + esc(b.head[i] || "") + '">' + esc(c) + (en && b.head[i] === "English" ? speakBtn(c.replace(/…/g, "")) : "") + "</td>").join("") +
                "</tr>"
            )
            .join("") +
          "</tbody></table></div>"
        );
      default:
        return "";
    }
  }

  function renderTests() {
    setTop("Тесты", allQuestions.length + " вопросов в базе");
    const due = dueMistakes().length;
    const mistakesTotal = Object.keys(state.mistakes).filter((id) => questionById[id]).length;

    let html =
      '<section class="section"><div class="card"><div class="row spread"><div><h3>Ваша точность</h3><p>' +
      state.answers.correct +
      " верных из " +
      state.answers.total +
      "</p></div><b style=\"font-size:24px\">" +
      accuracy() +
      "%</b></div></div></section>";

    html +=
      '<section class="section"><div class="section-head"><h2>Быстрый старт</h2></div>' +
      '<a class="menu-item" href="#/quiz/daily/1"><span class="mi-ico">🌅</span><span class="mi-body"><b>Тренировка дня</b><span class="mi-sub">ошибки, выцветающие темы, слабый курс и новое</span></span></a>' +
      '<a class="menu-item" href="#/review"><span class="mi-ico">↻</span><span class="mi-body"><b>Пора повторить</b><span class="mi-sub">' +
      (reviewLessons().length ? reviewLessons().length + " " + plural(reviewLessons().length, "тема выцветает", "темы выцветают", "тем выцветают") : "все темы свежие") +
      "</span></span></a>" +
      '<a class="menu-item" href="#/quiz/mix/10"><span class="mi-ico">⚡</span><span class="mi-body"><b>Случайные 10 вопросов</b><span class="mi-sub">по всем курсам</span></span></a>' +
      '<a class="menu-item" href="#/quiz/mix/25"><span class="mi-ico">🧩</span><span class="mi-body"><b>Большой тест · 25 вопросов</b><span class="mi-sub">проверка общей подготовки</span></span></a>' +
      '<a class="menu-item" href="#/interview"><span class="mi-ico">💼</span><span class="mi-body"><b>Собеседование</b><span class="mi-sub">' +
      INTERVIEW_SIZE +
      " вопросов за " +
      INTERVIEW_SECONDS / 60 +
      ' минут, разбор по направлениям</span></span></a>' +
      '<a class="menu-item" href="#/games"><span class="mi-ico">🎮</span><span class="mi-body"><b>Игры</b><span class="mi-sub">найди пару, блиц на минуту, собери порядок</span></span></a>' +
      '<a class="menu-item" href="#/cases"><span class="mi-ico">🧩</span><span class="mi-body"><b>Кейсы с проекта</b><span class="mi-sub">' +
      CASES.length +
      " ситуаций с разбором решений</span></span></a>" +
      '<a class="menu-item" href="#/quiz/mistakes/all"><span class="mi-ico">🎯</span><span class="mi-body"><b>Мои ошибки</b><span class="mi-sub">' +
      (mistakesTotal
        ? due
          ? due + " " + plural(due, "вопрос", "вопроса", "вопросов") + " готовы к повтору"
          : "все " + mistakesTotal + " на паузе до срока повтора"
        : "ошибок пока нет") +
      "</span></span></a></section>";

    html += '<section class="section"><div class="section-head"><h2>По курсам</h2></div>';
    CONTENT.courses.forEach((c) => {
      const st = state.byCourse[c.id] || { total: 0, correct: 0 };
      const acc = st.total ? Math.round((st.correct / st.total) * 100) : 0;
      const qn = c.lessons.reduce((a, l) => a + (l.questions || []).length, 0);
      html +=
        '<div class="card" style="--accent:' +
        c.accent +
        '"><div class="row spread"><div><h3>' +
        esc(c.title) +
        "</h3><p>" +
        qn +
        " вопросов · точность " +
        acc +
        '%</p></div></div><div class="btn-row mt"><a class="btn small soft" href="#/quiz/course/' +
        c.id +
        '">10 вопросов</a><a class="btn small" href="#/quiz/exam/' +
        c.id +
        '">Экзамен</a></div></div>';
    });
    html += "</section>";

    if (state.history.length) {
      html += '<section class="section"><div class="section-head"><h2>История</h2></div>';
      state.history
        .slice(0, 8)
        .forEach((h) => {
          const pct = Math.round((h.correct / h.total) * 100);
          html +=
            '<div class="result"><span class="kind">' +
            esc(h.mode) +
            "</span><b>" +
            esc(h.title) +
            "</b><span>" +
            h.correct +
            " из " +
            h.total +
            " · " +
            pct +
            "% · " +
            new Date(h.at).toLocaleDateString("ru-RU") +
            "</span></div>";
        });
      html += "</section>";
    }

    view.innerHTML = html;
  }

  /* ================= движок тестов ================= */

  let quiz = null;

  function startQuiz(mode, arg) {
    let items = [];
    let title = "Тест";
    let modeName = "Тест";

    if (mode === "lesson") {
      const lesson = lessonById[arg];
      if (!lesson) return renderNotFound();
      items = (lesson.questions || []).slice();
      title = lesson.title;
      modeName = "Мини-тест";
    } else if (mode === "course") {
      const course = courseById[arg];
      if (!course) return renderNotFound();
      items = shuffle(allQuestions.filter((q) => q.courseId === arg)).slice(0, 10);
      title = course.title + " · тест";
      modeName = "Тест по курсу";
    } else if (mode === "exam") {
      const course = courseById[arg];
      if (!course) return renderNotFound();
      items = shuffle(allQuestions.filter((q) => q.courseId === arg)).slice(0, 25);
      title = course.title + " · экзамен";
      modeName = "Экзамен";
    } else if (mode === "mix") {
      const n = Math.max(5, Math.min(50, parseInt(arg, 10) || 10));
      items = shuffle(allQuestions).slice(0, n);
      title = "Случайные вопросы";
      modeName = "Случайный тест";
    } else if (mode === "mistakes") {
      let ids = dueMistakes();
      if (!ids.length) ids = Object.keys(state.mistakes).filter((id) => questionById[id]);
      items = shuffle(ids.map((id) => questionById[id])).slice(0, 15);
      title = "Работа над ошибками";
      modeName = "Ошибки";
    } else if (mode === "daily") {
      items = dailyItems();
      title = "Тренировка дня";
      modeName = "Тренировка дня";
    } else if (mode === "review") {
      const lesson = lessonById[arg];
      if (!lesson) return renderNotFound();
      items = shuffle(lesson.questions || []).slice(0, 3);
      title = "Повторение: " + lesson.title;
      modeName = "Повторение";
    } else if (mode === "interview") {
      // Не больше трёх вопросов из одного курса — чтобы проверялась широта, а не одна тема.
      const per = {};
      shuffle(allQuestions.filter((q) => q.courseId !== "english")).forEach((q) => {
        if (items.length >= INTERVIEW_SIZE || (per[q.courseId] || 0) >= 3) return;
        per[q.courseId] = (per[q.courseId] || 0) + 1;
        items.push(q);
      });
      title = "Собеседование";
      modeName = "Собеседование";
    }

    if (!items.length) {
      setTop("Тесты", "");
      view.innerHTML =
        '<div class="empty"><span class="em">🎉</span><b>Вопросов для этого режима нет</b><p class="muted small mt">Ошибок к повтору не осталось. Пройдите новый урок или случайный тест.</p><div class="btn-row mt"><a class="btn primary" href="#/quiz/mix/10">Случайный тест</a><a class="btn" href="#/tests">Назад</a></div></div>';
      return;
    }

    quiz = {
      mode: mode,
      modeName: modeName,
      title: title,
      items: items,
      idx: 0,
      sel: [],
      checked: false,
      correct: 0,
      wrong: [],
      results: [],
      run: 0,
      lessonId: mode === "lesson" || mode === "review" ? arg : "",
      startedAt: Date.now(),
      deadline: mode === "interview" ? Date.now() + INTERVIEW_SECONDS * 1000 : 0
    };
    renderQuestion();
    if (quiz.deadline) startQuizTimer();
  }

  /* ---- таймер собеседования ---- */

  const INTERVIEW_SIZE = 15;
  const INTERVIEW_SECONDS = 600;
  let quizTimer = null;

  const fmtTime = (sec) => {
    const s = Math.max(0, Math.ceil(sec));
    return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
  };

  function startQuizTimer() {
    clearInterval(quizTimer);
    quizTimer = setInterval(() => {
      // Ушли со страницы теста — собеседование считается прерванным.
      if (!quiz || !quiz.deadline || location.hash.indexOf("#/quiz/interview") !== 0) {
        clearInterval(quizTimer);
        return;
      }
      const left = (quiz.deadline - Date.now()) / 1000;
      const el = document.getElementById("quizTimer");
      if (el) {
        el.textContent = fmtTime(left);
        el.classList.toggle("low", left <= 60);
      }
      if (left <= 0) {
        clearInterval(quizTimer);
        interviewTimeout();
      }
    }, 500);
  }

  function interviewTimeout() {
    // Всё, на что не успели ответить, идёт в разбор как ошибка.
    const from = quiz.checked ? quiz.idx + 1 : quiz.idx;
    for (let i = from; i < quiz.items.length; i++) {
      const q = quiz.items[i];
      quiz.wrong.push({ q: q, given: null, timeout: true });
      quiz.results.push({ q: q, ok: false });
    }
    quiz.timedOut = true;
    toast("Время вышло");
    finishQuiz();
    window.scrollTo(0, 0);
  }

  function interviewReport(results) {
    const byCourse = {};
    const weakLessons = {};
    results.forEach((r) => {
      const c = byCourse[r.q.courseId] || { total: 0, ok: 0 };
      c.total++;
      if (r.ok) c.ok++;
      else weakLessons[r.q.lessonId] = (weakLessons[r.q.lessonId] || 0) + 1;
      byCourse[r.q.courseId] = c;
    });
    let html = '<section class="section"><div class="section-head"><h2>По направлениям</h2></div><div class="card">';
    Object.keys(byCourse)
      .sort((a, b) => byCourse[a].ok / byCourse[a].total - byCourse[b].ok / byCourse[b].total)
      .forEach((id) => {
        const c = byCourse[id];
        const pct = Math.round((c.ok / c.total) * 100);
        html +=
          '<div class="iv-row"><span>' +
          esc((courseById[id] || {}).title || id) +
          '</span><div class="progress"><i style="width:' +
          pct +
          "%;background:" +
          (pct >= 70 ? "var(--ok)" : pct >= 40 ? "var(--warn)" : "var(--bad)") +
          '"></i></div><b>' +
          c.ok +
          "/" +
          c.total +
          "</b></div>";
      });
    html += "</div></section>";

    const weak = Object.keys(weakLessons).filter((id) => lessonById[id]);
    if (weak.length) {
      html +=
        '<section class="section"><div class="section-head"><h2>Что подтянуть</h2></div>' +
        weak
          .slice(0, 6)
          .map(
            (id) =>
              '<a class="menu-item" href="#/lesson/' +
              id +
              '"><span class="mi-ico">📘</span><span class="mi-body"><b>' +
              esc(lessonById[id].title) +
              '</b><span class="mi-sub">' +
              esc((courseById[lessonCourse[id]] || {}).title || "") +
              "</span></span></a>"
          )
          .join("") +
        "</section>";
    }
    return html;
  }

  function renderQuestion() {
    const q = quiz.items[quiz.idx];
    setTop(quiz.title, quiz.idx + 1 + " из " + quiz.items.length);
    const pct = (quiz.idx / quiz.items.length) * 100;
    const kind =
      q.type === "multi"
        ? "Несколько ответов"
        : q.type === "bool"
        ? "Верно или нет"
        : q.type === "input"
        ? "Впишите ответ"
        : "Один ответ";

    let body = "";
    if (q.type === "single" || q.type === "multi") {
      body =
        '<div class="options">' +
        q.options
          .map(
            (o, i) =>
              '<button class="option' +
              (q.type === "single" ? " round" : "") +
              '" data-act="pick" data-i="' +
              i +
              '"><span class="mark">' +
              (q.type === "single" ? "•" : "✓") +
              "</span><span>" +
              esc(o) +
              "</span></button>"
          )
          .join("") +
        "</div>";
      if (q.type === "multi")
        body += '<button class="btn primary block mt" data-act="check">Проверить</button>';
    } else if (q.type === "bool") {
      body =
        '<div class="options"><button class="option round" data-act="pick" data-i="1"><span class="mark">•</span><span>Верно</span></button>' +
        '<button class="option round" data-act="pick" data-i="0"><span class="mark">•</span><span>Неверно</span></button></div>';
    } else if (q.type === "input") {
      body =
        '<input class="answer-input" id="answerInput" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Ваш ответ" />' +
        '<button class="btn primary block mt" data-act="check">Проверить</button>';
    }

    const timer = quiz.deadline
      ? '<span class="quiz-timer" id="quizTimer">' + fmtTime((quiz.deadline - Date.now()) / 1000) + "</span>"
      : "";

    view.innerHTML =
      '<div class="quiz-top"><div class="progress"><i style="width:' +
      pct +
      '%"></i></div><span class="quiz-count">' +
      (quiz.idx + 1) +
      "/" +
      quiz.items.length +
      "</span>" +
      timer +
      "</div>" +
      '<div class="question" style="--accent:' +
      ((courseById[q.courseId] || {}).accent || "#4f7cf7") +
      '"><span class="q-kind">' +
      kind +
      "</span><h2>" +
      esc(q.q) +
      "</h2>" +
      body +
      '<div id="verdict"></div></div>' +
      '<div class="btn-row mt">' +
      (quiz.deadline ? "" : '<a class="btn" href="#/lesson/' + q.lessonId + '">К уроку</a>') +
      '<button class="btn" data-act="quit">Прервать</button></div>';

    quiz.sel = [];
    quiz.checked = false;
    const input = document.getElementById("answerInput");
    if (input) setTimeout(() => input.focus(), 60);
  }

  function pick(i) {
    const q = quiz.items[quiz.idx];
    if (quiz.checked) return;
    if (q.type === "multi") {
      const at = quiz.sel.indexOf(i);
      if (at >= 0) quiz.sel.splice(at, 1);
      else quiz.sel.push(i);
      document.querySelectorAll(".option").forEach((el) => {
        el.classList.toggle("sel", quiz.sel.indexOf(Number(el.dataset.i)) >= 0);
      });
    } else {
      quiz.sel = [i];
      checkAnswer();
    }
  }

  function isCorrect(q, sel, text) {
    if (q.type === "single") return sel[0] === q.answer;
    if (q.type === "bool") return (sel[0] === 1) === q.answer;
    if (q.type === "multi") {
      const want = q.answer.slice().sort().join(",");
      return sel.slice().sort().join(",") === want;
    }
    if (q.type === "input") {
      const a = norm(text);
      const b = hardNorm(text);
      if (!a) return false;
      return q.answer.some((v) => norm(v) === a || hardNorm(v) === b);
    }
    return false;
  }

  function correctText(q) {
    if (q.type === "single") return q.options[q.answer];
    if (q.type === "bool") return q.answer ? "Верно" : "Неверно";
    if (q.type === "multi") return q.answer.map((i) => q.options[i]).join(" · ");
    if (q.type === "input") return q.answer[0];
    return "";
  }

  function checkAnswer() {
    if (quiz.checked) return;
    const q = quiz.items[quiz.idx];
    const input = document.getElementById("answerInput");
    const text = input ? input.value : "";
    if (q.type === "multi" && !quiz.sel.length) return toast("Выберите хотя бы один вариант");
    if (q.type === "input" && !text.trim()) return toast("Введите ответ");

    const ok = isCorrect(q, quiz.sel, text);
    quiz.checked = true;
    quiz.results.push({ q: q, ok: ok });
    if (ok) quiz.correct++;
    else quiz.wrong.push({ q: q, given: q.type === "input" ? text : quiz.sel.slice() });

    // отметка вариантов
    document.querySelectorAll(".option").forEach((el) => {
      el.setAttribute("disabled", "disabled");
      const val = Number(el.dataset.i);
      let isRight;
      if (q.type === "bool") isRight = (val === 1) === (q.answer === true);
      else if (q.type === "multi") isRight = q.answer.indexOf(val) >= 0;
      else isRight = val === q.answer;
      if (isRight) el.classList.add("right");
      else if (quiz.sel.indexOf(val) >= 0) el.classList.add("wrong");
    });
    if (input) input.setAttribute("disabled", "disabled");

    const verdict = document.getElementById("verdict");
    verdict.innerHTML =
      '<div class="verdict ' +
      (ok ? "ok" : "no") +
      '"><b>' +
      (ok ? "Верно" : "Ошибка") +
      "</b>" +
      (ok ? "" : '<p><b class="ans-label">Правильный ответ: </b>' + esc(correctText(q)) + "</p>") +
      (q.explain ? "<p>" + esc(q.explain) + "</p>" : "") +
      '</div><button class="btn primary block mt" data-act="next">' +
      (quiz.idx + 1 < quiz.items.length ? "Дальше →" : "Результат") +
      "</button>";

    // статистика
    state.answers.total++;
    if (ok) state.answers.correct++;
    const cs = state.byCourse[q.courseId] || { total: 0, correct: 0 };
    cs.total++;
    if (ok) cs.correct++;
    state.byCourse[q.courseId] = cs;
    if (ok) state.xp += 3;
    bumpDay("questions", 1);

    quiz.run = ok ? (quiz.run || 0) + 1 : 0;
    if (ok) bumpDay("correct", 1);
    const dayNow = state.days[todayKey()];
    dayNow.bestRun = Math.max(dayNow.bestRun || 0, quiz.run);

    // интервальное повторение ошибок
    const m = state.mistakes[q.id];
    if (ok && m) bumpDay("fixes", 1);
    if (ok) {
      if (m) {
        const box = Math.min(MISTAKE_HOURS.length - 1, (m.box || 0) + 1);
        if (box >= MISTAKE_HOURS.length - 1) delete state.mistakes[q.id];
        else state.mistakes[q.id] = { box: box, dueAt: Date.now() + MISTAKE_HOURS[box] * 3600000 };
      }
    } else {
      state.mistakes[q.id] = { box: 0, dueAt: Date.now() };
    }
    checkQuests();
    save();

    const nextBtn = verdict.querySelector('[data-act="next"]');
    if (nextBtn) nextBtn.focus();
  }

  function nextQuestion() {
    if (quiz.idx + 1 < quiz.items.length) {
      quiz.idx++;
      renderQuestion();
      window.scrollTo(0, 0);
    } else {
      finishQuiz();
    }
  }

  function finishQuiz() {
    const total = quiz.items.length;
    const pct = Math.round((quiz.correct / total) * 100);
    state.history.unshift({
      at: Date.now(),
      mode: quiz.modeName,
      title: quiz.title,
      correct: quiz.correct,
      total: total
    });
    state.history = state.history.slice(0, 30);
    if (quiz.mode === "exam" && pct >= 90) state.flags.exam90 = true;
    if (total >= 10 && pct === 100) state.flags.perfect = true;
    if (quiz.mode === "mistakes") state.flags.mistakes = true;
    if (quiz.mode === "exam" && pct >= 80) state.xp += 25;
    state.companion.lastQuizAt = Date.now();
    state.companion.lastQuizPct = pct;
    if (quiz.lessonId) recordLessonQuiz(quiz.lessonId, pct, quiz.mode === "review");
    if (quiz.mode === "daily") {
      bumpDay("daily", 1);
      state.xp += 10;
    }
    checkQuests();
    const isInterview = quiz.mode === "interview";
    if (isInterview) {
      clearInterval(quizTimer);
      state.games.interviewBest = Math.max(state.games.interviewBest || 0, pct);
      state.games.played++;
      if (pct >= 80) state.xp += 30;
    }
    save();

    setTop("Результат", quiz.title);
    const r = 58;
    const c = 2 * Math.PI * r;
    const verdictText =
      pct >= 90 ? "Отличный результат" : pct >= 70 ? "Хорошо, но есть пробелы" : pct >= 50 ? "Стоит повторить тему" : "Нужно вернуться к уроку";

    let html =
      '<section class="section center"><div class="result-ring"><svg viewBox="0 0 132 132"><circle class="track" cx="66" cy="66" r="' +
      r +
      '"/><circle class="bar" cx="66" cy="66" r="' +
      r +
      '" stroke-dasharray="' +
      ((pct / 100) * c).toFixed(1) +
      " " +
      c.toFixed(1) +
      '"/></svg><b>' +
      pct +
      "%</b></div><h2 style=\"margin:0\">" +
      verdictText +
      '</h2><p class="muted">' +
      quiz.correct +
      " верных из " +
      total +
      " · +" +
      quiz.correct * 3 +
      " XP" +
      (isInterview
        ? " · " + fmtTime((Math.min(Date.now(), quiz.deadline) - quiz.startedAt) / 1000) + (quiz.timedOut ? " (время вышло)" : "")
        : "") +
      "</p></section>";

    if (isInterview) html += interviewReport(quiz.results);

    if (quiz.wrong.length) {
      html += '<section class="section"><div class="section-head"><h2>Разбор ошибок</h2></div>';
      quiz.wrong.forEach((w) => {
        html +=
          '<div class="mistake"><b>' +
          esc(w.q.q) +
          "</b>" +
          (w.timeout ? '<div class="muted small">не успели ответить</div>' : "") +
          '<div class="ans">Правильно: ' +
          esc(correctText(w.q)) +
          "</div>" +
          (w.q.explain ? '<div class="muted small mt">' + esc(w.q.explain) + "</div>" : "") +
          '<a class="btn small soft mt" href="#/lesson/' +
          w.q.lessonId +
          '">Открыть урок</a></div>';
      });
      html += "</section>";
    } else {
      html +=
        '<section class="section"><div class="note tip"><b>Ни одной ошибки</b><p>Можно двигаться дальше — попробуйте экзамен или следующий курс.</p></div></section>';
    }

    html +=
      '<section class="section"><div class="btn-row">' +
      (quiz.wrong.length ? '<button class="btn primary" data-act="retry-wrong">Повторить ошибки</button>' : "") +
      (isInterview ? '<a class="btn" href="#/interview">Ещё собеседование</a>' : "") +
      '<a class="btn" href="#/tests">К тестам</a><a class="btn" href="#/">На главную</a></div></section>';

    const wrongItems = quiz.wrong.map((w) => w.q);
    view.innerHTML = html;
    view._wrongItems = wrongItems;
    quiz = null;
  }

  /* ================= видео ================= */

  function renderVideos(params) {
    setTop("Видеоуроки", "подборки и свои ссылки");
    const active = params.get("course") || "all";
    const query = norm(params.get("q") || "");
    let list = CONTENT.videos.slice();
    if (active !== "all") list = list.filter((v) => v.course === active);
    if (query) list = list.filter((v) => norm(v.title + " " + v.description).indexOf(query) >= 0);

    let html =
      '<div class="filters"><button data-act="vfilter" data-id="all" class="' +
      (active === "all" ? "on" : "") +
      '">Все</button>' +
      CONTENT.courses
        .map(
          (c) =>
            '<button data-act="vfilter" data-id="' +
            c.id +
            '" class="' +
            (active === c.id ? "on" : "") +
            '">' +
            esc(c.title) +
            "</button>"
        )
        .join("") +
      "</div>";

    html +=
      '<section class="section"><div class="note tip"><b>Как это работает</b><p>«Смотреть» открывает YouTube с подборкой уроков по теме — такие ссылки не устаревают. Свои видео можно сохранить в конце страницы.</p></div></section>';

    if (state.myVideos.length) {
      html += '<section class="section"><div class="section-head"><h2>Мои видео</h2></div>';
      state.myVideos.forEach((v, i) => {
        html +=
          '<div class="video-card"><div class="vc-top"><div class="play"><svg viewBox="0 0 24 24">' +
          ICONS.play +
          "</svg></div><div><b>" +
          esc(v.title) +
          "</b><span>" +
          esc((courseById[v.course] || {}).title || "Своё видео") +
          '</span></div></div><div class="btn-row mt"><a class="btn small primary" href="' +
          esc(v.url) +
          '" target="_blank" rel="noopener">Открыть</a><button class="btn small" data-act="del-video" data-i="' +
          i +
          '">Удалить</button></div></div>';
      });
      html += "</section>";
    }

    html += '<section class="section"><div class="section-head"><h2>Подборки по темам</h2><span class="muted small">' + list.length + "</span></div>";
    if (!list.length) html += '<div class="empty"><span class="em">🔍</span>Ничего не найдено</div>';
    list.forEach((v) => {
      const course = courseById[v.course] || {};
      const lesson = lessonById[v.lesson];
      html +=
        '<div class="video-card" style="--accent:' +
        course.accent +
        '"><div class="vc-top"><div class="play"><svg viewBox="0 0 24 24">' +
        ICONS.play +
        "</svg></div><div><b>" +
        esc(v.title) +
        "</b><span>" +
        esc(course.title) +
        " · " +
        esc(v.level) +
        "</span></div></div><p>" +
        esc(v.description) +
        '</p><div class="btn-row mt"><a class="btn small primary" href="https://www.youtube.com/results?search_query=' +
        encodeURIComponent(v.query) +
        '" target="_blank" rel="noopener">Смотреть</a>' +
        (lesson ? '<a class="btn small" href="#/lesson/' + lesson.id + '">Урок по теме</a>' : "") +
        "</div></div>";
    });
    html += "</section>";

    html +=
      '<section class="section"><details class="term"><summary>➕ Добавить своё видео</summary><div class="term-body">' +
      '<input class="answer-input" id="vTitle" type="text" placeholder="Название" /><input class="answer-input mt" id="vUrl" type="url" placeholder="Ссылка (https://...)" />' +
      '<select class="answer-input mt" id="vCourse">' +
      CONTENT.courses.map((c) => '<option value="' + c.id + '">' + esc(c.title) + "</option>").join("") +
      '</select><button class="btn primary block mt" data-act="add-video">Сохранить</button></div></details></section>';

    view.innerHTML = html;
  }

  /* ================= глоссарий ================= */

  function renderGlossary(params) {
    setTop("Глоссарий", CONTENT.glossary.length + " терминов");
    const active = params.get("course") || "all";
    const q = params.get("q") || "";

    let html =
      '<div class="search-wrap"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6" fill="none"/><path d="M16 16l4 4"/></svg>' +
      '<input class="search-field" id="glossarySearch" type="search" placeholder="Поиск термина" value="' +
      esc(q) +
      '" /></div>';

    html +=
      '<div class="filters"><button data-act="gfilter" data-id="all" class="' +
      (active === "all" ? "on" : "") +
      '">Все</button>' +
      CONTENT.courses
        .map(
          (c) =>
            '<button data-act="gfilter" data-id="' +
            c.id +
            '" class="' +
            (active === c.id ? "on" : "") +
            '">' +
            esc(c.title) +
            "</button>"
        )
        .join("") +
      "</div>";

    html += '<div id="termList"></div>';
    view.innerHTML = html;

    const box = document.getElementById("termList");
    const input = document.getElementById("glossarySearch");

    function draw(value) {
      const nq = norm(value);
      let list = CONTENT.glossary.slice();
      if (active !== "all") list = list.filter((t) => t.course === active);
      if (nq) list = list.filter((t) => norm(t.term + " " + (t.full || "") + " " + t.text).indexOf(nq) >= 0);
      list.sort((a, b) => a.term.localeCompare(b.term, "ru"));

      if (!list.length) {
        box.innerHTML = '<div class="empty"><span class="em">🔍</span>Термин не найден</div>';
        return;
      }
      box.innerHTML = list
        .map((t) => {
          const course = courseById[t.course] || {};
          return (
            '<details class="term" data-term="' +
            esc(t.term) +
            '" style="--accent:' +
            course.accent +
            '"' +
            (nq && list.length <= 3 ? " open" : "") +
            "><summary><span>" +
            esc(t.term) +
            (t.full ? ' <span class="term-full">(' + esc(t.full) + ")</span>" : "") +
            '</span></summary><div class="term-body">' +
            esc(t.text) +
            '<div class="row mt"><span class="chip accent">' +
            esc(course.title || "BIM") +
            "</span></div></div></details>"
          );
        })
        .join("");
    }

    draw(q);
    if (input) {
      input.addEventListener("input", () => {
        clearTimeout(input._t);
        input._t = setTimeout(() => draw(input.value), 140);
      });
    }
  }

  /* ================= поиск ================= */

  function renderSearch(params) {
    setTop("Поиск", "уроки, термины, вопросы, видео");
    const q = params.get("q") || "";
    let html =
      '<div class="search-wrap"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6" fill="none"/><path d="M16 16l4 4"/></svg>' +
      '<input class="search-field" id="mainSearch" type="search" placeholder="Что ищем? Например: коллизии, LOD, слои" value="' +
      esc(q) +
      '" /></div><div id="searchResults"></div>';
    view.innerHTML = html;

    const input = document.getElementById("mainSearch");
    const box = document.getElementById("searchResults");

    function run(value) {
      const nq = norm(value);
      if (nq.length < 2) {
        box.innerHTML =
          '<div class="section"><div class="section-head"><h2>Популярное</h2></div><div class="row row-wrap">' +
          ["коллизии", "LOD", "IFC", "семейства", "слои", "спецификации", "коридор", "рабочие наборы", "печать", "поверхность"]
            .map((w) => '<button class="chip accent" data-act="suggest" data-w="' + w + '">' + w + "</button>")
            .join("") +
          "</div></div>";
        return;
      }
      const words = nq.split(" ").filter(Boolean);
      const found = searchIndex
        .map((item) => {
          let score = 0;
          words.forEach((w) => {
            const at = item.hay.indexOf(w);
            if (at >= 0) score += at < 60 ? 3 : 1;
            if (norm(item.title).indexOf(w) >= 0) score += 4;
          });
          return { item: item, score: score };
        })
        .filter((x) => x.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 40);

      if (!found.length) {
        box.innerHTML = '<div class="empty"><span class="em">🤔</span>Ничего не нашлось. Попробуйте другое слово.</div>';
        return;
      }
      box.innerHTML =
        '<div class="section"><div class="section-head"><h2>Найдено</h2><span class="muted small">' +
        found.length +
        "</span></div>" +
        found
          .map((x) => {
            const it = x.item;
            const accent = (courseById[it.course] || {}).accent || "#4f7cf7";
            return (
              '<a class="result" href="' +
              it.href +
              '" style="--accent:' +
              accent +
              '"><span class="kind">' +
              it.kind +
              "</span><b>" +
              highlight(it.title, words) +
              "</b><span>" +
              highlight(cut(it.sub, 130), words) +
              "</span></a>"
            );
          })
          .join("") +
        "</div>";
    }

    function cut(s, n) {
      s = String(s || "");
      return s.length > n ? s.slice(0, n) + "…" : s;
    }

    function highlight(text, words) {
      let out = esc(text);
      words.forEach((w) => {
        if (w.length < 2) return;
        const re = new RegExp("(" + w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "gi");
        out = out.replace(re, "<mark>$1</mark>");
      });
      return out;
    }

    input.addEventListener("input", () => {
      clearTimeout(input._t);
      input._t = setTimeout(() => run(input.value), 160);
    });
    box.addEventListener("click", (e) => {
      const b = e.target.closest('[data-act="suggest"]');
      if (b) {
        input.value = b.dataset.w;
        run(input.value);
      }
    });
    run(q);
    if (!q) setTimeout(() => input.focus(), 80);
  }

  /* ================= горячие клавиши ================= */

  function renderKeys() {
    setTop("Горячие клавиши", "шпаргалки по программам");
    let html = '<section class="section"><p class="muted small">Собрано из уроков: сочетания клавиш и служебные команды.</p></section>';
    CONTENT.courses.forEach((course) => {
      const tables = [];
      course.lessons.forEach((l) => {
        (l.blocks || []).forEach((b) => {
          if (b.type === "table" && /клавиш|команд|Ввод координат/i.test(b.title || "")) {
            tables.push({ block: b, lesson: l });
          }
        });
      });
      if (!tables.length) return;
      html +=
        '<section class="section" style="--accent:' +
        course.accent +
        '"><div class="section-head"><h2>' +
        esc(course.title) +
        "</h2></div>";
      tables.forEach((t) => {
        html +=
          '<div class="block">' +
          renderBlock(t.block) +
          '<a class="btn small soft mt" href="#/lesson/' +
          t.lesson.id +
          '">Урок: ' +
          esc(t.lesson.title) +
          "</a></div>";
      });
      html += "</section>";
    });
    view.innerHTML = html;
  }

  /* ================= закладки ================= */

  function renderBookmarks() {
    setTop("Закладки", state.bookmarks.length + " " + plural(state.bookmarks.length, "урок", "урока", "уроков"));
    const list = state.bookmarks.map((id) => lessonById[id]).filter(Boolean);
    if (!list.length) {
      view.innerHTML =
        '<div class="empty"><span class="em">☆</span><b>Пока пусто</b><p class="muted small mt">Открывайте урок и нажимайте «В закладки», чтобы вернуться к нему позже.</p><a class="btn primary mt" href="#/courses">К курсам</a></div>';
      return;
    }
    view.innerHTML =
      '<section class="section">' + list.map((l, i) => lessonRow(l, i + 1)).join("") + "</section>";
  }

  /* ================= чек-листы ================= */

  const CHECKLISTS = CONTENT.checklists || [];

  function checkItems(list) {
    return list.groups.reduce((a, g) => a.concat(g.items), []);
  }

  function currentProject() {
    const list = state.checkProjects || [];
    if (!list.length) return null;
    return list.filter((p) => p.id === state.checkCurrent)[0] || list[0];
  }

  function checkProgress(list, projectId) {
    const done = (state.checkDone || {})[projectId] || {};
    const items = checkItems(list);
    const n = items.filter((i) => done[i.id]).length;
    return { done: n, total: items.length, pct: items.length ? Math.round((n / items.length) * 100) : 0 };
  }

  // Пересчёт счётчиков на экране чек-листа без перерисовки страницы.
  function updateCheckCounters() {
    const project = currentProject();
    if (!project) return;
    const listId = (currentRoute()[3].get("list")) || CHECKLISTS[0].id;
    const list = CHECKLISTS.filter((c) => c.id === listId)[0] || CHECKLISTS[0];
    const done = (state.checkDone || {})[project.id] || {};
    const prog = checkProgress(list, project.id);

    const bar = document.getElementById("checkBar");
    if (bar) bar.style.width = prog.pct + "%";
    const count = document.getElementById("checkCount");
    if (count) count.textContent = prog.done + " из " + prog.total + " · " + project.name;

    list.groups.forEach((g, gi) => {
      const badge = document.querySelector('[data-group="' + gi + '"]');
      if (badge) badge.textContent = g.items.filter((i) => done[i.id]).length + "/" + g.items.length;
    });

    CHECKLISTS.forEach((c) => {
      const chip = document.querySelector('a[href="#/checks?list=' + c.id + '"]');
      if (chip) chip.textContent = c.icon + " " + c.title + " · " + checkProgress(c, project.id).pct + "%";
    });
  }

  function renderChecks(params) {
    setTop("Чек-листы", "перед стартом, выдачей и приёмкой");
    const project = currentProject();
    const listId = (params && params.get("list")) || CHECKLISTS[0].id;
    const list = CHECKLISTS.filter((c) => c.id === listId)[0] || CHECKLISTS[0];

    let html = "";

    if (!project) {
      html +=
        '<section class="section"><div class="note tip"><b>Заведите проект</b><p>Отметки хранятся отдельно по каждому объекту, поэтому один и тот же чек-лист можно вести параллельно для нескольких проектов.</p></div>' +
        '<input class="answer-input mt" id="projName" type="text" placeholder="Название проекта" />' +
        '<button class="btn primary block mt" data-act="add-project">Создать</button></section>';
      view.innerHTML = html;
      return;
    }

    html +=
      '<section class="section"><div class="section-head"><h2>Проект</h2></div><div class="row row-wrap">' +
      state.checkProjects
        .map(
          (p) =>
            '<a class="chip' +
            (p.id === project.id ? " accent" : "") +
            '" href="#/checks?list=' +
            esc(listId) +
            "&project=" +
            encodeURIComponent(p.id) +
            '" data-act="pick-project" data-id="' +
            esc(p.id) +
            '">' +
            esc(p.name) +
            "</a>"
        )
        .join("") +
      '<button class="chip" data-act="new-project">+ проект</button></div></section>';

    html +=
      '<section class="section"><div class="row row-wrap">' +
      CHECKLISTS.map((c) => {
        const p = checkProgress(c, project.id);
        return (
          '<a class="chip' +
          (c.id === listId ? " accent" : "") +
          '" href="#/checks?list=' +
          c.id +
          '">' +
          c.icon +
          " " +
          esc(c.title) +
          " · " +
          p.pct +
          "%</a>"
        );
      }).join("") +
      "</div></section>";

    const prog = checkProgress(list, project.id);
    const done = (state.checkDone || {})[project.id] || {};

    html +=
      '<section class="section"><div class="card"><h3>' +
      list.icon +
      " " +
      esc(list.title) +
      "</h3><p>" +
      esc(list.intro) +
      '</p><div class="progress mt"><span id="checkBar" style="width:' +
      prog.pct +
      '%"></span></div><p class="muted small mt" id="checkCount">' +
      prog.done +
      " из " +
      prog.total +
      " · " +
      esc(project.name) +
      "</p></div></section>";

    list.groups.forEach((g, gi) => {
      const gDone = g.items.filter((i) => done[i.id]).length;
      html +=
        '<section class="section"><div class="section-head"><h2>' +
        esc(g.title) +
        '</h2><span class="muted small" data-group="' +
        gi +
        '">' +
        gDone +
        "/" +
        g.items.length +
        "</span></div>";
      g.items.forEach((i) => {
        const on = !!done[i.id];
        html +=
          '<button class="menu-item check-row' +
          (on ? " on" : "") +
          '" data-act="toggle-check" data-id="' +
          esc(i.id) +
          '"><span class="cb">✓</span><span class="mi-body"><b>' +
          esc(i.text) +
          "</b></span></button>";
      });
      html += "</section>";
    });

    html +=
      '<section class="section"><div class="btn-row">' +
      '<button class="btn" data-act="reset-check" data-id="' +
      esc(list.id) +
      '">Сбросить список</button>' +
      '<button class="btn" data-act="del-project">Удалить проект</button></div></section>';

    view.innerHTML = html;
  }

  /* ================= предупреждения Revit ================= */

  const WARNINGS = CONTENT.warnings || [];

  function warningCard(w) {
    return (
      '<details class="term" data-term="' +
      esc(w.id) +
      '"><summary>' +
      (w.kind === "error" ? "⛔️ " : "⚠️ ") +
      esc(w.ru) +
      '</summary><div class="term-body">' +
      '<p class="muted small"><code>' +
      esc(w.en) +
      "</code></p>" +
      "<p><b>Чем грозит.</b> " +
      esc(w.why) +
      "</p>" +
      "<p><b>Как чинить</b></p><ol>" +
      w.fix.map((f) => "<li>" + esc(f) + "</li>").join("") +
      "</ol>" +
      (w.lesson && lessonById[w.lesson]
        ? '<a class="btn small soft mt" href="#/lesson/' + w.lesson + '">Урок: ' + esc(lessonById[w.lesson].title) + "</a>"
        : "") +
      "</div></details>"
    );
  }

  function renderWarnings(params) {
    setTop("Предупреждения Revit", "что значит и как чинить");
    const q = ((params && params.get("q")) || "").trim().toLowerCase();
    const kind = (params && params.get("kind")) || "all";

    let list = WARNINGS.slice();
    if (kind !== "all") list = list.filter((w) => w.kind === kind);
    if (q) {
      list = list.filter(
        (w) =>
          w.ru.toLowerCase().indexOf(q) >= 0 ||
          w.en.toLowerCase().indexOf(q) >= 0 ||
          w.why.toLowerCase().indexOf(q) >= 0 ||
          (w.tags || []).join(" ").toLowerCase().indexOf(q) >= 0
      );
    }

    let html =
      '<section class="section"><input class="answer-input" id="wq" type="search" placeholder="Поиск: текст, смысл или тема" value="' +
      esc(q) +
      '" /></section>';

    html +=
      '<section class="section"><div class="row row-wrap">' +
      [["all", "Все"], ["warn", "Предупреждения"], ["error", "Ошибки"]]
        .map(
          (k) =>
            '<a class="chip' +
            (kind === k[0] ? " accent" : "") +
            '" href="#/warnings?kind=' +
            k[0] +
            (q ? "&q=" + encodeURIComponent(q) : "") +
            '">' +
            k[1] +
            "</a>"
        )
        .join("") +
      "</div></section>";

    html +=
      '<section class="section"><div class="note tip"><b>Английский текст приведён специально</b><p>Именно он попадает в отчёты и в результаты поиска. В русской версии Revit формулировка другая, смысл описан рядом.</p></div></section>';

    html += '<section class="section"><div class="section-head"><h2>Найдено</h2><span class="muted small">' + list.length + "</span></div>";
    if (!list.length) html += '<div class="empty"><span class="em">🔍</span>Ничего не найдено</div>';
    list.forEach((w) => {
      html += warningCard(w);
    });
    html += "</section>";

    view.innerHTML = html;

    const input = document.getElementById("wq");
    if (input) {
      input.addEventListener("input", () => {
        const val = input.value.trim();
        location.replace("#/warnings?kind=" + kind + (val ? "&q=" + encodeURIComponent(val) : ""));
      });
    }
  }

  /* ================= карточки терминов ================= */

  let cardSession = null;

  function dueCards() {
    const now = Date.now();
    return CONTENT.glossary.filter((g) => {
      const c = state.cards[g.term];
      return c && c.dueAt <= now;
    });
  }

  function newCards() {
    return CONTENT.glossary.filter((g) => !state.cards[g.term]);
  }

  function startCards(course) {
    const pool = course && course !== "all" ? CONTENT.glossary.filter((g) => g.course === course) : CONTENT.glossary;
    const now = Date.now();
    const due = pool.filter((g) => state.cards[g.term] && state.cards[g.term].dueAt <= now);
    const fresh = pool.filter((g) => !state.cards[g.term]);
    const items = due.concat(shuffle(fresh).slice(0, Math.max(0, 15 - due.length))).slice(0, 20);
    if (!items.length) return null;
    cardSession = { items: shuffle(items), idx: 0, shown: false, known: 0, total: items.length };
    return cardSession;
  }

  function renderCards(params) {
    setTop("Карточки терминов", "повторение по интервалам");

    if (cardSession && cardSession.idx < cardSession.items.length) return renderCard();

    if (cardSession) {
      const s = cardSession;
      cardSession = null;
      view.innerHTML =
        '<section class="section"><div class="card"><h3>Готово</h3><p>Вспомнили ' +
        s.known +
        " из " +
        s.total +
        '.</p><div class="btn-row mt"><a class="btn primary" href="#/cards">Ещё подход</a><a class="btn" href="#/more">Закончить</a></div></div></section>';
      return;
    }

    const course = (params && params.get("course")) || "all";
    const due = dueCards().length;
    const fresh = newCards().length;

    let html =
      '<section class="section"><div class="card"><h3>Как это работает</h3><p>Термин показывается без определения — вы вспоминаете сами, потом проверяете. Если вспомнили, термин вернётся нескоро; если нет — уже через несколько часов.</p>' +
      '<p class="muted small mt">К повтору сейчас: ' +
      due +
      " · не открывали: " +
      fresh +
      "</p></div></section>";

    html +=
      '<section class="section"><div class="section-head"><h2>Курс</h2></div><div class="row row-wrap">' +
      [{ id: "all", title: "Все" }]
        .concat(CONTENT.courses.map((c) => ({ id: c.id, title: c.title })))
        .map(
          (c) =>
            '<a class="chip' +
            (course === c.id ? " accent" : "") +
            '" href="#/cards?course=' +
            c.id +
            '">' +
            esc(c.title) +
            "</a>"
        )
        .join("") +
      "</div></section>";

    html +=
      '<section class="section"><button class="btn primary block" data-act="start-cards" data-course="' +
      esc(course) +
      '">Начать подход</button></section>';

    view.innerHTML = html;
  }

  function renderCard() {
    const s = cardSession;
    const item = s.items[s.idx];
    let html =
      '<div class="quiz-top"><div class="progress"><span style="width:' +
      Math.round((s.idx / s.total) * 100) +
      '%"></span></div><span class="quiz-count">' +
      (s.idx + 1) +
      "/" +
      s.total +
      "</span></div>";

    html +=
      '<section class="question"><span class="q-kind">термин</span><h2>' +
      esc(item.term) +
      "</h2>" +
      (item.full ? '<p class="muted small">' + esc(item.full) + "</p>" : "");

    if (s.shown) {
      html += '<p class="mt">' + esc(item.text) + "</p>";
      html +=
        '<div class="btn-row mt"><button class="btn primary" data-act="card-known">Вспомнил</button>' +
        '<button class="btn" data-act="card-unknown">Не вспомнил</button></div>';
    } else {
      html += '<div class="btn-row mt"><button class="btn primary block" data-act="card-show">Показать определение</button></div>';
    }
    html += "</section>";
    html += '<div class="btn-row mt"><button class="btn" data-act="card-quit">Прервать</button></div>';
    view.innerHTML = html;
  }

  function answerCard(known) {
    const s = cardSession;
    const item = s.items[s.idx];
    const cur = state.cards[item.term] || { box: 0 };
    if (known) {
      const box = Math.min(MISTAKE_HOURS.length - 1, (cur.box || 0) + 1);
      state.cards[item.term] = { box: box, dueAt: Date.now() + MISTAKE_HOURS[box] * 3600000 };
      s.known++;
      if (state.terms.indexOf(item.term) < 0) state.terms.push(item.term);
    } else {
      state.cards[item.term] = { box: 0, dueAt: Date.now() + 4 * 3600000 };
    }
    s.idx++;
    s.shown = false;
    save();
    if (s.idx >= s.items.length) renderCards();
    else renderCard();
  }

  /* ================= тренажёр горячих клавиш ================= */

  let drill = null;

  function hotkeyPairs() {
    const out = [];
    CONTENT.courses.forEach((course) => {
      course.lessons.forEach((l) => {
        (l.blocks || []).forEach((b) => {
          if (b.type !== "table" || !/клавиш|сочетани/i.test(b.title || "")) return;
          (b.rows || []).forEach((r) => {
            if (!r[0] || !r[1]) return;
            // строки вида «MV / CO / RO» описывают сразу несколько команд — их пропускаем
            if (String(r[0]).indexOf("/") >= 0) return;
            out.push({ keys: String(r[0]), action: String(r[1]), course: course.title, courseId: course.id });
          });
        });
      });
    });
    return out;
  }

  function startDrill(courseId) {
    let pool = hotkeyPairs();
    if (courseId && courseId !== "all") pool = pool.filter((p) => p.courseId === courseId);
    if (pool.length < 4) return null;
    const items = shuffle(pool).slice(0, 10).map((p) => {
      const others = shuffle(pool.filter((x) => x.keys !== p.keys)).slice(0, 3);
      const options = shuffle(others.concat([p]));
      return { action: p.action, keys: p.keys, course: p.course, options: options.map((o) => o.keys) };
    });
    drill = { items: items, idx: 0, correct: 0, sel: null, startedAt: Date.now(), times: [] };
    return drill;
  }

  function renderDrill(params) {
    setTop("Тренажёр клавиш", "на скорость");

    if (drill && drill.idx < drill.items.length) return renderDrillQuestion();

    if (drill) {
      const d = drill;
      const total = Math.round((Date.now() - d.startedAt) / 1000);
      const avg = d.times.length ? (d.times.reduce((a, b) => a + b, 0) / d.times.length / 1000).toFixed(1) : "0";
      drill = null;
      view.innerHTML =
        '<section class="section"><div class="card"><h3>Результат</h3><p class="big">' +
        d.correct +
        " из " +
        d.items.length +
        '</p><p class="muted small">Всего ' +
        total +
        " с · в среднем " +
        avg +
        ' с на вопрос</p><div class="btn-row mt"><a class="btn primary" href="#/drill">Ещё раз</a><a class="btn" href="#/keys">Шпаргалки</a></div></div></section>';
      return;
    }

    const pool = hotkeyPairs();
    const byCourse = {};
    pool.forEach((p) => {
      byCourse[p.courseId] = (byCourse[p.courseId] || 0) + 1;
    });
    const course = (params && params.get("course")) || "all";

    let html =
      '<section class="section"><div class="card"><h3>Как это работает</h3><p>Показывается команда — выбираете сочетание клавиш. Засекается время: смысл не в том, чтобы угадать, а в том, чтобы отвечать не думая.</p>' +
      '<p class="muted small mt">В базе ' +
      pool.length +
      " " +
      plural(pool.length, "сочетание", "сочетания", "сочетаний") +
      ", собраны из уроков.</p></div></section>";

    html +=
      '<section class="section"><div class="section-head"><h2>Программа</h2></div><div class="row row-wrap">' +
      [{ id: "all", title: "Все" }]
        .concat(CONTENT.courses.filter((c) => byCourse[c.id] >= 4).map((c) => ({ id: c.id, title: c.title })))
        .map(
          (c) =>
            '<a class="chip' +
            (course === c.id ? " accent" : "") +
            '" href="#/drill?course=' +
            c.id +
            '">' +
            esc(c.title) +
            "</a>"
        )
        .join("") +
      "</div></section>";

    html +=
      '<section class="section"><button class="btn primary block" data-act="start-drill" data-course="' +
      esc(course) +
      '">Начать · 10 вопросов</button></section>';

    view.innerHTML = html;
  }

  function renderDrillQuestion() {
    const d = drill;
    const item = d.items[d.idx];
    if (d.sel === null) d.shownAt = Date.now();

    let html =
      '<div class="quiz-top"><div class="progress"><span style="width:' +
      Math.round((d.idx / d.items.length) * 100) +
      '%"></span></div><span class="quiz-count">' +
      (d.idx + 1) +
      "/" +
      d.items.length +
      "</span></div>";

    html +=
      '<section class="question"><span class="q-kind">' +
      esc(item.course) +
      "</span><h2>" +
      esc(item.action) +
      '</h2><div class="options">' +
      item.options
        .map((o) => {
          let cls = "option round";
          if (d.sel !== null) {
            if (o === item.keys) cls += " right";
            else if (o === d.sel) cls += " wrong";
          }
          return (
            '<button class="' +
            cls +
            '" data-act="drill-pick" data-k="' +
            esc(o) +
            '"' +
            (d.sel !== null ? " disabled" : "") +
            '><span class="mark">•</span><span>' +
            esc(o) +
            "</span></button>"
          );
        })
        .join("") +
      "</div>";

    if (d.sel !== null) {
      html +=
        '<div class="btn-row mt"><button class="btn primary block" data-act="drill-next">' +
        (d.idx + 1 >= d.items.length ? "Результат" : "Дальше →") +
        "</button></div>";
    }
    html += "</section>";
    html += '<div class="btn-row mt"><button class="btn" data-act="drill-quit">Прервать</button></div>';
    view.innerHTML = html;
  }

  /* ================= синхронизация между устройствами ================= */

  // Прогресс хранится локально и в Supabase. При каждом сохранении изменения
  // отправляются в облако, а другие открытые устройства получают их сразу.
  // Состояния не перезаписываются, а объединяются: ничего из сделанного офлайн не теряется.
  const SYNC_URL = "https://ucwtelledxfporffbykv.supabase.co";
  const SYNC_KEY = "sb_publishable_iAsRYmI2xmJ_CIXvUqiprQ_e3bY2cQJ";
  const DEVICE_KEY = "bim-academy-device";
  let sb = null;
  let syncUser = null;
  let syncChannel = null;
  let pushTimer = null;
  let syncBusy = false;
  let syncAgain = false;
  let syncInfo = { status: "off", at: 0, error: "" };
  let otpEmail = "";
  let syncMode = "code";

  const deviceId = (() => {
    try {
      let id = localStorage.getItem(DEVICE_KEY);
      if (!id) {
        id = Math.random().toString(36).slice(2) + Date.now().toString(36);
        localStorage.setItem(DEVICE_KEY, id);
      }
      return id;
    } catch (e) {
      return "dev-" + Math.random().toString(36).slice(2);
    }
  })();

  const num = (x) => (typeof x === "number" && isFinite(x) ? x : 0);

  function mergeMap(a, b, pick) {
    const out = Object.assign({}, b || {}, a || {});
    Object.keys(out).forEach((k) => {
      if (a && b && k in a && k in b) out[k] = pick(a[k], b[k], k);
    });
    return out;
  }

  function unionBy(a, b, key) {
    const seen = {};
    const out = [];
    (a || []).concat(b || []).forEach((x) => {
      const k = key(x);
      if (seen[k]) return;
      seen[k] = true;
      out.push(x);
    });
    return out;
  }

  // Объединение двух состояний. Счётчики берутся по максимуму, наборы — объединением,
  // настройки и «текущие» поля — из более свежего состояния.
  function mergeStates(a, b) {
    if (!b || typeof b !== "object") return a;
    if (!a || typeof a !== "object") return b;
    // Сброс прогресса на любом устройстве побеждает всё, что было до него.
    if (num(a.resetAt) !== num(b.resetAt)) return num(a.resetAt) > num(b.resetAt) ? a : b;
    const A = Object.assign(defaultState(), a);
    const B = Object.assign(defaultState(), b);
    const aNew = num(A.updatedAt) >= num(B.updatedAt);
    const N = aNew ? A : B;
    const O = aNew ? B : A;
    const out = Object.assign({}, O, N);

    out.lessons = mergeMap(A.lessons, B.lessons, (x, y) => (num(x.at) >= num(y.at) ? x : y));
    out.mastery = mergeMap(A.mastery, B.mastery, (x, y) => ({
      level: Math.max(num(x.level), num(y.level)),
      best: Math.max(num(x.best), num(y.best)),
      masteredAt: Math.min(x.masteredAt || Infinity, y.masteredAt || Infinity) === Infinity ? undefined : Math.min(x.masteredAt || Infinity, y.masteredAt || Infinity),
      at: Math.max(num(x.at), num(y.at)),
      checkedAt: Math.max(num(x.checkedAt), num(y.checkedAt))
    }));
    out.answers = { total: Math.max(num(A.answers.total), num(B.answers.total)), correct: Math.max(num(A.answers.correct), num(B.answers.correct)) };
    out.byCourse = mergeMap(A.byCourse, B.byCourse, (x, y) => (num(x.total) >= num(y.total) ? x : y));
    out.mistakes = mergeMap(A.mistakes, B.mistakes, (x, y) => (num(x.box) > num(y.box) ? x : num(y.box) > num(x.box) ? y : num(x.dueAt) >= num(y.dueAt) ? x : y));
    out.history = unionBy(A.history, B.history, (h) => h.at + "|" + h.title)
      .sort((x, y) => y.at - x.at)
      .slice(0, 30);
    out.days = mergeMap(A.days, B.days, (x, y) => {
      const d = Object.assign({}, x, y);
      Object.keys(d).forEach((k) => (d[k] = Math.max(num(x[k]), num(y[k]))));
      return d;
    });
    const sA = A.streak;
    const sB = B.streak;
    const sN = (sA.last || "") > (sB.last || "") || ((sA.last || "") === (sB.last || "") && num(sA.current) >= num(sB.current)) ? sA : sB;
    out.streak = Object.assign({}, sN, {
      best: Math.max(num(sA.best), num(sB.best)),
      frozen: unionBy(sA.frozen, sB.frozen, (k) => k).slice(-60)
    });
    out.settings = Object.assign({}, O.settings, N.settings);
    out.myVideos = unionBy(N.myVideos, O.myVideos, (v) => v.url || v.title);
    out.mySources = unionBy(N.mySources, O.mySources, (v) => v.id || v.url);
    out.checkProjects = unionBy(N.checkProjects, O.checkProjects, (p) => p.id);
    out.checkDone = mergeMap(A.checkDone, B.checkDone, (x, y) => Object.assign({}, aNew ? y : x, aNew ? x : y));
    out.cards = Object.assign({}, O.cards, N.cards);
    out.terms = unionBy(A.terms, B.terms, (t) => t);
    out.flags = mergeMap(A.flags, B.flags, (x, y) => x || y);
    const gA = Object.assign({ blitzBest: {}, matchBest: {} }, A.games);
    const gB = Object.assign({ blitzBest: {}, matchBest: {} }, B.games);
    out.games = {
      played: Math.max(num(gA.played), num(gB.played)),
      interviewBest: Math.max(num(gA.interviewBest), num(gB.interviewBest)),
      orderSolved: Math.max(num(gA.orderSolved), num(gB.orderSolved)),
      blitzBest: mergeMap(gA.blitzBest, gB.blitzBest, (x, y) => Math.max(num(x), num(y))),
      matchBest: mergeMap(gA.matchBest, gB.matchBest, (x, y) => Math.min(num(x) || Infinity, num(y) || Infinity))
    };
    out.quests = mergeMap(A.quests, B.quests, (x, y) => unionBy(x, y, (q) => q));
    out.cases = mergeMap(A.cases, B.cases, (x, y) => Math.max(num(x), num(y)));
    out.xp = Math.max(num(A.xp), num(B.xp));
    out.updatedAt = Math.max(num(A.updatedAt), num(B.updatedAt));
    return out;
  }

  const same = (x, y) => JSON.stringify(x) === JSON.stringify(y);

  function syncReady() {
    return !!(sb && syncUser);
  }

  function schedulePush() {
    if (!syncReady()) return;
    clearTimeout(pushTimer);
    pushTimer = setTimeout(syncNow, 2500);
  }

  // Забрать облачную версию, объединить с локальной и отправить результат обратно.
  async function syncNow() {
    if (!syncReady()) return;
    if (syncBusy) {
      syncAgain = true;
      return;
    }
    if (!navigator.onLine) {
      syncInfo = { status: "offline", at: syncInfo.at, error: "" };
      return refreshSyncUi();
    }
    syncBusy = true;
    syncInfo.status = "syncing";
    refreshSyncUi();
    try {
      const { data, error } = await sb.from("progress").select("state").eq("user_id", syncUser.id).maybeSingle();
      if (error) throw error;
      const remote = data ? data.state : null;
      const merged = remote ? mergeStates(state, remote) : state;
      if (!same(merged, state)) applyState(merged);
      if (!remote || !same(merged, remote)) {
        const up = await sb.from("progress").upsert({ user_id: syncUser.id, state: merged, device: deviceId, updated_at: new Date().toISOString() });
        if (up.error) throw up.error;
      }
      syncInfo = { status: "ok", at: Date.now(), error: "" };
    } catch (e) {
      syncInfo = { status: "error", at: syncInfo.at, error: (e && e.message) || "ошибка сети" };
    }
    syncBusy = false;
    refreshSyncUi();
    if (syncAgain) {
      syncAgain = false;
      schedulePush();
    }
  }

  // Новое состояние пришло с другого устройства: сохраняем и, если можно, перерисовываем экран.
  function applyState(next) {
    state = next;
    persist();
    applyingRemote = true;
    try {
      applyTheme();
      const [name] = currentRoute();
      const busy = quiz || game || caseRun || name === "quiz" || name === "checks";
      if (!busy) route();
    } finally {
      applyingRemote = false;
    }
  }

  function subscribeSync() {
    if (!syncReady() || syncChannel) return;
    syncChannel = sb
      .channel("progress-" + syncUser.id)
      .on("postgres_changes", { event: "*", schema: "public", table: "progress", filter: "user_id=eq." + syncUser.id }, (payload) => {
        const row = payload.new || {};
        if (!row.state || row.device === deviceId) return;
        const merged = mergeStates(state, row.state);
        if (!same(merged, state)) {
          applyState(merged);
          toast("Прогресс обновлён с другого устройства");
        }
        syncInfo = { status: "ok", at: Date.now(), error: "" };
        refreshSyncUi();
        if (!same(merged, row.state)) schedulePush();
      })
      .subscribe();
  }

  function unsubscribeSync() {
    if (syncChannel && sb) sb.removeChannel(syncChannel);
    syncChannel = null;
  }

  function initSync() {
    if (!window.supabase || !window.supabase.createClient) return;
    try {
      sb = window.supabase.createClient(SYNC_URL, SYNC_KEY, {
        auth: { flowType: "implicit", persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, storageKey: "bim-academy-auth" }
      });
    } catch (e) {
      sb = null;
      return;
    }
    sb.auth.onAuthStateChange((event, session) => {
      const u = session ? session.user : null;
      const was = syncUser ? syncUser.id : null;
      syncUser = u;
      if (u && u.id !== was) {
        // после входа по ссылке из письма убираем токены из адреса
        if (/access_token=/.test(location.hash) || location.search) {
          history.replaceState(null, "", location.pathname + "#/more");
          route();
        }
        setTimeout(() => {
          syncNow();
          subscribeSync();
        }, 0);
      }
      if (!u) {
        unsubscribeSync();
        syncInfo = { status: "off", at: 0, error: "" };
      }
      refreshSyncUi();
    });
    window.addEventListener("online", () => syncNow());
    // страховка: если мгновенные обновления оборвались, раз в минуту сверяемся с облаком
    setInterval(() => {
      if (document.visibilityState === "visible" && !syncBusy) syncNow();
    }, 60000);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") syncNow();
    });
  }

  function syncStatusText() {
    const t = syncInfo.at ? new Date(syncInfo.at).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }) : "";
    if (syncInfo.status === "syncing") return "синхронизация…";
    if (syncInfo.status === "offline") return "нет сети — отправлю, когда появится";
    if (syncInfo.status === "error") return "не удалось: " + syncInfo.error;
    if (syncInfo.status === "ok") return "синхронизировано в " + t;
    return "";
  }

  function syncSectionHtml() {
    if (!sb) {
      return '<section class="section"><div class="section-head"><h2>Синхронизация</h2></div><div class="card"><p>Модуль синхронизации не загрузился. Обновите приложение с интернетом.</p></div></section>';
    }
    if (syncUser) {
      return (
        '<section class="section" id="syncSection"><div class="section-head"><h2>Синхронизация</h2><span class="sync-dot ' +
        syncInfo.status +
        '"></span></div><div class="card"><div class="row spread"><div style="min-width:0"><h3 class="sync-mail">☁️ ' +
        esc(syncUser.email || "") +
        '</h3><p id="syncStatus">' +
        esc(syncStatusText()) +
        '</p></div></div><p class="muted small mt">Синхронизация идёт сама: после каждого действия, при открытии приложения и раз в минуту, пока оно открыто. Изменения с других устройств приходят сразу.</p>' +
        '<div class="btn-row mt"><button class="btn small" data-act="sync-now">Проверить сейчас</button><button class="btn small" data-act="sync-out">Выйти</button></div>' +
        '<details class="sync-pass mt"><summary>Пароль для входа на других устройствах</summary>' +
        '<p class="muted small mt">Задайте пароль один раз — и на любом компьютере или телефоне входите по почте и паролю, без писем. Письма Supabase ограничены парой штук в час.</p>' +
        '<input class="answer-input mt" id="newPass" type="password" autocomplete="new-password" placeholder="Новый пароль, от 8 символов">' +
        '<button class="btn primary block mt" data-act="sync-setpass">Сохранить пароль</button></details></div></section>'
      );
    }
    return (
      '<section class="section" id="syncSection"><div class="section-head"><h2>Синхронизация</h2><span class="muted small">телефон и компьютеры</span></div><div class="card">' +
      "<p>Войдите по почте — и прогресс будет одинаковым на всех устройствах. Пароль не нужен: придёт письмо с кодом.</p>" +
      '<div class="segmented mt"><button data-act="sync-mode" data-m="pass" class="' +
      (syncMode === "pass" ? "on" : "") +
      '">По паролю</button><button data-act="sync-mode" data-m="code" class="' +
      (syncMode === "code" ? "on" : "") +
      '">Код на почту</button></div>' +
      (syncMode === "pass"
        ? '<input class="answer-input mt" id="passEmail" type="email" autocomplete="email" placeholder="you@example.ru">' +
          '<input class="answer-input mt" id="passValue" type="password" autocomplete="current-password" placeholder="Пароль">' +
          '<button class="btn primary block mt" data-act="sync-login">Войти</button>' +
          '<p class="muted small mt">Пароля ещё нет? Войдите один раз через «Код на почту» и задайте пароль в этом же разделе.</p>'
        : otpEmail
        ? '<p class="mt"><b>Код отправлен на ' +
          esc(otpEmail) +
          '</b></p><input class="answer-input mt" id="otpCode" type="text" autocomplete="one-time-code" placeholder="Код или ссылка из письма">' +
          '<div class="btn-row mt"><button class="btn primary" data-act="sync-verify">Войти</button><button class="btn" data-act="sync-reset">Другая почта</button></div>' +
          '<p class="muted small mt">В письме ссылка «Log In»? Нажмите на неё и удерживайте → «Скопировать ссылку», вставьте сюда и нажмите «Войти». Письмо может попасть в «Спам».</p>'
        : '<input class="answer-input mt" id="syncEmail" type="email" autocomplete="email" placeholder="you@example.ru">' +
          '<button class="btn primary block mt" data-act="sync-send">Получить код на почту</button>') +
      '<p class="muted small mt">Прогресс с этого устройства не пропадёт: при входе он объединится с тем, что уже есть в облаке.</p></div></section>'
    );
  }

  function refreshSyncUi() {
    const el = document.getElementById("syncStatus");
    if (el) el.textContent = syncStatusText();
    const dot = document.querySelector("#syncSection .sync-dot");
    if (dot) dot.className = "sync-dot " + syncInfo.status;
    const [name] = currentRoute();
    if (name === "more" && document.getElementById("syncSection")) {
      const signed = !!syncUser;
      const shown = !!document.querySelector("#syncSection .sync-mail");
      if (signed !== shown) renderMore();
    }
  }

  async function syncLoginPass() {
    const email = ((document.getElementById("passEmail") || {}).value || "").trim();
    const password = (document.getElementById("passValue") || {}).value || "";
    if (!email || !password) return toast("Введите почту и пароль");
    if (!navigator.onLine) return toast("Нужен интернет");
    const { error } = await sb.auth.signInWithPassword({ email: email, password: password });
    if (error) return toast(/invalid/i.test(error.message) ? "Неверная почта или пароль" : "Не удалось войти: " + error.message);
    toast("Вход выполнен — объединяю прогресс");
  }

  async function syncSetPass() {
    const input = document.getElementById("newPass");
    const password = (input && input.value) || "";
    if (password.length < 8) return toast("Пароль — от 8 символов");
    const { error } = await sb.auth.updateUser({ password: password });
    if (error) return toast("Не удалось сохранить: " + error.message);
    input.value = "";
    toast("Пароль сохранён — на других устройствах входите по паролю");
  }

  async function syncSendCode() {
    const input = document.getElementById("syncEmail");
    const email = ((input && input.value) || "").trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return toast("Введите почту");
    if (!navigator.onLine) return toast("Нужен интернет");
    toast("Отправляю письмо…");
    const { error } = await sb.auth.signInWithOtp({
      email: email,
      options: { shouldCreateUser: true, emailRedirectTo: location.origin + location.pathname }
    });
    if (error) {
      if (/rate limit|too many/i.test(error.message)) {
        syncMode = "pass";
        renderMore();
        return toast("Лимит писем Supabase: около двух в час. Войдите по паролю, если уже задали его, или попробуйте через час");
      }
      return toast("Не удалось отправить: " + error.message);
    }
    otpEmail = email;
    renderMore();
  }

  // Принимает и шестизначный код, и ссылку из письма целиком.
  function parseEmailLink(text) {
    const m = text.match(/https?:\/\/\S+/);
    if (!m) return null;
    try {
      const u = new URL(m[0].replace(/&amp;/g, "&"));
      const token = u.searchParams.get("token") || u.searchParams.get("token_hash");
      if (!token) return null;
      return { token_hash: token, type: u.searchParams.get("type") || "magiclink" };
    } catch (e) {
      return null;
    }
  }

  async function syncVerify() {
    const input = document.getElementById("otpCode");
    const raw = ((input && input.value) || "").trim();
    if (!raw) return toast("Вставьте код или ссылку из письма");
    const link = parseEmailLink(raw);
    const token = raw.replace(/\s/g, "");
    if (!link && !/^\d{6,10}$/.test(token)) return toast("Это не похоже на код или ссылку из письма");
    const { error } = link
      ? await sb.auth.verifyOtp({ token_hash: link.token_hash, type: link.type })
      : await sb.auth.verifyOtp({ email: otpEmail, token: token, type: "email" });
    if (error) return toast((link ? "Ссылка не подошла: " : "Код не подошёл: ") + error.message + ". Запросите новое письмо — ссылка одноразовая и живёт около часа.");
    otpEmail = "";
    toast("Вход выполнен — объединяю прогресс");
  }

  /* ================= освоение тем и повторение ================= */

  // Урок проходит уровни «знаком → освоено → мастер». Освоенная тема через
  // REVIEW_DAYS дней «выцветает» и просит короткую проверку из трёх вопросов.
  const REVIEW_DAYS = 21;
  const MASTER_GAP_DAYS = 14;
  const DAY_MS = 86400000;

  function lessonLevel(id) {
    const m = state.mastery[id];
    if (m && m.level) return m.level;
    return (state.lessons[id] || {}).done ? 1 : 0;
  }

  function needsReview(id) {
    const m = state.mastery[id];
    return !!m && m.level >= 2 && Date.now() - (m.checkedAt || m.at || 0) > REVIEW_DAYS * DAY_MS;
  }

  function reviewLessons() {
    return allLessons.filter((l) => needsReview(l.id));
  }

  function masteryTag(id) {
    if (needsReview(id)) return '<span class="lesson-review-tag">пора повторить ↻</span>';
    const lv = lessonLevel(id);
    if (lv >= 3) return '<span class="lesson-master-tag">мастер ★</span>';
    if (lv === 2) return '<span class="lesson-done-tag">освоено</span>';
    if (lv === 1) return '<span class="lesson-done-tag">пройдено</span>';
    return "";
  }

  function recordLessonQuiz(lessonId, pct, isReview) {
    const now = Date.now();
    const m = state.mastery[lessonId] || { level: (state.lessons[lessonId] || {}).done ? 1 : 0 };
    m.best = Math.max(m.best || 0, pct);
    if (isReview) {
      if (pct >= 67) {
        m.checkedAt = now;
        if (m.level === 2 && now - (m.masteredAt || now) >= MASTER_GAP_DAYS * DAY_MS) {
          m.level = 3;
          toast("Тема на уровне «мастер» ★");
        } else toast("Тема подтверждена — снова на месяц");
      }
    } else if (pct >= 80) {
      if ((m.level || 0) < 2) {
        m.level = 2;
        m.masteredAt = now;
      }
      m.at = now;
      m.checkedAt = now;
    } else if (!m.level) {
      m.level = 1;
    }
    state.mastery[lessonId] = m;
  }

  function renderReview() {
    setTop("Пора повторить", "темы, которые начали забываться");
    const list = reviewLessons();
    view.innerHTML = list.length
      ? '<section class="section"><div class="card"><p>Эти темы вы освоили больше трёх недель назад. Короткая проверка из трёх вопросов вернёт их в память — а со второго подтверждения тема получает уровень «мастер».</p></div></section>' +
        '<section class="section">' +
        list
          .map(
            (l) =>
              '<a class="menu-item" href="#/quiz/review/' +
              l.id +
              '"><span class="mi-ico">↻</span><span class="mi-body"><b>' +
              esc(l.title) +
              '</b><span class="mi-sub">' +
              esc((courseById[lessonCourse[l.id]] || {}).title || "") +
              " · 3 вопроса</span></span></a>"
          )
          .join("") +
        "</section>"
      : '<div class="empty"><span class="em">🌱</span><b>Повторять пока нечего</b><p class="muted small mt">Тема попадает сюда через три недели после того, как вы прошли её мини-тест на 80% и выше.</p><a class="btn primary mt" href="#/quiz/daily/1">Тренировка дня</a></div>';
  }

  /* ================= тренировка дня ================= */

  // 10 вопросов: ошибки к повтору, выцветающие темы, самый слабый курс и новое.
  function dailyItems() {
    const pick = [];
    const seen = {};
    const add = (q) => {
      if (!q || seen[q.id] || pick.length >= 10) return;
      seen[q.id] = true;
      pick.push(q);
    };
    dueMistakes().slice(0, 4).forEach((id) => add(questionById[id]));
    reviewLessons().slice(0, 2).forEach((l) => add(shuffle(l.questions || [])[0]));
    const scored = CONTENT.courses
      .map((c) => {
        const st = state.byCourse[c.id];
        return { id: c.id, acc: st && st.total >= 5 ? st.correct / st.total : 2 };
      })
      .sort((a, b) => a.acc - b.acc);
    if (scored.length && scored[0].acc <= 1) shuffle(allQuestions.filter((q) => q.courseId === scored[0].id)).slice(0, 3).forEach(add);
    shuffle(allQuestions.filter((q) => !(state.lessons[q.lessonId] || {}).done)).forEach(add);
    shuffle(allQuestions).forEach(add);
    return shuffle(pick);
  }

  /* ================= задания дня ================= */

  const QUESTS = [
    { id: "lesson", t: "Пройти урок", need: 1, f: "lessons" },
    { id: "q15", t: "Ответить на 15 вопросов", need: 15, f: "questions" },
    { id: "correct10", t: "Дать 10 верных ответов", need: 10, f: "correct" },
    { id: "run5", t: "5 верных ответов подряд", need: 5, f: "bestRun" },
    { id: "game", t: "Сыграть в любую игру", need: 1, f: "games" },
    { id: "fix3", t: "Исправить 3 старые ошибки", need: 3, f: "fixes" },
    { id: "daily", t: "Пройти тренировку дня", need: 1, f: "daily" },
    { id: "case", t: "Разобрать кейс с проекта", need: 1, f: "cases" }
  ];

  function seedOf(key) {
    let h = 7;
    for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) % 100003;
    return h;
  }

  function todayQuests(key) {
    key = key || todayKey();
    let h = seedOf(key);
    const pool = QUESTS.slice();
    const out = [];
    while (out.length < 3 && pool.length) {
      h = (h * 1103 + 12345) % 100003;
      out.push(pool.splice(h % pool.length, 1)[0]);
    }
    return out;
  }

  function weekStart(key) {
    const p = (key || todayKey()).split("-").map(Number);
    const d = new Date(p[0], p[1] - 1, p[2]);
    const dow = (d.getDay() + 6) % 7;
    return shiftDay(todayKey(d), -dow);
  }

  function weekDays(mondayKey) {
    const out = [];
    for (let i = 0; i < 7; i++) out.push(shiftDay(mondayKey, i));
    return out;
  }

  function checkQuests() {
    const key = todayKey();
    const day = state.days[key] || {};
    const done = state.quests[key] || [];
    todayQuests(key).forEach((q) => {
      if (done.indexOf(q.id) < 0 && (day[q.f] || 0) >= q.need) {
        done.push(q.id);
        state.xp += 10;
        toast("Задание выполнено: " + q.t + " · +10 XP");
      }
    });
    state.quests[key] = done;
    if (done.length >= 3) {
      const wk = weekStart(key);
      const full = weekDays(wk).filter((k) => (state.quests[k] || []).length >= 3).length;
      if (full >= 5 && !state.flags["chest" + wk]) {
        state.flags["chest" + wk] = true;
        state.xp += 50;
        if ((state.streak.freezes || 0) < 2) state.streak.freezes = (state.streak.freezes || 0) + 1;
        toast("Недельный сундук: +50 XP и заморозка серии ❄️");
      }
    }
  }

  function questsHtml() {
    const key = todayKey();
    const day = state.days[key] || {};
    const done = state.quests[key] || [];
    const wk = weekStart(key);
    const names = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"];
    const full = weekDays(wk).filter((k) => (state.quests[k] || []).length >= 3).length;
    return (
      '<section class="section"><div class="section-head"><h2>Задания дня</h2><span class="muted small">+10 XP за каждое</span></div><div class="card quests">' +
      todayQuests(key)
        .map((q) => {
          const v = Math.min(q.need, day[q.f] || 0);
          const ok = done.indexOf(q.id) >= 0;
          return (
            '<div class="quest' +
            (ok ? " on" : "") +
            '"><span class="q-box">' +
            (ok ? "✓" : "") +
            '</span><span class="q-t">' +
            esc(q.t) +
            '</span><span class="q-n">' +
            (q.need > 1 ? v + "/" + q.need : ok ? "готово" : "") +
            "</span></div>"
          );
        })
        .join("") +
      '<div class="week-row"><span class="muted small">Сундук недели: ' +
      Math.min(full, 5) +
      ' из 5 дней</span><div class="week-dots">' +
      weekDays(wk)
        .map(
          (k, i) =>
            '<span class="wd' +
            ((state.quests[k] || []).length >= 3 ? " on" : "") +
            (k === key ? " today" : "") +
            '" title="' +
            k +
            '">' +
            names[i] +
            "</span>"
        )
        .join("") +
      "</div></div></div></section>"
    );
  }

  /* ================= серия: заморозка, календарь, напоминание ================= */

  function daysBetween(a, b) {
    const pa = a.split("-").map(Number);
    const pb = b.split("-").map(Number);
    return Math.round((new Date(pb[0], pb[1] - 1, pb[2]) - new Date(pa[0], pa[1] - 1, pa[2])) / DAY_MS);
  }

  // Серия, которую видит пользователь: обнуляется, если пропуск не покрыть заморозками.
  function streakNow() {
    const s = state.streak;
    if (!s.last) return 0;
    const gap = daysBetween(s.last, todayKey());
    if (gap <= 1) return s.current;
    return gap - 1 <= (s.freezes || 0) ? s.current : 0;
  }

  function heatmapHtml() {
    const today = todayKey();
    const weeks = 18;
    const start = shiftDay(weekStart(today), -7 * (weeks - 1));
    const goal = state.settings.goal;
    const frozen = state.streak.frozen || [];
    let cells = "";
    for (let w = 0; w < weeks; w++) {
      for (let d = 0; d < 7; d++) {
        const k = shiftDay(start, w * 7 + d);
        if (daysBetween(k, today) < 0) {
          cells += '<span class="hm-c hm-future"></span>';
          continue;
        }
        const q = (state.days[k] || {}).questions || 0;
        const lv = frozen.indexOf(k) >= 0 ? "f" : q >= goal ? 3 : q >= goal / 2 ? 2 : q > 0 ? 1 : 0;
        cells +=
          '<span class="hm-c hm-' + lv + (k === today ? " hm-today" : "") + '" title="' + k + ": " + q + " " + plural(q, "вопрос", "вопроса", "вопросов") + (lv === "f" ? ", заморозка" : "") + '"></span>';
      }
    }
    const sumWeek = (mon) => weekDays(mon).reduce((a, k) => a + ((state.days[k] || {}).questions || 0), 0);
    const lessonsWeek = (mon) => weekDays(mon).reduce((a, k) => a + ((state.days[k] || {}).lessons || 0), 0);
    const thisMon = weekStart(today);
    const lastMon = shiftDay(thisMon, -7);
    const a = sumWeek(thisMon);
    const b = sumWeek(lastMon);
    const diff = a - b;
    return (
      '<section class="section"><div class="section-head"><h2>Календарь занятий</h2><span class="muted small">' +
      weeks +
      ' недель</span></div><div class="card"><div class="heatmap" role="img" aria-label="Активность по дням">' +
      cells +
      '</div><div class="hm-legend"><span>меньше</span><span class="hm-c hm-0"></span><span class="hm-c hm-1"></span><span class="hm-c hm-2"></span><span class="hm-c hm-3"></span><span>цель</span><span class="hm-c hm-f"></span><span>заморозка</span></div>' +
      '<div class="week-cmp"><div><b>' +
      a +
      "</b><span>вопросов на этой неделе</span></div><div><b>" +
      b +
      "</b><span>на прошлой</span></div><div><b class=\"" +
      (diff >= 0 ? "up" : "down") +
      '">' +
      (diff >= 0 ? "▲ +" : "▼ ") +
      diff +
      "</b><span>уроков: " +
      lessonsWeek(thisMon) +
      " против " +
      lessonsWeek(lastMon) +
      "</span></div></div></div></section>" +
      '<section class="section"><div class="section-head"><h2>Серия</h2></div><div class="card"><div class="row spread"><div><h3>🔥 ' +
      streakNow() +
      " " +
      plural(streakNow(), "день", "дня", "дней") +
      '</h3><p>Заморозки: ' +
      "❄️".repeat(state.streak.freezes || 0) +
      (state.streak.freezes ? "" : "нет") +
      " · максимум две</p></div></div>" +
      '<p class="muted small mt">Заморозка спасает серию, если пропустить день. Она выдаётся за каждые 7 дней серии подряд и за недельный сундук заданий.</p>' +
      '<div class="remind mt"><label for="remindAt" class="muted small">Напоминание каждый день в</label><input id="remindAt" type="time" value="' +
      esc(state.settings.remindAt || "19:00") +
      '"><button class="btn small primary" data-act="ics">Добавить в календарь</button></div>' +
      '<p class="muted small mt">Скачается файл события — откройте его, и телефон предложит добавить ежедневное напоминание в календарь.</p></div></section>'
    );
  }

  function downloadIcs() {
    const input = document.getElementById("remindAt");
    const t = (input && input.value) || "19:00";
    state.settings.remindAt = t;
    save();
    const [hh, mm] = t.split(":");
    const d = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const start = d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) + "T" + pad(hh) + pad(mm) + "00";
    const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+/, "");
    const url = location.origin + location.pathname;
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//BIM Academy//RU",
      "BEGIN:VEVENT",
      "UID:bim-academy-daily-" + Date.now() + "@bim-academy",
      "DTSTAMP:" + stamp,
      "DTSTART:" + start,
      "DURATION:PT15M",
      "RRULE:FREQ=DAILY",
      "SUMMARY:BIM Academy: 10 минут практики",
      "DESCRIPTION:Тренировка дня и задания — серия ждёт.",
      "URL:" + url,
      "BEGIN:VALARM",
      "ACTION:DISPLAY",
      "DESCRIPTION:BIM Academy",
      "TRIGGER:PT0M",
      "END:VALARM",
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    a.download = "bim-academy-napominanie.ics";
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1500);
    toast("Файл напоминания сохранён");
  }

  /* ================= вопрос посреди урока ================= */

  function inlineCheckHtml(lesson) {
    const qi = (lesson.questions || []).findIndex((q) => q.type === "single" || q.type === "bool");
    if (qi < 0) return "";
    const q = lesson.questions[qi];
    const opts = q.type === "bool" ? ["Верно", "Неверно"] : q.options;
    return (
      '<section class="block"><div class="inq" data-q="' +
      esc(q.id) +
      '"><span class="q-kind">Проверьте себя</span><b>' +
      esc(q.q) +
      '</b><div class="options">' +
      opts
        .map(
          (o, i) =>
            '<button class="option round" data-act="inq" data-q="' +
            esc(q.id) +
            '" data-i="' +
            (q.type === "bool" ? (i === 0 ? 1 : 0) : i) +
            '"><span class="mark">•</span><span>' +
            esc(o) +
            "</span></button>"
        )
        .join("") +
      '</div><div class="inq-v"></div></div></section>'
    );
  }

  function answerInline(el) {
    const box = el.closest(".inq");
    if (!box || box.classList.contains("answered")) return;
    const q = questionById[el.dataset.q];
    if (!q) return;
    const i = Number(el.dataset.i);
    const ok = isCorrect(q, [i], "");
    box.classList.add("answered");
    box.querySelectorAll(".option").forEach((b) => {
      b.setAttribute("disabled", "disabled");
      const v = Number(b.dataset.i);
      const right = q.type === "bool" ? (v === 1) === q.answer : v === q.answer;
      if (right) b.classList.add("right");
      else if (v === i) b.classList.add("wrong");
    });
    box.querySelector(".inq-v").innerHTML =
      '<div class="verdict ' + (ok ? "ok" : "no") + '"><b>' + (ok ? "Верно" : "Не совсем") + "</b>" + (q.explain ? "<p>" + esc(q.explain) + "</p>" : "") + "</div>";
  }

  /* ================= озвучка английского ================= */

  const CAN_SPEAK = "speechSynthesis" in window;

  function speakBtn(text) {
    if (!CAN_SPEAK) return "";
    return '<button class="say" data-act="say" data-t="' + esc(text) + '" aria-label="Произнести: ' + esc(text) + '">🔊</button>';
  }

  function speak(text) {
    if (!CAN_SPEAK) return;
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      const voices = speechSynthesis.getVoices();
      const v = voices.filter((x) => /^en(-|_)GB/i.test(x.lang))[0] || voices.filter((x) => /^en/i.test(x.lang))[0];
      if (v) u.voice = v;
      u.lang = v ? v.lang : "en-GB";
      u.rate = 0.92;
      speechSynthesis.speak(u);
    } catch (e) {
      toast("Озвучка недоступна на этом устройстве");
    }
  }

  function renderVocab(params) {
    setTop("Словарь BIM English", VOCAB.length + " слов и фраз");
    const q = norm((params && params.get("q")) || "");
    const topics = { revit: "Интерфейс Revit", docs: "Документы и роли", coord: "Координация и совещания", mail: "Переписка", build: "Конструкции и системы" };
    let html =
      '<section class="section"><input class="search-field" id="vocabQ" type="search" placeholder="Найти слово" value="' +
      esc((params && params.get("q")) || "") +
      '" aria-label="Поиск по словарю"></section>' +
      (CAN_SPEAK ? "" : '<section class="section"><p class="muted small">На этом устройстве нет голосового движка — озвучка недоступна.</p></section>');
    Object.keys(topics).forEach((t) => {
      const list = VOCAB.filter((v) => v.topic === t && (!q || norm(v.en + " " + v.ru).indexOf(q) >= 0));
      if (!list.length) return;
      html +=
        '<section class="section"><div class="section-head"><h2>' +
        topics[t] +
        '</h2><span class="muted small">' +
        list.length +
        '</span></div><div class="card vocab">' +
        list.map((v) => '<div class="voc"><b>' + esc(v.en) + "</b>" + speakBtn(v.en) + "<span>" + esc(v.ru) + "</span></div>").join("") +
        "</div></section>";
    });
    html += '<section class="section"><button class="btn primary block" data-act="game-start" data-kind="match" data-src="en">Тренировать: найди пару</button></section>';
    view.innerHTML = html;
    const inp = document.getElementById("vocabQ");
    if (inp)
      inp.addEventListener("change", () => {
        location.hash = "#/vocab?q=" + encodeURIComponent(inp.value);
      });
  }

  /* ================= тренажёры ================= */

  const SIMS = window.BIM_SIMS || {};

  function simBlockHtml(id) {
    const s = SIMS[id];
    if (!s) return "";
    return (
      '<div class="sim" data-sim="' +
      esc(id) +
      '"><div class="sim-head"><span class="q-kind">Тренажёр</span><b>' +
      esc(s.title) +
      "</b><p>" +
      esc(s.intro) +
      '</p></div><div class="sim-body"></div></div>'
    );
  }

  function mountSims(root) {
    root.querySelectorAll(".sim[data-sim]").forEach((el) => {
      const s = SIMS[el.dataset.sim];
      if (s && !el.dataset.ready) {
        el.dataset.ready = "1";
        s.mount(el.querySelector(".sim-body"));
      }
    });
  }

  function renderSim(id) {
    const s = SIMS[id];
    if (!s) return renderNotFound();
    setTop("Тренажёр", s.title);
    const l = lessonById[s.lesson];
    view.innerHTML =
      '<section class="section">' +
      simBlockHtml(id) +
      "</section>" +
      (l ? '<section class="section"><a class="btn block" href="#/lesson/' + l.id + '">Урок по теме: ' + esc(l.title) + "</a></section>" : "");
    mountSims(view);
  }

  /* ================= кейсы с проекта ================= */

  const CASES = CONTENT.cases || [];
  let caseRun = null;

  function renderCases() {
    setTop("Кейсы с проекта", "ситуация → решение → разбор");
    view.innerHTML =
      '<section class="section"><div class="card"><p>Реальные рабочие ситуации. В каждой три решения подряд — после каждого видно, к чему оно приводит. Лучший результат сохраняется.</p></div></section><section class="section">' +
      CASES.map((c) => {
        const best = state.cases[c.id];
        const max = c.steps.length * 2;
        return (
          '<a class="menu-item" href="#/case/' +
          c.id +
          '"><span class="mi-ico">' +
          c.icon +
          '</span><span class="mi-body"><b>' +
          esc(c.title) +
          '</b><span class="mi-sub">' +
          esc(c.role) +
          " · " +
          (best == null ? "ещё не решали" : "лучший результат " + best + " из " + max) +
          "</span></span></a>"
        );
      }).join("") +
      "</section>";
  }

  function renderCase(id) {
    const c = CASES.filter((x) => x.id === id)[0];
    if (!c) return renderNotFound();
    if (!caseRun || caseRun.id !== id) caseRun = { id: id, step: 0, score: 0, picked: null };
    const r = caseRun;
    setTop(c.title, c.role);
    const max = c.steps.length * 2;
    if (r.step >= c.steps.length) {
      const pct = r.score / max;
      const verdict = pct >= 0.85 ? "Решения уровня опытного специалиста" : pct >= 0.5 ? "Рабоче, но с потерями" : "Стоит разобрать тему ещё раз";
      const prev = state.cases[id];
      if (!r.saved) {
        r.saved = true;
        state.cases[id] = Math.max(prev || 0, r.score);
        state.xp += r.score * 2;
        bumpDay("cases", 1);
        checkQuests();
        save();
      }
      const l = lessonById[c.lesson];
      view.innerHTML =
        '<section class="section"><div class="card center"><p class="big">' +
        r.score +
        " из " +
        max +
        '</p><p class="muted">' +
        verdict +
        " · +" +
        r.score * 2 +
        " XP</p></div></section>" +
        (l ? '<section class="section"><a class="menu-item" href="#/lesson/' + l.id + '"><span class="mi-ico">📘</span><span class="mi-body"><b>' + esc(l.title) + '</b><span class="mi-sub">урок по теме кейса</span></span></a></section>' : "") +
        '<section class="section"><div class="btn-row"><button class="btn primary" data-act="case-again" data-id="' +
        id +
        '">Решить заново</button><a class="btn" href="#/cases">Все кейсы</a></div></section>';
      return;
    }
    const st = c.steps[r.step];
    let html =
      '<div class="quiz-top"><div class="progress"><i style="width:' +
      Math.round((r.step / c.steps.length) * 100) +
      '%"></i></div><span class="quiz-count">' +
      (r.step + 1) +
      "/" +
      c.steps.length +
      "</span></div>" +
      (r.step === 0 ? '<section class="section"><div class="note tip"><b>' + c.icon + " Ситуация</b><p>" + esc(c.intro) + "</p></div></section>" : "") +
      '<section class="question"><span class="q-kind">Ваше решение</span><h2>' +
      esc(st.text) +
      '</h2><div class="options">' +
      st.options
        .map((o, i) => {
          let cls = "option round";
          if (r.picked !== null) {
            if (i === r.picked) cls += o.score === 2 ? " right" : o.score === 1 ? " sel" : " wrong";
            else if (o.score === 2) cls += " right";
          }
          return (
            '<button class="' + cls + '" data-act="case-pick" data-i="' + i + '"' + (r.picked !== null ? " disabled" : "") + '><span class="mark">•</span><span>' + esc(o.t) + "</span></button>"
          );
        })
        .join("") +
      "</div>";
    if (r.picked !== null) {
      const o = st.options[r.picked];
      html +=
        '<div class="verdict ' +
        (o.score === 2 ? "ok" : o.score === 1 ? "mid" : "no") +
        '"><b>' +
        (o.score === 2 ? "Сильное решение" : o.score === 1 ? "Допустимо, но с потерями" : "Так лучше не делать") +
        "</b><p>" +
        esc(o.why) +
        '</p></div><button class="btn primary block mt" data-act="case-next">' +
        (r.step + 1 < c.steps.length ? "Дальше →" : "Итог") +
        "</button>";
    }
    html += "</section>";
    view.innerHTML = html;
  }

  /* ================= траектории и сертификат ================= */

  const PATHS = (CONTENT.paths || []).map((p) => Object.assign({}, p, { lessons: p.lessons.filter((id) => lessonById[id]) }));

  function pathProgress(p) {
    const done = p.lessons.filter((id) => (state.lessons[id] || {}).done).length;
    return { done: done, total: p.lessons.length, pct: p.lessons.length ? Math.round((done / p.lessons.length) * 100) : 0 };
  }

  function pathCard(p) {
    const pr = pathProgress(p);
    return (
      '<a class="card path-card' +
      (pr.pct === 100 ? " is-done" : "") +
      '" href="#/path/' +
      p.id +
      '"><div class="row spread"><div class="row"><span class="path-ico">' +
      p.icon +
      "</span><div><h3>" +
      esc(p.title) +
      '</h3><span class="muted small">' +
      pr.total +
      " " +
      plural(pr.total, "урок", "урока", "уроков") +
      "</span></div></div>" +
      (pr.pct === 100 ? '<span class="cc-done">✓ сертификат</span>' : "<b>" + pr.pct + "%</b>") +
      '</div><div class="progress mt"><i style="width:' +
      pr.pct +
      '%"></i></div></a>'
    );
  }

  function renderPaths() {
    setTop("Траектории", "маршрут к роли через разные курсы");
    view.innerHTML =
      '<section class="section"><div class="card"><p>Траектория собирает уроки из разных курсов в один маршрут к конкретной роли. Пройдёте все уроки — получите сертификат с вашим именем.</p></div></section><section class="section"><div class="grid">' +
      PATHS.map(pathCard).join("") +
      "</div></section>";
  }

  function renderPath(id) {
    const p = PATHS.filter((x) => x.id === id)[0];
    if (!p) return renderNotFound();
    const pr = pathProgress(p);
    setTop(p.title, "траектория · " + pr.done + "/" + pr.total);
    const next = p.lessons.filter((lid) => !(state.lessons[lid] || {}).done)[0];
    view.innerHTML =
      '<section class="section"><div class="card"><div class="row"><span class="path-ico big-ico">' +
      p.icon +
      "</span><div><h3>" +
      esc(p.title) +
      "</h3><p>" +
      esc(p.desc) +
      '</p></div></div><div class="progress mt"><i style="width:' +
      pr.pct +
      '%"></i></div><div class="progress-meta"><span>' +
      pr.done +
      " / " +
      pr.total +
      " уроков</span><span>" +
      pr.pct +
      "%</span></div></div></section>" +
      '<section class="section">' +
      (pr.pct === 100
        ? '<a class="btn primary block" href="#/cert/path/' + p.id + '">🎓 Получить сертификат</a>'
        : next
        ? '<a class="btn primary block" href="#/lesson/' + next + '">Следующий урок: ' + esc(lessonById[next].title) + "</a>"
        : "") +
      '</section><section class="section"><div class="section-head"><h2>Маршрут</h2></div>' +
      p.lessons
        .map((lid, i) => {
          const l = lessonById[lid];
          return lessonRow(l, i + 1).replace('<span>' + l.minutes + " мин", "<span>" + esc((courseById[lessonCourse[lid]] || {}).title) + " · " + l.minutes + " мин");
        })
        .join("") +
      "</section>";
  }

  function certSubject(kind, id) {
    if (kind === "path") {
      const p = PATHS.filter((x) => x.id === id)[0];
      return p ? { title: "Траектория «" + p.title + "»", lessons: p.lessons, back: "#/path/" + id } : null;
    }
    const c = courseById[id];
    return c ? { title: "Курс «" + c.title + "»", lessons: c.lessons.map((l) => l.id), back: "#/course/" + id } : null;
  }

  function drawCert(canvas, subj, name) {
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;
    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, "#6d8cf7");
    g.addColorStop(1, "#7c6cf5");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, 26);
    ctx.fillRect(0, H - 26, W, 26);
    ctx.strokeStyle = "#d9def0";
    ctx.lineWidth = 4;
    ctx.strokeRect(60, 70, W - 120, H - 140);
    ctx.textAlign = "center";
    ctx.fillStyle = "#5b6aa8";
    ctx.font = "700 34px -apple-system, Segoe UI, Roboto, sans-serif";
    ctx.fillText("BIM ACADEMY", W / 2, 170);
    ctx.fillStyle = "#101526";
    ctx.font = "800 96px -apple-system, Segoe UI, Roboto, sans-serif";
    ctx.fillText("Сертификат", W / 2, 300);
    ctx.fillStyle = "#5f6884";
    ctx.font = "400 36px -apple-system, Segoe UI, Roboto, sans-serif";
    ctx.fillText("подтверждает, что", W / 2, 390);
    ctx.fillStyle = "#4f5fd8";
    ctx.font = "700 76px -apple-system, Segoe UI, Roboto, sans-serif";
    ctx.fillText(name || "Ваше имя", W / 2, 500, W - 240);
    ctx.fillStyle = "#5f6884";
    ctx.font = "400 36px -apple-system, Segoe UI, Roboto, sans-serif";
    ctx.fillText("полностью прошёл(а) программу", W / 2, 590);
    ctx.fillStyle = "#101526";
    ctx.font = "700 48px -apple-system, Segoe UI, Roboto, sans-serif";
    ctx.fillText(subj.title, W / 2, 670, W - 240);
    ctx.fillStyle = "#5f6884";
    ctx.font = "400 32px -apple-system, Segoe UI, Roboto, sans-serif";
    ctx.fillText(
      subj.lessons.length + " " + plural(subj.lessons.length, "урок", "урока", "уроков") + " · " + new Date().toLocaleDateString("ru-RU"),
      W / 2,
      760
    );
    ctx.font = "120px serif";
    ctx.fillText("🎓", W / 2, 940);
  }

  function renderCert(kind, id) {
    const subj = certSubject(kind, id);
    if (!subj) return renderNotFound();
    setTop("Сертификат", subj.title);
    const left = subj.lessons.filter((lid) => !(state.lessons[lid] || {}).done);
    if (left.length) {
      view.innerHTML =
        '<div class="empty"><span class="em">🎓</span><b>Осталось ' +
        left.length +
        " " +
        plural(left.length, "урок", "урока", "уроков") +
        '</b><p class="muted small mt">Сертификат открывается, когда все уроки программы отмечены пройденными.</p><a class="btn primary mt" href="#/lesson/' +
        left[0] +
        '">Продолжить</a></div>';
      return;
    }
    state.flags.cert = true;
    save();
    view.innerHTML =
      '<section class="section"><label class="muted small" for="certName">Имя на сертификате</label><input class="answer-input mt" id="certName" type="text" autocomplete="name" placeholder="Например, Анна Смирнова" value="' +
      esc(state.settings.name || "") +
      '"></section><section class="section"><canvas id="certCanvas" class="cert-canvas" width="1600" height="1130"></canvas></section>' +
      '<section class="section"><div class="btn-row"><button class="btn primary" data-act="cert-save" data-kind="' +
      kind +
      '" data-id="' +
      esc(id) +
      '">Сохранить картинку</button><a class="btn" href="' +
      subj.back +
      '">Назад</a></div></section>';
    const canvas = document.getElementById("certCanvas");
    const input = document.getElementById("certName");
    drawCert(canvas, subj, state.settings.name);
    input.addEventListener("input", () => {
      state.settings.name = input.value.trim();
      save();
      drawCert(canvas, subj, state.settings.name);
    });
  }

  function saveCert() {
    const canvas = document.getElementById("certCanvas");
    if (!canvas) return;
    canvas.toBlob((blob) => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "bim-academy-sertifikat.png";
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1500);
      toast("Сертификат сохранён");
    }, "image/png");
  }

  /* ================= компаньон на главной ================= */

  // Герой живёт в карточке на главной: состояние зависит от времени суток,
  // цели дня и последнего теста, а фразы всплывают иногда и по нажатию.
  const HEROES = window.BIM_HEROES || null;
  const HEROES_PX = window.BIM_HEROES_PX || null;
  let heroTimer = null;
  let heroBubbleTimer = null;
  let heroPhraseIdx = 0;
  let heroGreeted = false;

  function heroChar(id) {
    return HEROES ? HEROES.chars.filter((c) => c.id === id)[0] : null;
  }

  function heroDrawSvg(id, st, level) {
    if (state.settings.heroStyle === "px" && HEROES_PX) return HEROES_PX.svg(id, st, level);
    return HEROES.svg(id, st, level);
  }

  function heroLevel() {
    return Math.max(0, RANKS.indexOf(rank().cur));
  }

  function heroContext() {
    const t = todayStats();
    const goal = state.settings.goal;
    const c = state.companion;
    const goalPct = Math.min(100, (t.questions / goal) * 100);
    return {
      hour: new Date().getHours(),
      goalPct: goalPct,
      left: Math.max(0, goal - t.questions),
      justFinishedGoal: goalPct >= 100 && c.celebratedDay !== todayKey(),
      lastWrong: !!c.lastQuizAt && Date.now() - c.lastQuizAt < 15 * 60000 && c.lastQuizPct < 70
    };
  }

  function heroPhrases(ctx, ch) {
    const list = [];
    if (ctx.lastWrong) list.push("Ошибки — это тоже прогресс. Загляни в «Мои ошибки», они ждут повтора.");
    if (ctx.goalPct >= 100) list.push("Цель дня выполнена! Можно гордиться собой.");
    else if (ctx.left) list.push("До цели дня " + ctx.left + " " + plural(ctx.left, "вопрос", "вопроса", "вопросов") + ". Справимся?");
    if (ctx.hour >= 23 || ctx.hour < 6) list.push("Уже поздно. Отдых — тоже часть обучения.");
    else if (ctx.hour < 10) list.push("Доброе утро! Пара вопросов к кофе?");
    if (streakNow() >= 2) list.push("Серия " + streakNow() + " " + plural(streakNow(), "день", "дня", "дней") + " подряд — не прерывай!");
    return list.concat(ch.phrases);
  }

  function heroHtml() {
    if (!HEROES || state.settings.hero === "off" || !heroChar(state.settings.hero)) return "";
    return (
      '<div class="companion" id="companion" data-act="hero-tap" role="button" tabindex="0" aria-label="Компаньон: нажмите, чтобы он что-то сказал">' +
      '<div class="companion-art" id="companionArt"></div>' +
      '<div class="companion-bubble" id="companionBubble" aria-live="polite"></div></div>'
    );
  }

  function heroDraw() {
    const art = document.getElementById("companionArt");
    if (!art) return;
    const ctx = heroContext();
    const st = HEROES.pickState(ctx);
    // Праздник показывается один раз в день — сразу после выполнения цели.
    if (st === "celebrate") {
      state.companion.celebratedDay = todayKey();
      save();
    }
    art.innerHTML = heroDrawSvg(state.settings.hero, st, heroLevel());
  }

  function heroSay(text) {
    const b = document.getElementById("companionBubble");
    if (!b) return;
    if (!text) {
      const ch = heroChar(state.settings.hero);
      const list = heroPhrases(heroContext(), ch);
      text = list[heroPhraseIdx % list.length];
      heroPhraseIdx++;
    }
    b.textContent = text;
    b.classList.add("show");
    clearTimeout(heroBubbleTimer);
    heroBubbleTimer = setTimeout(() => b.classList.remove("show"), 4200);
  }

  function startHero() {
    clearInterval(heroTimer);
    startStage();
    if (!document.getElementById("companion")) return;
    heroPhraseIdx = 0;
    heroDraw();
    if (!heroGreeted) {
      heroGreeted = true;
      setTimeout(() => heroSay(), 1400);
    }
    let tick = 0;
    heroTimer = setInterval(() => {
      if (!document.getElementById("companion")) return clearInterval(heroTimer);
      tick++;
      heroDraw();
      if (tick % 2 === 0 && Math.random() < 0.6) heroSay();
    }, 24000);
  }

  function heroSettingsHtml() {
    if (!HEROES) return "";
    const cur = state.settings.hero;
    return (
      '<section class="section"><div class="section-head"><h2>Компаньон</h2><span class="muted small">живёт на главной</span></div>' +
      '<div class="hero-picks">' +
      HEROES.chars
        .map(
          (c) =>
            '<button class="hero-pick' +
            (cur === c.id ? " on" : "") +
            '" data-act="hero-pick" data-id="' +
            c.id +
            '" aria-pressed="' +
            (cur === c.id) +
            '"><span class="hp-art">' +
            heroDrawSvg(c.id, "idle", heroLevel()) +
            "</span><b>" +
            esc(c.name) +
            "</b><span>" +
            esc(c.role) +
            "</span></button>"
        )
        .join("") +
      '<button class="hero-pick off' +
      (cur === "off" ? " on" : "") +
      '" data-act="hero-pick" data-id="off" aria-pressed="' +
      (cur === "off") +
      '"><span class="hp-art hp-none">🚫</span><b>Без героя</b><span>карточка без анимации</span></button>' +
      "</div>" +
      '<div class="segmented mt">' +
      [
        ["vec", "Векторный"],
        ["px", "Пиксель-арт"]
      ]
        .map(
          (m) =>
            '<button data-act="hero-style" data-m="' +
            m[0] +
            '" class="' +
            (state.settings.heroStyle === m[0] ? "on" : "") +
            '">' +
            m[1] +
            "</button>"
        )
        .join("") +
      "</div>" +
      '<p class="muted small mt">Героев на главной на компьютере — они ходят, разговаривают и связываются друг с другом:</p>' +
      '<div class="segmented mt">' +
      [1, 2, 3]
        .map((n) => '<button data-act="hero-count" data-n="' + n + '" class="' + ((state.settings.heroCount || 3) === n ? "on" : "") + '">' + n + "</button>")
        .join("") +
      "</div></section>"
    );
  }

  /* ================= лестница званий в баннере ================= */

  function rankLadderHtml() {
    const r = rank();
    const idx = Math.max(0, RANKS.indexOf(r.cur));
    const frac = r.next ? (state.xp - r.cur.min) / (r.next.min - r.cur.min) : 1;
    const last = RANKS.length - 1;
    const pos = Math.min(100, ((idx + Math.max(0, Math.min(1, frac))) / last) * 100);
    return (
      '<div class="rank-ladder"><div class="rl-head"><b>' +
      esc(r.cur.title) +
      "</b><span>" +
      state.xp +
      " XP" +
      (r.next ? " · до «" + esc(r.next.title) + "» " + (r.next.min - state.xp) + " XP" : " · высшее звание") +
      '</span></div><div class="rl-track"><i style="width:' +
      pos.toFixed(1) +
      '%"></i>' +
      RANKS.map(
        (x, i) =>
          '<span class="rl-step' +
          (i <= idx ? " on" : "") +
          (i === idx ? " cur" : "") +
          '" style="left:' +
          ((i / last) * 100).toFixed(2) +
          '%" title="' +
          esc(x.title) +
          " — от " +
          x.min +
          ' XP"><em></em><small>' +
          esc(x.title) +
          "</small></span>"
      ).join("") +
      "</div></div>"
    );
  }

  /* ================= сцена с героями (компьютер) ================= */

  // На широком экране герои ходят по баннеру, занимаются своими делами,
  // сходятся по двое и разговаривают — между ними бежит линия связи.
  const STAGE_TALKS = [
    ["Ты уже синхронизировался?", "Секунду… готово, всё в облаке!"],
    ["Почему стену не видно на плане?", "Проверь секущий диапазон вида."],
    ["Specification — это спецификация?", "Нет! Таблица Revit — это schedule."],
    ["В отчёте 1200 коллизий!", "Похоже, одна система на неверной отметке."],
    ["Модель заблокирована!", "Только не через Проводник — зови админа."],
    ["Кто отвечает за координаты?", "Эталон один, и он записан в BEP."],
    ["Сыграем в блиц на минуту?", "Давай! Только без подсказок."],
    ["Ты прошёл тренировку дня?", "Пока нет — сейчас исправим."],
    ["Какой LOD нужен на стадии П?", "Тот, что нужен для задачи, а не максимальный."],
    ["Зачем нам ускоритель в филиале?", "Чтобы модель не открывалась сорок минут."],
    ["Опять ошибка в тесте…", "Ошибки — это тоже прогресс. Повторим!"],
    ["Как по-английски «рабочий набор»?", "Workset. Легко!"]
  ];
  let ACTOR_W = 92;
  const REDUCED = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  let stage = null;

  function heroStageHtml(mode) {
    if (!HEROES || state.settings.hero === "off") return "";
    return '<div class="hero-stage" id="heroStage"' + (mode ? ' data-mode="' + mode + '"' : "") + "></div>";
  }

  function stageWidth() {
    return Math.max(ACTOR_W, stage.el.clientWidth - ACTOR_W);
  }

  function setActorState(a, st) {
    if (a.st === st) return;
    a.st = st;
    a.art.innerHTML = heroDrawSvg(a.id, st, a.main ? heroLevel() : 0);
  }

  function actorSay(a, text, ms) {
    const W = stageWidth();
    a.bubble.textContent = text;
    a.bubble.classList.toggle("edge-l", a.x < 70);
    a.bubble.classList.toggle("edge-r", a.x > W - 70);
    a.bubble.classList.add("show");
    clearTimeout(a.bt);
    a.bt = setTimeout(() => a.bubble.classList.remove("show"), ms || 3200);
  }

  function stopStage() {
    if (!stage) return;
    cancelAnimationFrame(stage.raf);
    stage.actors.forEach((a) => clearTimeout(a.bt));
    clearTimeout(stage.talkTimer);
    stage = null;
  }

  function startStage() {
    stopStage();
    const el = document.getElementById("heroStage");
    if (!el || !HEROES || !window.matchMedia) return false;
    const desk = el.dataset.mode === "desk";
    const wide = matchMedia("(min-width: 1024px)").matches;
    if (!desk && !wide) return false;
    // «за столом»: главный герой работает за столом, остальные заходят к нему поговорить
    const count = desk && !matchMedia("(min-width: 700px)").matches ? 1 : Math.max(1, Math.min(3, state.settings.heroCount || 3));
    const ids = [state.settings.hero]
      .concat(shuffle(HEROES.chars.map((c) => c.id).filter((id) => id !== state.settings.hero)))
      .slice(0, count);
    const ctx = heroContext();
    const base = HEROES.pickState(ctx);
    if (base === "celebrate") {
      state.companion.celebratedDay = todayKey();
      save();
    }
    el.innerHTML =
      '<svg class="stage-link" id="stageLink" aria-hidden="true"></svg>' +
      ids
        .map(
          (id, i) =>
            '<div class="actor" data-act="stage-tap" data-i="' +
            i +
            '" role="button" tabindex="0" aria-label="' +
            esc((heroChar(id) || {}).name || "Герой") +
            '"><div class="actor-bubble" aria-live="polite"></div><div class="actor-art"></div></div>'
        )
        .join("");
    ACTOR_W = (el.querySelector(".actor") || {}).offsetWidth || 92;
    stage = { el: el, desk: desk, actors: [], last: performance.now(), talkIn: 4 + Math.random() * 3, talk: null, sleeping: base === "sleep", base: base, raf: 0 };
    const W = stageWidth();
    const deskX = deskSpot();
    const vMax = visitorMax();
    stage.actors = ids.map((id, i) => {
      const node = el.querySelector('.actor[data-i="' + i + '"]');
      return {
        id: id,
        i: i,
        main: i === 0,
        node: node,
        art: node.querySelector(".actor-art"),
        bubble: node.querySelector(".actor-bubble"),
        x: desk ? (i === 0 ? deskX : (vMax * (i - 1)) / Math.max(1, count - 2)) : count === 1 ? W / 2 : (W * i) / (count - 1),
        dir: desk ? 1 : i === count - 1 && count > 1 ? -1 : 1,
        target: null,
        wait: 1.5 + Math.random() * 3,
        st: ""
      };
    });
    stage.actors.forEach((a) => {
      setActorState(a, a.main ? base : stage.sleeping ? "sleep" : base === "celebrate" ? "celebrate" : "idle");
      a.node.style.transform = "translateX(" + a.x + "px)";
      a.node.classList.toggle("flip", a.dir < 0);
    });
    // главный герой здоровается
    setTimeout(() => {
      if (stage && stage.actors[0]) {
        const ch = heroChar(stage.actors[0].id);
        actorSay(stage.actors[0], heroPhrases(heroContext(), ch)[0], 4200);
      }
    }, 900);
    stage.raf = requestAnimationFrame(stageTick);
    return true;
  }

  // место главного героя за столом и зона, где гуляют гости
  function deskSpot() {
    return Math.max(0, Math.min(stageWidth(), stage.el.clientWidth * 0.66 - ACTOR_W / 2));
  }
  function visitorMax() {
    return Math.max(0, Math.min(deskSpot() - 120, stage.el.clientWidth * 0.42 - ACTOR_W));
  }

  function idleActivity() {
    const h = new Date().getHours();
    const pool = ["work", "work", "read", "game", "idle"];
    if (h < 11) pool.push("coffee", "coffee");
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function startTalk() {
    const free = stage.actors.filter((a) => !a.talking);
    if (free.length < 2) return;
    const lines0 = STAGE_TALKS[Math.floor(Math.random() * STAGE_TALKS.length)];
    if (stage.desk) {
      const main = stage.actors[0];
      const guest = shuffle(free.filter((a) => !a.main))[0];
      if (!guest || main.talking) return;
      stage.talk = { a: guest, b: main, lines: lines0, phase: "approach" };
      guest.target = Math.max(0, main.x - ACTOR_W * 1.1);
      guest.talking = main.talking = true;
      setActorState(guest, "idle");
      setActorState(main, "idle");
      return;
    }
    const pair = shuffle(free).slice(0, 2).sort((p, q) => p.x - q.x);
    const W = stageWidth();
    const mid = Math.max(60, Math.min(W - 60, (pair[0].x + pair[1].x) / 2));
    stage.talk = { a: pair[0], b: pair[1], lines: lines0, phase: "approach" };
    pair[0].target = Math.max(0, mid - 58);
    pair[1].target = Math.min(W, mid + 58);
    pair.forEach((a) => {
      a.talking = true;
      setActorState(a, "idle");
    });
  }

  function drawLink(on) {
    const svg = document.getElementById("stageLink");
    if (!svg) return;
    if (!on || !stage.talk) {
      svg.classList.remove("on");
      return;
    }
    const a = stage.talk.a;
    const b = stage.talk.b;
    const ax = a.x + ACTOR_W / 2;
    const bx = b.x + ACTOR_W / 2;
    const y = stage.el.clientHeight - 52;
    const d = "M" + ax + " " + y + " Q " + (ax + bx) / 2 + " " + (y - 30) + " " + bx + " " + y;
    const back = "M" + bx + " " + y + " Q " + (ax + bx) / 2 + " " + (y - 30) + " " + ax + " " + y;
    svg.innerHTML =
      '<path class="sl-path" d="' + d + '"/>' +
      '<circle class="sl-dot" r="4"><animateMotion dur="1.4s" repeatCount="indefinite" path="' + d + '"/></circle>' +
      '<circle class="sl-dot sl-dot2" r="3"><animateMotion dur="1.4s" repeatCount="indefinite" path="' + back + '"/></circle>';
    svg.classList.add("on");
  }

  function stageTick(now) {
    if (!stage) return;
    if (!document.body.contains(stage.el)) return stopStage();
    const dt = Math.min(0.1, (now - stage.last) / 1000);
    stage.last = now;
    const W = stageWidth();
    stage.actors.forEach((a) => {
      if (a.target !== null) {
        const dx = a.target - a.x;
        const step = REDUCED ? Math.abs(dx) : 46 * dt;
        if (Math.abs(dx) <= step + 0.5) {
          a.x = a.target;
          a.target = null;
          a.node.classList.remove("walking");
        } else {
          a.x += Math.sign(dx) * step;
          a.dir = Math.sign(dx);
          a.node.classList.add("walking");
        }
      } else if (!a.talking && !stage.sleeping && stage.base !== "celebrate") {
        a.wait -= dt;
        if (a.wait <= 0) {
          if (Math.random() < 0.55 && !(stage.desk && a.main)) {
            setActorState(a, "idle");
            a.target = Math.random() * (stage.desk ? visitorMax() : W);
            a.wait = 1 + Math.random() * 2;
          } else {
            setActorState(a, a.main && stage.base === "cheer" ? "cheer" : idleActivity());
            a.wait = 4 + Math.random() * 4;
          }
        }
      }
      if (stage.desk && a.main) a.x = deskSpot();
      a.x = Math.max(0, Math.min(W, a.x));
      a.node.style.transform = "translateX(" + a.x.toFixed(1) + "px)";
      a.node.classList.toggle("flip", a.dir < 0);
    });

    // разговоры по двое
    if (!stage.sleeping && stage.actors.length > 1) {
      const t = stage.talk;
      if (!t) {
        stage.talkIn -= dt;
        if (stage.talkIn <= 0) startTalk();
      } else if (t.phase === "approach" && t.a.target === null && t.b.target === null) {
        t.phase = "talk";
        t.a.dir = 1;
        t.b.dir = -1;
        drawLink(true);
        actorSay(t.a, t.lines[0], 2800);
        stage.talkTimer = setTimeout(() => {
          if (!stage || stage.talk !== t) return;
          actorSay(t.b, t.lines[1], 2900);
          stage.talkTimer = setTimeout(() => {
            if (!stage || stage.talk !== t) return;
            drawLink(false);
            [t.a, t.b].forEach((a) => {
              a.talking = false;
              a.wait = 0.5 + Math.random() * 2;
            });
            if (stage.desk) {
              t.b.dir = 1;
              t.a.target = Math.random() * visitorMax();
            }
            stage.talk = null;
            stage.talkIn = 9 + Math.random() * 8;
          }, 3100);
        }, 2900);
      }
    }
    stage.raf = requestAnimationFrame(stageTick);
  }

  function stageTap(i) {
    if (!stage) return;
    const a = stage.actors[i];
    if (!a) return;
    const ch = heroChar(a.id);
    const list = a.main ? heroPhrases(heroContext(), ch) : ch.phrases;
    a.k = (a.k || 0) + 1;
    actorSay(a, list[a.k % list.length], 3600);
  }

  /* ================= собеседование ================= */

  function renderInterview() {
    setTop("Собеседование", INTERVIEW_SIZE + " вопросов на время");
    const best = state.games.interviewBest || 0;
    view.innerHTML =
      '<section class="section"><div class="hero"><span class="hero-kicker">Проверка широты</span><h2>Как на настоящем собеседовании</h2><p>' +
      INTERVIEW_SIZE +
      " случайных вопросов по всем направлениям, не больше трёх из одного курса. На всё — " +
      INTERVIEW_SECONDS / 60 +
      " минут. Подсмотреть урок нельзя.</p></div></section>" +
      '<section class="section"><div class="card"><h3>Что будет в конце</h3><ul class="bullets">' +
      "<li>Результат по каждому направлению — где вы сильны, а где плаваете.</li>" +
      "<li>Список уроков, которые стоит перечитать.</li>" +
      "<li>Разбор каждой ошибки с объяснением.</li></ul>" +
      (best ? '<p class="muted small mt">Лучший результат: ' + best + "%</p>" : "") +
      "</div></section>" +
      '<section class="section"><a class="btn primary block" href="#/quiz/interview/' +
      INTERVIEW_SIZE +
      '">Начать · таймер запустится сразу</a></section>';
  }

  /* ================= игры ================= */

  // Одна активная игра; её таймер останавливается при уходе со страницы.
  let game = null;
  let gameTimer = null;
  const VOCAB = CONTENT.vocab || [];
  const BLITZ_SECONDS = 60;

  function stopGame() {
    clearInterval(gameTimer);
    gameTimer = null;
    game = null;
  }

  function shortDef(text) {
    let s = String(text || "").split(/[.;:]/)[0].trim();
    if (s.length > 72) s = s.slice(0, 70).replace(/\s+\S*$/, "") + "…";
    return s;
  }

  // Набор уникальных пар «слева — справа» для игры «Найди пару».
  function matchPairs(src) {
    let raw;
    if (src === "en") raw = shuffle(VOCAB).map((v) => ({ a: v.en, b: v.ru }));
    else if (src === "keys") raw = shuffle(hotkeyPairs()).map((p) => ({ a: p.action, b: p.keys }));
    else raw = shuffle(CONTENT.glossary.filter((g) => g.term.length <= 26)).map((g) => ({ a: g.term, b: shortDef(g.text) }));
    const seenA = {};
    const seenB = {};
    const out = [];
    raw.forEach((p) => {
      const ka = norm(p.a);
      const kb = norm(p.b);
      if (out.length >= (src === "terms" ? 5 : 6) || seenA[ka] || seenB[kb] || !p.b) return;
      seenA[ka] = seenB[kb] = true;
      out.push(p);
    });
    return out;
  }

  // Головоломки «Собери порядок» берутся из пошаговых блоков уроков.
  const ORDER_POOL = [];
  allLessons.forEach((lesson) => {
    (lesson.blocks || []).forEach((b) => {
      if (b.type === "steps" && b.items.length >= 4 && b.items.length <= 7 && b.items.every((i) => i.length <= 170)) {
        ORDER_POOL.push({ lessonId: lesson.id, title: b.title || lesson.title, items: b.items });
      }
    });
  });

  function blitzItem(src) {
    if (src === "en") {
      const v = VOCAB[Math.floor(Math.random() * VOCAB.length)];
      const truth = Math.random() < 0.5;
      let ru = v.ru;
      if (!truth) {
        const others = VOCAB.filter((x) => norm(x.ru) !== norm(v.ru));
        ru = others[Math.floor(Math.random() * others.length)].ru;
      }
      return { q: v.en + " — это «" + ru + "»", answer: truth, explain: v.en + " — " + v.ru };
    }
    const pool = allQuestions.filter((q) => q.type === "bool" && q.courseId !== "english");
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function startGame(kind, src) {
    stopGame();
    if (kind === "match") {
      const pairs = matchPairs(src);
      if (pairs.length < 4) return false;
      game = {
        kind: kind,
        src: src,
        pairs: pairs,
        left: shuffle(pairs.map((p, i) => i)),
        right: shuffle(pairs.map((p, i) => i)),
        selA: null,
        selB: null,
        done: {},
        miss: null,
        mistakes: 0,
        startedAt: Date.now()
      };
      gameTimer = setInterval(() => {
        const el = document.getElementById("gameClock");
        if (el && game) el.textContent = fmtTime((Date.now() - game.startedAt) / 1000);
      }, 500);
    } else if (kind === "order") {
      if (!ORDER_POOL.length) return false;
      game = { kind: kind, src: "steps", rounds: shuffle(ORDER_POOL).slice(0, 3), round: 0, clean: 0, mistakes: 0 };
      nextOrderRound();
    } else if (kind === "blitz") {
      if (src === "en" && VOCAB.length < 4) return false;
      game = {
        kind: kind,
        src: src,
        item: blitzItem(src),
        correct: 0,
        wrong: [],
        flash: "",
        deadline: Date.now() + BLITZ_SECONDS * 1000
      };
      gameTimer = setInterval(() => {
        if (!game || game.kind !== "blitz") return clearInterval(gameTimer);
        const left = (game.deadline - Date.now()) / 1000;
        const el = document.getElementById("gameClock");
        if (el) {
          el.textContent = fmtTime(left);
          el.classList.toggle("low", left <= 10);
        }
        const bar = document.getElementById("gameBar");
        if (bar) bar.style.width = Math.max(0, (left / BLITZ_SECONDS) * 100) + "%";
        if (left <= 0) finishGame();
      }, 250);
    } else {
      return false;
    }
    return true;
  }

  function nextOrderRound() {
    const r = game.rounds[game.round];
    game.items = r.items;
    game.shuffled = shuffle(r.items.map((t, i) => i));
    // Перемешанный порядок не должен совпасть с правильным.
    if (game.shuffled.every((v, i) => v === i)) game.shuffled.reverse();
    game.placed = [];
    game.roundMistakes = 0;
    game.miss = null;
  }

  function finishGame() {
    clearInterval(gameTimer);
    gameTimer = null;
    const g = game;
    if (!g || g.finished) return;
    g.finished = true;
    state.games.played++;
    if (g.kind === "match") {
      g.time = Math.round((Date.now() - g.startedAt) / 1000);
      const prev = state.games.matchBest[g.src];
      g.record = !g.mistakes && (!prev || g.time < prev);
      if (!g.mistakes) state.games.matchBest[g.src] = prev ? Math.min(prev, g.time) : g.time;
      state.xp += g.mistakes ? 3 : 6;
    } else if (g.kind === "order") {
      state.games.orderSolved += g.rounds.length;
      state.xp += g.clean * 4 + 2;
    } else if (g.kind === "blitz") {
      const prev = state.games.blitzBest[g.src] || 0;
      g.record = g.correct > prev;
      state.games.blitzBest[g.src] = Math.max(prev, g.correct);
      state.xp += g.correct;
    }
    bumpDay("games", 1);
    checkQuests();
    save();
    renderGames();
    window.scrollTo(0, 0);
  }

  const GAME_SRC = {
    terms: "Термины",
    en: "Английский",
    keys: "Горячие клавиши",
    bim: "Вопросы по BIM",
    steps: "Пошаговые инструкции"
  };

  function gameTile(href, em, title, sub) {
    return (
      '<a class="menu-item" href="' +
      href +
      '"><span class="mi-ico">' +
      em +
      '</span><span class="mi-body"><b>' +
      esc(title) +
      '</b><span class="mi-sub">' +
      esc(sub) +
      "</span></span></a>"
    );
  }

  function gameButton(kind, src, title, sub) {
    return (
      '<button class="menu-item" data-act="game-start" data-kind="' +
      kind +
      '" data-src="' +
      src +
      '"><span class="mi-body"><b>' +
      esc(title) +
      '</b><span class="mi-sub">' +
      esc(sub) +
      '</span></span><span class="lesson-arrow">▶</span></button>'
    );
  }

  function renderGames() {
    if (game && !game.finished) return renderGameBoard();
    if (game && game.finished) return renderGameResult();

    setTop("Игры", "учиться играя");
    const gs = state.games;
    const mb = (k) => (gs.matchBest[k] ? "рекорд " + fmtTime(gs.matchBest[k]) : "ещё не играли");
    const bb = (k) => (gs.blitzBest[k] ? "рекорд " + gs.blitzBest[k] + " за минуту" : "ещё не играли");

    let html =
      '<section class="section"><div class="hero"><span class="hero-kicker">Сыграно: ' +
      gs.played +
      '</span><h2>Короткие игры на 1–3 минуты</h2><p>Те же знания, что в уроках, но в формате, который легко повторять каждый день. За каждую игру начисляется XP.</p></div></section>';

    html +=
      '<section class="section"><div class="section-head"><h2>🧩 Найди пару</h2></div>' +
      '<p class="muted small">Соедините понятие с его значением. Без ошибок засчитывается рекорд по времени.</p>' +
      gameButton("match", "terms", GAME_SRC.terms, mb("terms")) +
      (VOCAB.length ? gameButton("match", "en", GAME_SRC.en, mb("en")) : "") +
      gameButton("match", "keys", GAME_SRC.keys, mb("keys")) +
      "</section>";

    html +=
      '<section class="section"><div class="section-head"><h2>⏱ Блиц на минуту</h2></div>' +
      '<p class="muted small">Верно или нет — отвечайте как можно быстрее. Считаются верные ответы за 60 секунд.</p>' +
      gameButton("blitz", "bim", GAME_SRC.bim, bb("bim")) +
      (VOCAB.length ? gameButton("blitz", "en", GAME_SRC.en, bb("en")) : "") +
      "</section>";

    html +=
      '<section class="section"><div class="section-head"><h2>🔢 Собери порядок</h2></div>' +
      '<p class="muted small">Шаги из уроков перемешаны — нажимайте их в правильной последовательности. Три задачи за игру.</p>' +
      gameButton("order", "steps", GAME_SRC.steps, ORDER_POOL.length + " задач в базе · решено " + gs.orderSolved) +
      "</section>";

    html +=
      '<section class="section"><div class="section-head"><h2>🎛 Тренажёры</h2></div>' +
      '<p class="muted small">Двигайте ползунки — схема и вывод пересчитываются сразу.</p>' +
      Object.keys(SIMS)
        .map((k) => gameTile("#/sim/" + k, "🎛", SIMS[k].title, (lessonById[SIMS[k].lesson] || {}).title || ""))
        .join("") +
      "</section>";

    html +=
      '<section class="section"><div class="section-head"><h2>Ещё тренировки</h2></div>' +
      gameTile("#/interview", "💼", "Собеседование", INTERVIEW_SIZE + " вопросов за " + INTERVIEW_SECONDS / 60 + " минут") +
      gameTile("#/cases", "🧩", "Кейсы с проекта", CASES.length + " ситуаций с разбором") +
      gameTile("#/vocab", "🔊", "Словарь с озвучкой", VOCAB.length + " слов и фраз") +
      gameTile("#/cards", "🃏", "Карточки терминов", "повторение по интервалам") +
      gameTile("#/drill", "⌨️", "Тренажёр клавиш", "сочетания на скорость") +
      "</section>";

    view.innerHTML = html;
  }

  function renderGameBoard() {
    const g = game;
    if (g.kind === "match") {
      setTop("Найди пару", GAME_SRC[g.src]);
      const found = Object.keys(g.done).length;
      const cell = (side, i, text) => {
        let cls = "m-cell";
        if (g.done[i]) cls += " done";
        else if ((side === "a" ? g.selA : g.selB) === i) cls += " sel";
        if (g.miss && g.miss[side] === i) cls += " miss";
        return (
          '<button class="' +
          cls +
          '" data-act="m-pick" data-side="' +
          side +
          '" data-i="' +
          i +
          '"' +
          (g.done[i] ? " disabled" : "") +
          ">" +
          esc(text) +
          "</button>"
        );
      };
      view.innerHTML =
        '<div class="quiz-top"><div class="progress"><i style="width:' +
        Math.round((found / g.pairs.length) * 100) +
        '%"></i></div><span class="quiz-count">' +
        found +
        "/" +
        g.pairs.length +
        '</span><span class="quiz-timer" id="gameClock">' +
        fmtTime((Date.now() - g.startedAt) / 1000) +
        "</span></div>" +
        '<div class="match' +
        (g.src === "terms" ? " wide" : "") +
        '"><div class="m-col">' +
        g.left.map((i) => cell("a", i, g.pairs[i].a)).join("") +
        '</div><div class="m-col">' +
        g.right.map((i) => cell("b", i, g.pairs[i].b)).join("") +
        "</div></div>" +
        '<p class="muted small mt">Ошибок: ' +
        g.mistakes +
        '</p><div class="btn-row mt"><button class="btn" data-act="game-quit">Прервать</button></div>';
      return;
    }

    if (g.kind === "order") {
      const r = g.rounds[g.round];
      setTop("Собери порядок", "задача " + (g.round + 1) + " из " + g.rounds.length);
      const solved = g.placed.length === g.items.length;
      let html =
        '<div class="quiz-top"><div class="progress"><i style="width:' +
        Math.round(((g.round + (solved ? 1 : 0)) / g.rounds.length) * 100) +
        '%"></i></div><span class="quiz-count">' +
        (g.round + 1) +
        "/" +
        g.rounds.length +
        "</span></div>" +
        '<section class="question"><span class="q-kind">' +
        esc((courseById[lessonCourse[r.lessonId]] || {}).title || "") +
        "</span><h2>" +
        esc(r.title) +
        '</h2><p class="muted small" style="margin-top:-8px">Нажимайте шаги по порядку: первый, второй, третий…</p><div class="options">' +
        g.shuffled
          .map((i) => {
            const pos = g.placed.indexOf(i);
            let cls = "option order-item";
            if (pos >= 0) cls += " right";
            if (g.miss === i) cls += " wrong";
            return (
              '<button class="' +
              cls +
              '" data-act="o-pick" data-i="' +
              i +
              '"' +
              (pos >= 0 || solved ? " disabled" : "") +
              '><span class="mark">' +
              (pos >= 0 ? pos + 1 : "") +
              "</span><span>" +
              esc(g.items[i]) +
              "</span></button>"
            );
          })
          .join("") +
        "</div>";
      if (solved) {
        html +=
          '<div class="verdict ' +
          (g.roundMistakes ? "no" : "ok") +
          '"><b>' +
          (g.roundMistakes ? "Собрано, ошибок: " + g.roundMistakes : "Чисто, без ошибок") +
          '</b><p><a href="#/lesson/' +
          r.lessonId +
          '">Открыть урок с этой инструкцией</a></p></div>' +
          '<button class="btn primary block mt" data-act="o-next">' +
          (g.round + 1 < g.rounds.length ? "Следующая задача →" : "Результат") +
          "</button>";
      }
      html += '</section><div class="btn-row mt"><button class="btn" data-act="game-quit">Прервать</button></div>';
      view.innerHTML = html;
      return;
    }

    if (g.kind === "blitz") {
      setTop("Блиц", GAME_SRC[g.src]);
      const left = (g.deadline - Date.now()) / 1000;
      view.innerHTML =
        '<div class="quiz-top"><span class="quiz-count">Верно: ' +
        g.correct +
        '</span><div class="progress"><i id="gameBar" style="width:' +
        Math.max(0, (left / BLITZ_SECONDS) * 100) +
        '%"></i></div><span class="quiz-timer' +
        (left <= 10 ? " low" : "") +
        '" id="gameClock">' +
        fmtTime(left) +
        "</span></div>" +
        '<section class="question blitz ' +
        g.flash +
        '"><span class="q-kind">Верно или нет?</span><h2>' +
        esc(g.item.q) +
        '</h2><div class="blitz-btns"><button class="btn primary" data-act="b-pick" data-v="1">Верно</button>' +
        '<button class="btn" data-act="b-pick" data-v="0">Неверно</button></div></section>' +
        '<div class="btn-row mt"><button class="btn" data-act="game-quit">Прервать</button></div>';
    }
  }

  function renderGameResult() {
    const g = game;
    game = null;
    setTop("Результат", "игра окончена");
    let big = "";
    let sub = "";
    if (g.kind === "match") {
      big = fmtTime(g.time);
      sub = g.mistakes
        ? "ошибок: " + g.mistakes + " — рекорд засчитывается только без ошибок"
        : g.record
        ? "без ошибок · новый рекорд!"
        : "без ошибок";
    } else if (g.kind === "order") {
      big = g.clean + " из " + g.rounds.length;
      sub = "задач собрано без единой ошибки";
    } else {
      big = String(g.correct);
      sub = "верных за минуту" + (g.record ? " · новый рекорд!" : "") + (g.wrong.length ? " · ошибок: " + g.wrong.length : "");
    }
    let html =
      '<section class="section"><div class="card center"><p class="big">' +
      big +
      '</p><p class="muted">' +
      esc(sub) +
      "</p></div></section>";
    if (g.kind === "blitz" && g.wrong.length) {
      html +=
        '<section class="section"><div class="section-head"><h2>Где ошиблись</h2></div>' +
        g.wrong
          .slice(0, 8)
          .map(
            (w) =>
              '<div class="mistake"><b>' +
              esc(w.q) +
              '</b><div class="ans">Правильно: ' +
              (w.answer ? "верно" : "неверно") +
              "</div>" +
              (w.explain ? '<div class="muted small mt">' + esc(w.explain) + "</div>" : "") +
              "</div>"
          )
          .join("") +
        "</section>";
    }
    html +=
      '<section class="section"><div class="btn-row"><button class="btn primary" data-act="game-start" data-kind="' +
      g.kind +
      '" data-src="' +
      esc(g.src) +
      '">Ещё раз</button><button class="btn" data-act="games-home">Все игры</button></div></section>';
    view.innerHTML = html;
  }

  function matchPick(side, i) {
    const g = game;
    if (!g || g.kind !== "match" || g.done[i] || g.lock) return;
    if (side === "a") g.selA = g.selA === i ? null : i;
    else g.selB = g.selB === i ? null : i;
    if (g.selA !== null && g.selB !== null) {
      if (g.selA === g.selB) {
        g.done[g.selA] = true;
        g.selA = g.selB = null;
        if (Object.keys(g.done).length === g.pairs.length) return finishGame();
      } else {
        g.mistakes++;
        g.miss = { a: g.selA, b: g.selB };
        g.lock = true;
        renderGameBoard();
        setTimeout(() => {
          if (game !== g) return;
          g.miss = null;
          g.lock = false;
          g.selA = g.selB = null;
          renderGameBoard();
        }, 550);
        return;
      }
    }
    renderGameBoard();
  }

  function orderPick(i) {
    const g = game;
    if (!g || g.kind !== "order" || g.lock || g.placed.indexOf(i) >= 0) return;
    if (i === g.placed.length) {
      g.placed.push(i);
      if (g.placed.length === g.items.length && !g.roundMistakes) g.clean++;
      return renderGameBoard();
    }
    g.mistakes++;
    g.roundMistakes++;
    g.miss = i;
    g.lock = true;
    renderGameBoard();
    setTimeout(() => {
      if (game !== g) return;
      g.miss = null;
      g.lock = false;
      renderGameBoard();
    }, 500);
  }

  function blitzPick(v) {
    const g = game;
    if (!g || g.kind !== "blitz" || g.finished || Date.now() > g.deadline) return;
    const ok = (v === 1) === g.item.answer;
    if (ok) g.correct++;
    else g.wrong.push(g.item);
    g.flash = ok ? "flash-ok" : "flash-no";
    let next = blitzItem(g.src);
    for (let k = 0; k < 4 && next.q === g.item.q; k++) next = blitzItem(g.src);
    g.item = next;
    renderGameBoard();
  }

  /* ================= крупный просмотр схем ================= */

  function openZoom(key, srcEl) {
    const svg = FIGURES[key];
    if (!svg) return;
    closeZoom();
    const ov = document.createElement("div");
    ov.className = "zoom";
    ov.id = "zoom";
    ov.setAttribute("role", "dialog");
    // Схема в крупном просмотре сохраняет цвет курса, из которого её открыли.
    if (srcEl) ov.style.setProperty("--accent", getComputedStyle(srcEl).getPropertyValue("--accent"));
    ov.innerHTML =
      '<div class="zoom-bar"><button class="icon-btn" data-z="out" aria-label="Уменьшить">−</button>' +
      '<span class="zoom-pct" id="zoomPct">100%</span>' +
      '<button class="icon-btn" data-z="in" aria-label="Увеличить">+</button>' +
      '<button class="icon-btn" data-z="close" aria-label="Закрыть">✕</button></div>' +
      '<div class="zoom-stage" id="zoomStage"><div class="zoom-inner" id="zoomInner">' +
      svg +
      "</div></div>" +
      '<p class="zoom-hint">Двумя пальцами или кнопками — масштаб. Поверните телефон, чтобы схема стала крупнее.</p>';
    document.body.appendChild(ov);
    document.body.classList.add("no-scroll");

    const stage = ov.querySelector("#zoomStage");
    const inner = ov.querySelector("#zoomInner");
    let scale = 1;
    const apply = (next, cx, cy) => {
      const prev = scale;
      scale = Math.max(1, Math.min(4, next));
      const ax = cx == null ? stage.clientWidth / 2 : cx;
      const ay = cy == null ? stage.clientHeight / 2 : cy;
      // Точка под пальцами остаётся на месте, чтобы схема не «уезжала».
      const px = (stage.scrollLeft + ax) / prev;
      const py = (stage.scrollTop + ay) / prev;
      inner.style.width = scale * 100 + "%";
      stage.scrollLeft = px * scale - ax;
      stage.scrollTop = py * scale - ay;
      ov.querySelector("#zoomPct").textContent = Math.round(scale * 100) + "%";
    };

    ov.addEventListener("click", (e) => {
      const b = e.target.closest("[data-z]");
      if (!b) return;
      if (b.dataset.z === "close") closeZoom();
      if (b.dataset.z === "in") apply(scale * 1.5);
      if (b.dataset.z === "out") apply(scale / 1.5);
    });

    let pinch = null;
    const dist = (t) => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
    stage.addEventListener(
      "touchstart",
      (e) => {
        if (e.touches.length === 2) pinch = { d: dist(e.touches), s: scale };
      },
      { passive: true }
    );
    stage.addEventListener(
      "touchmove",
      (e) => {
        if (!pinch || e.touches.length !== 2) return;
        e.preventDefault();
        const r = stage.getBoundingClientRect();
        const cx = (e.touches[0].clientX + e.touches[1].clientX) / 2 - r.left;
        const cy = (e.touches[0].clientY + e.touches[1].clientY) / 2 - r.top;
        apply(pinch.s * (dist(e.touches) / pinch.d), cx, cy);
      },
      { passive: false }
    );
    stage.addEventListener("touchend", (e) => {
      if (e.touches.length < 2) pinch = null;
    });
    stage.addEventListener("dblclick", (e) => {
      const r = stage.getBoundingClientRect();
      apply(scale > 1.4 ? 1 : 2.2, e.clientX - r.left, e.clientY - r.top);
    });
  }

  function closeZoom() {
    const ov = document.getElementById("zoom");
    if (ov) ov.remove();
    document.body.classList.remove("no-scroll");
  }

  /* ================= новости ================= */

  const NEWS = (CONTENT.news && CONTENT.news.sources) ? CONTENT.news : { sources: [], timeline: [] };
  const NEWS_CACHE_KEY = "bim-academy-news-cache-v1";

  function allSources() {
    return NEWS.sources.concat(
      (state.mySources || []).map((s) => Object.assign({ custom: true, kind: "Своё", description: "" }, s))
    );
  }

  function feedSources() {
    return allSources().filter((s) => s.feed);
  }

  function readNewsCache() {
    try {
      const raw = localStorage.getItem(NEWS_CACHE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function writeNewsCache(data) {
    try {
      localStorage.setItem(NEWS_CACHE_KEY, JSON.stringify(data));
    } catch (e) {
      /* переполнено или приватный режим — просто не кэшируем */
    }
  }

  // Ленты нельзя запросить напрямую: сайты не отдают заголовок CORS.
  // Поэтому запрос идёт через прокси, адрес которого задаётся в настройках.
  function proxied(url) {
    const p = (state.settings.newsProxy || "").trim();
    if (!p) return "";
    return p.indexOf("{url}") >= 0 ? p.replace("{url}", encodeURIComponent(url)) : p + encodeURIComponent(url);
  }

  function parseFeed(text, source) {
    const doc = new DOMParser().parseFromString(text, "application/xml");
    if (doc.querySelector("parsererror")) return [];
    const nodes = doc.querySelectorAll("item, entry");
    const out = [];
    nodes.forEach((n) => {
      const title = (n.querySelector("title") || {}).textContent || "";
      let link = "";
      const linkEl = n.querySelector("link");
      if (linkEl) link = linkEl.getAttribute("href") || linkEl.textContent || "";
      const dateText =
        ((n.querySelector("pubDate") || n.querySelector("updated") || n.querySelector("published") || {}).textContent) || "";
      if (!title.trim()) return;
      out.push({
        title: title.trim(),
        link: link.trim(),
        date: dateText.trim(),
        ts: dateText ? Date.parse(dateText) || 0 : 0,
        source: source.title,
        region: source.region
      });
    });
    return out;
  }

  function loadFeeds() {
    const sources = feedSources();
    if (!sources.length) return Promise.resolve({ items: [], failed: [], fetchedAt: 0 });

    // Если прокси не задан, пробуем забрать ленту напрямую. Для ленты, лежащей
    // на том же домене, что и приложение, этого достаточно — CORS не мешает.
    const failed = [];
    const perSource = [];
    return Promise.all(
      sources.map((s) =>
        fetch(proxied(s.feed) || s.feed, { cache: "no-store" })
          .then((r) => (r.ok ? r.text() : Promise.reject(new Error("ответ " + r.status))))
          .then((t) => {
            const items = parseFeed(t, s);
            perSource.push({
              title: s.title,
              ok: items.length > 0,
              count: items.length,
              note: items.length ? "" : "ответила, но записей нет — похоже, это не RSS"
            });
            return items;
          })
          .catch((err) => {
            failed.push(s.title);
            perSource.push({
              title: s.title,
              ok: false,
              count: 0,
              note: err && err.message ? err.message : "не отвечает или закрыта политикой CORS"
            });
            return [];
          })
      )
    ).then((lists) => {
      const items = [].concat.apply([], lists).sort((a, b) => b.ts - a.ts).slice(0, 60);
      const data = { items: items, failed: failed, perSource: perSource, fetchedAt: Date.now() };
      if (items.length) writeNewsCache(data);
      return data;
    });
  }

  function feedStatusHtml(perSource) {
    if (!perSource || !perSource.length) return "";
    const bad = perSource.filter((s) => !s.ok).length;
    return (
      '<details class="term mt"><summary>Состояние лент' +
      (bad ? " — не отвечает: " + bad : "") +
      '</summary><div class="term-body">' +
      perSource
        .map(
          (s) =>
            '<p class="small">' +
            (s.ok ? "✅ " : "⚠️ ") +
            "<b>" +
            esc(s.title) +
            "</b> — " +
            (s.ok ? s.count + " " + plural(s.count, "запись", "записи", "записей") : esc(s.note)) +
            "</p>"
        )
        .join("") +
      "</div></details>"
    );
  }

  function fmtFeedDate(item) {
    if (!item.ts) return item.date || "";
    const d = new Date(item.ts);
    return d.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
  }

  function newsSourceCard(s) {
    return (
      '<a class="menu-item" href="' +
      esc(s.url) +
      '" target="_blank" rel="noopener"><span class="mi-ico">📰</span><span class="mi-body"><b>' +
      esc(s.title) +
      '</b><span class="mi-sub">' +
      esc(s.kind) +
      (s.feed ? " · есть RSS" : "") +
      "</span>" +
      (s.description ? '<span class="mi-sub">' + esc(s.description) + "</span>" : "") +
      "</span></a>" +
      (s.custom
        ? '<div class="btn-row" style="margin:6px 0 4px"><button class="btn small" data-act="del-source" data-id="' +
          esc(s.id) +
          '">Удалить источник</button></div>'
        : "")
    );
  }

  function digestCard(d) {
    const lesson = lessonById[d.lesson];
    return (
      '<details class="term digest" data-term="' +
      esc(d.id) +
      '"><summary><span class="chip accent">' +
      esc(d.tag) +
      "</span> " +
      esc(d.title) +
      '</summary><div class="term-body">' +
      "<p><b>" +
      esc(d.lead) +
      "</b></p><ul>" +
      d.points.map((p) => "<li>" + esc(p) + "</li>").join("") +
      "</ul>" +
      '<div class="note tip"><b>Что это значит для вас</b><p>' +
      esc(d.soWhat) +
      "</p></div>" +
      (lesson ? '<a class="btn small soft mt" href="#/lesson/' + d.lesson + '">Разобрать: ' + esc(lesson.title) + "</a>" : "") +
      "</div></details>"
    );
  }

  function renderNews(params) {
    const tab = (params && params.get("tab")) || "digest";
    const region = (params && params.get("region")) || "ru";
    setTop(
      "Новости BIM",
      tab === "digest" ? "дайджест отрасли" : tab === "feed" ? "живая лента" : "источники и хронология"
    );

    const link = (t, r) => "#/news?tab=" + t + "&region=" + (r || region);

    let html =
      '<div class="row row-wrap mb">' +
      [["digest", "Дайджест"], ["feed", "Лента"], ["sources", "Источники"]]
        .map(
          (t) =>
            '<a class="chip' + (tab === t[0] ? " accent" : "") + '" href="' + link(t[0]) + '">' + t[1] + "</a>"
        )
        .join("") +
      "</div>";

    if (tab !== "feed") {
      html +=
        '<div class="row row-wrap mb">' +
        [["ru", "Россия"], ["world", "Мир"]]
          .map(
            (r) =>
              '<a class="chip' + (region === r[0] ? " accent" : "") + '" href="' + link(tab, r[0]) + '">' + r[1] + "</a>"
          )
          .join("") +
        "</div>";
    }

    if (tab === "digest") {
      const items = (NEWS.digest || []).filter((d) => d.region === region);
      html +=
        '<section class="section"><div class="card"><h3>Что происходит в отрасли</h3>' +
        '<p>Не лента заголовков, а разбор тем, которые определяют работу прямо сейчас. По каждой — что происходит и что из этого следует лично для вас.</p>' +
        '<p class="muted small mt">Обзор составлен: ' +
        esc(NEWS.digestUpdated || "—") +
        ". Свежие заголовки — во вкладке «Лента».</p></div></section>";

      html +=
        '<section class="section"><div class="section-head"><h2>Темы</h2><span class="muted small">' +
        items.length +
        "</span></div>";
      if (!items.length) html += '<div class="empty"><span class="em">📰</span>Тем пока нет</div>';
      items.forEach((d) => {
        html += digestCard(d);
      });
      html += "</section>";

      const timeline = (NEWS.timeline || []).filter((t) => t.region === region).slice().reverse();
      if (timeline.length) {
        html += '<section class="section"><div class="section-head"><h2>Как мы сюда пришли</h2></div>';
        timeline.forEach((t) => {
          html +=
            '<div class="card mb"><div class="row"><span class="chip accent">' +
            esc(t.year) +
            "</span></div><h3>" +
            esc(t.title) +
            "</h3><p>" +
            esc(t.text) +
            "</p></div>";
        });
        html +=
          '<div class="note warn"><b>Это ориентиры, а не выписка из реестра</b><p>Номера документов и даты вступления требований в силу меняются, часть документов существует в виде проектов. Перед тем как ссылаться на них в договоре или в переписке с заказчиком, сверьтесь с действующей редакцией в официальном источнике.</p></div>';
        html += "</section>";
      }
    }

    if (tab === "feed") {
      const cache = readNewsCache();
      html += '<section class="section"><div class="section-head"><h2>Свежие заголовки</h2>';
      if (feedSources().length) html += '<button class="btn small" data-act="news-refresh">Обновить</button>';
      html += '</div><div id="newsFeed">';
      if (!feedSources().length) {
        html +=
          '<div class="note tip"><b>Лента не настроена</b><p>Ни у одного источника не указан адрес RSS. Добавьте источник со ссылкой на ленту во вкладке «Источники» — и свежие заголовки появятся здесь. Для лент с чужих сайтов дополнительно нужен прокси: он настраивается в «Ещё» → «Новости».</p>' +
          '<p class="mt">Пока лента не настроена, вкладка «Дайджест» даёт разбор того, что происходит в отрасли — она работает офлайн.</p></div>';
      } else if (cache && cache.items && cache.items.length) {
        html += feedListHtml(cache.items, cache.fetchedAt) + feedStatusHtml(cache.perSource);
      } else {
        html += '<p class="muted small">Загружаю…</p>';
      }
      html += "</div></section>";
    }

    if (tab === "sources") {
      const sources = allSources().filter((s) => s.region === region);
      html +=
        '<section class="section"><div class="section-head"><h2>Где смотреть</h2><span class="muted small">' +
        sources.length +
        "</span></div>";
      if (!sources.length) html += '<div class="empty"><span class="em">📰</span>Источников пока нет</div>';
      sources.forEach((s) => {
        html += newsSourceCard(s);
      });
      html += "</section>";

      html +=
        '<section class="section"><details class="term"><summary>➕ Добавить свой источник</summary><div class="term-body">' +
        '<input class="answer-input" id="srcTitle" type="text" placeholder="Название" />' +
        '<input class="answer-input mt" id="srcUrl" type="url" placeholder="Ссылка на сайт (https://...)" />' +
        '<input class="answer-input mt" id="srcFeed" type="url" placeholder="Ссылка на RSS — необязательно" />' +
        '<select class="answer-input mt" id="srcRegion"><option value="ru">Россия</option><option value="world">Мир</option></select>' +
        '<button class="btn primary block mt" data-act="add-source">Сохранить</button>' +
        '<p class="muted small mt">Источник сохранится только на этом устройстве и попадёт в экспорт прогресса.</p>' +
        "</div></details></section>";
    }

    view.innerHTML = html;

    if (tab === "feed" && feedSources().length) refreshFeed(region, !readNewsCache());
  }

  function feedListHtml(items, fetchedAt) {
    if (!items.length) return '<p class="muted small">Свежих записей нет.</p>';
    return (
      items
        .slice(0, 20)
        .map(
          (i) =>
            '<a class="menu-item" href="' +
            esc(i.link) +
            '" target="_blank" rel="noopener"><span class="mi-ico">·</span><span class="mi-body"><b>' +
            esc(i.title) +
            '</b><span class="mi-sub">' +
            esc(i.source) +
            (fmtFeedDate(i) ? " · " + esc(fmtFeedDate(i)) : "") +
            "</span></span></a>"
        )
        .join("") +
      (fetchedAt
        ? '<p class="muted small mt">Обновлено ' + new Date(fetchedAt).toLocaleString("ru-RU") + "</p>"
        : "")
    );
  }

  function refreshFeed(region, silent) {
    const box = document.getElementById("newsFeed");
    if (!box) return;
    if (!silent) box.innerHTML = '<p class="muted small">Обновляю…</p>';
    loadFeeds()
      .then((data) => {
        const target = document.getElementById("newsFeed");
        if (!target) return;
        if (!data.items.length) {
          target.innerHTML =
            '<div class="note warn"><b>Не удалось загрузить ленту</b><p>' +
            (proxied("test")
              ? "Прокси задан, но источники не ответили. Разверните «Состояние лент» — там написано, что именно пошло не так по каждому."
              : "Чужие ленты браузер напрямую забрать не может: мешает политика CORS. Нужен прокси — адрес задаётся в «Ещё» → «Новости», там же описано, как его поднять.") +
            " Каталог источников ниже работает и без этого.</p></div>" +
            feedStatusHtml(data.perSource);
          return;
        }
        target.innerHTML = feedListHtml(data.items, data.fetchedAt) + feedStatusHtml(data.perSource);
        if (!silent) toast("Лента обновлена");
      })
      .catch(() => {
        const target = document.getElementById("newsFeed");
        if (target && !silent) target.innerHTML = '<p class="muted small">Не удалось обновить ленту.</p>';
      });
  }

  /* ================= профиль / ещё ================= */

  function renderMore() {
    setTop("Профиль и настройки", "прогресс, темы, данные");
    const r = rank();
    const tp = totalProgress();
    const t = todayStats();

    let html =
      '<section class="section"><div class="card"><div class="row spread"><div><h3>' +
      esc(r.cur.title) +
      "</h3><p>" +
      state.xp +
      " XP · " +
      accuracy() +
      "% точность</p></div>" +
      ringHtml(tp.pct) +
      "</div>" +
      (r.next
        ? '<div class="progress" style="margin-top:12px"><i style="width:' +
          Math.min(100, Math.round(((state.xp - r.cur.min) / (r.next.min - r.cur.min)) * 100)) +
          '%"></i></div><div class="progress-meta"><span>до «' +
          esc(r.next.title) +
          '»</span><span>' +
          (r.next.min - state.xp) +
          " XP</span></div>"
        : "") +
      "</div></section>";

    html +=
      '<section class="section"><div class="section-head"><h2>Как к вам обращаться</h2></div><div class="card"><input class="answer-input" id="userName" type="text" maxlength="40" autocomplete="name" placeholder="Имя и фамилия" value="' +
      esc(state.settings.name || "") +
      '" /><p class="muted small mt">Имя появится в приветствии на главной и в сертификатах.</p></div></section>';

    html += syncSectionHtml();

    html +=
      '<section class="section"><div class="grid grid-2">' +
      statTile(tp.done + "/" + tp.total, "уроков пройдено") +
      statTile(state.answers.total, "ответов в тестах") +
      statTile(streakNow(), "дней подряд") +
      statTile(state.streak.best, "лучшая серия") +
      statTile(t.questions, "вопросов сегодня") +
      statTile(Object.keys(state.mistakes).filter((id) => questionById[id]).length, "ошибок в работе") +
      "</div></section>" +
      heatmapHtml();

    html +=
      '<section class="section"><div class="section-head"><h2>Достижения</h2><span class="muted small">' +
      BADGES.filter((b) => b.test(state)).length +
      " из " +
      BADGES.length +
      '</span></div><div class="grid grid-2">' +
      BADGES.map(
        (b) =>
          '<div class="badge' +
          (b.test(state) ? " on" : "") +
          '"><span class="em">' +
          b.em +
          "</span><b>" +
          esc(b.title) +
          "</b><span>" +
          esc(b.desc) +
          "</span></div>"
      ).join("") +
      "</div></section>";

    html +=
      '<section class="section"><div class="section-head"><h2>Разделы</h2></div>' +
      '<a class="menu-item" href="#/bookmarks"><span class="mi-ico">★</span><span class="mi-body"><b>Закладки</b><span class="mi-sub">' +
      state.bookmarks.length +
      ' сохранённых уроков</span></span></a>' +
      '<a class="menu-item" href="#/checks"><span class="mi-ico">✅</span><span class="mi-body"><b>Чек-листы</b><span class="mi-sub">старт проекта, выдача, приёмка, запуск Revit Server</span></span></a>' +
      '<a class="menu-item" href="#/warnings"><span class="mi-ico">⚠️</span><span class="mi-body"><b>Предупреждения Revit</b><span class="mi-sub">' +
      WARNINGS.length +
      " разборов: что значит и как чинить</span></span></a>" +
      '<a class="menu-item" href="#/games"><span class="mi-ico">🎮</span><span class="mi-body"><b>Игры</b><span class="mi-sub">найди пару, блиц, собери порядок</span></span></a>' +
      '<a class="menu-item" href="#/paths"><span class="mi-ico">🧭</span><span class="mi-body"><b>Траектории</b><span class="mi-sub">маршрут к роли и сертификат</span></span></a>' +
      '<a class="menu-item" href="#/cases"><span class="mi-ico">🧩</span><span class="mi-body"><b>Кейсы с проекта</b><span class="mi-sub">ситуации с разбором решений</span></span></a>' +
      '<a class="menu-item" href="#/vocab"><span class="mi-ico">🔊</span><span class="mi-body"><b>Словарь BIM English</b><span class="mi-sub">слова и фразы с озвучкой</span></span></a>' +
      '<a class="menu-item" href="#/interview"><span class="mi-ico">💼</span><span class="mi-body"><b>Собеседование</b><span class="mi-sub">случайные вопросы на время</span></span></a>' +
      '<a class="menu-item" href="#/cards"><span class="mi-ico">🃏</span><span class="mi-body"><b>Карточки терминов</b><span class="mi-sub">' +
      (dueCards().length ? dueCards().length + " к повтору" : "повторение по интервалам") +
      "</span></span></a>" +
      '<a class="menu-item" href="#/keys"><span class="mi-ico">⌨️</span><span class="mi-body"><b>Горячие клавиши</b><span class="mi-sub">Revit, AutoCAD и другие</span></span></a>' +
      '<a class="menu-item" href="#/drill"><span class="mi-ico">⚡</span><span class="mi-body"><b>Тренажёр клавиш</b><span class="mi-sub">на скорость, 10 вопросов</span></span></a>' +
      '<a class="menu-item" href="#/glossary"><span class="mi-ico">📖</span><span class="mi-body"><b>Глоссарий</b><span class="mi-sub">' +
      CONTENT.glossary.length +
      " терминов</span></span></a></section>";

    html +=
      heroSettingsHtml() +
      '<section class="section"><div class="section-head"><h2>Тема оформления</h2></div><div class="segmented">' +
      ["auto", "light", "dark"]
        .map(
          (m) =>
            '<button data-act="theme" data-m="' +
            m +
            '" class="' +
            (state.settings.theme === m ? "on" : "") +
            '">' +
            (m === "auto" ? "Как в системе" : m === "light" ? "Светлая" : "Тёмная") +
            "</button>"
        )
        .join("") +
      "</div></section>";

    html +=
      '<section class="section"><div class="section-head"><h2>Цель на день</h2></div><div class="segmented">' +
      [5, 10, 20, 30]
        .map(
          (g) =>
            '<button data-act="goal" data-g="' +
            g +
            '" class="' +
            (state.settings.goal === g ? "on" : "") +
            '">' +
            g +
            "</button>"
        )
        .join("") +
      '</div><p class="muted small mt">Столько вопросов нужно решить, чтобы день засчитался в серию.</p></section>';

    html +=
      '<section class="section"><div class="section-head"><h2>Новости</h2></div>' +
      '<div class="card"><p class="muted small">Приложение может показывать свежие заголовки прямо в разделе «Новости». Браузеру нельзя забирать чужие RSS-ленты напрямую, поэтому нужен адрес прокси. Если оставить поле пустым, раздел работает как каталог источников — это тоже полностью рабочий вариант.</p>' +
      '<input class="answer-input mt" id="newsProxy" type="text" placeholder="https://ваш-сервер/feed?url=" value="' +
      esc(state.settings.newsProxy || "") +
      '" />' +
      '<div class="btn-row mt"><button class="btn primary" data-act="save-proxy">Сохранить</button>' +
      '<button class="btn" data-act="test-feeds">Проверить ленты</button></div>' +
      '<p class="muted small mt">Как поднять такой прокси бесплатно за пять минут — в файле deploy/README.md, раздел про живую ленту.</p></div></section>';

    html +=
      '<section class="section"><div class="section-head"><h2>Данные</h2></div>' +
      '<button class="menu-item" data-act="export"><span class="mi-ico">⬇️</span><span class="mi-body"><b>Экспорт прогресса</b><span class="mi-sub">файл JSON для переноса на другое устройство</span></span></button>' +
      '<button class="menu-item" data-act="import"><span class="mi-ico">⬆️</span><span class="mi-body"><b>Импорт прогресса</b><span class="mi-sub">загрузить сохранённый файл</span></span></button>' +
      '<button class="menu-item" data-act="install"><span class="mi-ico">📲</span><span class="mi-body"><b>Установить на телефон</b><span class="mi-sub">работает офлайн, как обычное приложение</span></span></button>' +
      '<button class="menu-item" data-act="reset"><span class="mi-ico">🗑</span><span class="mi-body"><b>Сбросить прогресс</b><span class="mi-sub">удалит статистику, закладки и ошибки</span></span></button>' +
      '<input type="file" id="importFile" class="file-input" accept="application/json,.json" /></section>';

    html +=
      '<section class="section"><div class="card"><h3>О приложении</h3><p>BIM Academy — офлайн-справочник и тренажёр по BIM, Revit, Navisworks, AutoCAD и Civil 3D. ' +
      allLessons.length +
      " уроков, " +
      allQuestions.length +
      " вопросов, " +
      CONTENT.glossary.length +
      " терминов, " +
      CONTENT.videos.length +
      ' видеоподборок.</p><p class="mt small">Версия ' +
      APP_VERSION +
      "</p></div></section>";

    view.innerHTML = html;
    const nameInput = document.getElementById("userName");
    if (nameInput)
      nameInput.addEventListener("change", () => {
        state.settings.name = nameInput.value.trim().slice(0, 40);
        save();
        updateUserChip();
        toast("Имя сохранено");
      });
  }

  function statTile(v, label) {
    return '<div class="stat-tile"><b>' + esc(v) + "</b><span>" + esc(label) + "</span></div>";
  }

  function renderNotFound() {
    setTop("Не найдено", "");
    view.innerHTML =
      '<div class="empty"><span class="em">🧭</span><b>Страница не найдена</b><a class="btn primary mt" href="#/">На главную</a></div>';
  }

  /* ================= действия ================= */

  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-act]");
    if (!el) return;
    const act = el.dataset.act;

    if (act === "zoom-fig") return openZoom(el.dataset.fig, el);
    if (act === "game-start") {
      if (!startGame(el.dataset.kind, el.dataset.src)) return toast("Для этой игры пока мало данных");
      if (location.hash !== "#/games") location.hash = "#/games";
      else renderGames();
      window.scrollTo(0, 0);
      return;
    }
    if (act === "game-quit") {
      stopGame();
      return renderGames();
    }
    if (act === "games-home") {
      stopGame();
      if (location.hash !== "#/games") location.hash = "#/games";
      else renderGames();
      window.scrollTo(0, 0);
      return;
    }
    if (act === "m-pick") return matchPick(el.dataset.side, Number(el.dataset.i));
    if (act === "o-pick") return orderPick(Number(el.dataset.i));
    if (act === "o-next") {
      if (!game || game.kind !== "order") return;
      if (game.round + 1 >= game.rounds.length) return finishGame();
      game.round++;
      nextOrderRound();
      renderGameBoard();
      window.scrollTo(0, 0);
      return;
    }
    if (act === "b-pick") return blitzPick(Number(el.dataset.v));
    if (act === "pick") return pick(Number(el.dataset.i));
    if (act === "check") return checkAnswer();
    if (act === "next") return nextQuestion();
    if (act === "quit") {
      quiz = null;
      location.hash = "#/tests";
      return;
    }
    if (act === "retry-wrong") {
      const items = view._wrongItems || [];
      if (!items.length) return;
      quiz = {
        mode: "mistakes",
        modeName: "Повтор ошибок",
        title: "Повтор ошибок",
        items: shuffle(items),
        idx: 0,
        sel: [],
        checked: false,
        correct: 0,
        wrong: [],
        results: [],
        startedAt: Date.now(),
        deadline: 0
      };
      renderQuestion();
      window.scrollTo(0, 0);
      return;
    }
    if (act === "toggle-done") {
      const id = el.dataset.id;
      const cur = state.lessons[id] || {};
      if (cur.done) {
        state.lessons[id] = { done: false, at: Date.now() };
        toast("Отметка снята");
      } else {
        state.lessons[id] = { done: true, at: Date.now() };
        state.xp += 12;
        bumpDay("lessons", 1);
        toast("Урок пройден. +12 XP");
        checkQuests();
      }
      save();
      renderLesson(id);
      return;
    }
    if (act === "bookmark") {
      const id = el.dataset.id;
      const at = state.bookmarks.indexOf(id);
      if (at >= 0) {
        state.bookmarks.splice(at, 1);
        toast("Убрано из закладок");
      } else {
        state.bookmarks.push(id);
        toast("Добавлено в закладки");
      }
      save();
      renderLesson(id);
      return;
    }
    if (act === "hero-tap") return heroSay();
    if (act === "stage-tap") return stageTap(Number(el.dataset.i));
    if (act === "home-tab") {
      homeTab = el.dataset.t;
      const box = document.getElementById("nhCourses");
      if (box) box.innerHTML = homeCoursesHtml();
      return;
    }
    if (act === "hero-count") {
      state.settings.heroCount = Number(el.dataset.n);
      save();
      return renderMore();
    }
    if (act === "sync-send") return syncSendCode();
    if (act === "sync-verify") return syncVerify();
    if (act === "sync-login") return syncLoginPass();
    if (act === "sync-setpass") return syncSetPass();
    if (act === "sync-mode") {
      syncMode = el.dataset.m;
      return renderMore();
    }
    if (act === "sync-reset") {
      otpEmail = "";
      return renderMore();
    }
    if (act === "sync-now") return syncNow();
    if (act === "sync-out") {
      if (sb) sb.auth.signOut();
      toast("Вы вышли. Прогресс на этом устройстве остался");
      return;
    }
    if (act === "inq") return answerInline(el);
    if (act === "say") {
      e.preventDefault();
      return speak(el.dataset.t);
    }
    if (act === "ics") return downloadIcs();
    if (act === "cert-save") return saveCert();
    if (act === "case-pick") {
      if (!caseRun || caseRun.picked !== null) return;
      const c = CASES.filter((x) => x.id === caseRun.id)[0];
      caseRun.picked = Number(el.dataset.i);
      caseRun.score += c.steps[caseRun.step].options[caseRun.picked].score;
      return renderCase(caseRun.id);
    }
    if (act === "case-next") {
      if (!caseRun) return;
      caseRun.step++;
      caseRun.picked = null;
      renderCase(caseRun.id);
      window.scrollTo(0, 0);
      return;
    }
    if (act === "case-again") {
      caseRun = null;
      renderCase(el.dataset.id);
      window.scrollTo(0, 0);
      return;
    }
    if (act === "hero-pick") {
      state.settings.hero = el.dataset.id;
      save();
      renderMore();
      toast(el.dataset.id === "off" ? "Компаньон выключен" : "Компаньон выбран — загляните на главную");
      return;
    }
    if (act === "hero-style") {
      state.settings.heroStyle = el.dataset.m;
      save();
      renderMore();
      return;
    }
    if (act === "theme") {
      state.settings.theme = el.dataset.m;
      save();
      applyTheme();
      renderMore();
      return;
    }
    if (act === "goal") {
      state.settings.goal = Number(el.dataset.g);
      save();
      renderMore();
      return;
    }
    if (act === "gfilter") {
      const val = document.getElementById("glossarySearch");
      location.hash =
        "#/glossary?course=" + el.dataset.id + (val && val.value ? "&q=" + encodeURIComponent(val.value) : "");
      return;
    }
    if (act === "vfilter") {
      location.hash = "#/videos?course=" + el.dataset.id;
      return;
    }
    if (act === "add-video") {
      const title = document.getElementById("vTitle").value.trim();
      const url = document.getElementById("vUrl").value.trim();
      const course = document.getElementById("vCourse").value;
      if (!title || !url) return toast("Заполните название и ссылку");
      if (!/^https?:\/\//i.test(url)) return toast("Ссылка должна начинаться с http");
      state.myVideos.unshift({ title: title, url: url, course: course });
      save();
      toast("Видео сохранено");
      route();
      return;
    }
    if (act === "del-video") {
      state.myVideos.splice(Number(el.dataset.i), 1);
      save();
      route();
      return;
    }
    if (act === "add-source") {
      const title = document.getElementById("srcTitle").value.trim();
      const url = document.getElementById("srcUrl").value.trim();
      const feed = document.getElementById("srcFeed").value.trim();
      const region = document.getElementById("srcRegion").value;
      if (!title || !url) return toast("Заполните название и ссылку");
      if (!/^https?:\/\//i.test(url)) return toast("Ссылка должна начинаться с http");
      if (feed && !/^https?:\/\//i.test(feed)) return toast("Ссылка на ленту должна начинаться с http");
      state.mySources = state.mySources || [];
      state.mySources.unshift({
        id: "my-" + Date.now(),
        title: title,
        url: url,
        feed: feed,
        region: region
      });
      save();
      toast("Источник сохранён");
      route();
      return;
    }
    if (act === "del-source") {
      const id = el.dataset.id;
      state.mySources = (state.mySources || []).filter((s) => s.id !== id);
      save();
      route();
      return;
    }
    if (act === "news-refresh") {
      const params = new URLSearchParams((location.hash.split("?")[1] || ""));
      refreshFeed(params.get("region") || "ru", false);
      return;
    }
    if (act === "add-project" || act === "new-project") {
      const input = document.getElementById("projName");
      if (!input) {
        const name = prompt("Название проекта");
        if (!name || !name.trim()) return;
        if (state.checkProjects.some((p) => p.name.toLowerCase() === name.trim().toLowerCase())) {
          return toast("Проект с таким названием уже есть");
        }
        const id = "p-" + Date.now();
        state.checkProjects.push({ id: id, name: name.trim() });
        state.checkCurrent = id;
        save();
        route();
        return;
      }
      const name = input.value.trim();
      if (!name) return toast("Введите название проекта");
      if (state.checkProjects.some((p) => p.name.toLowerCase() === name.toLowerCase())) {
        return toast("Проект с таким названием уже есть");
      }
      const id = "p-" + Date.now();
      state.checkProjects.push({ id: id, name: name });
      state.checkCurrent = id;
      save();
      toast("Проект создан");
      route();
      return;
    }
    if (act === "pick-project") {
      state.checkCurrent = el.dataset.id;
      save();
      return;
    }
    if (act === "del-project") {
      const p = currentProject();
      if (!p) return;
      if (!confirm("Удалить проект «" + p.name + "» вместе с отметками?")) return;
      state.checkProjects = state.checkProjects.filter((x) => x.id !== p.id);
      delete state.checkDone[p.id];
      state.checkCurrent = state.checkProjects.length ? state.checkProjects[0].id : "";
      save();
      toast("Проект удалён");
      route();
      return;
    }
    if (act === "toggle-check") {
      const p = currentProject();
      if (!p) return;
      const id = el.dataset.id;
      state.checkDone[p.id] = state.checkDone[p.id] || {};
      const on = !state.checkDone[p.id][id];
      if (on) state.checkDone[p.id][id] = 1;
      else delete state.checkDone[p.id][id];
      save();
      // Обновляем только то, что изменилось: полная перерисовка сбрасывала бы
      // прокрутку в начало на каждой галочке.
      el.classList.toggle("on", on);
      updateCheckCounters();
      return;
    }
    if (act === "reset-check") {
      const p = currentProject();
      if (!p) return;
      const list = CHECKLISTS.filter((c) => c.id === el.dataset.id)[0];
      if (!list) return;
      if (!confirm("Снять все отметки в списке «" + list.title + "»?")) return;
      const done = state.checkDone[p.id] || {};
      checkItems(list).forEach((i) => delete done[i.id]);
      save();
      toast("Отметки сняты");
      route();
      return;
    }
    if (act === "start-cards") {
      if (!startCards(el.dataset.course)) return toast("Все термины этого курса на повторении — вернитесь позже");
      renderCard();
      window.scrollTo(0, 0);
      return;
    }
    if (act === "card-show") {
      cardSession.shown = true;
      return renderCard();
    }
    if (act === "card-known") return answerCard(true);
    if (act === "card-unknown") return answerCard(false);
    if (act === "card-quit") {
      cardSession = null;
      location.hash = "#/more";
      return;
    }
    if (act === "start-drill") {
      if (!startDrill(el.dataset.course)) return toast("Для этой программы мало сочетаний в базе");
      renderDrillQuestion();
      window.scrollTo(0, 0);
      return;
    }
    if (act === "drill-pick") {
      if (drill.sel !== null) return;
      drill.sel = el.dataset.k;
      drill.times.push(Date.now() - (drill.shownAt || Date.now()));
      if (drill.sel === drill.items[drill.idx].keys) drill.correct++;
      return renderDrillQuestion();
    }
    if (act === "drill-next") {
      drill.idx++;
      drill.sel = null;
      if (drill.idx >= drill.items.length) {
        state.xp += drill.correct * 2;
        save();
        return renderDrill();
      }
      return renderDrillQuestion();
    }
    if (act === "drill-quit") {
      drill = null;
      location.hash = "#/keys";
      return;
    }
    if (act === "test-feeds") {
      const val = document.getElementById("newsProxy").value.trim();
      if (val && !/^https?:\/\//i.test(val)) return toast("Адрес должен начинаться с http");
      state.settings.newsProxy = val;
      save();
      if (!feedSources().length) return toast("Сначала добавьте источник со ссылкой на RSS");
      toast("Проверяю…");
      loadFeeds().then((data) => {
        const ok = (data.perSource || []).filter((s) => s.ok);
        const bad = (data.perSource || []).filter((s) => !s.ok);
        toast(
          ok.length
            ? "Работает: " + ok.length + " из " + (ok.length + bad.length) + ". Записей: " + data.items.length
            : "Ни одна лента не ответила. Подробности — во вкладке «Новости»"
        );
      });
      return;
    }
    if (act === "save-proxy") {
      const val = document.getElementById("newsProxy").value.trim();
      if (val && !/^https?:\/\//i.test(val)) return toast("Адрес должен начинаться с http");
      state.settings.newsProxy = val;
      save();
      toast(val ? "Прокси сохранён" : "Лента отключена");
      return;
    }
    if (act === "export") return exportData();
    if (act === "import") {
      const f = document.getElementById("importFile");
      f.onchange = importData;
      f.click();
      return;
    }
    if (act === "install") {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt = null;
      } else {
        toast("На iPhone: «Поделиться» → «На экран Домой»");
      }
      return;
    }
    if (act === "reset") {
      if (confirm("Удалить весь прогресс: уроки, статистику, закладки и ошибки?")) {
        state = defaultState();
        state.resetAt = Date.now();
        save();
        applyTheme();
        toast("Прогресс сброшен");
        location.hash = "#/";
        route();
      }
      return;
    }
  });

  // запоминаем открытые термины (для достижения)
  document.addEventListener("toggle", (e) => {
    const d = e.target;
    if (!d.classList || !d.classList.contains("term") || !d.open) return;
    const term = d.dataset.term;
    if (term && state.terms.indexOf(term) < 0) {
      state.terms.push(term);
      save();
    }
  }, true);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && document.getElementById("zoom")) return closeZoom();
    const actor = e.target.closest && e.target.closest('[data-act="stage-tap"]');
    if (actor && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      return stageTap(Number(actor.dataset.i));
    }
    const hero = e.target.closest && e.target.closest('[data-act="hero-tap"]');
    if (hero && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      return heroSay();
    }
    const fig = e.target.closest && e.target.closest('[data-act="zoom-fig"]');
    if (fig && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      return openZoom(fig.dataset.fig, fig);
    }
    // В блице с клавиатуры: стрелка влево — «верно», вправо — «неверно».
    if (game && game.kind === "blitz" && !game.finished && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
      e.preventDefault();
      return blitzPick(e.key === "ArrowLeft" ? 1 : 0);
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    if (e.target && e.target.id === "syncEmail") return syncSendCode();
    if (e.target && e.target.id === "otpCode") return syncVerify();
    if (e.target && e.target.id === "passValue") return syncLoginPass();
    if (e.target && e.target.id === "newPass") return syncSetPass();
    if (!quiz) return;
    const nextBtn = document.querySelector('[data-act="next"]');
    if (nextBtn) {
      e.preventDefault();
      nextQuestion();
      return;
    }
    const checkBtn = document.querySelector('[data-act="check"]');
    if (checkBtn) {
      e.preventDefault();
      checkAnswer();
    }
  });

  function exportData() {
    const data = JSON.stringify({ app: "bim-academy", version: APP_VERSION, savedAt: new Date().toISOString(), state: state }, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "bim-academy-progress-" + todayKey() + ".json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1500);
    toast("Файл прогресса сохранён");
  }

  function importData(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        const incoming = parsed.state || parsed;
        if (!incoming || typeof incoming !== "object") throw new Error("bad");
        state = Object.assign(defaultState(), incoming);
        save();
        applyTheme();
        toast("Прогресс загружен");
        route();
      } catch (err) {
        toast("Не удалось прочитать файл");
      }
    };
    reader.readAsText(file);
  }

  /* ================= тема ================= */

  function applyTheme() {
    const mode = state.settings.theme;
    const dark = mode === "dark" || (mode === "auto" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  }

  themeBtn.addEventListener("click", () => {
    const order = ["auto", "light", "dark"];
    const cur = order.indexOf(state.settings.theme);
    state.settings.theme = order[(cur + 1) % order.length];
    save();
    applyTheme();
    toast(
      state.settings.theme === "auto" ? "Тема: как в системе" : state.settings.theme === "light" ? "Светлая тема" : "Тёмная тема"
    );
    if (currentRoute()[0] === "more") renderMore();
  });

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", applyTheme);

  /* ================= шапка: поиск, уведомления, профиль ================= */

  const topSearch = document.getElementById("topSearch");
  if (topSearch)
    topSearch.addEventListener("submit", (e) => {
      e.preventDefault();
      const inp = document.getElementById("topSearchInput");
      const q = inp.value.trim();
      location.hash = "#/search" + (q ? "?q=" + encodeURIComponent(q) : "");
      inp.value = "";
      inp.blur();
    });

  function updateUserChip() {
    const el = document.getElementById("userChip");
    if (!el) return;
    const full = (state.settings.name || "").trim();
    const ini = full
      ? full
          .split(/\s+/)
          .slice(0, 2)
          .map((w) => w[0])
          .join("")
          .toUpperCase()
      : "BA";
    el.innerHTML =
      '<span class="uc-ava">' + esc(ini) + '</span><span class="uc-text"><b>' + esc(full || "Гость") + "</b><small>" + esc(rank().cur.title) + "</small></span>";
  }

  function bellItems() {
    const k = todayKey();
    const items = [];
    const due = dueMistakes().length;
    if (due) items.push(["#/quiz/mistakes/all", "🎯", due + " " + plural(due, "ошибка ждёт", "ошибки ждут", "ошибок ждут") + " повтора"]);
    const rv = reviewLessons().length;
    if (rv) items.push(["#/review", "↻", rv + " " + plural(rv, "тема выцветает", "темы выцветают", "тем выцветают") + " — пора повторить"]);
    const qLeft = todayQuests(k).filter((q) => (state.quests[k] || []).indexOf(q.id) < 0).length;
    if (qLeft) items.push(["#/", "✅", "Задания на сегодня: осталось " + qLeft + " из 3"]);
    const cards = dueCards().length;
    if (cards) items.push(["#/cards", "🃏", cards + " " + plural(cards, "карточка", "карточки", "карточек") + " к повтору"]);
    if (!(todayStats().daily > 0)) items.push(["#/quiz/daily/1", "⚡", "Тренировка дня ещё не пройдена"]);
    return items;
  }

  function updateBell() {
    const dot = document.getElementById("bellDot");
    if (dot) dot.hidden = bellItems().length === 0;
  }

  function closeBell() {
    const pop = document.getElementById("bellPop");
    const btn = document.getElementById("bellBtn");
    if (pop) pop.hidden = true;
    if (btn) btn.setAttribute("aria-expanded", "false");
  }

  const bellBtn = document.getElementById("bellBtn");
  if (bellBtn)
    bellBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const pop = document.getElementById("bellPop");
      if (!pop.hidden) return closeBell();
      const items = bellItems();
      pop.innerHTML =
        '<b class="bp-head">Уведомления</b>' +
        (items.length
          ? items.map((x) => '<a class="bp-item" href="' + x[0] + '"><span>' + x[1] + "</span>" + esc(x[2]) + "</a>").join("")
          : '<p class="bp-empty">Всё сделано — на сегодня новостей нет 🎉</p>');
      pop.hidden = false;
      bellBtn.setAttribute("aria-expanded", "true");
    });
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".bell-pop")) closeBell();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeBell();
  });

  /* ================= маршрутизация ================= */

  function setTop(title, sub) {
    topTitle.textContent = title;
    topSubtitle.textContent = sub || "";
  }

  function currentRoute() {
    const raw = location.hash.replace(/^#\/?/, "");
    const [path, search] = raw.split("?");
    const parts = path.split("/").filter(Boolean);
    return [parts[0] || "home", parts[1], parts[2], new URLSearchParams(search || "")];
  }

  const TAB_ROUTES = { home: "home", courses: "courses", tests: "tests", videos: "videos", news: "news", more: "more" };

  function route() {
    document.body.dataset.route = currentRoute()[0];
    closeBell();
    updateBell();
    updateUserChip();
    if (/access_token=|error_description=/.test(location.hash)) {
      const err = /error_description=([^&]+)/.exec(location.hash);
      setTop("Вход", "синхронизация");
      view.innerHTML = err
        ? '<div class="empty"><span class="em">⚠️</span><b>Ссылка не сработала</b><p class="muted small mt">' +
          esc(decodeURIComponent(err[1].replace(/\+/g, " "))) +
          '</p><a class="btn primary mt" href="#/more">Запросить новое письмо</a></div>'
        : '<div class="empty"><span class="em">☁️</span><b>Выполняю вход…</b></div>';
      return;
    }
    const [name, a, b, params] = currentRoute();
    closeZoom();
    if (name !== "games" && game) stopGame();
    if (name !== "home") {
      clearInterval(heroTimer);
      stopStage();
    }

    document.querySelectorAll(".tab").forEach((t) => {
      t.classList.toggle("active", (TAB_ROUTES[name] || name) === t.dataset.tab);
    });
    backBtn.hidden = !!TAB_ROUTES[name];

    switch (name) {
      case "home":
        renderHome();
        break;
      case "courses":
        renderCourses();
        break;
      case "course":
        renderCourse(a);
        break;
      case "lesson":
        renderLesson(a);
        break;
      case "tests":
        renderTests();
        break;
      case "quiz":
        startQuiz(a, b);
        break;
      case "videos":
        renderVideos(params);
        break;
      case "glossary":
        renderGlossary(params);
        break;
      case "search":
        renderSearch(params);
        break;
      case "keys":
        renderKeys();
        break;
      case "news":
        renderNews(params);
        break;
      case "checks":
        renderChecks(params);
        break;
      case "warnings":
        renderWarnings(params);
        break;
      case "cards":
        renderCards(params);
        break;
      case "drill":
        renderDrill(params);
        break;
      case "games":
        renderGames();
        break;
      case "interview":
        renderInterview();
        break;
      case "review":
        renderReview();
        break;
      case "ranks":
        renderRanks();
        break;
      case "vocab":
        renderVocab(params);
        break;
      case "sim":
        renderSim(a);
        break;
      case "cases":
        renderCases();
        break;
      case "case":
        caseRun = null;
        renderCase(a);
        break;
      case "paths":
        renderPaths();
        break;
      case "path":
        renderPath(a);
        break;
      case "cert":
        renderCert(a, b);
        break;
      case "bookmarks":
        renderBookmarks();
        break;
      case "more":
        renderMore();
        break;
      default:
        renderNotFound();
    }
    window.scrollTo(0, 0);
  }

  backBtn.addEventListener("click", () => {
    if (history.length > 1) history.back();
    else location.hash = "#/";
  });

  window.addEventListener("hashchange", route);
  let resizeTimer = null;
  let wasDesktop = window.matchMedia && matchMedia("(min-width: 1024px)").matches;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const desk = matchMedia("(min-width: 1024px)").matches;
      if (desk !== wasDesktop && currentRoute()[0] === "home") renderHome();
      wasDesktop = desk;
    }, 200);
  });

  /* ================= PWA ================= */

  let deferredPrompt = null;
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
  });

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    });
  }

  /* ================= запуск ================= */

  applyTheme();
  initSync();
  if (!location.hash) location.hash = "#/";
  route();
})();
