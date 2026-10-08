# Venestlus

Eestlaste ja venelaste iseloomupidu ja tutvused — a bilingual (ET/RU) personality
and matchmaking PWA. Answer a few questions, get an AI-built personality profile,
match with people from the other language group, find interest circles to join
and see where everyone is going this week.

Live: **https://app.arle.top**

## How it works

1. **6-step quiz** (name/age/city → mother tongue → 1–8 interests → weekend style
   → what you're looking for → optional plans to join).
2. **Personality** — four traits (Avatus, Sotsiaalsus, Plaanitlus, Seikluslikkus)
   plus an archetype and a bilingual narrative summary.
3. **Matches** — scored 0–100: shared interests (0.40), trait affinity (0.25),
   intent (0.15), city (0.10), mother-tongue complementarity (0.10), each with
   human-readable reasons.
4. **Circles** — recommended by your interests, then the most popular ones.
5. **Where everyone is going** — a shared feed of plans you can join or create.

## Stack

- **Backend:** Node.js 22+, zero runtime dependencies (`node:http`, `node:sqlite`).
- **Frontend:** vanilla-JS SPA + service worker PWA (installable on phones),
  no CDNs, works offline, full ET/RU i18n.
- **DB:** SQLite (WAL) at `DATA_DIR/venestlus.db`.

## Run

```bash
npm start          # http://localhost:3000
npm test           # node --test tests/*.test.js
PORT=4000 DATA_DIR=./data npm start
```

### Environment

| Var | Default | Purpose |
|---|---|---|
| `PORT` | `3000` | HTTP port |
| `DATA_DIR` | `./data` | SQLite data directory |
| `RATE_LIMIT_MAX` | `60` | POST requests per minute per IP |
| `AI_BASE_URL` | — | OpenAI-compatible endpoint, e.g. `https://api.openai.com/v1` |
| `AI_API_KEY` | — | Bearer key for the above |
| `AI_MODEL` | `gpt-4o-mini` | Chat completions model |
| `AI_TIMEOUT_MS` | `15000` | AI request timeout |
| `AI_MODE` | — | `fixture` = deterministic demo AI (used in tests) |
| `LOG_REQUESTS` | `1` | Set `0` to silence request logs |

**No AI key required.** Without `AI_API_KEY` the server falls back to the built-in
deterministic personality engine (bilingual, same schema) and `personality.ai`
is `false`, so the UI can label it honestly.

## API

All responses JSON. `Authorization: Bearer <token>` required except where noted.

| Method & path | Notes |
|---|---|
| `GET /healthz` | liveness |
| `GET /api/stats` | `{profiles, circles, plans, ai}` |
| `POST /api/profile` | create profile → `{token, id, personality}` |
| `GET /api/me` | profile + `personality` + joined circles/plans |
| `GET /api/matches` | top 10 with `score` + localized `reasons` |
| `GET /api/circles` | circles with `joined`, `members`, `why` (anon OK) |
| `POST /api/circles/:id/join` | toggle → `{joined, members}` |
| `GET /api/plans` | seed + user plans sorted by `going` (anon OK) |
| `POST /api/plans` | `{title, when, city}` → creates user plan |
| `POST /api/plans/:id/join` | toggle → `{joined, going}` |

Errors: `{error: {code, message}}` with 400/401/404/405/413/429/500.

## Deploy (Docker + Traefik on arleserver)

```bash
docker build -t venestlus .
docker run -d --name venestlus --restart unless-stopped \
  -p 127.0.0.1:3210:3000 -v /data/venestlus:/data \
  --network coolify \
  -l traefik.enable=true \
  -l traefik.docker.network=coolify \
  -l traefik.http.routers.https-0-venestlus.entryPoints=https \
  -l traefik.http.routers.https-0-venestlus.rule='Host(`app.arle.top`)' \
  -l traefik.http.routers.https-0-venestlus.middlewares=gzip \
  -l traefik.http.routers.https-0-venestlus.service=https-0-venestlus \
  -l traefik.http.routers.https-0-venestlus.tls=true \
  -l traefik.http.services.https-0-venestlus.loadbalancer.server.port=3000 \
  venestlus
```

Plus two entries in `/data/coolify/proxy/dynamic/arle-top.yaml` (manually
maintained): add `Host(\`app.arle.top\`)` to the `arle-top-http-redirect`
OR-list, and an `arle-top-app` router pointing at
`https-0-venestlus@docker` with the `arle-top-gzip` middleware.
Traefik hot-reloads the file.

## Privacy

Profiles live in a SQLite file on the server; tokens are stored hashed
(SHA-256). No third-party analytics, no external requests from the frontend.
