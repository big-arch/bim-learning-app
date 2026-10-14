window.BIM_CONTENT = window.BIM_CONTENT || { courses: [], glossary: [], videos: [] };

// Курс «Английский для BIM»: интерфейс Revit, документы, координация,
// переписка, совещания и строительная лексика. Словарь vocab ниже
// питает игры «Найди пару» и «Блиц» в разделе «Игры».
window.BIM_CONTENT.courses.push({
  id: "english",
  title: "Английский для BIM",
  subtitle: "Интерфейс, документы, переписка",
  accent: "#d4508a",
  icon: "lang",
  summary:
    "Английский, который реально нужен в BIM: интерфейс Revit без перевода, EIR и BEP в оригинале, язык координации и коллизий, деловая переписка, совещания и строительная лексика. Отдельно — «ложные друзья», на которых ошибаются чаще всего.",
  lessons: [
    {
      id: "en-01",
      title: "Интерфейс Revit по-английски",
      minutes: 12,
      level: "База",
      tags: ["английский", "revit", "интерфейс"],
      goal: "Свободно работать в английской версии Revit и понимать англоязычные уроки.",
      blocks: [
        {
          type: "text",
          text: "Большая часть уроков, форумов и документации по Revit — на английском. Даже если у вас русская версия, полезно знать оригинальные названия команд: по ним ищется ответ в интернете, и на них ссылаются зарубежные стандарты. Хорошая новость: словарь интерфейса небольшой и быстро запоминается."
        },
        {
          type: "table",
          title: "Модель и виды",
          head: ["English", "По-русски", "Где встретите"],
          rows: [
            ["Level", "Уровень", "Этаж в модели, к нему привязаны элементы"],
            ["Grid", "Ось", "Координационные оси здания"],
            ["Floor plan", "План этажа", "Вид в браузере проекта"],
            ["Section", "Разрез", "Вид, вырезающий модель плоскостью"],
            ["Elevation", "Фасад / отметка", "Вид фасада; в другом контексте — высотная отметка"],
            ["View range", "Секущий диапазон", "Почему элемент не виден на плане"],
            ["Visibility/Graphics (VG)", "Видимость/графика", "Что и как показывается на виде"],
            ["View template", "Шаблон вида", "Единое оформление для группы видов"],
            ["Crop region", "Область кадрирования", "Граница, обрезающая вид"]
          ]
        },
        {
          type: "table",
          title: "Элементы и данные",
          head: ["English", "По-русски", "Комментарий"],
          rows: [
            ["Family", "Семейство", "Загружаемое, системное или контекстное"],
            ["Type", "Типоразмер", "Не «тип»: это конкретный вариант семейства"],
            ["Instance parameter", "Параметр экземпляра", "Свой у каждого элемента"],
            ["Type parameter", "Параметр типа", "Общий для всех элементов типоразмера"],
            ["Shared parameter", "Общий параметр", "Попадает в спецификации и марки"],
            ["Schedule", "Спецификация", "Таблица по элементам модели"],
            ["Tag", "Марка", "Подпись элемента на виде"],
            ["Sheet", "Лист", "Лист документации с основной надписью"],
            ["Title block", "Основная надпись", "Штамп листа"]
          ]
        },
        {
          type: "table",
          title: "Совместная работа",
          head: ["English", "По-русски", "Комментарий"],
          rows: [
            ["Central model", "Центральная модель", "Главный файл совместной работы"],
            ["Local file", "Локальная копия", "Ваша рабочая копия"],
            ["Synchronize with Central", "Синхронизация с центральной", "Отправить и получить изменения"],
            ["Workset", "Рабочий набор", "Часть модели с правами редактирования"],
            ["Relinquish", "Освободить", "Отдать заимствованные элементы"],
            ["Borrow", "Заимствовать", "Временно взять элемент на редактирование"],
            ["Purge unused", "Удалить неиспользуемое", "Очистка модели от лишнего"]
          ]
        },
        {
          type: "note",
          kind: "warn",
          title: "Elevation — два значения",
          text: "Elevation в Revit — это вид фасада, но в разговоре и в спецификациях это ещё и высотная отметка: «top of slab elevation +3.300» — отметка верха плиты +3,300. Понимать, какое значение имеется в виду, помогает контекст: вид или число."
        },
        {
          type: "note",
          kind: "tip",
          title: "Как быстро привыкнуть",
          text: "Поставьте английскую версию Revit хотя бы на неделю — это самый быстрый способ. Если нельзя, держите эту таблицу рядом и ищите решения проблем на английском: запрос «revit view range element not visible» находит в разы больше ответов, чем русский."
        },
        {
          type: "key",
          items: [
            "Type — это типоразмер, а Schedule — спецификация Revit.",
            "Elevation — и вид фасада, и высотная отметка.",
            "Ответы на вопросы по Revit ищите английскими названиями команд."
          ]
        }
      ],
      terms: ["Schedule (англ.)", "Семейство", "Рабочий набор"],
      questions: [
        {
          type: "single",
          q: "Как по-английски называется спецификация Revit?",
          options: ["Specification", "Schedule", "List", "Legend"],
          answer: 1,
          explain: "В интерфейсе Revit это Schedule. Specification — другое понятие, о нём в уроке про ложных друзей."
        },
        {
          type: "input",
          q: "Как по-английски «рабочий набор»?",
          answer: ["workset", "worksets"],
          explain: "Workset — часть модели для разграничения прав при совместной работе."
        },
        {
          type: "single",
          q: "Что означает Type в Revit?",
          options: ["Категорию", "Типоразмер — конкретный вариант семейства", "Шрифт", "Формат файла"],
          answer: 1,
          explain: "Family — семейство, Type — его конкретный типоразмер."
        },
        {
          type: "bool",
          q: "Elevation может означать как вид фасада, так и высотную отметку.",
          answer: true,
          explain: "Значение определяется контекстом: вид в браузере или число в документе."
        },
        {
          type: "input",
          q: "Впишите английское название команды «синхронизация с центральной моделью» (три слова)",
          answer: ["synchronize with central", "sync with central", "synchronise with central"],
          explain: "Synchronize with Central — в разговоре часто просто «sync»."
        },
        {
          type: "single",
          q: "Пользователь пишет: «My wall disappeared from the plan, I think it's the view range». О чём речь?",
          options: ["О шаблоне листа", "О секущем диапазоне вида", "О рабочем наборе", "О фильтре спецификации"],
          answer: 1,
          explain: "View range — секущий диапазон: частая причина того, что элемент не виден на плане."
        },
        {
          type: "multi",
          q: "Какие пары перевода верны?",
          options: ["Tag — марка", "Sheet — лист", "Grid — сетка цен", "Title block — основная надпись"],
          answer: [0, 1, 3],
          explain: "Grid в Revit — координационные оси здания."
        }
      ]
    },

    {
      id: "en-02",
      title: "Документы BIM в оригинале: EIR, BEP, CDE",
      minutes: 13,
      level: "Средний",
      tags: ["английский", "iso 19650", "документы"],
      goal: "Читать EIR, BEP и требования по ISO 19650 без переводчика.",
      blocks: [
        {
          type: "text",
          text: "Международные требования к BIM пишутся на языке ISO 19650. В нём устойчивые термины, и переводить их «по смыслу» опасно: у каждого есть точное значение. Ниже — словарь, которого хватает, чтобы читать EIR и BEP зарубежного заказчика."
        },
        {
          type: "table",
          title: "Участники и документы",
          head: ["English", "По-русски", "Смысл"],
          rows: [
            ["Appointing party", "Заказчик (назначающая сторона)", "Тот, кто ставит задачу и принимает информацию"],
            ["Lead appointed party", "Генпроектировщик / генподрядчик", "Главный исполнитель, координирует остальных"],
            ["Task team", "Рабочая группа", "Команда, выпускающая часть информации"],
            ["EIR", "Информационные требования заказчика", "Что и в каком виде нужно заказчику"],
            ["BEP", "План реализации BIM", "Как исполнитель выполнит требования"],
            ["MIDP / TIDP", "Общий / командный план выпуска информации", "Что, кто и когда выпускает"],
            ["Deliverable", "Результат / поставляемый документ", "То, что должно быть передано"],
            ["Milestone", "Контрольная точка", "Дата, к которой привязана выдача"]
          ]
        },
        {
          type: "table",
          title: "Среда общих данных (CDE)",
          head: ["English", "По-русски", "Что значит"],
          rows: [
            ["WIP (Work in progress)", "В работе", "Видно только своей команде"],
            ["Shared", "Общий доступ", "Передано смежникам для координации"],
            ["Published", "Опубликовано", "Утверждено для использования, например для стройки"],
            ["Archived", "Архив", "История, больше не актуально"],
            ["Information container", "Информационный контейнер", "Файл, модель или документ как единица хранения"],
            ["Status / Revision code", "Код статуса / изменения", "Метка пригодности и версии файла"]
          ]
        },
        {
          type: "table",
          title: "Уровень информации",
          head: ["English", "По-русски", "Комментарий"],
          rows: [
            ["LOD (Level of Development)", "Уровень проработки", "Шкала 100–500, геометрия плюс надёжность"],
            ["LOI (Level of Information)", "Уровень информации", "Заполненность параметров"],
            ["LOIN", "Необходимый уровень информации", "Подход ISO 19650: ровно столько, сколько нужно для цели"],
            ["As-built", "Исполнительная", "Модель или чертёж по факту построенного"],
            ["Handover", "Передача объекта", "Сдача информации в эксплуатацию"]
          ]
        },
        {
          type: "note",
          kind: "tip",
          title: "Shall, should, may",
          text: "В требованиях это не стилистика, а уровень обязательности. Shall — обязательно, невыполнение — нарушение требований. Should — рекомендуется, отступление нужно обосновать. May — допускается, на ваше усмотрение. При чтении EIR первым делом выделите все shall: это и есть настоящий объём работ."
        },
        {
          type: "key",
          items: [
            "Appointing party — заказчик, lead appointed party — главный исполнитель.",
            "Статусы CDE: WIP → Shared → Published → Archived.",
            "Shall — обязательно, should — рекомендовано, may — можно."
          ]
        }
      ],
      terms: ["EIR", "BEP", "CDE", "As-built"],
      questions: [
        {
          type: "single",
          q: "Кто такой appointing party?",
          options: ["Субподрядчик", "Заказчик — сторона, которая ставит задачу", "Производитель ПО", "Эксперт госэкспертизы"],
          answer: 1,
          explain: "Appointing party в ISO 19650 — назначающая сторона, то есть заказчик."
        },
        {
          type: "single",
          q: "Что означает shall в тексте требований?",
          options: ["Рекомендуется", "Обязательно", "Допускается", "Будет сделано позже"],
          answer: 1,
          explain: "Shall — обязательное требование, его невыполнение считается нарушением."
        },
        {
          type: "input",
          q: "Как по-английски называется статус CDE «в работе» (аббревиатура)?",
          answer: ["wip", "work in progress"],
          explain: "WIP — Work in progress: информация видна только своей команде."
        },
        {
          type: "bool",
          q: "As-built model — это модель на стадии эскиза.",
          answer: false,
          explain: "As-built — исполнительная модель по факту построенного."
        },
        {
          type: "single",
          q: "Milestone в BEP — это:",
          options: ["Камень в основании", "Контрольная точка с датой выдачи", "Тип семейства", "Уровень LOD"],
          answer: 1,
          explain: "К milestone привязывают выдачу информации."
        },
        {
          type: "multi",
          q: "Какие статусы относятся к CDE по ISO 19650?",
          options: ["WIP", "Shared", "Published", "Draft for fun"],
          answer: [0, 1, 2],
          explain: "Плюс Archived. Четвёртый вариант выдуман."
        },
        {
          type: "bool",
          q: "Should в требованиях означает то же, что shall.",
          answer: false,
          explain: "Should — рекомендация: отступить можно, но с обоснованием."
        }
      ]
    },

    {
      id: "en-03",
      title: "Язык координации и коллизий",
      minutes: 12,
      level: "Средний",
      tags: ["английский", "координация", "коллизии"],
      goal: "Читать отчёты о коллизиях и обсуждать их с зарубежными смежниками.",
      blocks: [
        {
          type: "table",
          title: "Коллизии и проверки",
          head: ["English", "По-русски", "Пример"],
          rows: [
            ["Clash", "Коллизия", "Duct clashes with the beam — воздуховод пересекает балку"],
            ["Hard clash", "Жёсткая коллизия", "Физическое пересечение геометрии"],
            ["Soft clash / clearance clash", "Коллизия по зазору", "Нарушено минимальное расстояние"],
            ["Tolerance", "Допуск", "Пересечения меньше допуска не считаются"],
            ["Clearance", "Зазор / свободное пространство", "Maintenance clearance — зона обслуживания"],
            ["Federated model", "Сводная модель", "Модели всех разделов в одном файле"],
            ["Clash test", "Тест на коллизии", "Проверка пары разделов по правилам"],
            ["Viewpoint", "Точка обзора", "Сохранённый вид проблемы, основа BCF"]
          ]
        },
        {
          type: "table",
          title: "Статусы замечаний",
          head: ["English", "По-русски", "Когда ставят"],
          rows: [
            ["New", "Новое", "Замечание только найдено"],
            ["Active / Open", "Активное / открытое", "Признано, в работе"],
            ["Reviewed", "Рассмотрено", "Посмотрели, решение ещё не принято"],
            ["Approved", "Принято", "Пересечение допустимо, менять не будем"],
            ["Resolved / Closed", "Устранено / закрыто", "Исправлено в модели"],
            ["Assigned to", "Назначено", "Кто отвечает за исправление"]
          ]
        },
        {
          type: "list",
          title: "Готовые фразы для отчёта",
          items: [
            "The cable tray clashes with the sprinkler pipe at grid C/4, level 02. — Кабельный лоток пересекается с трубой спринклера в осях C/4 на втором уровне.",
            "Please reroute the duct below the beam. — Просьба перетрассировать воздуховод под балкой.",
            "This clash is within tolerance and can be approved. — Коллизия в пределах допуска, её можно принять.",
            "We need a sleeve in the wall for this pipe. — Для этой трубы нужна гильза в стене.",
            "Responsibility: MEP. Due date: next model drop. — Ответственный: инженерные системы. Срок: следующая выгрузка модели."
          ]
        },
        {
          type: "note",
          kind: "tip",
          title: "Пишите адрес коллизии",
          text: "Хорошее замечание на английском строится по одной схеме: что с чем пересекается — где (оси и уровень) — что сделать — кто и к какому сроку. «Clash at C/4, L02: duct vs beam. Reroute duct below beam. MEP, by next drop.» Коротко, и переводчик не нужен никому."
        },
        {
          type: "key",
          items: [
            "Hard clash — пересечение, soft clash — нарушенный зазор.",
            "Approved — принято как допустимое, resolved — исправлено.",
            "Схема замечания: что — где — что сделать — кто и когда."
          ]
        }
      ],
      terms: ["BCF", "Коллизия"],
      questions: [
        {
          type: "single",
          q: "Чем soft clash отличается от hard clash?",
          options: [
            "Ничем",
            "Soft clash — нарушен минимальный зазор, hard — физическое пересечение",
            "Soft clash — коллизия в архитектуре",
            "Hard clash проверяется только вручную"
          ],
          answer: 1,
          explain: "Soft (clearance) clash — элементы не пересекаются, но стоят ближе допустимого."
        },
        {
          type: "single",
          q: "Статус Approved у коллизии означает:",
          options: ["Исправлено в модели", "Пересечение признано допустимым", "Назначено ответственному", "Новое замечание"],
          answer: 1,
          explain: "Approved — менять не будем, это допустимо. Исправленное — Resolved."
        },
        {
          type: "input",
          q: "Как по-английски «сводная модель» (два слова)?",
          answer: ["federated model", "federated models"],
          explain: "Federated model — модели всех разделов, собранные вместе."
        },
        {
          type: "single",
          q: "Что значит фраза «Please reroute the duct»?",
          options: ["Удалите воздуховод", "Перетрассируйте воздуховод", "Увеличьте воздуховод", "Покрасьте воздуховод"],
          answer: 1,
          explain: "Reroute — проложить по другому маршруту."
        },
        {
          type: "bool",
          q: "Tolerance — это допуск, в пределах которого пересечения не считаются коллизиями.",
          answer: true,
          explain: "Допуск отсекает несущественные касания."
        },
        {
          type: "input",
          q: "Как по-английски «гильза» для трубы в стене?",
          answer: ["sleeve", "pipe sleeve"],
          explain: "Sleeve — гильза; penetration — проходка."
        },
        {
          type: "multi",
          q: "Что должно быть в хорошем замечании?",
          options: ["Что с чем пересекается", "Где: оси и уровень", "Кто исправляет и к какому сроку", "Мнение о квалификации смежника"],
          answer: [0, 1, 2],
          explain: "Оценки людей в замечаниях не нужны — только факт, место, действие и ответственный."
        }
      ]
    },

    {
      id: "en-04",
      title: "Деловая переписка по проекту",
      minutes: 11,
      level: "Средний",
      tags: ["английский", "переписка", "email"],
      goal: "Писать короткие, понятные и вежливые письма смежникам и заказчику.",
      blocks: [
        {
          type: "text",
          text: "Проектная переписка на английском строится из десятка устойчивых фраз. Их не нужно сочинять — достаточно знать и подставлять своё. Главное правило: одно письмо — одна тема, а то, что нужно сделать, стоит в начале, а не в последнем абзаце."
        },
        {
          type: "table",
          title: "Фразы, которые закрывают 80% писем",
          head: ["English", "По-русски", "Когда"],
          rows: [
            ["Please find attached…", "Во вложении…", "Отправляете файлы"],
            ["As discussed in today's meeting…", "Как обсуждали на сегодняшней встрече…", "Фиксируете договорённость"],
            ["Could you please confirm … by Friday?", "Подтвердите, пожалуйста, … до пятницы", "Нужен ответ к сроку"],
            ["Please see our comments below.", "Наши комментарии ниже.", "Отвечаете по пунктам"],
            ["We have noticed that…", "Мы заметили, что…", "Мягко сообщаете о проблеме"],
            ["Kindly let us know if…", "Сообщите, пожалуйста, если…", "Вежливая просьба"],
            ["For your review / approval / information", "На рассмотрение / согласование / к сведению", "Назначение отправки"],
            ["Looking forward to your feedback.", "Ждём вашей обратной связи.", "Вежливое завершение"]
          ]
        },
        {
          type: "table",
          title: "Документы в переписке",
          head: ["English", "По-русски", "Что это"],
          rows: [
            ["RFI (Request for Information)", "Запрос информации", "Официальный вопрос к проектировщику или заказчику"],
            ["Transmittal", "Сопроводительный реестр", "Список переданных файлов с версиями и назначением"],
            ["Submittal", "Документ на согласование", "Подрядчик отправляет на одобрение"],
            ["Markup / Redline", "Пометки / красные правки", "Замечания поверх чертежа"],
            ["Revision", "Изменение (ревизия)", "Новая версия документа: Rev A, Rev B"],
            ["Issue", "Выдача / замечание", "Issued for construction — выдано в производство"]
          ]
        },
        {
          type: "steps",
          title: "Структура хорошего письма",
          items: [
            "Тема письма называет проект и суть: «Tower A — RFI-014 — slab opening size».",
            "Первая строка — что нужно от получателя и к какому сроку.",
            "Дальше — контекст: что произошло и на что ссылаемся (лист, модель, номер замечания).",
            "Вложения перечислены, если их больше одного.",
            "Короткое вежливое завершение без лишних извинений."
          ]
        },
        {
          type: "note",
          kind: "warn",
          title: "Revert — осторожно",
          text: "В переписке с Индией и Ближним Востоком часто пишут «we will revert» в значении «мы ответим». В британском и американском английском revert значит «вернуться к прежнему состоянию». Понимать это значение полезно, а самим надёжнее писать «we will get back to you»."
        },
        {
          type: "key",
          items: [
            "Действие и срок — в первой строке письма.",
            "Тема письма: проект — номер — суть.",
            "RFI — официальный вопрос, transmittal — реестр переданного."
          ]
        }
      ],
      terms: ["RFI", "Transmittal"],
      questions: [
        {
          type: "single",
          q: "Как по-английски начать письмо, к которому приложены файлы?",
          options: ["Please find attached…", "I attach you…", "Look the files…", "Here is attaching…"],
          answer: 0,
          explain: "Please find attached — стандартная деловая формула."
        },
        {
          type: "input",
          q: "Как называется официальный запрос информации (аббревиатура)?",
          answer: ["rfi", "request for information"],
          explain: "RFI — Request for Information."
        },
        {
          type: "single",
          q: "For approval означает, что документ отправлен:",
          options: ["К сведению", "На согласование", "В архив", "На печать"],
          answer: 1,
          explain: "For information — к сведению, for review — на рассмотрение, for approval — на согласование."
        },
        {
          type: "bool",
          q: "В деловом письме главное действие и срок лучше писать в самом конце.",
          answer: false,
          explain: "Действие и срок — в первой строке: длинные письма дочитывают не всегда."
        },
        {
          type: "single",
          q: "Что такое transmittal?",
          options: ["Счёт за работы", "Реестр переданных файлов с версиями и назначением", "Чат проекта", "Тип коллизии"],
          answer: 1,
          explain: "Transmittal фиксирует, что, в какой версии и зачем передано."
        },
        {
          type: "input",
          q: "Переведите: «Как обсуждали на встрече» (начало фразы: As discussed…)",
          answer: ["as discussed in the meeting", "as discussed in today's meeting", "as discussed at the meeting", "as discussed in our meeting"],
          explain: "As discussed in today's meeting — хорошая формула, чтобы зафиксировать договорённость письменно."
        },
        {
          type: "bool",
          q: "Issued for construction означает «выдано в производство работ».",
          answer: true,
          explain: "Issue здесь — выдача документации, а не проблема."
        }
      ]
    },

    {
      id: "en-05",
      title: "Совещания и созвоны",
      minutes: 10,
      level: "Средний",
      tags: ["английский", "совещания", "координация"],
      goal: "Уверенно участвовать в координационном совещании на английском.",
      blocks: [
        {
          type: "text",
          text: "Координационное совещание идёт по одному сценарию: повестка, разбор замечаний, поручения, следующие шаги. Если знать фразы для каждой части, можно участвовать уверенно даже со средним уровнем языка — а уточняющие вопросы на совещаниях задают и носители."
        },
        {
          type: "table",
          title: "Фразы по ходу совещания",
          head: ["Ситуация", "English", "По-русски"],
          rows: [
            ["Начать", "Let's go through the clash report.", "Давайте пройдёмся по отчёту о коллизиях"],
            ["Кто отвечает", "Who owns this issue?", "Кто отвечает за это замечание?"],
            ["Перенести", "Can we push this to the next model drop?", "Перенесём на следующую выгрузку модели?"],
            ["Разграничить", "This is a design issue, not a modelling issue.", "Это вопрос проектного решения, а не моделирования"],
            ["Нужно решение", "We need a decision from the client.", "Нужно решение заказчика"],
            ["Переспросить", "Sorry, could you repeat that?", "Простите, можете повторить?"],
            ["Уточнить", "Just to clarify — you mean the level 3 slab?", "Уточню: вы про плиту третьего уровня?"],
            ["Показать", "Could you share your screen?", "Можете показать экран?"]
          ]
        },
        {
          type: "table",
          title: "Сокращения в протоколах",
          head: ["Сокращение", "Расшифровка", "По-русски"],
          rows: [
            ["AI", "Action item", "Поручение"],
            ["TBC", "To be confirmed", "Требует подтверждения"],
            ["TBD", "To be determined", "Предстоит определить"],
            ["ETA", "Estimated time of arrival", "Ожидаемый срок"],
            ["FYI", "For your information", "К сведению"],
            ["AOB", "Any other business", "Разное, в конце повестки"],
            ["POC", "Point of contact", "Контактное лицо"]
          ]
        },
        {
          type: "note",
          kind: "tip",
          title: "Переспрашивать — нормально",
          text: "Самая дорогая ошибка на совещании — кивнуть, не поняв. Фраза «Just to clarify…» с пересказом своими словами показывает, что вы внимательны, и сразу ловит недопонимание. Поручение, понятое неправильно, обходится в неделю переделки."
        },
        {
          type: "key",
          items: [
            "Сценарий совещания: повестка → замечания → поручения → следующие шаги.",
            "Action item, TBC, TBD — главные сокращения протокола.",
            "«Just to clarify…» дешевле недели переделки."
          ]
        }
      ],
      terms: ["Action item"],
      questions: [
        {
          type: "single",
          q: "Что значит TBC в протоколе?",
          options: ["To be confirmed — требует подтверждения", "Take back control", "Total building cost", "To be cancelled"],
          answer: 0,
          explain: "TBC — to be confirmed; TBD — to be determined."
        },
        {
          type: "input",
          q: "Как по-английски «поручение» в протоколе совещания (два слова)?",
          answer: ["action item", "action items"],
          explain: "Action item — у каждого есть ответственный и срок."
        },
        {
          type: "single",
          q: "Как вежливо переспросить, не поняв фразу?",
          options: ["What?", "Sorry, could you repeat that?", "Repeat!", "I don't care"],
          answer: 1,
          explain: "Вежливая и привычная на совещаниях формула."
        },
        {
          type: "single",
          q: "«Who owns this issue?» означает:",
          options: ["Чья это модель?", "Кто отвечает за это замечание?", "Кто купил лицензию?", "Чей это объект?"],
          answer: 1,
          explain: "Own an issue — отвечать за его решение."
        },
        {
          type: "bool",
          q: "AOB в повестке — это пункт «разное» в конце совещания.",
          answer: true,
          explain: "Any other business."
        },
        {
          type: "single",
          q: "Фраза «This is a design issue, not a modelling issue» значит, что:",
          options: [
            "Модельер ошибся",
            "Нужно решение проектировщика, а не исправление модели",
            "Модель надо удалить",
            "Ошибка в ПО"
          ],
          answer: 1,
          explain: "Разделение вопроса решения и вопроса моделирования экономит время на совещании."
        }
      ]
    },

    {
      id: "en-06",
      title: "Строительная лексика и ложные друзья",
      minutes: 13,
      level: "Средний",
      tags: ["английский", "конструкции", "инженерные системы"],
      goal: "Знать названия конструкций и систем и не попадаться на ложных друзей переводчика.",
      blocks: [
        {
          type: "table",
          title: "Конструкции",
          head: ["English", "По-русски", "Комментарий"],
          rows: [
            ["Slab", "Плита перекрытия", "Floor в Revit — тоже перекрытие"],
            ["Beam", "Балка", ""],
            ["Column", "Колонна", "Structural column — несущая"],
            ["Footing", "Фундамент под колонну, подошва", "Foundation — фундамент в целом"],
            ["Load-bearing wall", "Несущая стена", "Partition — перегородка"],
            ["Shaft", "Шахта", "Лифтовая или инженерная"],
            ["Opening", "Проём / отверстие", "В стене или плите"],
            ["Ceiling void", "Запотолочное пространство", "Где идут инженерные сети"]
          ]
        },
        {
          type: "table",
          title: "Инженерные системы (MEP)",
          head: ["English", "По-русски", "Комментарий"],
          rows: [
            ["MEP", "Инженерные системы", "Mechanical, electrical, plumbing"],
            ["HVAC", "ОВиК", "Отопление, вентиляция, кондиционирование"],
            ["Plumbing", "Водопровод и канализация (ВК)", ""],
            ["Duct", "Воздуховод", ""],
            ["Pipe", "Труба", ""],
            ["Riser", "Стояк", "Вертикальный участок сети"],
            ["Cable tray", "Кабельный лоток", ""],
            ["Fire damper", "Огнезадерживающий клапан", "Ставится в воздуховоде на границе пожарного отсека"],
            ["Penetration", "Проходка", "Место прохода сети через конструкцию"]
          ]
        },
        {
          type: "table",
          title: "Ложные друзья переводчика",
          head: ["English", "Кажется, что это", "А на самом деле"],
          rows: [
            ["Specification", "Спецификация (таблица)", "Технические требования к материалам и работам; таблица Revit — schedule"],
            ["Phase (Revit)", "Фаза", "Стадия: существующее, демонтаж, новое"],
            ["Revision", "Ревизия-проверка", "Изменение документа и его номер: Rev C"],
            ["Issue", "Выпуск журнала", "Выдача документации или замечание — по контексту"],
            ["Detail", "Деталь", "Узел — чертёж конструктивного решения"],
            ["Project", "Проектная документация", "Проект как работа или объект; документация — design / drawings"],
            ["Elevation", "Подъём", "Фасад или высотная отметка"],
            ["Mark", "Отметка", "Марка элемента; отметка высоты — elevation или level"]
          ]
        },
        {
          type: "note",
          kind: "warn",
          title: "Specification — самая частая ошибка",
          text: "Если зарубежный заказчик просит specification, он почти всегда имеет в виду текстовый документ с требованиями к материалам, изделиям и работам, а не таблицу из модели. Таблица количеств в Revit — это schedule, ведомость объёмов — bill of quantities (BoQ). Уточните, что именно нужно, иначе отправите совсем не тот документ."
        },
        {
          type: "key",
          items: [
            "Specification — требования, schedule — таблица Revit, BoQ — ведомость объёмов.",
            "Detail — узел, phase — стадия, mark — марка.",
            "MEP — инженерные системы, HVAC — ОВиК."
          ]
        }
      ],
      terms: ["Specification (англ.)", "MEP"],
      questions: [
        {
          type: "single",
          q: "Заказчик просит specification. Что ему почти наверняка нужно?",
          options: [
            "Спецификацию из Revit",
            "Текстовые технические требования к материалам и работам",
            "Ведомость чертежей",
            "Протокол совещания"
          ],
          answer: 1,
          explain: "Таблица Revit — schedule, ведомость объёмов — BoQ."
        },
        {
          type: "input",
          q: "Как по-английски «воздуховод»?",
          answer: ["duct", "ductwork", "air duct"],
          explain: "Duct — воздуховод, pipe — труба."
        },
        {
          type: "single",
          q: "Что означает Detail на чертеже?",
          options: ["Деталь изделия", "Узел", "Подробную спецификацию", "Мелкий шрифт"],
          answer: 1,
          explain: "Detail — узел, чертёж конструктивного решения."
        },
        {
          type: "bool",
          q: "HVAC — это отопление, вентиляция и кондиционирование.",
          answer: true,
          explain: "Heating, ventilation and air conditioning — ОВиК."
        },
        {
          type: "single",
          q: "Как переводится riser?",
          options: ["Подъёмник", "Стояк", "Лестница", "Насос"],
          answer: 1,
          explain: "Riser — вертикальный участок инженерной сети."
        },
        {
          type: "multi",
          q: "Какие пары перевода верны?",
          options: ["Slab — плита перекрытия", "Phase — стадия в Revit", "Mark — высотная отметка", "Penetration — проходка"],
          answer: [0, 1, 3],
          explain: "Mark — марка элемента, высотная отметка — elevation или level."
        },
        {
          type: "input",
          q: "Как по-английски «ведомость объёмов работ» (аббревиатура)?",
          answer: ["boq", "bill of quantities"],
          explain: "BoQ — Bill of Quantities."
        }
      ]
    }
  ]
});

// Словарь для игр «Найди пару» и «Блиц». topic — тема, en — английский, ru — перевод.
window.BIM_CONTENT.vocab = [
  { topic: "revit", en: "Level", ru: "Уровень" },
  { topic: "revit", en: "Grid", ru: "Ось" },
  { topic: "revit", en: "Floor plan", ru: "План этажа" },
  { topic: "revit", en: "Section", ru: "Разрез" },
  { topic: "revit", en: "View range", ru: "Секущий диапазон" },
  { topic: "revit", en: "View template", ru: "Шаблон вида" },
  { topic: "revit", en: "Crop region", ru: "Область кадрирования" },
  { topic: "revit", en: "Family", ru: "Семейство" },
  { topic: "revit", en: "Type", ru: "Типоразмер" },
  { topic: "revit", en: "Instance parameter", ru: "Параметр экземпляра" },
  { topic: "revit", en: "Shared parameter", ru: "Общий параметр" },
  { topic: "revit", en: "Schedule", ru: "Спецификация Revit" },
  { topic: "revit", en: "Tag", ru: "Марка на виде" },
  { topic: "revit", en: "Sheet", ru: "Лист" },
  { topic: "revit", en: "Title block", ru: "Основная надпись" },
  { topic: "revit", en: "Legend", ru: "Легенда" },
  { topic: "revit", en: "Keynote", ru: "Ключевая пометка" },
  { topic: "revit", en: "Dimension", ru: "Размер" },
  { topic: "revit", en: "Text note", ru: "Текстовое примечание" },
  { topic: "revit", en: "Central model", ru: "Центральная модель" },
  { topic: "revit", en: "Local file", ru: "Локальная копия" },
  { topic: "revit", en: "Workset", ru: "Рабочий набор" },
  { topic: "revit", en: "Relinquish", ru: "Освободить элементы" },
  { topic: "revit", en: "Borrow", ru: "Заимствовать" },
  { topic: "revit", en: "Purge unused", ru: "Удалить неиспользуемое" },
  { topic: "revit", en: "Linked model", ru: "Связанная модель" },
  { topic: "revit", en: "Shared coordinates", ru: "Общие координаты" },
  { topic: "revit", en: "Project base point", ru: "Базовая точка проекта" },
  { topic: "revit", en: "Survey point", ru: "Точка съёмки" },
  { topic: "revit", en: "True north", ru: "Истинный север" },
  { topic: "revit", en: "Warning", ru: "Предупреждение" },
  { topic: "revit", en: "Phase", ru: "Стадия" },

  { topic: "docs", en: "Appointing party", ru: "Заказчик (назначающая сторона)" },
  { topic: "docs", en: "Lead appointed party", ru: "Главный исполнитель" },
  { topic: "docs", en: "Task team", ru: "Рабочая группа" },
  { topic: "docs", en: "Deliverable", ru: "Поставляемый результат" },
  { topic: "docs", en: "Milestone", ru: "Контрольная точка" },
  { topic: "docs", en: "Work in progress", ru: "В работе" },
  { topic: "docs", en: "Published", ru: "Опубликовано" },
  { topic: "docs", en: "Archived", ru: "В архиве" },
  { topic: "docs", en: "Information container", ru: "Информационный контейнер" },
  { topic: "docs", en: "As-built", ru: "Исполнительная" },
  { topic: "docs", en: "Handover", ru: "Передача в эксплуатацию" },
  { topic: "docs", en: "Stakeholder", ru: "Заинтересованная сторона" },
  { topic: "docs", en: "Scope of work", ru: "Объём работ" },
  { topic: "docs", en: "Shall", ru: "Обязательно (в требованиях)" },
  { topic: "docs", en: "Should", ru: "Рекомендуется (в требованиях)" },
  { topic: "docs", en: "Bill of quantities", ru: "Ведомость объёмов работ" },
  { topic: "docs", en: "Specification", ru: "Технические требования" },

  { topic: "coord", en: "Clash", ru: "Коллизия" },
  { topic: "coord", en: "Hard clash", ru: "Пересечение геометрии" },
  { topic: "coord", en: "Clearance clash", ru: "Нарушение зазора" },
  { topic: "coord", en: "Tolerance", ru: "Допуск" },
  { topic: "coord", en: "Clearance", ru: "Зазор" },
  { topic: "coord", en: "Federated model", ru: "Сводная модель" },
  { topic: "coord", en: "Viewpoint", ru: "Точка обзора" },
  { topic: "coord", en: "Resolved", ru: "Устранено" },
  { topic: "coord", en: "Approved", ru: "Принято как допустимое" },
  { topic: "coord", en: "Assigned to", ru: "Назначено на" },
  { topic: "coord", en: "Reroute", ru: "Перетрассировать" },
  { topic: "coord", en: "Model drop", ru: "Выгрузка модели" },
  { topic: "coord", en: "Coordination meeting", ru: "Координационное совещание" },
  { topic: "coord", en: "Action item", ru: "Поручение" },
  { topic: "coord", en: "Due date", ru: "Срок исполнения" },
  { topic: "coord", en: "To be confirmed", ru: "Требует подтверждения" },
  { topic: "coord", en: "To be determined", ru: "Предстоит определить" },
  { topic: "coord", en: "Point of contact", ru: "Контактное лицо" },
  { topic: "coord", en: "Next steps", ru: "Следующие шаги" },

  { topic: "mail", en: "Please find attached", ru: "Во вложении" },
  { topic: "mail", en: "As discussed", ru: "Как обсуждали" },
  { topic: "mail", en: "For your review", ru: "На рассмотрение" },
  { topic: "mail", en: "For approval", ru: "На согласование" },
  { topic: "mail", en: "For information", ru: "К сведению" },
  { topic: "mail", en: "Request for information", ru: "Запрос информации" },
  { topic: "mail", en: "Transmittal", ru: "Сопроводительный реестр" },
  { topic: "mail", en: "Submittal", ru: "Документ на согласование" },
  { topic: "mail", en: "Markup", ru: "Пометки на чертеже" },
  { topic: "mail", en: "Revision", ru: "Изменение документа" },
  { topic: "mail", en: "Issued for construction", ru: "Выдано в производство" },
  { topic: "mail", en: "Get back to you", ru: "Ответить позже" },
  { topic: "mail", en: "Deadline", ru: "Крайний срок" },

  { topic: "build", en: "Slab", ru: "Плита перекрытия" },
  { topic: "build", en: "Beam", ru: "Балка" },
  { topic: "build", en: "Column", ru: "Колонна" },
  { topic: "build", en: "Footing", ru: "Подошва фундамента" },
  { topic: "build", en: "Foundation", ru: "Фундамент" },
  { topic: "build", en: "Load-bearing wall", ru: "Несущая стена" },
  { topic: "build", en: "Partition", ru: "Перегородка" },
  { topic: "build", en: "Shaft", ru: "Шахта" },
  { topic: "build", en: "Opening", ru: "Проём" },
  { topic: "build", en: "Ceiling void", ru: "Запотолочное пространство" },
  { topic: "build", en: "Roof", ru: "Кровля" },
  { topic: "build", en: "Staircase", ru: "Лестничная клетка" },
  { topic: "build", en: "Facade", ru: "Фасад здания" },
  { topic: "build", en: "Curtain wall", ru: "Витражная стена" },
  { topic: "build", en: "Reinforcement", ru: "Армирование" },
  { topic: "build", en: "Detail", ru: "Узел" },
  { topic: "build", en: "Duct", ru: "Воздуховод" },
  { topic: "build", en: "Pipe", ru: "Труба" },
  { topic: "build", en: "Riser", ru: "Стояк" },
  { topic: "build", en: "Cable tray", ru: "Кабельный лоток" },
  { topic: "build", en: "Fire damper", ru: "Огнезадерживающий клапан" },
  { topic: "build", en: "Penetration", ru: "Проходка" },
  { topic: "build", en: "Sleeve", ru: "Гильза" },
  { topic: "build", en: "Sprinkler", ru: "Спринклер" },
  { topic: "build", en: "Plumbing", ru: "Водопровод и канализация" },
  { topic: "build", en: "HVAC", ru: "Отопление, вентиляция и кондиционирование" },
  { topic: "build", en: "Building services", ru: "Инженерное оборудование здания" }
];
