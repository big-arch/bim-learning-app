/**
 * Прокси для RSS-лент на Cloudflare Workers.
 *
 * Зачем он нужен: браузер не разрешает странице забирать ленту с чужого сайта —
 * мешает политика CORS. Этот worker забирает ленту на своей стороне и отдаёт её
 * приложению уже с разрешающим заголовком.
 *
 * Почему именно Workers: бесплатного тарифа хватает с большим запасом, свой
 * сервер не нужен, работает в том числе с приложением на GitHub Pages.
 *
 * Как развернуть:
 *   1. cloudflare.com → Workers & Pages → Create → Worker
 *   2. Заменить содержимое редактора на этот файл
 *   3. Вписать свои домены в ALLOW ниже
 *   4. Deploy. Адрес будет вида https://имя.ваш-аккаунт.workers.dev
 *   5. В приложении: «Ещё» → «Новости» → адрес прокси
 *      https://имя.ваш-аккаунт.workers.dev/?url=
 *
 * Важно: список ALLOW обязателен. Прокси без него пересылает запрос куда угодно,
 * и рано или поздно его используют для атак от вашего имени.
 */

const ALLOW = [
  "minstroyrf.gov.ru",
  "www.faufcc.ru",
  "notim.ru",
  "isicad.ru",
  "ancb.ru",
  "erzrf.ru",
  "rengabim.com",
  "www.nanocad.ru",
  "ascon.ru",
  "www.csoft.ru",
  "www.buildingsmart.org",
  "www.thenbs.com",
  "aecmag.com",
  "www.bimplus.co.uk",
  "adsknews.autodesk.com",
  "graphisoft.com"
];

// Сколько держать ответ в кэше Cloudflare. Ленты обновляются нечасто,
// а лишние запросы к чужим сайтам никому не нужны.
const CACHE_SECONDS = 900;

export default {
  async fetch(request) {
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }
    if (request.method !== "GET") {
      return new Response("only GET", { status: 405, headers: cors });
    }

    const target = new URL(request.url).searchParams.get("url");
    if (!target) {
      return new Response("нет параметра url", { status: 400, headers: cors });
    }

    let host;
    try {
      const parsed = new URL(target);
      if (parsed.protocol !== "https:" && parsed.protocol !== "http:") throw new Error("схема");
      host = parsed.hostname;
    } catch (e) {
      return new Response("некорректный адрес", { status: 400, headers: cors });
    }

    if (!ALLOW.includes(host)) {
      return new Response("хост не в списке разрешённых: " + host, { status: 403, headers: cors });
    }

    try {
      const upstream = await fetch(target, {
        headers: { "User-Agent": "BIM Academy feed reader" },
        cf: { cacheTtl: CACHE_SECONDS, cacheEverything: true }
      });

      if (!upstream.ok) {
        return new Response("источник ответил " + upstream.status, { status: 502, headers: cors });
      }

      const body = await upstream.text();
      return new Response(body, {
        status: 200,
        headers: Object.assign({}, cors, {
          "Content-Type": "application/xml; charset=utf-8",
          "Cache-Control": "public, max-age=" + CACHE_SECONDS
        })
      });
    } catch (e) {
      return new Response("не удалось получить ленту", { status: 502, headers: cors });
    }
  }
};
