'use strict';

// AI adapter tests: no key configured (local engine), fixture mode, a real
// OpenAI-compatible mock endpoint, and a failing endpoint (graceful fallback).

const test = require('node:test');
const assert = require('node:assert');
const http = require('node:http');

const ai = require('../src/ai');
const { buildProfile } = require('../src/personality');
const { SAMPLE } = require('./fixtures');

test('aiConfigured reflects env', () => {
  assert.strictEqual(ai.aiConfigured({}), false);
  assert.strictEqual(ai.aiConfigured({ AI_API_KEY: 'k' }), false);
  assert.strictEqual(ai.aiConfigured({ AI_API_KEY: 'k', AI_BASE_URL: 'http://x/v1' }), true);
  assert.strictEqual(ai.aiConfigured({ AI_API_KEY: 'k', AI_OPENAI_COMPAT: 'http://x/v1' }), true);
});

test('generate returns null without config (local engine stays authoritative)', async () => {
  const local = buildProfile(SAMPLE);
  const out = await ai.generate(SAMPLE, local, {});
  assert.strictEqual(out, null);
});

test('fixture mode returns an AI-upgraded bilingual personality', async () => {
  const local = buildProfile(SAMPLE);
  const out = await ai.generate(SAMPLE, local, { AI_API_KEY: 'x', AI_BASE_URL: 'http://unused', AI_MODE: 'fixture' });
  assert.ok(out && out.ai === true);
  assert.ok(/[а-яё]/i.test(out.summary.ru));
  assert.deepStrictEqual(out.traits, local.traits);
});

test('openai-compatible endpoint is used and validated', async () => {
  let seen = null;
  const srv = http.createServer((req, res) => {
    let body = '';
    req.on('data', (c) => { body += c; });
    req.on('end', () => {
      seen = { url: req.url, auth: req.headers.authorization, body: JSON.parse(body) };
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify({
        choices: [{
          message: {
            content: JSON.stringify({
              archetype: { et: 'Keelesild', ru: 'Языковой мост' },
              summary: { et: 'Mari ühendab kultuure.', ru: 'Мари объединяет культуры.' },
            }),
          },
        }],
      }));
    });
  });
  await new Promise((r) => srv.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${srv.address().port}/v1`;
  try {
    const local = buildProfile(SAMPLE);
    const out = await ai.generate(SAMPLE, local, { AI_API_KEY: 'sk-test', AI_BASE_URL: base });
    assert.ok(out && out.ai === true, JSON.stringify(out));
    assert.strictEqual(out.archetype.et, 'Keelesild');
    assert.strictEqual(seen.url, '/v1/chat/completions');
    assert.strictEqual(seen.auth, 'Bearer sk-test');
    assert.ok(seen.body.messages[0].role === 'system');
    assert.strictEqual(seen.body.model, 'gpt-4o-mini');
  } finally {
    await new Promise((r) => srv.close(r));
  }
});

test('malformed AI response falls back to local engine (null)', async () => {
  const srv = http.createServer((req, res) => {
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ choices: [{ message: { content: 'not json at all' } }] }));
  });
  await new Promise((r) => srv.listen(0, '127.0.0.1', r));
  try {
    const local = buildProfile(SAMPLE);
    const out = await ai.generate(SAMPLE, local, { AI_API_KEY: 'k', AI_BASE_URL: `http://127.0.0.1:${srv.address().port}` });
    assert.strictEqual(out, null);
  } finally {
    await new Promise((r) => srv.close(r));
  }
});

test('unreachable endpoint falls back to local engine (null)', async () => {
  const local = buildProfile(SAMPLE);
  const out = await ai.generate(SAMPLE, local, {
    AI_API_KEY: 'k',
    AI_BASE_URL: 'http://127.0.0.1:1',
    AI_TIMEOUT_MS: '500',
  });
  assert.strictEqual(out, null);
});
