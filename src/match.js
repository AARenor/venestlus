'use strict';

// Cross-language matching: score a profile against all others, preferring the
// other mother tongue, shared interests, similar energy and same intent.

const { TAGS, TRAIT_LABELS, LOOKING } = require('./data');

const jaccard = (a, b) => {
  const A = new Set(a);
  const B = new Set(b);
  if (!A.size || !B.size) return 0;
  let inter = 0;
  for (const x of A) if (B.has(x)) inter += 1;
  return inter / (A.size + B.size - inter);
};

const traitAffinity = (a, b) => {
  const keys = Object.keys(a);
  const diff = keys.reduce((sum, k) => sum + Math.abs((a[k] || 0) - (b[k] || 0)), 0) / keys.length;
  return 1 - diff / 100;
};

const intentScore = (x, y) => {
  if (x === y) return 1;
  const near = new Set(['friends', 'chat']);
  if (near.has(x) && near.has(y)) return 0.7;
  return 0.45;
};

const tongueScore = (x, y) => {
  if (x === 'both' || y === 'both') return 0.9;
  return x === y ? 0.55 : 1;
};

const cityScore = (x, y) => {
  const a = (x || '').trim().toLowerCase();
  const b = (y || '').trim().toLowerCase();
  if (a && b && a === b) return 1;
  return 0.75;
};

function scorePair(a, b) {
  const raw =
    0.40 * jaccard(a.interests, b.interests)
    + 0.25 * traitAffinity(a.traits, b.traits)
    + 0.15 * intentScore(a.looking, b.looking)
    + 0.10 * cityScore(a.city, b.city)
    + 0.10 * tongueScore(a.tongue, b.tongue);
  return Math.round(Math.max(0, Math.min(1, raw)) * 100);
}

function reasonsFor(me, other) {
  const lang = me.lang === 'ru' ? 'ru' : 'et';
  const shared = me.interests.filter((i) => other.interests.includes(i));
  const reasons = [];

  if (shared.length) {
    const names = shared.slice(0, 3).map((k) => TAGS[k][lang]);
    reasons.push(lang === 'et'
      ? `Ühine huvi: ${names.join(', ')}`
      : `Общий интерес: ${names.join(', ')}`);
  }
  if (me.tongue !== other.tongue && me.tongue !== 'both' && other.tongue !== 'both') {
    reasons.push(lang === 'et'
      ? 'Teie emakeeled on erinevad — õpite üksteise keelt'
      : 'Разные родные языки — научитесь языку друг друга');
  }
  if (me.city && other.city && me.city.trim().toLowerCase() === other.city.trim().toLowerCase()) {
    reasons.push(lang === 'et' ? `Samast linnast: ${other.city}` : `Из того же города: ${other.city}`);
  }
  if (me.looking === other.looking) {
    const l = LOOKING[other.looking].phrase[lang];
    reasons.push(lang === 'et' ? `Mõlemad otsite ${l}` : `Вы ищете одно и то же: ${l}`);
  }
  const keys = Object.keys(me.traits);
  let closest = keys[0];
  for (const k of keys) {
    if (Math.abs(me.traits[k] - other.traits[k]) < Math.abs(me.traits[closest] - other.traits[k])) closest = k;
  }
  if (Math.abs(me.traits[closest] - other.traits[closest]) <= 8) {
    const label = TRAIT_LABELS[closest][lang].toLowerCase();
    reasons.push(lang === 'et' ? `Sarnane ${label}: ${me.traits[closest]} vs ${other.traits[closest]}` : `Похожий уровень: ${label} ${me.traits[closest]} и ${other.traits[closest]}`);
  }
  if (!reasons.length) {
    reasons.push(lang === 'et' ? 'Erinev vaatenurk — huvitav tutvus' : 'Другой взгляд — интересное знакомство');
  }
  return reasons.slice(0, 4);
}

function match(me, others) {
  return others
    .filter((o) => o.id !== me.id)
    .map((o) => ({ o, score: scorePair(me, o) }))
    .sort((a, b) => b.score - a.score || b.o.created_at - a.o.created_at)
    .slice(0, 10)
    .map(({ o, score }) => ({
      id: o.id,
      name: o.name,
      age: o.age,
      city: o.city,
      lang: o.lang,
      tongue: o.tongue,
      score,
      reasons: reasonsFor(me, o),
      archetype: o.archetype,
      summary: o.summary,
      interests: o.interests,
    }));
}

module.exports = { match, scorePair, reasonsFor };
