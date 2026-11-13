(() => {
  const el = id => document.getElementById(id);
  const courses = window.BIM_CONTENT.courses;
  const selected = () => courses.find(c => c.id === el("course").value);
  const current = () => selected().lessons.find(l => l.id === el("lesson").value);
  const edits = [...window.BIM_EDITS];
  for (const course of courses) el("course").add(new Option(course.title, course.id));
  for (let i = 0; i < 6; i++) {
    const row = document.createElement("section");
    row.innerHTML = '<label>Утверждение ' + (i+1) + '<input required></label><select aria-label="Ответ"><option>Верно</option><option>Неверно</option></select><label>Почему?<input required></label>';
    el("questions").append(row);
  }
  function preview() {
    el("preview").textContent = [el("titleText").value, el("goal").value, el("bodyText").value].join("\n\n");
  }
  function fill() {
    const lesson = current();
    el("questions").hidden = el("questions").disabled = !!lesson;
    el("titleText").value = lesson?.title || "";
    el("goal").value = lesson?.goal || "";
    el("bodyText").value = (lesson?.blocks || []).filter(b => b.type === "text").map(b => b.text).join("\n");
    preview();
  }
  function list() {
    el("lesson").replaceChildren(...selected().lessons.map(l => new Option(l.title, l.id)), new Option("Новый урок", ""));
    fill();
  }
  el("course").onchange = list;
  el("lesson").onchange = fill;
  el("edit").oninput = preview;
  el("edit").onsubmit = e => {
    e.preventDefault();
    const existing = current();
    const lesson = structuredClone(existing || {id: "lesson-" + crypto.randomUUID(), minutes: 10, level: "Базовый", blocks: [], terms: [], tags: []});
    lesson.title = el("titleText").value.trim();
    lesson.goal = el("goal").value.trim();
    const paragraphs = el("bodyText").value.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
    lesson.blocks = lesson.blocks.flatMap(b => b.type !== "text" ? [b] : paragraphs.length ? [{...b, text: paragraphs.shift()}] : []);
    lesson.blocks.push(...paragraphs.map(text => ({type:"text", text})));
    if (!lesson.blocks.length) { el("status").textContent = "Добавьте текст урока."; return; }
    if (!existing) lesson.questions = [...el("questions").children].filter(r => r.tagName === "SECTION").map(r => {
      const [q, why] = r.querySelectorAll("input");
      return {type: "bool", q: q.value.trim(), explain: why.value.trim(), answer: r.querySelector("select").selectedIndex === 0};
    });
    const course = selected();
    if (existing) course.lessons[course.lessons.indexOf(existing)] = lesson;
    else course.lessons.push(lesson);
    const record = {course: course.id, lesson};
    const index = edits.findIndex(r => r.lesson.id === lesson.id);
    if (index < 0) edits.push(record); else edits[index] = record;
    const code = "window.BIM_EDITS = " + JSON.stringify(edits, null, 2) + ";\n" +
      "for (const {course, lesson} of window.BIM_EDITS) { const c = window.BIM_CONTENT.courses.find(c => c.id === course); const i = c.lessons.findIndex(l => l.id === lesson.id); if (i < 0) c.lessons.push(lesson); else c.lessons[i] = lesson; }\n";
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([code], {type:"text/javascript"}));
    a.download = "editor-changes.js"; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    list(); el("lesson").value = lesson.id; fill();
    el("status").textContent = "Файл изменений подготовлен.";
  };
  list();
})();
