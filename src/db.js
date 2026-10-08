'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { DatabaseSync } = require('node:sqlite');

function open(dataDir) {
  fs.mkdirSync(dataDir, { recursive: true });
  const db = new DatabaseSync(path.join(dataDir, 'venestlus.db'));
  db.exec(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS profiles (
      id TEXT PRIMARY KEY,
      token_hash TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      age INTEGER NOT NULL,
      city TEXT NOT NULL,
      lang TEXT NOT NULL,
      tongue TEXT NOT NULL,
      looking TEXT NOT NULL,
      weekend TEXT NOT NULL,
      interests TEXT NOT NULL,
      note TEXT NOT NULL DEFAULT '',
      traits TEXT NOT NULL,
      archetype TEXT NOT NULL,
      summary TEXT NOT NULL,
      ai INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS circle_members (
      circle_id TEXT NOT NULL,
      profile_id TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      PRIMARY KEY (circle_id, profile_id)
    );
    CREATE TABLE IF NOT EXISTS plan_joins (
      plan_id TEXT NOT NULL,
      profile_id TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      PRIMARY KEY (plan_id, profile_id)
    );
    CREATE TABLE IF NOT EXISTS user_plans (
      id TEXT PRIMARY KEY,
      profile_id TEXT NOT NULL,
      title TEXT NOT NULL,
      whent TEXT NOT NULL,
      city TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS plan_creators (
      plan_id TEXT PRIMARY KEY,
      profile_id TEXT NOT NULL
    );
  `);
  return wrap(db);
}

function wrap(db) {
  const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');

  return {
    insertProfile(p) {
      const token = crypto.randomBytes(24).toString('hex');
      const id = crypto.randomBytes(8).toString('hex');
      db.prepare(`
        INSERT INTO profiles (id, token_hash, name, age, city, lang, tongue, looking,
          weekend, interests, note, traits, archetype, summary, ai, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(id, sha(token), p.name, p.age, p.city, p.lang, p.tongue, p.looking,
        p.weekend, JSON.stringify(p.interests), p.note, JSON.stringify(p.traits),
        JSON.stringify(p.archetype), JSON.stringify(p.summary), p.ai ? 1 : 0,
        Date.now());
      return { id, token };
    },

    profileByToken(token) {
      if (typeof token !== 'string' || !token) return null;
      const row = db.prepare('SELECT * FROM profiles WHERE token_hash = ?').get(sha(token));
      return row ? hydrate(row) : null;
    },

    profileById(id) {
      const row = db.prepare('SELECT * FROM profiles WHERE id = ?').get(id);
      return row ? hydrate(row) : null;
    },

    allProfiles() {
      return db.prepare('SELECT * FROM profiles ORDER BY created_at').all().map(hydrate);
    },

    countProfiles() {
      return db.prepare('SELECT COUNT(*) AS c FROM profiles').get().c;
    },

    join(table, aCol, aVal, bVal) {
      db.prepare(`INSERT OR IGNORE INTO ${table} (${aCol}, profile_id, created_at) VALUES (?, ?, ?)`)
        .run(aVal, bVal, Date.now());
    },

    leave(table, aCol, aVal, bVal) {
      db.prepare(`DELETE FROM ${table} WHERE ${aCol} = ? AND profile_id = ?`).run(aVal, bVal);
    },

    joinedIds(table, aCol, profileId) {
      return db.prepare(`SELECT ${aCol} AS id FROM ${table} WHERE profile_id = ?`)
        .all(profileId).map((r) => r.id);
    },

    joinedCount(table, aCol, aVal) {
      return db.prepare(`SELECT COUNT(*) AS c FROM ${table} WHERE ${aCol} = ?`).get(aVal).c;
    },

    createUserPlan({ profileId, title, whent, city }) {
      const id = `u_${crypto.randomBytes(6).toString('hex')}`;
      const now = Date.now();
      db.prepare('INSERT INTO user_plans (id, profile_id, title, whent, city, created_at) VALUES (?, ?, ?, ?, ?, ?)')
        .run(id, profileId, JSON.stringify(title), JSON.stringify(whent), city, now);
      db.prepare('INSERT OR IGNORE INTO plan_creators (plan_id, profile_id) VALUES (?, ?)').run(id, profileId);
      db.prepare('INSERT OR IGNORE INTO plan_joins (plan_id, profile_id, created_at) VALUES (?, ?, ?)')
        .run(id, profileId, now);
      return id;
    },

    allUserPlans() {
      return db.prepare('SELECT * FROM user_plans ORDER BY created_at DESC').all().map((r) => ({
        id: r.id,
        profile_id: r.profile_id,
        title: JSON.parse(r.title),
        when: JSON.parse(r.whent),
        city: r.city,
        created_at: r.created_at,
      }));
    },

    close() {
      db.close();
    },
  };
}

function hydrate(row) {
  return {
    id: row.id,
    name: row.name,
    age: row.age,
    city: row.city,
    lang: row.lang,
    tongue: row.tongue,
    looking: row.looking,
    weekend: row.weekend,
    interests: JSON.parse(row.interests),
    note: row.note,
    traits: JSON.parse(row.traits),
    archetype: JSON.parse(row.archetype),
    summary: JSON.parse(row.summary),
    ai: row.ai === 1,
    created_at: row.created_at,
  };
}

module.exports = { open };
