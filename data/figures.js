// Схемы-иллюстрации к урокам. Все цвета берутся из CSS-переменных,
// поэтому картинки одинаково читаются в светлой и тёмной теме.
window.BIM_FIGURES = {
  "bim-vs-cad": `
<svg viewBox="0 0 640 300" role="img" aria-label="Отличие чертежа CAD от информационной модели">
  <text class="f-title" x="20" y="26">CAD: набор линий</text>
  <rect class="f-box" x="20" y="44" width="270" height="200" rx="10"/>
  <path class="f-line" d="M60 90h190M60 90v110M250 90v110M60 200h190"/>
  <path class="f-line" d="M100 200v-40h50v40"/>
  <text class="f-dim" x="60" y="230">линия = просто геометрия</text>
  <text class="f-dim" x="60" y="76">толщина, слой, цвет</text>

  <text class="f-title" x="350" y="26">BIM: объект + данные</text>
  <rect class="f-box" x="350" y="44" width="270" height="200" rx="10"/>
  <rect class="f-fill" x="380" y="90" width="110" height="110" rx="4"/>
  <path class="f-accent" d="M380 90h110v110H380z"/>
  <path class="f-accent" d="M490 145h40"/>
  <circle class="f-dot" cx="534" cy="145" r="5"/>
  <text class="f-txt" x="500" y="110">Стена</text>
  <text class="f-dim" x="500" y="128">тип: КР-200</text>
  <text class="f-dim" x="500" y="162">материал: ЖБ</text>
  <text class="f-dim" x="500" y="178">объём: 4,4 м³</text>
  <text class="f-dim" x="500" y="194">этаж: 2</text>
  <text class="f-dim" x="380" y="230">геометрия + свойства + связи</text>
</svg>`,

  "bim-lifecycle": `
<svg viewBox="0 0 640 320" role="img" aria-label="Жизненный цикл объекта и роль модели">
  <circle class="f-ring" cx="320" cy="160" r="112"/>
  <circle class="f-fill" cx="320" cy="160" r="58"/>
  <text class="f-txt f-center" x="320" y="155">Единая</text>
  <text class="f-txt f-center" x="320" y="174">модель</text>
  <g class="f-node">
    <rect class="f-box" x="240" y="10" width="160" height="40" rx="10"/>
    <text class="f-txt f-center" x="320" y="35">1. Концепция и ТЗ</text>
  </g>
  <g class="f-node">
    <rect class="f-box" x="452" y="140" width="176" height="40" rx="10"/>
    <text class="f-txt f-center" x="540" y="165">2. Проектирование</text>
  </g>
  <g class="f-node">
    <rect class="f-box" x="240" y="270" width="160" height="40" rx="10"/>
    <text class="f-txt f-center" x="320" y="295">3. Строительство</text>
  </g>
  <g class="f-node">
    <rect class="f-box" x="14" y="140" width="176" height="40" rx="10"/>
    <text class="f-txt f-center" x="102" y="165">4. Эксплуатация</text>
  </g>
  <path class="f-arrow" d="M404 40q70 20 96 96"/>
  <path class="f-arrow" d="M540 186q-24 84-140 100"/>
  <path class="f-arrow" d="M240 288Q120 268 100 186"/>
  <path class="f-arrow" d="M104 134Q126 46 240 32"/>
</svg>`,

  "lod-scale": `
<svg viewBox="0 0 640 250" role="img" aria-label="Уровни проработки LOD от 100 до 500">
  <g>
    <rect class="f-fill" x="24" y="120" width="70" height="70" rx="3"/>
    <text class="f-txt f-center" x="59" y="212">LOD 100</text>
    <text class="f-dim f-center" x="59" y="230">объём-масса</text>
  </g>
  <g>
    <rect class="f-fill" x="150" y="96" width="70" height="94" rx="3"/>
    <path class="f-accent" d="M150 96h70v94h-70z"/>
    <text class="f-txt f-center" x="185" y="212">LOD 200</text>
    <text class="f-dim f-center" x="185" y="230">габариты</text>
  </g>
  <g>
    <rect class="f-fill" x="276" y="80" width="70" height="110" rx="3"/>
    <path class="f-accent" d="M276 80h70v110h-70zM276 110h70M276 160h70"/>
    <text class="f-txt f-center" x="311" y="212">LOD 300</text>
    <text class="f-dim f-center" x="311" y="230">точная геометрия</text>
  </g>
  <g>
    <rect class="f-fill" x="402" y="66" width="70" height="124" rx="3"/>
    <path class="f-accent" d="M402 66h70v124h-70zM402 96h70M402 130h70M402 160h70M437 66v124"/>
    <text class="f-txt f-center" x="437" y="212">LOD 400</text>
    <text class="f-dim f-center" x="437" y="230">узлы, монтаж</text>
  </g>
  <g>
    <rect class="f-fill" x="528" y="66" width="70" height="124" rx="3"/>
    <path class="f-accent" d="M528 66h70v124h-70zM528 96h70M528 130h70M528 160h70M563 66v124"/>
    <circle class="f-dot" cx="598" cy="66" r="6"/>
    <text class="f-txt f-center" x="563" y="212">LOD 500</text>
    <text class="f-dim f-center" x="563" y="230">как построено</text>
  </g>
  <path class="f-arrow" d="M24 40h570"/>
  <text class="f-dim" x="24" y="30">геометрия и объём информации растут</text>
</svg>`,

  "ifc-exchange": `
<svg viewBox="0 0 640 330" role="img" aria-label="Обмен данными через IFC и среду общего доступа">
  <rect class="f-fill" x="230" y="130" width="180" height="70" rx="14"/>
  <path class="f-accent" d="M230 130h180v70H230z"/>
  <text class="f-txt f-center" x="320" y="160">СОД / CDE</text>
  <text class="f-dim f-center" x="320" y="182">общая среда данных</text>

  <rect class="f-box" x="20" y="24" width="150" height="48" rx="10"/>
  <text class="f-txt f-center" x="95" y="53">Revit (АР, КР)</text>
  <rect class="f-box" x="470" y="24" width="150" height="48" rx="10"/>
  <text class="f-txt f-center" x="545" y="53">Civil 3D (ГП)</text>
  <rect class="f-box" x="20" y="258" width="150" height="48" rx="10"/>
  <text class="f-txt f-center" x="95" y="287">Navisworks</text>
  <rect class="f-box" x="470" y="258" width="150" height="48" rx="10"/>
  <text class="f-txt f-center" x="545" y="287">Заказчик / стройка</text>

  <path class="f-arrow" d="M170 60q80 20 60 74"/>
  <path class="f-arrow" d="M470 60q-80 20-60 74"/>
  <path class="f-arrow" d="M230 200q-80 20-60 62"/>
  <path class="f-arrow" d="M410 200q80 20 60 62"/>
  <text class="f-dim" x="176" y="110">IFC / RVT</text>
  <text class="f-dim" x="404" y="110">IFC / DWG</text>
  <text class="f-dim" x="140" y="240">NWC</text>
  <text class="f-dim" x="424" y="240">IFC / BCF / PDF</text>
</svg>`,

  "clash-flow": `
<svg viewBox="0 0 640 240" role="img" aria-label="Цикл поиска и устранения коллизий">
  <g><rect class="f-box" x="10" y="40" width="130" height="56" rx="10"/><text class="f-txt f-center" x="75" y="66">1. Выдача</text><text class="f-dim f-center" x="75" y="84">моделей в СОД</text></g>
  <g><rect class="f-box" x="170" y="40" width="130" height="56" rx="10"/><text class="f-txt f-center" x="235" y="66">2. Сводная</text><text class="f-dim f-center" x="235" y="84">модель (NWD)</text></g>
  <g><rect class="f-fill" x="330" y="40" width="130" height="56" rx="10"/><path class="f-accent" d="M330 40h130v56H330z"/><text class="f-txt f-center" x="395" y="66">3. Проверка</text><text class="f-dim f-center" x="395" y="84">Clash Detective</text></g>
  <g><rect class="f-box" x="490" y="40" width="140" height="56" rx="10"/><text class="f-txt f-center" x="560" y="66">4. Отчёт</text><text class="f-dim f-center" x="560" y="84">BCF / HTML</text></g>
  <g><rect class="f-box" x="330" y="150" width="130" height="56" rx="10"/><text class="f-txt f-center" x="395" y="176">5. Исправление</text><text class="f-dim f-center" x="395" y="194">в своей модели</text></g>
  <g><rect class="f-box" x="170" y="150" width="130" height="56" rx="10"/><text class="f-txt f-center" x="235" y="176">6. Перепроверка</text><text class="f-dim f-center" x="235" y="194">статус Resolved</text></g>
  <path class="f-arrow" d="M140 68h26M300 68h26M460 68h26"/>
  <path class="f-arrow" d="M560 96v40q0 14-14 14h-84"/>
  <path class="f-arrow" d="M330 178h-26"/>
  <path class="f-arrow" d="M235 150V116q0-14-14-14h-70V96"/>
</svg>`,

  "roles": `
<svg viewBox="0 0 640 250" role="img" aria-label="Роли в BIM-проекте">
  <rect class="f-fill" x="220" y="12" width="200" height="52" rx="12"/>
  <path class="f-accent" d="M220 12h200v52H220z"/>
  <text class="f-txt f-center" x="320" y="36">BIM-менеджер</text>
  <text class="f-dim f-center" x="320" y="55">стандарт, BEP, обучение</text>

  <rect class="f-box" x="220" y="100" width="200" height="52" rx="12"/>
  <text class="f-txt f-center" x="320" y="124">BIM-координатор</text>
  <text class="f-dim f-center" x="320" y="143">сборка, коллизии, регламент</text>

  <rect class="f-box" x="20" y="188" width="180" height="52" rx="12"/>
  <text class="f-txt f-center" x="110" y="212">Моделлер АР/КР</text>
  <text class="f-dim f-center" x="110" y="231">модель и оформление</text>
  <rect class="f-box" x="230" y="188" width="180" height="52" rx="12"/>
  <text class="f-txt f-center" x="320" y="212">Моделлер ИОС</text>
  <text class="f-dim f-center" x="320" y="231">сети и оборудование</text>
  <rect class="f-box" x="440" y="188" width="180" height="52" rx="12"/>
  <text class="f-txt f-center" x="530" y="212">Смежники</text>
  <text class="f-dim f-center" x="530" y="231">ГП, ПОС, сметы</text>

  <path class="f-arrow" d="M320 64v34"/>
  <path class="f-arrow" d="M320 152v12q0 12-12 12h-88v10"/>
  <path class="f-arrow" d="M320 152v34"/>
  <path class="f-arrow" d="M320 152v12q0 12 12 12h88v10"/>
</svg>`,

  "revit-ui": `
<svg viewBox="0 0 640 340" role="img" aria-label="Схема окна Revit">
  <rect class="f-box" x="10" y="10" width="620" height="320" rx="12"/>
  <rect class="f-fill" x="10" y="10" width="620" height="46" rx="12"/>
  <text class="f-txt" x="26" y="32">Лента (Ribbon): вкладки и панели инструментов</text>
  <text class="f-dim" x="26" y="48">Архитектура · Конструкция · Инженерные системы · Аннотации · Вид</text>

  <rect class="f-box" x="24" y="70" width="160" height="180" rx="8"/>
  <text class="f-txt" x="36" y="94">Браузер проекта</text>
  <text class="f-dim" x="36" y="118">Виды (планы)</text>
  <text class="f-dim" x="36" y="138">Разрезы, фасады</text>
  <text class="f-dim" x="36" y="158">Спецификации</text>
  <text class="f-dim" x="36" y="178">Листы</text>
  <text class="f-dim" x="36" y="198">Семейства</text>
  <text class="f-dim" x="36" y="218">Группы, связи</text>

  <rect class="f-box" x="200" y="70" width="250" height="220" rx="8"/>
  <text class="f-txt f-center" x="325" y="94">Область рисования</text>
  <path class="f-accent" d="M240 130h170M240 130v120M410 130v120M240 250h170"/>
  <path class="f-line" d="M280 250v-50h60v50"/>
  <text class="f-dim f-center" x="325" y="278">активный вид</text>

  <rect class="f-box" x="466" y="70" width="150" height="140" rx="8"/>
  <text class="f-txt" x="478" y="94">Свойства</text>
  <text class="f-dim" x="478" y="118">Тип элемента</text>
  <text class="f-dim" x="478" y="138">Параметры</text>
  <text class="f-dim" x="478" y="158">экземпляра</text>
  <text class="f-dim" x="478" y="186">Изменить тип...</text>

  <rect class="f-box" x="466" y="226" width="150" height="64" rx="8"/>
  <text class="f-txt" x="478" y="250">Панель</text>
  <text class="f-dim" x="478" y="272">управления видом</text>

  <text class="f-dim" x="200" y="312">Строка состояния и фильтр выбора внизу окна</text>
</svg>`,

  "revit-family-tree": `
<svg viewBox="0 0 640 260" role="img" aria-label="Иерархия категория - семейство - тип - экземпляр">
  <rect class="f-fill" x="230" y="10" width="180" height="46" rx="10"/>
  <path class="f-accent" d="M230 10h180v46H230z"/>
  <text class="f-txt f-center" x="320" y="32">Категория</text>
  <text class="f-dim f-center" x="320" y="49">«Двери»</text>

  <rect class="f-box" x="230" y="80" width="180" height="46" rx="10"/>
  <text class="f-txt f-center" x="320" y="102">Семейство</text>
  <text class="f-dim f-center" x="320" y="119">«Дверь однопольная»</text>

  <rect class="f-box" x="230" y="150" width="180" height="46" rx="10"/>
  <text class="f-txt f-center" x="320" y="172">Тип</text>
  <text class="f-dim f-center" x="320" y="189">«900 x 2100»</text>

  <rect class="f-box" x="40" y="216" width="150" height="40" rx="10"/>
  <text class="f-dim f-center" x="115" y="241">экземпляр в стене 1</text>
  <rect class="f-box" x="245" y="216" width="150" height="40" rx="10"/>
  <text class="f-dim f-center" x="320" y="241">экземпляр в стене 2</text>
  <rect class="f-box" x="450" y="216" width="150" height="40" rx="10"/>
  <text class="f-dim f-center" x="525" y="241">экземпляр в стене 3</text>

  <path class="f-arrow" d="M320 56v22M320 126v22"/>
  <path class="f-arrow" d="M320 196v6q0 8-10 8H115v6"/>
  <path class="f-arrow" d="M320 196v20"/>
  <path class="f-arrow" d="M320 196v6q0 8 10 8h195v6"/>
  <text class="f-dim" x="424" y="172">параметры типа →</text>
  <text class="f-dim" x="20" y="196">параметры</text>
  <text class="f-dim" x="20" y="212">экземпляра ↓</text>
</svg>`,

  "revit-view-range": `
<svg viewBox="0 0 640 260" role="img" aria-label="Диапазон вида плана в Revit">
  <path class="f-line" d="M60 40h520M60 100h520M60 170h520M60 220h520"/>
  <text class="f-dim" x="60" y="34">Верхняя граница (Top)</text>
  <text class="f-accent-txt" x="60" y="94">Секущая плоскость (Cut plane) — обычно 1200 мм</text>
  <text class="f-dim" x="60" y="164">Низ (Bottom)</text>
  <text class="f-dim" x="60" y="214">Глубина вида (View depth)</text>

  <rect class="f-fill" x="150" y="60" width="60" height="130" rx="2"/>
  <path class="f-accent" d="M150 60h60v130h-60z"/>
  <text class="f-dim" x="150" y="240">стена: попала под секущую</text>

  <rect class="f-box" x="300" y="120" width="70" height="50" rx="2"/>
  <text class="f-dim" x="292" y="240">ниже секущей: видна целиком</text>

  <rect class="f-box" x="470" y="192" width="70" height="24" rx="2"/>
  <text class="f-dim" x="440" y="240">между низом и глубиной</text>
  <text class="f-dim" x="440" y="256">(показ пунктиром/скрыто)</text>
</svg>`,

  "worksharing": `
<svg viewBox="0 0 640 260" role="img" aria-label="Совместная работа через центральную модель">
  <rect class="f-fill" x="220" y="14" width="200" height="60" rx="14"/>
  <path class="f-accent" d="M220 14h200v60H220z"/>
  <text class="f-txt f-center" x="320" y="40">Центральная модель</text>
  <text class="f-dim f-center" x="320" y="60">на сервере / в облаке</text>

  <rect class="f-box" x="20" y="150" width="170" height="70" rx="12"/>
  <text class="f-txt f-center" x="105" y="176">Локальный файл</text>
  <text class="f-dim f-center" x="105" y="196">архитектор</text>
  <text class="f-dim f-center" x="105" y="212">рабочий набор АР</text>

  <rect class="f-box" x="235" y="150" width="170" height="70" rx="12"/>
  <text class="f-txt f-center" x="320" y="176">Локальный файл</text>
  <text class="f-dim f-center" x="320" y="196">конструктор</text>
  <text class="f-dim f-center" x="320" y="212">рабочий набор КР</text>

  <rect class="f-box" x="450" y="150" width="170" height="70" rx="12"/>
  <text class="f-txt f-center" x="535" y="176">Локальный файл</text>
  <text class="f-dim f-center" x="535" y="196">инженер</text>
  <text class="f-dim f-center" x="535" y="212">рабочий набор ИОС</text>

  <path class="f-arrow" d="M270 74q-90 20-150 72"/>
  <path class="f-arrow" d="M320 74v72"/>
  <path class="f-arrow" d="M370 74q90 20 150 72"/>
  <text class="f-dim f-center" x="320" y="120">Синхронизация с центральной моделью ↑↓</text>
</svg>`,

  "navis-federation": `
<svg viewBox="0 0 640 260" role="img" aria-label="Форматы Navisworks и сборка сводной модели">
  <rect class="f-box" x="14" y="20" width="150" height="44" rx="10"/>
  <text class="f-dim f-center" x="89" y="47">АР .rvt → .nwc</text>
  <rect class="f-box" x="14" y="82" width="150" height="44" rx="10"/>
  <text class="f-dim f-center" x="89" y="109">КР .rvt → .nwc</text>
  <rect class="f-box" x="14" y="144" width="150" height="44" rx="10"/>
  <text class="f-dim f-center" x="89" y="171">ИОС .ifc → .nwc</text>
  <rect class="f-box" x="14" y="206" width="150" height="44" rx="10"/>
  <text class="f-dim f-center" x="89" y="233">ГП .dwg → .nwc</text>

  <rect class="f-fill" x="240" y="94" width="160" height="80" rx="14"/>
  <path class="f-accent" d="M240 94h160v80H240z"/>
  <text class="f-txt f-center" x="320" y="126">.nwf</text>
  <text class="f-dim f-center" x="320" y="148">ссылки на файлы,</text>
  <text class="f-dim f-center" x="320" y="164">обновляется сам</text>

  <rect class="f-box" x="470" y="52" width="156" height="64" rx="12"/>
  <text class="f-txt f-center" x="548" y="78">.nwd</text>
  <text class="f-dim f-center" x="548" y="98">снимок для выдачи</text>

  <rect class="f-box" x="470" y="152" width="156" height="64" rx="12"/>
  <text class="f-txt f-center" x="548" y="178">Freedom</text>
  <text class="f-dim f-center" x="548" y="198">бесплатный просмотр</text>

  <path class="f-arrow" d="M164 42q60 10 76 56M164 104h72M164 166q60-10 76-56M164 228q60-10 76-56"/>
  <path class="f-arrow" d="M400 120q40-10 66-30M400 150q40 10 66 26"/>
</svg>`,

  "timeliner": `
<svg viewBox="0 0 640 260" role="img" aria-label="Связь календарного плана и 3D модели">
  <text class="f-title" x="20" y="24">График (TimeLiner)</text>
  <rect class="f-box" x="20" y="40" width="290" height="200" rx="10"/>
  <text class="f-dim" x="34" y="66">Земляные работы</text>
  <rect class="f-fill" x="180" y="54" width="60" height="14" rx="4"/>
  <text class="f-dim" x="34" y="98">Фундамент</text>
  <rect class="f-fill" x="200" y="86" width="70" height="14" rx="4"/>
  <text class="f-dim" x="34" y="130">Каркас 1 этаж</text>
  <rect class="f-accent-fill" x="215" y="118" width="80" height="14" rx="4"/>
  <text class="f-dim" x="34" y="162">Каркас 2 этаж</text>
  <rect class="f-fill" x="230" y="150" width="60" height="14" rx="4"/>
  <text class="f-dim" x="34" y="194">Кровля</text>
  <rect class="f-fill" x="245" y="182" width="50" height="14" rx="4"/>
  <text class="f-dim" x="34" y="226">Отделка</text>
  <rect class="f-fill" x="250" y="214" width="45" height="14" rx="4"/>

  <text class="f-title" x="350" y="24">Модель на дату</text>
  <rect class="f-box" x="350" y="40" width="270" height="200" rx="10"/>
  <path class="f-line" d="M400 200h170M400 200v-40h170v40"/>
  <path class="f-accent" d="M400 160h170v-40H400z"/>
  <path class="f-line f-dash" d="M400 120h170v-40H400z"/>
  <text class="f-dim" x="400" y="222">серое — построено, синее — в работе,</text>
  <text class="f-dim" x="400" y="236">пунктир — ещё не начато</text>
  <path class="f-arrow" d="M300 132h44"/>
</svg>`,

  "autocad-spaces": `
<svg viewBox="0 0 640 270" role="img" aria-label="Пространство модели и листа в AutoCAD">
  <text class="f-title" x="20" y="24">Модель (1:1, в миллиметрах)</text>
  <rect class="f-box" x="20" y="40" width="280" height="190" rx="10"/>
  <path class="f-line" d="M60 190h200M60 190V90h200v100M100 190v-60h50v60"/>
  <text class="f-dim" x="60" y="220">черти в натуральных размерах</text>

  <text class="f-title" x="350" y="24">Лист (Layout, формат A3)</text>
  <rect class="f-box" x="350" y="40" width="270" height="190" rx="10"/>
  <rect class="f-fill" x="368" y="58" width="180" height="120" rx="4"/>
  <path class="f-accent" d="M368 58h180v120H368z"/>
  <path class="f-line" d="M392 156h130M392 156V96h130v60"/>
  <text class="f-dim" x="374" y="196">видовой экран, масштаб 1:100</text>
  <rect class="f-box" x="556" y="58" width="50" height="120" rx="4"/>
  <text class="f-dim f-vert" x="581" y="120">штамп</text>
  <text class="f-dim" x="350" y="252">Одна модель → несколько листов с разными масштабами</text>
</svg>`,

  "autocad-coords": `
<svg viewBox="0 0 640 250" role="img" aria-label="Способы ввода координат в AutoCAD">
  <path class="f-line" d="M60 210h540M60 210V30"/>
  <text class="f-dim" x="606" y="214">X</text>
  <text class="f-dim" x="48" y="26">Y</text>
  <circle class="f-dot" cx="60" cy="210" r="4"/>
  <text class="f-dim" x="30" y="228">0,0</text>

  <circle class="f-dot" cx="180" cy="150" r="5"/>
  <text class="f-txt" x="190" y="146">120,60</text>
  <text class="f-dim" x="190" y="164">абсолютные</text>
  <path class="f-line f-dash" d="M60 150h120M180 150v60"/>

  <circle class="f-dot" cx="330" cy="90" r="5"/>
  <path class="f-accent" d="M180 150l150-60"/>
  <text class="f-txt" x="340" y="86">@150,60</text>
  <text class="f-dim" x="340" y="104">относительные от прошлой точки</text>

  <circle class="f-dot" cx="500" cy="150" r="5"/>
  <path class="f-accent" d="M330 90l170 60"/>
  <text class="f-txt" x="470" y="186">@180&lt;-20</text>
  <text class="f-dim" x="440" y="204">полярные: длина и угол</text>
</svg>`,

  "autocad-layers": `
<svg viewBox="0 0 640 240" role="img" aria-label="Слои и свойства ByLayer">
  <rect class="f-box" x="20" y="20" width="330" height="200" rx="10"/>
  <text class="f-title" x="36" y="46">Диспетчер слоёв</text>
  <text class="f-dim" x="36" y="76">A-WALL · вкл · синий · 0.35</text>
  <text class="f-dim" x="36" y="104">A-DOOR · вкл · зелёный · 0.18</text>
  <text class="f-dim" x="36" y="132">A-DIM · вкл · серый · 0.13</text>
  <text class="f-dim" x="36" y="160">A-HELP · выкл · не печатать</text>
  <text class="f-dim" x="36" y="196">0 — только для блоков!</text>

  <rect class="f-fill" x="390" y="40" width="230" height="70" rx="10"/>
  <path class="f-accent" d="M390 40h230v70H390z"/>
  <text class="f-txt f-center" x="505" y="70">Свойства = ByLayer</text>
  <text class="f-dim f-center" x="505" y="92">цвет, тип и вес линии — от слоя</text>

  <rect class="f-box" x="390" y="140" width="230" height="70" rx="10"/>
  <text class="f-txt f-center" x="505" y="170">Ручной цвет объекта</text>
  <text class="f-dim f-center" x="505" y="192">ломает стандарт и печать</text>
</svg>`,

  "civil-surface": `
<svg viewBox="0 0 640 250" role="img" aria-label="TIN поверхность и горизонтали">
  <text class="f-title" x="20" y="24">Точки и треугольники (TIN)</text>
  <path class="f-line" d="M40 200l70-110 80 60 70-90 80 120-90 50z"/>
  <path class="f-line" d="M110 90l80 60M190 150l70-90M260 60l80 120M110 90l80 60-90 50M190 150l150 30"/>
  <circle class="f-dot" cx="40" cy="200" r="4"/>
  <circle class="f-dot" cx="110" cy="90" r="4"/>
  <circle class="f-dot" cx="190" cy="150" r="4"/>
  <circle class="f-dot" cx="260" cy="60" r="4"/>
  <circle class="f-dot" cx="340" cy="180" r="4"/>
  <circle class="f-dot" cx="250" cy="230" r="4"/>
  <text class="f-dim" x="40" y="245">съёмка → точки с высотой</text>

  <text class="f-title" x="400" y="24">Горизонтали</text>
  <path class="f-accent" d="M410 200q60-40 110-10t100-30"/>
  <path class="f-accent" d="M410 170q60-40 110-10t100-30"/>
  <path class="f-accent" d="M410 140q60-40 110-10t100-30"/>
  <path class="f-line f-dash" d="M410 110q60-40 110-10t100-30"/>
  <text class="f-dim" x="400" y="230">стиль поверхности задаёт шаг</text>
</svg>`,

  "civil-corridor": `
<svg viewBox="0 0 640 300" role="img" aria-label="Из чего собирается коридор в Civil 3D">
  <text class="f-title" x="20" y="24">1. Трасса (Alignment) — план</text>
  <path class="f-accent" d="M30 80q80-40 150 0t150 0"/>
  <circle class="f-dot" cx="30" cy="80" r="4"/>
  <circle class="f-dot" cx="330" cy="70" r="4"/>
  <text class="f-dim" x="30" y="104">прямые, круговые кривые, переходные</text>

  <text class="f-title" x="20" y="150">2. Профиль (Profile) — вид сбоку</text>
  <path class="f-line" d="M30 230h300"/>
  <path class="f-accent" d="M30 220l90-30 100 20 110-25"/>
  <text class="f-dim" x="30" y="256">чёрная — земля, цветная — проект</text>

  <text class="f-title" x="380" y="24">3. Конструкция (Assembly)</text>
  <path class="f-line" d="M400 90h200"/>
  <path class="f-accent" d="M420 76h160M420 76l-20 14M580 76l20 14"/>
  <path class="f-line f-dash" d="M500 60v40"/>
  <text class="f-dim" x="380" y="116">полосы, обочины, откосы (subassembly)</text>

  <rect class="f-fill" x="380" y="160" width="240" height="100" rx="14"/>
  <path class="f-accent" d="M380 160h240v100H380z"/>
  <text class="f-txt f-center" x="500" y="196">= Коридор (Corridor)</text>
  <text class="f-dim f-center" x="500" y="220">3D-модель дороги + поверхность</text>
  <text class="f-dim f-center" x="500" y="242">объёмы, сечения, чертежи</text>
  <path class="f-arrow" d="M340 200h34"/>
</svg>`,

  "coordinates": `
<svg viewBox="0 0 640 250" role="img" aria-label="Общие координаты между моделями">
  <rect class="f-box" x="20" y="30" width="260" height="180" rx="12"/>
  <text class="f-title" x="34" y="56">Внутренние координаты</text>
  <circle class="f-dot" cx="70" cy="170" r="5"/>
  <text class="f-dim" x="80" y="174">0,0,0 у каждого свой</text>
  <path class="f-accent" d="M110 150h90v-50h-90z"/>
  <path class="f-line f-dash" d="M70 170l40-20"/>
  <text class="f-dim" x="34" y="200">модели «разъезжаются» при сборке</text>

  <rect class="f-fill" x="360" y="30" width="260" height="180" rx="12"/>
  <path class="f-accent" d="M360 30h260v180H360z"/>
  <text class="f-title" x="374" y="56">Общая точка проекта</text>
  <circle class="f-dot" cx="410" cy="170" r="5"/>
  <text class="f-dim" x="420" y="174">одна база для всех</text>
  <path class="f-line" d="M450 150h90v-50h-90z"/>
  <path class="f-line" d="M460 140h90v-50h-90z"/>
  <text class="f-dim" x="374" y="200">модели садятся точно друг на друга</text>
</svg>`,

  "cde-status": `
<svg viewBox="0 0 640 200" role="img" aria-label="Статусы данных в среде общего доступа">
  <g><rect class="f-box" x="10" y="60" width="140" height="70" rx="12"/><text class="f-txt f-center" x="80" y="88">В работе</text><text class="f-dim f-center" x="80" y="108">WIP</text><text class="f-dim f-center" x="80" y="124">видно автору</text></g>
  <g><rect class="f-box" x="170" y="60" width="140" height="70" rx="12"/><text class="f-txt f-center" x="240" y="88">Общий доступ</text><text class="f-dim f-center" x="240" y="108">Shared</text><text class="f-dim f-center" x="240" y="124">для смежников</text></g>
  <g><rect class="f-fill" x="330" y="60" width="140" height="70" rx="12"/><path class="f-accent" d="M330 60h140v70H330z"/><text class="f-txt f-center" x="400" y="88">Опубликовано</text><text class="f-dim f-center" x="400" y="108">Published</text><text class="f-dim f-center" x="400" y="124">выдано заказчику</text></g>
  <g><rect class="f-box" x="490" y="60" width="140" height="70" rx="12"/><text class="f-txt f-center" x="560" y="88">Архив</text><text class="f-dim f-center" x="560" y="108">Archive</text><text class="f-dim f-center" x="560" y="124">история версий</text></g>
  <path class="f-arrow" d="M150 92h16M310 92h16M470 92h16"/>
  <text class="f-dim" x="10" y="170">Каждый переход = проверка и согласование, а не просто копирование файла</text>
</svg>`,

  "links-tree": `
<svg viewBox="0 0 640 330" role="img" aria-label="Дерево связей против круговой зависимости">
  <text class="f-title" x="16" y="24">Кольцо: так нельзя</text>
  <rect class="f-box" x="24" y="46" width="112" height="44" rx="10"/>
  <text class="f-txt f-center" x="80" y="73">АР</text>
  <rect class="f-box" x="150" y="130" width="112" height="44" rx="10"/>
  <text class="f-txt f-center" x="206" y="157">Фасад</text>
  <rect class="f-box" x="24" y="214" width="112" height="44" rx="10"/>
  <text class="f-txt f-center" x="80" y="241">Отделка</text>
  <path class="f-line" d="M136 74l24 52M206 174l-24 44M60 214V90"/>
  <path class="f-accent" d="M148 118l14 12-19 6"/>
  <path class="f-accent" d="M188 202l-6-20 19 8"/>
  <path class="f-accent" d="M52 104l8-20 8 20"/>
  <text class="f-dim" x="24" y="290">Каждый грузит каждого: открытие долгое,</text>
  <text class="f-dim" x="24" y="308">версии расходятся, координаты «плывут»</text>

  <path class="f-line f-dash" d="M320 30v280"/>

  <text class="f-title" x="352" y="24">Дерево: так нужно</text>
  <rect class="f-box" x="450" y="46" width="140" height="48" rx="10"/>
  <text class="f-txt f-center" x="520" y="68">АР — источник</text>
  <text class="f-dim f-center" x="520" y="86">координат</text>
  <rect class="f-box" x="352" y="150" width="118" height="44" rx="10"/>
  <text class="f-txt f-center" x="411" y="177">Фасад</text>
  <rect class="f-box" x="486" y="150" width="118" height="44" rx="10"/>
  <text class="f-txt f-center" x="545" y="177">Отделка</text>
  <path class="f-accent" d="M520 94v26M411 120h134M411 120v26M545 120v26"/>
  <circle class="f-dot" cx="411" cy="150" r="4"/>
  <circle class="f-dot" cx="545" cy="150" r="4"/>
  <text class="f-accent-txt" x="352" y="228">Связь только вниз, тип Overlay</text>
  <text class="f-dim" x="352" y="252">Обратно в АР — не рабочий файл,</text>
  <text class="f-dim" x="352" y="270">а выданный снимок из СОД</text>
  <text class="f-dim" x="352" y="296">Каждая связь — в своём рабочем наборе</text>
</svg>`,

  "wall-layers": `
<svg viewBox="0 0 640 330" role="img" aria-label="Одна многослойная стена против нескольких стен и правило вставки проёма">
  <text class="f-title" x="16" y="24">Одна многослойная стена</text>
  <rect class="f-box" x="24" y="44" width="250" height="150" rx="6"/>
  <rect class="f-fill" x="150" y="44" width="46" height="52"/>
  <rect class="f-fill" x="150" y="142" width="46" height="52"/>
  <path class="f-line" d="M84 44v52M150 44v52M196 44v52M84 142v52M150 142v52M196 142v52"/>
  <text class="f-dim" x="28" y="212">облиц.</text>
  <text class="f-dim" x="94" y="212">утепл.</text>
  <text class="f-dim" x="152" y="212">несущ.</text>
  <text class="f-dim" x="202" y="212">отд.</text>
  <path class="f-accent" d="M24 96h250M24 142h250"/>
  <text class="f-accent-txt f-center" x="149" y="124">один проём насквозь</text>
  <text class="f-dim" x="24" y="242">Окно вставляется в стену —</text>
  <text class="f-dim" x="24" y="260">Revit сам режет все слои</text>
  <text class="f-dim" x="24" y="286">Слой основы (Core) задаёт привязки</text>
  <text class="f-dim" x="24" y="304">и границу помещения</text>

  <path class="f-line f-dash" d="M320 30v280"/>

  <text class="f-title" x="352" y="24">Несколько стен</text>
  <rect class="f-box" x="352" y="44" width="56" height="150" rx="4"/>
  <rect class="f-box" x="414" y="44" width="56" height="150" rx="4"/>
  <rect class="f-box" x="476" y="44" width="76" height="150" rx="4"/>
  <rect class="f-fill" x="476" y="44" width="76" height="150"/>
  <text class="f-dim f-center" x="380" y="212">АР</text>
  <text class="f-dim f-center" x="442" y="212">АР</text>
  <text class="f-dim f-center" x="514" y="212">КР</text>
  <path class="f-accent" d="M476 96h76M476 142h76"/>
  <path class="f-line f-dash" d="M352 96h124M352 142h124"/>
  <circle class="f-dot" cx="514" cy="119" r="5"/>
  <text class="f-accent-txt" x="352" y="242">Окно — в несущую стену</text>
  <text class="f-dim" x="352" y="266">Остальные слои: Wall Opening</text>
  <text class="f-dim" x="352" y="284">по тем же габаритам</text>
  <text class="f-dim" x="352" y="310">Дырка должна быть одна, а не три разных</text>
</svg>`,

  "phases-demo": `
<svg viewBox="0 0 640 300" role="img" aria-label="Стадии: существующее, демонтаж, новое и закладка проёма">
  <text class="f-title" x="16" y="24">Существующее</text>
  <rect class="f-box" x="16" y="44" width="176" height="120" rx="6"/>
  <rect class="f-fill" x="66" y="74" width="60" height="90"/>
  <path class="f-accent" d="M66 74h60v90"/>
  <text class="f-dim f-center" x="96" y="124">дверь</text>
  <text class="f-dim" x="16" y="190">Стадия возведения =</text>
  <text class="f-dim" x="16" y="208">«Существующее»</text>

  <text class="f-title" x="232" y="24">Демонтаж</text>
  <rect class="f-box" x="232" y="44" width="176" height="120" rx="6"/>
  <path class="f-line f-dash" d="M282 74h60v90h-60z"/>
  <path class="f-line f-dash" d="M282 74l60 90M342 74l-60 90"/>
  <text class="f-dim f-center" x="312" y="190">Стадия сноса =</text>
  <text class="f-dim f-center" x="312" y="208">«Демонтаж»</text>
  <text class="f-accent-txt" x="232" y="234">Элемент НЕ удаляют</text>

  <text class="f-title" x="448" y="24">Новое</text>
  <rect class="f-box" x="448" y="44" width="176" height="120" rx="6"/>
  <rect class="f-fill" x="498" y="74" width="60" height="90"/>
  <path class="f-accent" d="M498 74h60v90h-60z"/>
  <path class="f-line" d="M498 92h60M498 110h60M498 128h60M498 146h60"/>
  <text class="f-dim f-center" x="528" y="190">новая стена «Закладка»</text>
  <text class="f-dim f-center" x="528" y="208">Стадия возведения = «Новое»</text>
  <text class="f-accent-txt" x="448" y="234">Отдельный элемент</text>

  <path class="f-arrow" d="M200 104h24M416 104h24"/>
  <text class="f-dim" x="16" y="268">Ведомость демонтажа — фильтр спецификации по «Стадия сноса»</text>
  <text class="f-dim" x="16" y="288">Объём заделки — спецификация стен по типу «Закладка проёма»</text>
</svg>`,

  "detail-views": `
<svg viewBox="0 0 640 320" role="img" aria-label="Чем отличаются легенда, чертёжный вид и выносной вид узла">
  <rect class="f-box" x="16" y="40" width="192" height="150" rx="12"/>
  <text class="f-title f-center" x="112" y="66">Легенда</text>
  <text class="f-dim f-center" x="112" y="90">условные обозначения,</text>
  <text class="f-dim f-center" x="112" y="108">экспликация типов</text>
  <path class="f-line" d="M48 126h32M48 146h32"/>
  <rect class="f-fill" x="96" y="118" width="70" height="36"/>
  <text class="f-dim f-center" x="112" y="178">один масштаб на весь вид</text>

  <rect class="f-box" x="224" y="40" width="192" height="150" rx="12"/>
  <text class="f-title f-center" x="320" y="66">Чертёжный вид</text>
  <text class="f-dim f-center" x="320" y="90">2D-узел, не связан</text>
  <text class="f-dim f-center" x="320" y="108">с моделью</text>
  <path class="f-accent" d="M264 122h112v40h-112z"/>
  <path class="f-line" d="M282 122v40M300 122v40M318 122v40"/>
  <text class="f-accent-txt f-center" x="320" y="180">свой масштаб у каждого</text>

  <rect class="f-box" x="432" y="40" width="192" height="150" rx="12"/>
  <text class="f-title f-center" x="528" y="66">Выносной вид</text>
  <text class="f-dim f-center" x="528" y="90">режет реальную модель,</text>
  <text class="f-dim f-center" x="528" y="108">обновляется сам</text>
  <rect class="f-fill" x="472" y="118" width="112" height="44"/>
  <path class="f-accent f-dash" d="M472 118h112v44h-112z"/>
  <circle class="f-dot" cx="528" cy="140" r="5"/>
  <text class="f-dim f-center" x="528" y="180">дороже в поддержке</text>

  <text class="f-accent-txt" x="16" y="230">Правило: один узел = один чертёжный вид</text>
  <text class="f-dim" x="16" y="254">Тогда у каждого узла свой номер, масштаб и заголовок,</text>
  <text class="f-dim" x="16" y="274">его можно переставить на другой лист и переиспользовать.</text>
  <text class="f-dim" x="16" y="300">Десять узлов в одной легенде — обратной дороги нет.</text>
</svg>`,

  "vg-priority": `
<svg viewBox="0 0 640 300" role="img" aria-label="Порядок применения переопределений графики на виде">
  <text class="f-title" x="16" y="24">Что побеждает на виде — сверху вниз</text>
  <rect class="f-fill" x="16" y="44" width="450" height="42" rx="10"/>
  <path class="f-accent" d="M16 44h450v42H16z"/>
  <text class="f-txt" x="34" y="70">1. Переопределение конкретного элемента</text>
  <text class="f-dim" x="480" y="70">сильнее всего</text>
  <rect class="f-box" x="16" y="96" width="450" height="42" rx="10"/>
  <text class="f-txt" x="34" y="122">2. Фильтры — сверху вниз по списку</text>
  <text class="f-dim" x="480" y="122">порядок важен</text>
  <rect class="f-box" x="16" y="148" width="450" height="42" rx="10"/>
  <text class="f-txt" x="34" y="174">3. Переопределение категории (V/G)</text>
  <text class="f-dim" x="480" y="174">вся категория</text>
  <rect class="f-box" x="16" y="200" width="450" height="42" rx="10"/>
  <text class="f-txt" x="34" y="226">4. Настройки вида и шаблона вида</text>
  <text class="f-dim" x="480" y="226">основа</text>
  <path class="f-arrow" d="M241 86v10M241 138v10M241 190v10"/>
  <text class="f-dim" x="16" y="274">Первый сработавший фильтр забирает элемент — следующие к нему уже не применяются</text>
</svg>`,

  "worksets-map": `
<svg viewBox="0 0 640 300" role="img" aria-label="Правильная и неправильная разбивка рабочих наборов">
  <text class="f-title" x="16" y="24">Рабочий набор — про загрузку и доступ, а не про порядок в модели</text>
  <rect class="f-box" x="16" y="42" width="290" height="204" rx="12"/>
  <text class="f-accent-txt" x="34" y="70">Так правильно</text>
  <text class="f-txt" x="34" y="96">00_Оси_Уровни</text>
  <text class="f-txt" x="34" y="120">01_Несущие</text>
  <text class="f-txt" x="34" y="144">02_Перегородки</text>
  <text class="f-txt" x="34" y="168">03_Заполнения_проёмов</text>
  <text class="f-txt" x="34" y="192">10_Связь_КР</text>
  <text class="f-txt" x="34" y="216">11_Связь_ИОС</text>
  <text class="f-dim" x="34" y="238">5–15 наборов, каждая связь — свой</text>

  <rect class="f-box" x="334" y="42" width="290" height="204" rx="12"/>
  <text class="f-dim" x="352" y="70">Так не надо</text>
  <text class="f-txt" x="352" y="96">Иванов</text>
  <text class="f-txt" x="352" y="120">Петров</text>
  <text class="f-txt" x="352" y="144">Этаж_1</text>
  <text class="f-txt" x="352" y="168">Этаж_2</text>
  <text class="f-txt" x="352" y="192">Workset1</text>
  <path class="f-line" d="M352 90h58M352 114h64M352 138h58M352 162h58M352 186h74"/>
  <text class="f-dim" x="352" y="216">Именной набор блокирует работу,</text>
  <text class="f-dim" x="352" y="234">когда автор в отпуске</text>

  <text class="f-dim" x="16" y="276">Заимствование элементов Revit делает сам — забирать набор целиком нужно редко и ненадолго</text>
</svg>`,

  "file-naming": `
<svg viewBox="0 0 640 260" role="img" aria-label="Разбор шаблона имени файла ведомости объёмов работ">
  <text class="f-title" x="16" y="24">Шаблон имени файла</text>
  <rect class="f-box" x="16" y="42" width="608" height="46" rx="10"/>
  <text class="f-txt" x="32" y="72">Проект_Секция_Раздел_Тип_Вид работ_Версия_Дата</text>
  <text class="f-accent-txt" x="32" y="118">Mytishchi7_K1_AR_VOR_Montazh_v03_2026-06-06.xlsx</text>
  <text class="f-accent-txt" x="32" y="142">Mytishchi7_K1_AR_VOR_Demontazh_v03_2026-06-06.xlsx</text>
  <rect class="f-box" x="16" y="166" width="196" height="70" rx="10"/>
  <text class="f-txt f-center" x="114" y="194">Дата ISO</text>
  <text class="f-dim f-center" x="114" y="216">ГГГГ-ММ-ДД сортируется</text>
  <rect class="f-box" x="222" y="166" width="196" height="70" rx="10"/>
  <text class="f-txt f-center" x="320" y="194">Версия с нулём</text>
  <text class="f-dim f-center" x="320" y="216">v03, а не v3</text>
  <rect class="f-box" x="428" y="166" width="196" height="70" rx="10"/>
  <text class="f-txt f-center" x="526" y="194">Монтаж ≠ демонтаж</text>
  <text class="f-dim f-center" x="526" y="216">это разные ведомости</text>
</svg>`,

  "competency-map": `
<svg viewBox="0 0 640 340" role="img" aria-label="Сферы знаний BIM-специалиста">
  <circle class="f-ring" cx="320" cy="170" r="122"/>
  <circle class="f-fill" cx="320" cy="170" r="60"/>
  <text class="f-txt f-center" x="320" y="165">BIM-</text>
  <text class="f-txt f-center" x="320" y="184">менеджер</text>
  <rect class="f-box" x="222" y="10" width="196" height="38" rx="10"/>
  <text class="f-txt f-center" x="320" y="34">Аналитика и внедрение</text>
  <rect class="f-box" x="452" y="86" width="176" height="38" rx="10"/>
  <text class="f-txt f-center" x="540" y="110">Техника и ПО</text>
  <rect class="f-box" x="452" y="216" width="176" height="38" rx="10"/>
  <text class="f-txt f-center" x="540" y="240">Координация</text>
  <rect class="f-box" x="222" y="292" width="196" height="38" rx="10"/>
  <text class="f-txt f-center" x="320" y="316">Документы и стандарты</text>
  <rect class="f-box" x="12" y="216" width="176" height="38" rx="10"/>
  <text class="f-txt f-center" x="100" y="240">Автоматизация</text>
  <rect class="f-box" x="12" y="86" width="176" height="38" rx="10"/>
  <text class="f-txt f-center" x="100" y="110">Коммуникация</text>
  <path class="f-arrow" d="M320 48v62M452 116l-76 30M452 224l-76-24M320 292v-62M188 224l76-24M188 116l76 30"/>
</svg>`,

  "maturity-levels": `
<svg viewBox="0 0 640 300" role="img" aria-label="Уровни зрелости BIM в компании">
  <text class="f-title" x="16" y="24">Уровни зрелости BIM</text>
  <path class="f-line" d="M40 250h584M40 250V44"/>
  <rect class="f-box" x="56" y="212" width="96" height="38" rx="6"/>
  <text class="f-txt f-center" x="104" y="236">0</text>
  <rect class="f-box" x="160" y="180" width="96" height="70" rx="6"/>
  <text class="f-txt f-center" x="208" y="220">1</text>
  <rect class="f-box" x="264" y="140" width="96" height="110" rx="6"/>
  <text class="f-txt f-center" x="312" y="200">2</text>
  <rect class="f-box" x="368" y="100" width="96" height="150" rx="6"/>
  <text class="f-txt f-center" x="416" y="180">3</text>
  <rect class="f-fill" x="472" y="60" width="96" height="190" rx="6"/>
  <path class="f-accent" d="M472 60h96v190h-96z"/>
  <text class="f-txt f-center" x="520" y="160">4</text>
  <text class="f-dim f-center" x="104" y="268">нет BIM</text>
  <text class="f-dim f-center" x="208" y="268">2D и 3D</text>
  <text class="f-dim f-center" x="312" y="268">коллизии</text>
  <text class="f-dim f-center" x="416" y="268">анализ</text>
  <text class="f-dim f-center" x="520" y="268">решения</text>
  <text class="f-accent-txt" x="16" y="292">Прыгнуть с 0 на 3 нельзя: каждый уровень — это привычки людей, а не купленное ПО</text>
</svg>`,

  "license-types": `
<svg viewBox="0 0 640 280" role="img" aria-label="Типы лицензий на программное обеспечение">
  <text class="f-title" x="16" y="24">Три модели лицензии</text>
  <rect class="f-fill" x="16" y="42" width="192" height="150" rx="12"/>
  <path class="f-accent" d="M16 42h192v150H16z"/>
  <text class="f-txt f-center" x="112" y="70">Постоянная</text>
  <text class="f-dim f-center" x="112" y="94">платишь один раз,</text>
  <text class="f-dim f-center" x="112" y="112">пользуешься всегда</text>
  <text class="f-dim f-center" x="112" y="140">дорого на входе</text>
  <text class="f-dim f-center" x="112" y="164">обновления — отдельно</text>
  <rect class="f-box" x="224" y="42" width="192" height="150" rx="12"/>
  <text class="f-txt f-center" x="320" y="70">Подписка</text>
  <text class="f-dim f-center" x="320" y="94">платишь за период,</text>
  <text class="f-dim f-center" x="320" y="112">обновления включены</text>
  <text class="f-dim f-center" x="320" y="140">дешевле на входе</text>
  <text class="f-dim f-center" x="320" y="164">не платишь — не работает</text>
  <rect class="f-box" x="432" y="42" width="192" height="150" rx="12"/>
  <text class="f-txt f-center" x="528" y="70">Аренда</text>
  <text class="f-dim f-center" x="528" y="94">короткий срок</text>
  <text class="f-dim f-center" x="528" y="112">под конкретный проект</text>
  <text class="f-dim f-center" x="528" y="140">обновлений нет</text>
  <text class="f-dim f-center" x="528" y="164">удобно на пик нагрузки</text>
  <text class="f-accent-txt" x="16" y="226">Сравнивают не цену покупки, а стоимость владения за 3 года</text>
  <text class="f-dim" x="16" y="252">Лицензия + обучение + поддержка + железо + время на внедрение</text>
</svg>`,

  "software-map": `
<svg viewBox="0 0 640 330" role="img" aria-label="Карта программного обеспечения по задачам">
  <text class="f-title" x="16" y="22">Задача → чем закрывают</text>
  <text class="f-accent-txt" x="176" y="46">Зарубежное</text>
  <text class="f-accent-txt" x="430" y="46">Российское</text>
  <path class="f-line f-dash" d="M410 34v272"/>
  <text class="f-txt" x="16" y="76">Здание</text>
  <text class="f-dim" x="176" y="76">Revit, Archicad, Allplan</text>
  <text class="f-dim" x="430" y="76">Renga, nanoCAD BIM</text>
  <text class="f-txt" x="16" y="112">Металл</text>
  <text class="f-dim" x="176" y="112">Tekla Structures</text>
  <text class="f-dim" x="430" y="112">nanoCAD BIM Конструкции</text>
  <text class="f-txt" x="16" y="148">Инженерия</text>
  <text class="f-dim" x="176" y="148">MagiCAD, Revit MEP</text>
  <text class="f-dim" x="430" y="148">Model Studio CS, Project Studio</text>
  <text class="f-txt" x="16" y="184">Сведение</text>
  <text class="f-dim" x="176" y="184">Navisworks, Solibri</text>
  <text class="f-dim" x="430" y="184">CADLib, S-Info, Larix</text>
  <text class="f-txt" x="16" y="220">СОД</text>
  <text class="f-dim" x="176" y="220">Autodesk Docs, Aconex</text>
  <text class="f-dim" x="430" y="220">Pilot-BIM, Vitro-CAD, TDMS</text>
  <text class="f-txt" x="16" y="256">Инфраструктура</text>
  <text class="f-dim" x="176" y="256">Civil 3D, OpenRoads</text>
  <text class="f-dim" x="430" y="256">Credo, IndorCAD, Topomatic</text>
  <text class="f-txt" x="16" y="292">Бесплатно</text>
  <text class="f-dim" x="176" y="292">Bonsai (BlenderBIM), FreeCAD</text>
  <text class="f-dim" x="430" y="292">nanoCAD Free, просмотрщики</text>
</svg>`,

  "cim-stages": `
<svg viewBox="0 0 640 300" role="img" aria-label="Стадии цифровой информационной модели в России">
  <text class="f-title" x="16" y="24">ЦИМ по стадиям в российской практике</text>
  <rect class="f-box" x="16" y="44" width="188" height="86" rx="10"/>
  <text class="f-txt f-center" x="110" y="70">ЦИМ ПД</text>
  <text class="f-dim f-center" x="110" y="92">проектная</text>
  <text class="f-dim f-center" x="110" y="110">документация</text>
  <rect class="f-fill" x="226" y="44" width="188" height="86" rx="10"/>
  <path class="f-accent" d="M226 44h188v86H226z"/>
  <text class="f-txt f-center" x="320" y="70">ЦИМ РД</text>
  <text class="f-dim f-center" x="320" y="92">«строительная модель»,</text>
  <text class="f-dim f-center" x="320" y="110">уровень С1</text>
  <rect class="f-box" x="436" y="44" width="188" height="86" rx="10"/>
  <text class="f-txt f-center" x="530" y="70">ЦИМ ИД</text>
  <text class="f-dim f-center" x="530" y="92">исполнительная,</text>
  <text class="f-dim f-center" x="530" y="110">по захваткам</text>
  <path class="f-arrow" d="M204 87h20M414 87h20"/>
  <text class="f-dim" x="16" y="164">Зарубежная шкала для сравнения:</text>
  <text class="f-dim" x="16" y="188">ЦИМ ПД ≈ LOD 300 · ЦИМ РД ≈ LOD 400 · ЦИМ ИД ≈ LOD 500</text>
  <text class="f-accent-txt" x="16" y="224">Спорный узел: кто делает и за чей счёт ЦИМ РД</text>
  <text class="f-dim" x="16" y="250">По проекту приказа она ложится на подрядчика СМР, а проверять её</text>
  <text class="f-dim" x="16" y="270">некому: проектировщик на стройке остаётся только надзором.</text>
  <text class="f-dim" x="16" y="294">Ориентиры: СП 333.1325800, ПНСТ 909, ПП РФ № 331 — сверяйтесь с редакцией.</text>
</svg>`,

  "openbim-tools": `
<svg viewBox="0 0 640 300" role="img" aria-label="Стандарты openBIM и что каждый решает">
  <text class="f-title" x="16" y="24">Стандарты openBIM: кто за что отвечает</text>
  <rect class="f-fill" x="16" y="44" width="146" height="84" rx="10"/>
  <path class="f-accent" d="M16 44h146v84H16z"/>
  <text class="f-txt f-center" x="89" y="72">IFC</text>
  <text class="f-dim f-center" x="89" y="96">сама модель:</text>
  <text class="f-dim f-center" x="89" y="114">геометрия и данные</text>
  <rect class="f-box" x="174" y="44" width="146" height="84" rx="10"/>
  <text class="f-txt f-center" x="247" y="72">BCF</text>
  <text class="f-dim f-center" x="247" y="96">замечания</text>
  <text class="f-dim f-center" x="247" y="114">к модели</text>
  <rect class="f-box" x="332" y="44" width="146" height="84" rx="10"/>
  <text class="f-txt f-center" x="405" y="72">IDS</text>
  <text class="f-dim f-center" x="405" y="96">проверяемые</text>
  <text class="f-dim f-center" x="405" y="114">требования</text>
  <rect class="f-box" x="490" y="44" width="134" height="84" rx="10"/>
  <text class="f-txt f-center" x="557" y="72">COBie</text>
  <text class="f-dim f-center" x="557" y="96">данные для</text>
  <text class="f-dim f-center" x="557" y="114">эксплуатации</text>
  <rect class="f-box" x="16" y="150" width="196" height="76" rx="10"/>
  <text class="f-txt f-center" x="114" y="176">IDM</text>
  <text class="f-dim f-center" x="114" y="200">кто, когда и какие</text>
  <text class="f-dim f-center" x="114" y="216">данные передаёт</text>
  <rect class="f-box" x="224" y="150" width="196" height="76" rx="10"/>
  <text class="f-txt f-center" x="322" y="176">MVD</text>
  <text class="f-dim f-center" x="322" y="200">какой срез IFC</text>
  <text class="f-dim f-center" x="322" y="216">нужен получателю</text>
  <rect class="f-box" x="432" y="150" width="192" height="76" rx="10"/>
  <text class="f-txt f-center" x="528" y="176">bSDD (IFD)</text>
  <text class="f-dim f-center" x="528" y="200">единая</text>
  <text class="f-dim f-center" x="528" y="216">терминология</text>
  <text class="f-accent-txt" x="16" y="258">EIR говорит «что нужно», IDS делает это машинно проверяемым,</text>
  <text class="f-dim" x="16" y="282">BEP описывает «как мы это сделаем». Не путайте документ и формат.</text>
</svg>`
};
