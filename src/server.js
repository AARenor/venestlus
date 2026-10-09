'use strict';

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { URL } = require('node:url');

const db = require('./db');
const ai = require('./ai');
const matcher = require('./match');
const { buildProfile } = require('./personality');
const { TAGS, WEEKEND, LOOKING, CIRCLES, PLANS, OPTIONS, TAG_TRAITS } = require('./data');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const VERSION = (() => {
  try {
    return JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8')).version;
  } catch {
    return '0.0.0';
  }
})();

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.woff2': 'font/woff2',
};

const SECURITY_HEADERS = {
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'permissions-policy': 'camera=(), microphone=(), geolocation=()',
  'content-security-policy': "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'; manifest-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'",
};

const err = (status, error) => Object.assign(new Error(error), { status, error });

function readBody(req, limit = 65536) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (c) => {
      size += c.length;
      if (size > limit) {
        reject(err(413, 'payload_too_large'));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on('end', () => {
      if (!chunks.length) return resolve({});
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')));
      } catch {
        reject(err(400, 'invalid_json'));
      }
    });
    req.on('error', reject);
  });
}

const str = (v, min, max) => {
  if (typeof v !== 'string') return null;
  const t = v.trim();
  if (t.length < min || t.length > max) return null;
  return t;
};

const enumOf = (v, allowed) => (allowed.includes(v) ? v : null);

function validateProfile(body) {
  const name = str(body.name, 1, 40);
  const city = str(body.city, 1, 40);
  const age = Number(body.age);
  if (!name) throw err(400, 'name_invalid');
  if (!city) throw err(400, 'city_invalid');
  if (!Number.isInteger(age) || age < 12 || age > 120) throw err(400, 'age_invalid');
  const lang = enumOf(body.lang, OPTIONS.lang);
  const tongue = enumOf(body.tongue, OPTIONS.tongue);
  const looking = enumOf(body.looking, OPTIONS.looking);
  const weekend = enumOf(body.weekend, OPTIONS.weekend);
  if (!lang) throw err(400, 'lang_invalid');
  if (!tongue) throw err(400, 'tongue_invalid');
  if (!looking) throw err(400, 'looking_invalid');
  if (!weekend) throw err(400, 'weekend_invalid');
  if (!Array.isArray(body.interests) || body.interests.length < 1 || body.interests.length > 8) {
    throw err(400, 'interests_invalid');
  }
  const interests = [...new Set(body.interests.map((i) => str(String(i), 1, 20)))].filter(Boolean);
  if (interests.length < 1 || interests.some((i) => !TAGS[i])) throw err(400, 'interests_invalid');
  const note = body.note == null || body.note === '' ? '' : str(body.note, 1, 200);
  if (note === null) throw err(400, 'note_invalid');
  const plans = Array.isArray(body.plans) ? body.plans.slice(0, 3) : [];
  return { name, city, age, lang, tongue, looking, weekend, interests, note, plans };
}

// --- rate limiting (per IP, POST only) ------------------------------------
function makeLimiter() {
  const max = Number(process.env.RATE_LIMIT_MAX || 60);
  const windowMs = 60_000;
  const hits = new Map();
  return (ip) => {
    const now = Date.now();
    let e = hits.get(ip);
    if (!e || now > e.resetAt) {
      e = { count: 0, resetAt: now + windowMs };
      hits.set(ip, e);
    }
    e.count += 1;
    if (hits.size > 5000) for (const [k, v] of hits) if (now > v.resetAt) hits.delete(k);
    return e.count <= max;
  };
}

function send(res, status, body, extraHeaders = {}) {
  const payload = Buffer.from(JSON.stringify(body));
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'content-length': payload.length,
    'cache-control': 'no-store',
    ...SECURITY_HEADERS,
    ...extraHeaders,
  });
  res.end(payload);
}

function serveStatic(req, res, pathname) {
  let rel = decodeURIComponent(pathname);
  if (rel === '/' || rel === '') rel = '/index.html';
  const file = path.normalize(path.join(PUBLIC_DIR, rel));
  if (!file.startsWith(PUBLIC_DIR)) {
    send(res, 404, { error: 'not_found' });
    return;
  }
  fs.readFile(file, (e, buf) => {
    if (e) {
      // SPA-ish fallback: unknown non-file path serves the app shell
      if (!path.extname(file)) {
        fs.readFile(path.join(PUBLIC_DIR, 'index.html'), (e2, shell) => {
          if (e2) return send(res, 404, { error: 'not_found' });
          res.writeHead(200, {
            'content-type': 'text/html; charset=utf-8',
            'content-length': shell.length,
            'cache-control': 'no-cache',
            ...SECURITY_HEADERS,
          });
          return res.end(shell);
        });
        return;
      }
      send(res, 404, { error: 'not_found' });
      return;
    }
    const ext = path.extname(file);
    const base = path.basename(file);
    // App shell, scripts and styles must revalidate so new versions propagate
    // immediately; icons and other assets get a short cache window.
    const noCache = ext === '.js' || ext === '.css'
      || ['index.html', 'sw.js', 'manifest.webmanifest'].includes(base);
    res.writeHead(200, {
      'content-type': MIME[ext] || 'application/octet-stream',
      'content-length': buf.length,
      'cache-control': noCache ? 'no-cache' : (ext === '.png' ? 'public, max-age=86400' : 'public, max-age=3600'),
      ...SECURITY_HEADERS,
    });
    res.end(buf);
  });
}

function createApp(options = {}) {
  const dataDir = options.dataDir || process.env.DATA_DIR || path.join(process.cwd(), 'data');
  const store = options.db || db.open(dataDir);
  const limit = makeLimiter();

  const auth = (req) => {
    const h = req.headers.authorization || '';
    const token = h.startsWith('Bearer ') ? h.slice(7).trim() : '';
    const profile = token ? store.profileByToken(token) : null;
    if (!profile) throw err(401, 'unauthorized');
    return profile;
  };

  const joinedSet = (table, col, profileId) => new Set(store.joinedIds(table, col, profileId));

  const circleList = (profile) => {
    const joined = profile ? joinedSet('circle_members', 'circle_id', profile.id) : new Set();
    const list = CIRCLES.map((c) => {
      const recommended = Boolean(profile && !joined.has(c.id) && profile.interests.includes(c.tag));
      return {
        id: c.id,
        name: c.name,
        desc: c.desc,
        category: c.tag,
        city: c.city,
        members: c.base + store.joinedCount('circle_members', 'circle_id', c.id),
        joined: joined.has(c.id),
        recommended,
        why: recommended
          ? { et: `Sinu huvi: ${TAGS[c.tag].et}`, ru: `Ваш интерес: ${TAGS[c.tag].ru}` }
          : null,
      };
    });
    return list.sort((a, b) => (b.recommended - a.recommended) || (b.members - a.members));
  };

  const planList = (profile) => {
    const joined = profile ? joinedSet('plan_joins', 'plan_id', profile.id) : new Set();
    const seed = PLANS.map((p) => ({
      id: p.id,
      title: p.title,
      when: p.when,
      city: p.city,
      going: p.base + store.joinedCount('plan_joins', 'plan_id', p.id),
      joined: joined.has(p.id),
      kind: 'seed',
    }));
    const custom = store.allUserPlans().map((p) => ({
      id: p.id,
      title: p.title,
      when: p.when,
      city: p.city,
      going: store.joinedCount('plan_joins', 'plan_id', p.id),
      joined: joined.has(p.id),
      kind: 'user',
    }));
    return [...seed, ...custom].sort((a, b) => b.going - a.going);
  };

  async function handleApi(req, res, url) {
    const { pathname } = url;
    const parts = pathname.split('/').filter(Boolean); // ['api', ...]
    const method = req.method;
    const needsBody = method === 'POST';
    const body = needsBody ? await readBody(req) : null;

    if (method === 'POST' && !limit(req.socket.remoteAddress || '?')) {
      throw err(429, 'rate_limited');
    }

    // GET /api/stats
    if (pathname === '/api/stats' && method === 'GET') {
      return send(res, 200, {
        profiles: store.countProfiles(),
        circles: CIRCLES.length,
        plans: PLANS.length + store.allUserPlans().length,
        ai: ai.aiConfigured(),
      });
    }

    // POST /api/profile
    if (pathname === '/api/profile' && method === 'POST') {
      const a = validateProfile(body);
      const local = buildProfile(a);
      const upgraded = await ai.generate(a, local).catch(() => null);
      const personality = upgraded || local;
      const { id, token } = store.insertProfile({
        name: a.name,
        age: a.age,
        city: a.city,
        lang: a.lang,
        tongue: a.tongue,
        looking: a.looking,
        weekend: a.weekend,
        interests: a.interests,
        note: a.note,
        traits: personality.traits,
        archetype: personality.archetype,
        summary: personality.summary,
        ai: personality.ai,
      });
      for (const planId of a.plans) {
        if (typeof planId === 'string' && PLANS.some((p) => p.id === planId)) {
          store.join('plan_joins', 'plan_id', planId, id);
        }
      }
      return send(res, 200, { token, id, personality });
    }

    if (pathname === '/api/me' && method === 'GET') {
      const me = auth(req);
      return send(res, 200, {
        ...me,
        personality: {
          archetype: me.archetype,
          summary: me.summary,
          traits: me.traits,
          interests: me.interests,
          ai: me.ai,
        },
        joinedCircles: store.joinedIds('circle_members', 'circle_id', me.id),
        joinedPlans: store.joinedIds('plan_joins', 'plan_id', me.id),
      });
    }

    if (pathname === '/api/matches' && method === 'GET') {
      const me = auth(req);
      return send(res, 200, { matches: matcher.match(me, store.allProfiles()) });
    }

    if (pathname === '/api/circles' && method === 'GET') {
      const me = req.headers.authorization ? auth(req) : null;
      return send(res, 200, { circles: circleList(me) });
    }

    const circleJoin = pathname.match(/^\/api\/circles\/([A-Za-z0-9_-]+)\/join$/);
    if (circleJoin && method === 'POST') {
      const me = auth(req);
      const id = circleJoin[1];
      const circle = CIRCLES.find((c) => c.id === id);
      if (!circle) throw err(404, 'circle_not_found');
      const joined = store.joinedIds('circle_members', 'circle_id', me.id).includes(id);
      if (joined) store.leave('circle_members', 'circle_id', id, me.id);
      else store.join('circle_members', 'circle_id', id, me.id);
      return send(res, 200, {
        joined: !joined,
        members: circle.base + store.joinedCount('circle_members', 'circle_id', id),
      });
    }

    if (pathname === '/api/plans' && method === 'GET') {
      const me = req.headers.authorization ? auth(req) : null;
      return send(res, 200, { plans: planList(me) });
    }

    if (pathname === '/api/plans' && method === 'POST') {
      const me = auth(req);
      const title = str(body.title, 3, 60);
      const whent = str(body.when, 1, 40);
      const city = str(body.city, 1, 40);
      if (!title) throw err(400, 'title_invalid');
      if (!whent) throw err(400, 'when_invalid');
      if (!city) throw err(400, 'city_invalid');
      const id = store.createUserPlan({
        profileId: me.id,
        title: { et: title, ru: title },
        whent: { et: whent, ru: whent },
        city,
      });
      return send(res, 200, {
        id, title: { et: title, ru: title }, when: { et: whent, ru: whent },
        city, going: 1, joined: true, kind: 'user',
      });
    }

    const planJoin = pathname.match(/^\/api\/plans\/([A-Za-z0-9_-]+)\/join$/);
    if (planJoin && method === 'POST') {
      const me = auth(req);
      const id = planJoin[1];
      const seedPlan = PLANS.find((p) => p.id === id);
      const userPlan = store.allUserPlans().find((p) => p.id === id);
      const plan = seedPlan || userPlan;
      if (!plan) throw err(404, 'plan_not_found');
      const joined = store.joinedIds('plan_joins', 'plan_id', me.id).includes(id);
      if (joined) store.leave('plan_joins', 'plan_id', id, me.id);
      else store.join('plan_joins', 'plan_id', id, me.id);
      const going = seedPlan
        ? seedPlan.base + store.joinedCount('plan_joins', 'plan_id', id)
        : store.joinedCount('plan_joins', 'plan_id', id);
      return send(res, 200, { joined: !joined, going });
    }

    if (parts.length === 2 && parts[0] === 'api') throw err(404, 'not_found');
    if (pathname.startsWith('/api/')) {
      if (method !== 'GET' && method !== 'POST') throw err(405, 'method_not_allowed');
      throw err(404, 'not_found');
    }
    throw err(404, 'not_found');
  }

  const server = http.createServer(async (req, res) => {
    const started = Date.now();
    const url = new URL(req.url, 'http://localhost');
    try {
      if (url.pathname === '/healthz') {
        send(res, 200, { ok: true, version: VERSION, ai: ai.aiConfigured() });
      } else if (url.pathname.startsWith('/api/')) {
        await handleApi(req, res, url);
      } else if (req.method === 'GET' || req.method === 'HEAD') {
        serveStatic(req, res, url.pathname);
      } else {
        throw err(405, 'method_not_allowed');
      }
    } catch (e) {
      const status = e.status || 500;
      if (status === 500) console.error('[error]', req.method, url.pathname, e);
      if (!res.headersSent) send(res, status, { error: e.error || 'internal_error' });
      else res.end();
    } finally {
      if (process.env.LOG_REQUESTS !== '0') {
        console.log(`${req.method} ${url.pathname} ${res.statusCode} ${Date.now() - started}ms`);
      }
    }
  });

  server.store = store;
  return server;
}

module.exports = { createApp };
