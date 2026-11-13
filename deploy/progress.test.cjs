const test = require('node:test');
const assert = require('node:assert/strict');
require('../learning.js');
const {add, mergeCounters} = globalThis.BIM_LEARNING;
test('Independent answers from two offline devices survive repeated merges', () => {
  const base = {answers:{total:10,correct:8}, xp:100};
  const states = ['phone','desktop'].map(device => {
    const s = structuredClone(base);
    add(s, device, ['answers','total'], 1);
    add(s, device, ['answers','correct'], 1);
    add(s, device, ['xp'], 3);
    return s;
  });
  const merged = {};
  mergeCounters(...states, merged);
  assert.deepEqual(merged.answers, {total:12,correct:10});
  assert.equal(merged.xp, 106);
  const replay = {};
  mergeCounters(merged, states[0], replay);
  assert.deepEqual(replay, merged);
});

test('A concurrent update is read again before saving local work', async () => {
  let row = {state:{remote:1}, updated_at:'2026-10-30T12:00:00.000Z'};
  let writes = 0;
  const table = {
    select() { return this; },
    eq() { return this; },
    async maybeSingle() { return {data:structuredClone(row)}; },
    update(payload) {
      let expected;
      const query = {
        eq(field, value) { if (field === 'updated_at') expected = value; return this; },
        select() { return this; },
        async maybeSingle() {
          if (++writes === 1) row = {state:{remote:2},updated_at:'2026-10-30T12:01:00.000Z'};
          if (expected !== row.updated_at) return {data:null};
          row = payload;
          return {data:{updated_at:row.updated_at}};
        }
      };
      return query;
    }
  };
  const saved = await globalThis.BIM_LEARNING.syncRow({from:()=>table}, 'user', 'desktop', ()=>true, remote => ({...remote, local:1}));
  assert.equal(saved,true);
  assert.equal(writes,2);
  assert.deepEqual(row.state,{remote:2,local:1});
});
