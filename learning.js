/* Offline counters retain each device's contribution across repeated syncs. */
(function (root) {
  "use strict";
  function add(state, device, parts, amount) {
    const key = parts.join("/");
    const ledger = state.contributions ||= {};
    const row = ledger[key] ||= {};
    row[device] = (row[device] || 0) + amount;
    const field = parts.at(-1);
    const target = parts.slice(0, -1).reduce((obj, part) => obj[part] ||= {}, state);
    target[field] = (target[field] || 0) + amount;
  }
  function mergeCounters(a, b, out) {
    const left = a.contributions || {};
    const right = b.contributions || {};
    out.contributions = {};
    for (const key of new Set([...Object.keys(left), ...Object.keys(right)])) {
      if (!/^(xp|answers\/(total|correct)|byCourse\/[a-z0-9-]+\/(total|correct)|days\/\d{4}-\d{2}-\d{2}\/[a-z]+)$/.test(key)) continue;
      const parts = key.split("/");
      const l = left[key] || {}, r = right[key] || {};
      const row = {};
      for (const id of new Set([...Object.keys(l), ...Object.keys(r)])) {
        row[id] = Math.max(l[id] || 0, r[id] || 0);
      }
      const sum = (x) => Object.values(x).reduce((n, v) => n + v, 0);
      const prior = (s, x) => (parts.reduce((v, k) => v?.[k], s) || 0) - sum(x);
      const target = parts.slice(0, -1).reduce((obj, k) => (obj[k] = {...obj[k]}), out);
      target[parts.at(-1)] = Math.max(0, prior(a,l), prior(b,r)) + sum(row);
      out.contributions[key] = row;
    }
  }
  async function syncRow(sb, userId, deviceId, active, reconcile) {
    for (let attempt = 0; attempt < 3; attempt++) {
        const row = await sb.from("progress").select("state,updated_at").eq("user_id", userId).maybeSingle();
        if (row.error) throw row.error;
        if (!active()) return true;
        const remote = row.data?.state;
        const merged = reconcile(remote);
        if (remote && JSON.stringify(merged) === JSON.stringify(remote)) return true;
        const previous = row.data?.updated_at;
        const stamp = Math.max(Date.now(), (Date.parse(previous) || 0) + 1);
        const payload = {state: merged, device: deviceId, updated_at: new Date(stamp).toISOString()};
        // If another device won this race, read its changes before retrying.
        let query;
        if (row.data) {
          query = sb.from("progress").update(payload).eq("user_id", userId);
          query = previous ? query.eq("updated_at", previous) : query.is("updated_at", null);
        } else {
          query = sb.from("progress").insert({...payload, user_id: userId});
        }
        const saved = await query.select("updated_at").maybeSingle();
        if (saved.error && saved.error.code !== "23505") throw saved.error;
        if (saved.data) return true;
    }
    return false;
  }
  root.BIM_LEARNING = { add, mergeCounters, syncRow };
})(typeof window === "undefined" ? globalThis : window);
