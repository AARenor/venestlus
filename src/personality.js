'use strict';

// Personality engine: deterministic trait scoring from questionnaire answers,
// archetype selection and a bilingual narrative. The AI adapter (src/ai.js)
// may upgrade archetype/summary text when an AI endpoint is configured.

const { TAGS, TAG_TRAITS, WEEKEND, LOOKING, TRAIT_LABELS, ARCHETYPES } = require('./data');

const BASE = { avatus: 50, sotsiaalsus: 50, plaanitus: 50, seikluslikkus: 50 };
const TRAIT_KEYS = Object.keys(BASE);
const clamp = (n) => Math.max(5, Math.min(95, Math.round(n)));

function traitsFor({ interests, weekend, looking }) {
  const t = { ...BASE };
  const add = (deltas) => {
    for (const k of Object.keys(deltas || {})) t[k] += deltas[k];
  };
  add(WEEKEND[weekend]?.traits);
  add(LOOKING[looking]?.traits);
  for (const tag of interests) add(TAG_TRAITS[tag]);
  for (const k of TRAIT_KEYS) t[k] = clamp(t[k]);
  return t;
}

function archetypeFor(traits) {
  const rule = ARCHETYPES.find((r) => r.test(traits));
  return rule ? rule.name : ARCHETYPES[ARCHETYPES.length - 1].name;
}

function topInterests(interests, n = 2) {
  const scored = interests
    .map((k) => ({ k, w: (TAG_TRAITS[k] ? Object.values(TAG_TRAITS[k]).reduce((a, b) => a + Math.abs(b), 0) : 0) }))
    .sort((a, b) => b.w - a.w);
  return scored.slice(0, n).map((s) => s.k);
}

function topTraits(traits, n = 2) {
  return TRAIT_KEYS
    .map((k) => ({ k, v: traits[k] }))
    .sort((a, b) => b.v - a.v)
    .slice(0, n);
}

function summaryFor({ name, traits, interests, weekend, looking, archetype }) {
  const [i1, i2] = topInterests(interests).map((k) => TAGS[k]);
  const [t1, t2] = topTraits(traits);
  const l1 = TRAIT_LABELS[t1.k];
  const l2 = TRAIT_LABELS[t2.k];
  const w = WEEKEND[weekend]?.phrase;
  const look = LOOKING[looking]?.phrase;
  const et = [
    `${name} on ${archetype.et.toLowerCase()}, kelle loomulik element on ${i1.et}` +
    (i2 ? ` ja ${i2.et}` : '') + `.`,
    `Pigem ${w.et}, otsib ${look.et}.`,
    `Tugevaimad jooned: ${l1.et.toLowerCase()} (${t1.v}) ja ${l2.et.toLowerCase()} (${t2.v}).`,
  ].join(' ');
  const ru = [
    `${name} — ${archetype.ru.toLowerCase()}, ей/ему ближе всего ${i1.ru}` +
    (i2 ? ` и ${i2.ru}` : '') + '.',
    `Скорее ${w.ru}, ищет ${look.ru}.`,
    `Сильнейшие стороны: ${l1.ru.toLowerCase()} (${t1.v}) и ${l2.ru.toLowerCase()} (${t2.v}).`,
  ].join(' ');
  return { et, ru };
}

/**
 * Build the full personality object for a questionnaire submission.
 * Returns { archetype:{et,ru}, summary:{et,ru}, traits, interests, ai:boolean }
 */
function buildProfile(answers) {
  const traits = traitsFor(answers);
  const archetype = archetypeFor(traits);
  const summary = summaryFor({ ...answers, traits, archetype });
  return { archetype, summary, traits, interests: [...answers.interests], ai: false };
}

module.exports = { buildProfile, traitsFor, archetypeFor, summaryFor, topTraits };
