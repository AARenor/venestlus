'use strict';

// Integration tests for the Venestlus API: personality, matching, circles,
// plans, auth and validation. Run with: node --test tests/

const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const { createApp } = require('../src/server');
const { buildProfile } = require('../src/personality');
const { match, scorePair } = require('../src/match');
const { CIRCLES, PLANS } = require('../src/data');

process.env.LOG_REQUESTS = '0';
process.env.RATE_LIMIT_MAX = '100000';

function tmp() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'venestlus-'));
}

async function boot(dir) {
  const server = createApp({ dataDir: dir });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${server.address().port}`;
  return {
    base,
    close: () => new Promise((r) => server.close(r)),
    get: async (p, token) => {
      const res = await fetch(base + p, { headers: token ? { authorization: `Bearer ${token}` } : {} });
      return { status: res.status, body: await res.json() };
    },
    post: async (p, body, token) => {
      const res = await fetch(base + p, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          ...(token ? { authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body || {}),
      });
      return { status: res.status, body: await res.json() };
    },
  };
}

const SAMPLE = {
  name: 'Mari',
  age: 29,
  city: 'Tallinn',
  lang: 'et',
  tongue: 'et',
  looking: 'friends',
  weekend: 'outdoors',
  interests: ['nature', 'music', 'travel', 'food'],
  note: '',
  plans: ['p_market', 'p_lang'],
};

const SAMPLE2 = {
  name: 'Dmitri',
  age: 31,
  city: 'Tallinn',
  lang: 'ru',
  tongue: 'ru',
  looking: 'friends',
  weekend: 'outdoors',
  interests: ['nature', 'travel', 'sport', 'languages'],
  note: '',
  plans: [],
};

test('personality: traits bounded, archetype + bilingual summary', () => {
  const p = buildProfile(SAMPLE);
  for (const [k, v] of Object.entries(p.traits)) {
    assert.ok(v >= 5 && v <= 95, `${k}=${v} out of bounds`);
  }
  assert.ok(p.archetype.et.length > 0 && p.archetype.ru.length > 0);
  assert.ok(p.summary.et.includes('Mari') && p.summary.ru.includes('Mari'));
  assert.ok(/[а-яё]/i.test(p.summary.ru), 'russian summary must contain cyrillic');
  assert.strictEqual(p.ai, false);
});

test('personality: different answers give different traits', () => {
  const a = buildProfile(SAMPLE);
  const b = buildProfile({ ...SAMPLE, weekend: 'home', interests: ['reading', 'family'] });
  assert.notDeepStrictEqual(a.traits, b.traits);
  assert.notStrictEqual(a.archetype.et, undefined);
});

test('scorePair: cross-language pair with shared interests scores high', () => {
  const me = buildProfile(SAMPLE);
  const other = buildProfile(SAMPLE2);
  const a = { ...SAMPLE, ...me, id: 'a' };
  const b = { ...SAMPLE2, ...other, id: 'b' };
  const score = scorePair(a, b);
  assert.ok(score >= 35 && score <= 100, `score ${score}`);
  const stranger = { ...b, interests: ['cinema'], weekend: 'home' };
  assert.ok(scorePair(a, stranger) < score + 1);
});

test('HTTP: stats, static shell, healthz', async () => {
  const app = await boot(tmp());
  try {
    const stats = await app.get('/api/stats');
    assert.strictEqual(stats.status, 200);
    assert.strictEqual(typeof stats.body.profiles, 'number');
    assert.strictEqual(stats.body.circles, CIRCLES.length);
    assert.strictEqual(stats.body.plans, PLANS.length);
    assert.strictEqual(stats.body.ai, false);

    const health = await app.get('/healthz');
    assert.strictEqual(health.body.ok, true);

    const page = await fetch(app.base + '/');
    assert.strictEqual(page.status, 200);
    assert.match(page.headers.get('content-type'), /text\/html/);
    const html = await page.text();
    assert.match(html, /Venestlus/);
    assert.strictEqual(page.headers.get('content-security-policy').includes("default-src 'self'"), true);
  } finally {
    await app.close();
  }
});

test('HTTP: profile -> me -> matches happy path', async () => {
  const app = await boot(tmp());
  try {
    const a = await app.post('/api/profile', SAMPLE);
    assert.strictEqual(a.status, 200, JSON.stringify(a.body));
    assert.ok(a.body.token && a.body.id);
    assert.ok(a.body.personality.traits && a.body.personality.summary.et);

    const b = await app.post('/api/profile', SAMPLE2);
    assert.strictEqual(b.status, 200);

    const me = await app.get('/api/me', a.body.token);
    assert.strictEqual(me.status, 200);
    assert.strictEqual(me.body.name, 'Mari');
    assert.deepStrictEqual(me.body.joinedPlans.sort(), ['p_lang', 'p_market']);

    const matches = await app.get('/api/matches', a.body.token);
    assert.strictEqual(matches.status, 200);
    assert.strictEqual(matches.body.matches.length, 1);
    const m = matches.body.matches[0];
    assert.strictEqual(m.name, 'Dmitri');
    assert.ok(m.score >= 35, `score ${m.score}`);
    assert.ok(Array.isArray(m.reasons) && m.reasons.length >= 1);
    assert.ok(typeof m.summary.et === 'string');
  } finally {
    await app.close();
  }
});

test('HTTP: auth required for protected routes', async () => {
  const app = await boot(tmp());
  try {
    for (const p of ['/api/me', '/api/matches']) {
      const r = await app.get(p);
      assert.strictEqual(r.status, 401, p);
    }
    const r1 = await app.post('/api/circles/c_lang/join', {});
    assert.strictEqual(r1.status, 401);
    const r2 = await app.post('/api/profile', { ...SAMPLE, name: '' });
    assert.strictEqual(r2.status, 400);
    const r3 = await app.post('/api/profile', { ...SAMPLE, age: 11 });
    assert.strictEqual(r3.status, 400);
    const r3b = await app.post('/api/profile', { ...SAMPLE, age: 12 });
    assert.strictEqual(r3b.status < 400, true, 'age 12 must be allowed');
    const r4 = await app.post('/api/profile', { ...SAMPLE, interests: ['nope'] });
    assert.strictEqual(r4.status, 400);
    const r5 = await app.get('/api/nope');
    assert.strictEqual(r5.status, 404);
    const r6 = await app.get('/api/me', 'not-a-real-token');
    assert.strictEqual(r6.status, 401);
  } finally {
    await app.close();
  }
});

test('HTTP: circles list + join toggle', async () => {
  const app = await boot(tmp());
  try {
    const a = await app.post('/api/profile', SAMPLE);
    const anon = await app.get('/api/circles');
    assert.strictEqual(anon.status, 200);
    assert.strictEqual(anon.body.circles.length, CIRCLES.length);
    const first = anon.body.circles[0];
    assert.ok(first.id && typeof first.members === 'number');
    assert.strictEqual(first.joined, false);

    const join = await app.post('/api/circles/c_lang/join', {}, a.body.token);
    assert.strictEqual(join.status, 200);
    assert.strictEqual(join.body.joined, true);
    const anon2 = await app.get('/api/circles');
    const lang = anon2.body.circles.find((c) => c.id === 'c_lang');
    assert.strictEqual(lang.members, CIRCLES.find((c) => c.id === 'c_lang').base + 1);

    const me = await app.get('/api/me', a.body.token);
    assert.deepStrictEqual(me.body.joinedCircles, ['c_lang']);

    const mine = await app.get('/api/circles', a.body.token);
    const rec = mine.body.circles.find((c) => c.recommended);
    assert.ok(metOk(rec), 'expected at least one recommended circle for nature/music/travel/food interests');

    const leave = await app.post('/api/circles/c_lang/join', {}, a.body.token);
    assert.strictEqual(leave.body.joined, false);
    const bad = await app.post('/api/circles/c_nope/join', {}, a.body.token);
    assert.strictEqual(bad.status, 404);
  } finally {
    await app.close();
  }
});

function metOk(rec) {
  return Boolean(rec && rec.why && rec.why.et && rec.why.ru);
}

test('HTTP: plans list, join toggle, create custom plan', async () => {
  const app = await boot(tmp());
  try {
    const a = await app.post('/api/profile', SAMPLE);
    const list = await app.get('/api/plans', a.body.token);
    assert.strictEqual(list.body.plans.length, PLANS.length);
    const seed = list.body.plans.find((p) => p.id === 'p_market');
    assert.strictEqual(seed.joined, true, 'creator joined via profile.plans');
    assert.ok(seed.going >= 58, `going=${seed.going}`);

    const anonList = await app.get('/api/plans');
    assert.strictEqual(anonList.body.plans.every((p) => p.joined === false), true);

    const toggle = await app.post('/api/plans/p_pub/join', {}, a.body.token);
    assert.strictEqual(toggle.body.joined, true);

    const created = await app.post('/api/plans', {
      title: 'Kohvikus kohtumine',
      when: 'pühapäev õhtul',
      city: 'Tartu',
    }, a.body.token);
    assert.strictEqual(created.status, 200, JSON.stringify(created.body));
    assert.ok(created.body.id.startsWith('u_'));
    assert.strictEqual(created.body.going, 1);

    const bad = await app.post('/api/plans', { title: 'x', when: '', city: '' }, a.body.token);
    assert.strictEqual(bad.status, 400);

    const after = await app.get('/api/plans', a.body.token);
    const custom = after.body.plans.find((p) => p.id === created.body.id);
    assert.ok(custom, 'custom plan present in feed');
    assert.strictEqual(custom.city, 'Tartu');
    assert.strictEqual(custom.kind, 'user');

    const joinCustom = await app.post('/api/profile', { ...SAMPLE2, plans: [] });
    const second = await app.post(`/api/plans/${created.body.id}/join`, {}, joinCustom.body.token);
    assert.strictEqual(second.body.joined, true);
    const after2 = await app.get('/api/plans', joinCustom.body.token);
    assert.strictEqual(after2.body.plans.find((p) => p.id === created.body.id).going, 2);

    const nope = await app.post('/api/plans/p_nope/join', {}, a.body.token);
    assert.strictEqual(nope.status, 404);
  } finally {
    await app.close();
  }
});

test('db: tokens are stored hashed', () => {
  const dir = tmp();
  const db = require('../src/db').open(dir);
  const { id, token } = db.insertProfile({
    name: 'Test', age: 30, city: 'Tallinn', lang: 'et', tongue: 'et',
    looking: 'chat', weekend: 'home', interests: ['reading'], note: '',
    traits: { avatus: 50, sotsiaalsus: 50, plaanitus: 50, seikluslikkus: 50 },
    archetype: { et: 'X', ru: 'X' }, summary: { et: 'x', ru: 'x' }, ai: false,
  });
  assert.ok(db.profileByToken(token));
  assert.strictEqual(db.profileByToken('wrong'), null);
  assert.strictEqual(db.countProfiles(), 1);
  db.close();
  fs.rmSync(dir, { recursive: true, force: true });
});
