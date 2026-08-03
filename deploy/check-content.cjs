#!/usr/bin/env node
// Проверка данных приложения перед выгрузкой.
// Запуск: node deploy/check-content.cjs
//
// Ловит то, что иначе всплывёт уже у пользователя: битые ссылки на схемы,
// вопросы без объяснения, неверные индексы ответов, видео и термины,
// указывающие на несуществующие уроки и курсы.

const path = require("path");
const fs = require("fs");

const root = path.join(__dirname, "..");
global.window = {};

const files = [
  "data/figures.js",
  "data/course-bim.js",
  "data/course-revit.js",
  "data/course-navisworks.js",
  "data/course-autocad.js",
  "data/course-civil3d.js",
  "data/course-practice.js",
  "data/course-manager.js",
  "data/course-software.js",
  "data/glossary.js",
  "data/videos.js",
  "data/news.js"
];

// Все ли файлы данных подключены в index.html и закэшированы service worker'ом.
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const sw = fs.readFileSync(path.join(root, "sw.js"), "utf8");

const errors = [];
files.forEach((f) => {
  if (!fs.existsSync(path.join(root, f))) return errors.push("нет файла " + f);
  require(path.join(root, f));
  if (!html.includes(f)) errors.push(f + " не подключён в index.html");
  if (!sw.includes("./" + f)) errors.push(f + " не добавлен в APP_SHELL в sw.js");
});

const C = global.window.BIM_CONTENT;
const F = global.window.BIM_FIGURES || {};
const figures = new Set(Object.keys(F));
const courseIds = new Set(C.courses.map((c) => c.id));
const lessonIds = new Set();

C.courses.forEach((course) => {
  if (!course.title || !course.icon) errors.push("курс " + course.id + ": нет title или icon");
  course.lessons.forEach((lesson) => {
    const tag = lesson.id;
    if (lessonIds.has(tag)) errors.push("дублируется id урока: " + tag);
    lessonIds.add(tag);
    if (!lesson.title) errors.push(tag + ": нет заголовка");
    if (!lesson.goal) errors.push(tag + ": нет цели урока");

    (lesson.blocks || []).forEach((b) => {
      if (b.type === "figure" && !figures.has(b.figure)) {
        errors.push(tag + ": ссылка на несуществующую схему " + b.figure);
      }
      if (b.type === "table" && b.rows) {
        b.rows.forEach((r, i) => {
          if (b.head && r.length !== b.head.length) {
            errors.push(tag + ": в таблице строка " + i + " не совпадает с заголовком по числу столбцов");
          }
        });
      }
    });

    (lesson.questions || []).forEach((q, i) => {
      const qt = tag + " вопрос " + (i + 1);
      if (!q.q) errors.push(qt + ": нет текста");
      if (!q.explain) errors.push(qt + ": нет объяснения");
      if (!["single", "multi", "bool", "input"].includes(q.type)) {
        errors.push(qt + ": неизвестный тип " + q.type);
        return;
      }
      if (q.type === "single") {
        if (!Array.isArray(q.options) || q.options.length < 2) errors.push(qt + ": нужно минимум два варианта");
        else if (typeof q.answer !== "number" || q.answer < 0 || q.answer >= q.options.length) {
          errors.push(qt + ": индекс ответа вне списка вариантов");
        }
      }
      if (q.type === "multi") {
        if (!Array.isArray(q.answer) || !q.answer.length) errors.push(qt + ": пустой список верных ответов");
        else if (q.answer.some((a) => a < 0 || a >= (q.options || []).length)) {
          errors.push(qt + ": индекс ответа вне списка вариантов");
        }
      }
      if (q.type === "bool" && typeof q.answer !== "boolean") errors.push(qt + ": ответ должен быть true или false");
      if (q.type === "input" && (!Array.isArray(q.answer) || !q.answer.length)) {
        errors.push(qt + ": нужен список допустимых ответов");
      }
    });
  });
});

C.videos.forEach((v) => {
  if (!courseIds.has(v.course)) errors.push("видео " + v.id + ": нет курса " + v.course);
  if (v.lesson && !lessonIds.has(v.lesson)) errors.push("видео " + v.id + ": нет урока " + v.lesson);
  if (!v.query) errors.push("видео " + v.id + ": нет поискового запроса");
});

const terms = C.glossary.map((g) => g.term.toLowerCase());
C.glossary.forEach((g) => {
  if (!courseIds.has(g.course)) errors.push('термин "' + g.term + '": нет курса ' + g.course);
  if (!g.text) errors.push('термин "' + g.term + '": нет определения');
});

const orphanTerms = new Set();
C.courses.forEach((c) =>
  c.lessons.forEach((l) =>
    (l.terms || []).forEach((t) => {
      const lower = t.toLowerCase();
      if (!terms.some((g) => g.includes(lower) || lower.includes(g))) orphanTerms.add(t);
    })
  )
);

const news = C.news || { sources: [], timeline: [] };
const seenSources = new Set();
news.sources.forEach((s) => {
  if (seenSources.has(s.id)) errors.push("источник новостей: дублируется id " + s.id);
  seenSources.add(s.id);
  if (!s.title || !s.url) errors.push("источник " + s.id + ": нет названия или ссылки");
  if (!/^https?:\/\//.test(s.url || "")) errors.push("источник " + s.id + ": ссылка должна начинаться с http");
  if (s.feed && !/^https?:\/\//.test(s.feed)) errors.push("источник " + s.id + ": некорректная ссылка на ленту");
  if (!["ru", "world"].includes(s.region)) errors.push("источник " + s.id + ": region должен быть ru или world");
});
news.timeline.forEach((t, i) => {
  if (!t.year || !t.title || !t.text) errors.push("хронология, запись " + (i + 1) + ": нет года, заголовка или текста");
  if (!["ru", "world"].includes(t.region)) errors.push("хронология, запись " + (i + 1) + ": region должен быть ru или world");
});

const lessons = C.courses.reduce((a, c) => a + c.lessons.length, 0);
const questions = C.courses.reduce((a, c) => a + c.lessons.reduce((b, l) => b + l.questions.length, 0), 0);

console.log(
  "Курсов: " + C.courses.length +
  " | уроков: " + lessons +
  " | вопросов: " + questions +
  " | терминов: " + C.glossary.length +
  " | видео: " + C.videos.length +
  " | схем: " + figures.size +
  " | источников новостей: " + news.sources.length
);

if (orphanTerms.size) {
  console.log("Предупреждение — термины уроков без статьи в глоссарии: " + [...orphanTerms].join(", "));
}

if (errors.length) {
  console.error("\nОшибки (" + errors.length + "):");
  errors.forEach((e) => console.error("  - " + e));
  process.exit(1);
}

console.log("Проверка пройдена.");
