"use strict";
/* Venestlus SPA — vanilla JS, no dependencies. All UI strings live in STR. */

const STR = {
  et: {
    brandTag: "iseloomupidu",
    tagline: "Eestlaste ja venelaste iseloomupidu ja tutvused",
    landingNote: "6 küsimust, 1 minut — ja iseloom valmis.",
    statsPeople: "inimest", statsCircles: "huviringi", statsPlans: "plaani",
    statsAi: "tehisaru sees", offline: "võrguühendus puudub — näitan vahemälu",
    start: "Alusta", continue: "Jätka", next: "Edasi", back: "Tagasi", skip: "Jäta vahele",
    retry: "Proovi uuesti", loading: "Laadin…", saving: "Salvestan…",
    q1t: "Kes sa oled?", q1name: "Nimi", q1namePh: "nt Mari", q1age: "Vanus", q1city: "Linn", q1cityPh: "nt Tallinn",
    q1err: "Sisesta nimi (1–40), vanus (16–99) ja linn (1–40).",
    q2t: "Mis on su emakeel?", q3t: "Vali 1–8 huvi", q3sub: "Valitud",
    q4t: "Kuidas veedad nädalavahetust?", q5t: "Mida otsid?", q5note: "Paar sõna endast (valikuline)",
    q5notePh: "nt Armastan jalutada vanalinnas…", q6t: "Kuhu plaanid minna? (kuni 3)",
    q6sub: "Valikuline — saad hiljem liituda",
    finish: "Näita mu iseloomu",
    traits: { avatus: "Avatus", sotsiaalsus: "Sotsiaalsus", plaanitus: "Plaanitlus", seikluslikkus: "Seikluslikkus" },
    aiBadge: "AI", yourType: "Sinu iseloomutüüp", toMatches: "Vaata tutvusi",
    tabs: { me: "Iseloom", matches: "Tutvused", circles: "Ringid", plans: "Kuhu läheme" },
    matchEmpty: "Tutvusi veel pole.", matchEmptySub: "Täida küsimustik ja tule tagasi — sobitame sind teise keelegrupiga.",
    matchEmptyAuth: "Sind ei ole veel sobitatud.", matchEmptyAuthSub: "Teised liituvad iga päev — vaata varsti uuesti.",
    rec: "Sulle soovitatud", popular: "Populaarseimad", members: "liiget",
    join: "Liitu", leave: "Lahku", joined: "Liitunud", why: "Soovitus",
    plansTitle: "Kuhu kõik teised lähevad", going: "läheb", addPlan: "Lisa oma plaan",
    fTitle: "Pealkiri", fTitlePh: "nt Jalutus Kalamajas", fWhen: "Millal", fWhenPh: "nt Laup 18:00",
    fCity: "Linn", fCityPh: "nt Tallinn", add: "Lisa plaan",
    noPlans: "Plaane veel pole — lisa esimene!",
    errGeneric: "Midagi läks valesti. Proovi uuesti.",
    errRate: "Liiga palju katseid — oota hetk ja proovi uuesti.",
    errAuth: "Sessioon aegus — alusta uuesti.",
    errNet: "Võrgu viga — kontrolli ühendust.",
    errPlan: "Pealkiri (3–60), aeg ja linn on kohustuslikud.",
    step: "Samm", of: "/",
    meSub: "Sinu profiil ja iseloom",
    restart: "Alusta uuesti",
  },
  ru: {
    brandTag: "встреча характеров",
    tagline: "Характеры и знакомства эстонцев и русских",
    landingNote: "6 вопросов, 1 минута — и характер готов.",
    statsPeople: "людей", statsCircles: "кружков", statsPlans: "планов",
    statsAi: "ИИ включён", offline: "Нет сети — показываю кэш",
    start: "Начать", continue: "Продолжить", next: "Далее", back: "Назад", skip: "Пропустить",
    retry: "Попробовать снова", loading: "Загрузка…", saving: "Сохраняю…",
    q1t: "Кто ты?", q1name: "Имя", q1namePh: "напр. Мария", q1age: "Возраст", q1city: "Город", q1cityPh: "напр. Таллинн",
    q1err: "Введи имя (1–40), возраст (16–99) и город (1–40).",
    q2t: "Твой родной язык?", q3t: "Выбери 1–8 интересов", q3sub: "Выбрано",
    q4t: "Как проводишь выходные?", q5t: "Что ищешь?", q5note: "Пара слов о себе (необязательно)",
    q5notePh: "напр. Люблю гулять по Старому городу…", q6t: "Куда планируешь пойти? (до 3)",
    q6sub: "Необязательно — можно позже",
    finish: "Покажи мой характер",
    traits: { avatus: "Открытость", sotsiaalsus: "Общительность", plaanitus: "Планирование", seikluslikkus: "Приключения" },
    aiBadge: "ИИ", yourType: "Твой тип характера", toMatches: "Смотреть знакомства",
    tabs: { me: "Характер", matches: "Знакомства", circles: "Круги", plans: "Куда идём" },
    matchEmpty: "Пока нет знакомств.", matchEmptySub: "Заполни анкету и возвращайся — подберём тебе пару из другой языковой группы.",
    matchEmptyAuth: "Вас пока не подобрали.", matchEmptyAuthSub: "Другие присоединяются каждый день — загляните позже.",
    rec: "Рекомендуем вам", popular: "Популярные", members: "участников",
    join: "Вступить", leave: "Выйти", joined: "Вы с нами", why: "Почему",
    plansTitle: "Куда все идут", going: "идут", addPlan: "Добавь свой план",
    fTitle: "Название", fTitlePh: "напр. Прогулка по Каламая", fWhen: "Когда", fWhenPh: "напр. Сб 18:00",
    fCity: "Город", fCityPh: "напр. Таллинн", add: "Добавить план",
    noPlans: "Планов пока нет — добавь первый!",
    errGeneric: "Что-то пошло не так. Попробуй снова.",
    errRate: "Слишком много попыток — подожди и попробуй снова.",
    errAuth: "Сессия истекла — начни заново.",
    errNet: "Ошибка сети — проверь соединение.",
    errPlan: "Название (3–60), время и город обязательны.",
    step: "Шаг", of: " / ",
    meSub: "Твой профиль и характер",
    restart: "Начать заново",
  }
};

const INTERESTS = { music: ["Muusika", "Музыка"], sport: ["Sport", "Спорт"], food: ["Toit", "Еда"], nature: ["Loodus", "Природа"], games: ["Mängud", "Игры"], art: ["Kunst", "Искусство"], tech: ["Tehnoloogia", "Технологии"], night: ["Ööelu", "Ночная жизнь"], family: ["Pere", "Семья"], travel: ["Reisimine", "Путешествия"], languages: ["Keeled", "Языки"], volunteering: ["Vabatahtlikkus", "Волонтёрство"], reading: ["Lugemine", "Чтение"], cinema: ["Kino", "Кино"], photo: ["Fotograafia", "Фотография"], dance: ["Tants", "Танцы"] };
const WEEKEND = { home: ["Kodus siibin", "Дома отдыхаю"], friends: ["Sõpradega", "С друзьями"], outdoors: ["Õues", "На улице"], events: ["Üritustel", "На мероприятиях"] };
const LOOKING = { friends: ["Sõprust", "Дружбу"], chat: ["Vestlust", "Общение"], relationship: ["Suhet", "Отношения"] };
const TONGUE = { et: ["Eesti keel", "Эстонский"], ru: ["Vene keel", "Русский"], both: ["Mõlemad", "Оба"] };

const LS_LANG = "venestlus.lang", LS_TOKEN = "venestlus.token";
const state = {
  lang: localStorage.getItem(LS_LANG) || "et",
  token: localStorage.getItem(LS_TOKEN) || null,
  screen: "landing",
  step: 1,
  form: { name: "", age: "", city: "", tongue: null, interests: [], weekend: null, looking: null, note: "", plans: [] },
  me: null, matches: null, circles: null, plans: null, stats: null,
  busy: false,
};
if (state.lang !== "et" && state.lang !== "ru") state.lang = "et";
const T = () => STR[state.lang];
const LI = () => (state.lang === "et" ? 0 : 1);

const $ = (sel) => document.querySelector(sel);
const view = () => $("#view");
const errBox = () => $("#error");

function showError(msg) {
  const e = errBox();
  if (!msg) { e.classList.remove("show"); e.textContent = ""; return; }
  e.textContent = msg;
  e.classList.add("show");
}
function setLoading(on, label) {
  state.busy = on;
  $("#loading").classList.toggle("show", !!on);
  $("#loadingTxt").textContent = label || T().loading;
}
async function api(path, opts) {
  opts = opts || {};
  const headers = Object.assign({ "Content-Type": "application/json" }, opts.headers || {});
  if (state.token) headers["Authorization"] = "Bearer " + state.token;
  let res;
  try {
    res = await fetch(path, { method: opts.method || "GET", headers, body: opts.body ? JSON.stringify(opts.body) : undefined });
  } catch (e) { throw new Error(T().errNet); }
  let data = null;
  try { data = await res.json(); } catch (e) { data = null; }
  if (!res.ok) {
    if (res.status === 429) throw new Error(T().errRate);
    if (res.status === 401) { state.token = null; localStorage.removeItem(LS_TOKEN); throw new Error(T().errAuth); }
    const m = (data && data.error) ? data.error : T().errGeneric;
    throw new Error(m);
  }
  return data;
}
function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text !== undefined && text !== null) n.textContent = text;
  return n;
}
function chipBtn(label, pressed, onClick, sub) {
  const b = document.createElement("button");
  b.type = "button"; b.className = "chip";
  b.setAttribute("aria-pressed", pressed ? "true" : "false");
  b.textContent = sub ? label + "  · " + sub : label;
  b.addEventListener("click", onClick);
  return b;
}
function optBtn(title, sub, selected, onClick) {
  const b = document.createElement("button");
  b.type = "button"; b.className = "opt";
  b.setAttribute("aria-pressed", selected ? "true" : "false");
  const dot = el("span", null, selected ? "● " : "○ ");
  dot.setAttribute("aria-hidden", "true");
  b.appendChild(dot);
  const wrap = el("span");
  const t = el("span", null, title);
  wrap.appendChild(t);
  if (sub) { wrap.appendChild(document.createElement("br")); const s = el("span", "sub", sub); wrap.appendChild(s); }
  b.appendChild(wrap);
  b.addEventListener("click", onClick);
  return b;
}
function traitBar(key, val) {
  const box = el("div", "trait");
  const head = el("div", "t-head");
  head.appendChild(el("span", null, T().traits[key] || key));
  head.appendChild(el("span", null, String(val)));
  const bar = el("div", "bar");
  const fill = el("i");
  bar.appendChild(fill);
  box.appendChild(head); box.appendChild(bar);
  const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  requestAnimationFrame(() => requestAnimationFrame(() => {
    fill.style.transition = reduced ? "none" : "";
    fill.style.width = Math.max(0, Math.min(100, val)) + "%";
  }));
  return box;
}
function interestChips(keys) {
  const w = el("div", "chips");
  (keys || []).forEach((k) => {
    const lbl = (INTERESTS[k] || [])[LI()] || k;
    const c = el("span", "chip", lbl);
    c.setAttribute("aria-pressed", "false");
    w.appendChild(c);
  });
  return w;
}

/* ---------- language ---------- */
function applyLang() {
  document.documentElement.lang = state.lang;
  $("#langEt").setAttribute("aria-pressed", state.lang === "et" ? "true" : "false");
  $("#langRu").setAttribute("aria-pressed", state.lang === "ru" ? "true" : "false");
  $("#brandTag").textContent = T().brandTag;
  renderTabs();
  render();
}
$("#langEt").addEventListener("click", () => { state.lang = "et"; localStorage.setItem(LS_LANG, "et"); applyLang(); });
$("#langRu").addEventListener("click", () => { state.lang = "ru"; localStorage.setItem(LS_LANG, "ru"); applyLang(); });

/* ---------- tabs ---------- */
const TAB_DEFS = [
  { id: "me", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.5-6.5 8-6.5s8 2.5 8 6.5"/></svg>' },
  { id: "matches", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s-7-4.6-9.5-9C.9 8.9 2.4 5.5 5.7 5.5c2 0 3.4 1.1 4.1 2.3h4.4c.7-1.2 2.1-2.3 4.1-2.3 3.3 0 4.8 3.4 3.2 6.5-2.5 4.4-9.5 9-9.5 9z" transform="scale(.92) translate(1,0)"/></svg>' },
  { id: "circles", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="8" cy="9" r="3.2"/><circle cx="16.5" cy="10" r="2.6"/><path d="M2.5 20c0-3.4 2.6-5.2 5.5-5.2s5.5 1.8 5.5 5.2M13.5 15.4c2.9-.4 7 1 7 4.6"/></svg>' },
  { id: "plans", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="16" rx="2.5"/><path d="M3 10h18M8 3v4M16 3v4M7 14l2.5 2.5L15 11"/></svg>' },
];
function renderTabs() {
  const tabs = $("#tabs");
  const show = !!state.token && ["me", "matches", "circles", "plans"].includes(state.screen);
  tabs.hidden = !show;
  const host = $("#tabsIn");
  host.textContent = "";
  if (!show) return;
  TAB_DEFS.forEach((d) => {
    const b = document.createElement("button");
    b.type = "button"; b.className = "tab"; b.setAttribute("role", "tab");
    b.setAttribute("aria-selected", state.screen === d.id ? "true" : "false");
    const s = document.createElement("span");
    s.setAttribute("aria-hidden", "true");
    // icon is static trusted markup from TAB_DEFS (not API data)
    s.innerHTML = d.icon;
    b.appendChild(s);
    b.appendChild(el("span", null, T().tabs[d.id]));
    b.addEventListener("click", () => {
      state.screen = d.id;
      // refresh per-tab data on every switch so counts/matches are never stale
      if (d.id === "matches") state.matches = null;
      if (d.id === "circles") state.circles = null;
      if (d.id === "plans") state.plans = null;
      showError(null);
      render();
    });
    host.appendChild(b);
  });
  // refresh selected states on re-render without rebuilding icons
  host.querySelectorAll(".tab").forEach((b, i) => {
    b.setAttribute("aria-selected", state.screen === TAB_DEFS[i].id ? "true" : "false");
  });
}

/* ---------- screens ---------- */
function render() {
  renderTabs();
  const v = view();
  v.textContent = "";
  if (!state.token && ["me", "matches", "circles", "plans"].includes(state.screen)) state.screen = "landing";
  if (state.screen === "landing") return renderLanding(v);
  if (state.screen === "quiz") return renderQuiz(v);
  if (state.screen === "result") return renderResult(v);
  if (state.screen === "me") return renderMe(v);
  if (state.screen === "matches") return renderMatches(v);
  if (state.screen === "circles") return renderCircles(v);
  if (state.screen === "plans") return renderPlans(v);
  return renderLanding(v);
}

// Static bridge illustration: two banks, one bridge, two people meeting in the middle.
const BRIDGE_ART = `<svg viewBox="0 0 300 132" fill="none" aria-hidden="true" focusable="false">
  <path d="M8 120h284" stroke="#cdd4ea" stroke-width="6" stroke-linecap="round"/>
  <path d="M96 120V42M204 120V42" stroke="#121527" stroke-width="7" stroke-linecap="round"/>
  <path d="M36 94h228" stroke="#121527" stroke-width="7" stroke-linecap="round"/>
  <path d="M118 49v45M136 64v30M164 64v30M182 49v45" stroke="#b9c1de" stroke-width="4" stroke-linecap="round"/>
  <path d="M36 88C60 88 74 42 96 42c28 0 36 30 54 26 18-4 26-24 54-24 22 0 36 44 60 44" stroke="#f5a524" stroke-width="5" stroke-linecap="round"/>
  <circle cx="141" cy="83" r="7.5" fill="#1b48d0"/>
  <circle cx="159" cy="83" r="7.5" fill="#f5a524"/>
  <path d="M148.5 83h3" stroke="#121527" stroke-width="4" stroke-linecap="round"/>
</svg>`;

function renderLanding(v) {
  const art = document.createElement("div");
  art.className = "hero-art";
  art.innerHTML = BRIDGE_ART; // static trusted markup, no API data
  v.appendChild(art);
  const h = el("h1", "wordmark");
  const a = el("span", "grad", "Venestlus");
  h.appendChild(a);
  v.appendChild(h);
  v.appendChild(el("p", "subtitle", T().tagline));
  const stats = el("div", "stats");
  const s = state.stats;
  const mk = (num, label) => {
    const d = el("div", "stat");
    d.appendChild(el("b", null, num));
    d.appendChild(el("span", null, label));
    return d;
  };
  stats.appendChild(mk(s ? String(s.profiles ?? "–") : "…", T().statsPeople));
  stats.appendChild(mk(s ? String(s.circles ?? "–") : "…", T().statsCircles));
  stats.appendChild(mk(s ? String(s.plans ?? "–") : "…", T().statsPlans));
  v.appendChild(stats);
  if (s && s.ai) {
    const c = el("div", "card");
    c.appendChild(el("span", "badge", "✦ " + T().statsAi));
    v.appendChild(c);
  }
  const btn = el("button", "btn", state.token ? T().continue : T().start);
  btn.type = "button";
  btn.addEventListener("click", async () => {
    showError(null);
    if (state.token) {
      try {
        setLoading(true);
        state.me = await api("/api/me");
        state.screen = "me";
      } catch (e) { state.screen = "quiz"; state.step = 1; showError(e.message); }
      finally { setLoading(false); render(); }
    } else { state.screen = "quiz"; state.step = 1; render(); }
  });
  v.appendChild(btn);
  v.appendChild(el("p", "sec-sub note", T().landingNote));
  if (!state.stats) loadStats();
}
async function loadStats() {
  try {
    const d = await api("/api/stats");
    state.stats = d;
    if (state.screen === "landing") render();
  } catch (e) { /* stay offline-tolerant; stats show … */ }
}

function progressHead(v, step, total) {
  const meta = el("div", "step-meta");
  meta.appendChild(el("span", null, T().step + " " + step + T().of + total));
  meta.appendChild(el("span", null, Math.round((step / total) * 100) + "%"));
  v.appendChild(meta);
  const p = el("div", "progress");
  const f = el("i");
  f.style.width = Math.round((step / total) * 100) + "%";
  p.appendChild(f);
  v.appendChild(p);
}
function navRow(v, opts) {
  opts = opts || {};
  const r = el("div", "row");
  r.style.marginTop = "18px";
  const back = el("button", "btn ghost", T().back);
  back.type = "button";
  back.addEventListener("click", () => { showError(null); state.step = Math.max(1, state.step - 1); render(); });
  r.appendChild(back);
  if (opts.skip) {
    const sk = el("button", "btn ghost", T().skip);
    sk.type = "button";
    sk.addEventListener("click", opts.onSkip);
    r.appendChild(sk);
  }
  const next = el("button", "btn", opts.label || T().next);
  next.type = "button";
  if (opts.disabled) next.disabled = true;
  next.addEventListener("click", opts.onNext);
  r.appendChild(next);
  v.appendChild(r);
  return { back, next };
}

function renderQuiz(v) {
  const f = state.form;
  if (state.step === 1) {
    progressHead(v, 1, 6);
    const c = el("div", "card");
    c.appendChild(el("h2", null, T().q1t));
    const mkField = (label, type, val, ph, key, num) => {
      c.appendChild(el("label", "f", label));
      const inp = document.createElement("input");
      inp.type = type; inp.value = val; inp.placeholder = ph;
      if (num) { inp.inputMode = "numeric"; }
      inp.addEventListener("input", () => { f[key] = inp.value; validate(); });
      c.appendChild(inp);
      return inp;
    };
    v.appendChild(c);
    const nameI = mkField(T().q1name, "text", f.name, T().q1namePh, "name");
    const ageI = mkField(T().q1age, "number", f.age, "25", "age", true);
    const cityI = mkField(T().q1city, "text", f.city, T().q1cityPh, "city");
    const row = navRow(v, { onNext: () => {
      const age = Number(String(f.age).trim());
      const ok = f.name.trim().length >= 1 && f.name.trim().length <= 40 &&
        Number.isFinite(age) && age >= 16 && age <= 99 &&
        f.city.trim().length >= 1 && f.city.trim().length <= 40;
      if (!ok) { showError(T().q1err); return; }
      showError(null); state.step = 2; render();
    }});
    const validate = () => {
      const age = Number(String(f.age).trim());
      row.next.disabled = !(f.name.trim().length >= 1 && Number.isFinite(age) && age >= 16 && age <= 99 && f.city.trim().length >= 1);
    };
    validate();
    nameI.focus();
  } else if (state.step === 2) {
    progressHead(v, 2, 6);
    const c = el("div", "card");
    c.appendChild(el("h2", null, T().q2t));
    const g = el("div", "opt-grid");
    Object.keys(TONGUE).forEach((k) => {
      g.appendChild(optBtn(TONGUE[k][LI()], null, f.tongue === k, () => {
        f.tongue = k; showError(null); state.step = 3; render();
      }));
    });
    c.appendChild(g);
    v.appendChild(c);
    navRow(v, { label: T().skip, onNext: () => { f.tongue = f.tongue || "both"; state.step = 3; render(); } });
  } else if (state.step === 3) {
    progressHead(v, 3, 6);
    const c = el("div", "card");
    c.appendChild(el("h2", null, T().q3t));
    const cnt = el("p", "sec-sub", T().q3sub + ": " + f.interests.length + "/8");
    c.appendChild(cnt);
    const chips = el("div", "chips");
    Object.keys(INTERESTS).forEach((k) => {
      const on = f.interests.includes(k);
      chips.appendChild(chipBtn(INTERESTS[k][LI()], on, (ev) => {
        const arr = state.form.interests;
        const i = arr.indexOf(k);
        if (i >= 0) arr.splice(i, 1);
        else if (arr.length < 8) arr.push(k);
        render();
      }));
    });
    c.appendChild(chips);
    v.appendChild(c);
    navRow(v, { disabled: f.interests.length < 1, onNext: () => { showError(null); state.step = 4; render(); } });
  } else if (state.step === 4) {
    progressHead(v, 4, 6);
    const c = el("div", "card");
    c.appendChild(el("h2", null, T().q4t));
    const g = el("div", "opt-grid");
    Object.keys(WEEKEND).forEach((k) => {
      g.appendChild(optBtn(WEEKEND[k][LI()], null, f.weekend === k, () => {
        f.weekend = k; showError(null); state.step = 5; render();
      }));
    });
    c.appendChild(g);
    v.appendChild(c);
    navRow(v, { label: T().skip, onNext: () => { f.weekend = f.weekend || "friends"; state.step = 5; render(); } });
  } else if (state.step === 5) {
    progressHead(v, 5, 6);
    const c = el("div", "card");
    c.appendChild(el("h2", null, T().q5t));
    const g = el("div", "opt-grid");
    Object.keys(LOOKING).forEach((k) => {
      g.appendChild(optBtn(LOOKING[k][LI()], null, f.looking === k, () => {
        f.looking = k;
        g.querySelectorAll(".opt").forEach((b, i) => {
          b.setAttribute("aria-pressed", Object.keys(LOOKING)[i] === k ? "true" : "false");
        });
        validate();
      }));
    });
    c.appendChild(g);
    c.appendChild(el("label", "f", T().q5note));
    const ta = document.createElement("textarea");
    ta.maxLength = 200; ta.placeholder = T().q5notePh; ta.value = f.note;
    ta.addEventListener("input", () => { f.note = ta.value; });
    c.appendChild(ta);
    v.appendChild(c);
    const row = navRow(v, { disabled: !f.looking, onNext: async () => {
      showError(null);
      try { setLoading(true, T().saving); await ensurePlans(); } catch (e) { /* plans optional */ }
      finally { setLoading(false); }
      state.step = 6; render();
    }});
    const validate = () => { row.next.disabled = !f.looking; };
  } else {
    progressHead(v, 6, 6);
    renderPlanPicker(v);
  }
}

async function ensurePlans() {
  if (!state.plansCache) {
    try { const d = await api("/api/plans"); state.plansCache = (d && d.plans) || []; }
    catch (e) { state.plansCache = []; }
  }
}
function renderPlanPicker(v) {
  const c = el("div", "card");
  c.appendChild(el("h2", null, T().q6t));
  c.appendChild(el("p", "sec-sub", T().q6sub));
  const chips = el("div", "chips");
  const list = state.plansCache || [];
  if (!list.length) chips.appendChild(el("span", "sec-sub", T().noPlans));
  list.slice(0, 12).forEach((p) => {
    const on = state.form.plans.includes(p.id);
    const title = (p.title && (p.title[state.lang] || p.title.et || p.title.ru)) || p.id;
    chips.appendChild(chipBtn(title, on, () => {
      const arr = state.form.plans;
      const i = arr.indexOf(p.id);
      if (i >= 0) arr.splice(i, 1);
      else if (arr.length < 3) arr.push(p.id);
      render();
    }));
  });
  c.appendChild(chips);
  v.appendChild(c);
  navRow(v, { skip: true, label: T().finish,
    onSkip: () => submitProfile(),
    onNext: () => submitProfile() });
}
async function submitProfile() {
  const f = state.form;
  const body = {
    name: String(f.name).trim().slice(0, 40),
    age: Number(String(f.age).trim()),
    city: String(f.city).trim().slice(0, 40),
    lang: state.lang,
    tongue: f.tongue || "both",
    looking: f.looking || "friends",
    weekend: f.weekend || "friends",
    interests: f.interests.slice(0, 8),
    note: String(f.note || "").slice(0, 200),
    plans: f.plans.slice(0, 3),
  };
  showError(null);
  setLoading(true, T().saving);
  try {
    const d = await api("/api/profile", { method: "POST", body });
    if (d && d.token) { state.token = d.token; localStorage.setItem(LS_TOKEN, d.token); }
    state.me = await api("/api/me");
    state.screen = "result";
  } catch (e) { showError(e.message); }
  finally { setLoading(false); render(); }
}

function personalityCard(me) {
  const p = (me && me.personality) || {};
  const arch = p.archetype || {};
  const card = el("div", "card hero");
  card.appendChild(el("span", "badge", "✦ " + T().yourType));
  card.appendChild(el("div", "arch", arch[state.lang] || arch.et || arch.ru || "—"));
  const sum = (p.summary || {})[state.lang] || (p.summary || {}).et || (p.summary || {}).ru || "";
  if (sum) card.appendChild(el("p", "subtitle", sum));
  if (p.ai) {
    const b = el("span", "badge", "✦ " + T().aiBadge);
    b.style.marginLeft = "6px";
    card.appendChild(b);
  }
  const tr = p.traits || {};
  ["avatus", "sotsiaalsus", "plaanitus", "seikluslikkus"].forEach((k) => {
    card.appendChild(traitBar(k, Number(tr[k] || 0)));
  });
  if (p.interests && p.interests.length) card.appendChild(interestChips(p.interests));
  return card;
}
function renderResult(v) {
  if (!state.me) { state.screen = "landing"; return renderLanding(v); }
  v.appendChild(personalityCard(state.me));
  const b = el("button", "btn", T().toMatches);
  b.type = "button";
  b.addEventListener("click", async () => {
    state.screen = "matches"; showError(null); setLoading(true); render();
    try { const d = await api("/api/matches"); state.matches = (d && d.matches) || []; }
    catch (e) { showError(e.message); }
    finally { setLoading(false); render(); }
  });
  v.appendChild(b);
  const ghost = el("button", "btn ghost", T().tabs.me);
  ghost.type = "button"; ghost.style.marginTop = "10px";
  ghost.addEventListener("click", () => { state.screen = "me"; render(); });
  v.appendChild(ghost);
}
function renderMe(v) {
  const me = state.me;
  if (!me) {
    const c = el("div", "card");
    c.appendChild(el("p", null, T().loading));
    v.appendChild(c);
    api("/api/me").then((d) => { state.me = d; render(); }).catch((e) => showError(e.message));
    return;
  }
  const head = el("div", "card");
  head.appendChild(el("h2", null, [me.name, me.age].filter((x) => x !== undefined && x !== null && x !== "").join(", ")));
  const meta = [me.city, me.lang === "et" ? "ET" : "RU"].filter(Boolean).join(" · ");
  if (meta) head.appendChild(el("p", "sec-sub", meta));
  if (me.note) head.appendChild(el("p", null, me.note));
  v.appendChild(head);
  v.appendChild(el("p", "sec-sub", T().meSub));
  v.appendChild(personalityCard(me));
  const out = el("button", "btn ghost", T().restart);
  out.type = "button"; out.style.marginTop = "10px";
  out.addEventListener("click", () => {
    state.token = null; localStorage.removeItem(LS_TOKEN);
    state.me = null; state.matches = null;
    state.form = { name: "", age: "", city: "", tongue: null, interests: [], weekend: null, looking: null, note: "", plans: [] };
    state.screen = "landing"; showError(null); render();
  });
  v.appendChild(out);
}

function renderMatches(v) {
  const list = state.matches;
  if (!list) {
    v.appendChild(el("p", "sec-sub", T().loading));
    api("/api/matches").then((d) => { state.matches = (d && d.matches) || []; setLoading(false); render(); })
      .catch((e) => { setLoading(false); showError(e.message); render(); });
    return;
  }
  setLoading(false);
  if (!list.length) {
    const authed = !!state.me;
    const c = el("div", "card empty");
    c.appendChild(el("span", "big", "💜"));
    c.appendChild(el("p", null, authed ? T().matchEmptyAuth : T().matchEmpty));
    c.appendChild(el("p", "sec-sub", authed ? T().matchEmptyAuthSub : T().matchEmptySub));
    const again = el("button", "btn", T().retry);
    again.type = "button";
    again.addEventListener("click", () => { state.matches = null; render(); });
    c.appendChild(again);
    v.appendChild(c);
    return;
  }
  const sorted = list.slice().sort((a, b) => (b.score || 0) - (a.score || 0));
  sorted.forEach((m) => {
    const c = el("div", "card match");
    const top = el("div", "row");
    top.style.alignItems = "center";
    const who = el("div");
    who.style.flex = "1";
    who.appendChild(el("h3", null, [m.name, m.age].filter((x) => x !== undefined && x !== null && x !== "").join(", ")));
    who.appendChild(el("div", "meta", [m.city, (m.lang || "").toUpperCase()].filter(Boolean).join(" · ")));
    top.appendChild(who);
    const sc = el("span", "badge score", (m.score ?? "–") + "%");
    top.appendChild(sc);
    c.appendChild(top);
    const arch = (m.archetype || {})[state.lang] || (m.archetype || {}).et || (m.archetype || {}).ru;
    if (arch) {
      const b = el("span", "badge lang", arch);
      c.appendChild(b);
    }
    const sum = (m.summary || {})[state.lang] || (m.summary || {}).et || (m.summary || {}).ru;
    if (sum) c.appendChild(el("p", "sum", sum));
    if (m.interests && m.interests.length) c.appendChild(interestChips(m.interests));
    if (m.reasons && m.reasons.length) {
      const ul = document.createElement("ul");
      m.reasons.forEach((r) => ul.appendChild(el("li", null, r)));
      c.appendChild(ul);
    }
    v.appendChild(c);
  });
}

function renderCircles(v) {
  const load = async () => {
    try {
      const d = await api("/api/circles");
      state.circles = (d && d.circles) || [];
    } catch (e) { showError(e.message); state.circles = []; }
    render();
  };
  if (!state.circles) { setLoading(false); load(); v.appendChild(el("p", "sec-sub", T().loading)); return; }
  const rec = state.circles.filter((c) => c.recommended);
  const pop = state.circles.filter((c) => !c.recommended).sort((a, b) => (b.members || 0) - (a.members || 0));
  const draw = (title, items) => {
    if (!items.length) return;
    v.appendChild(el("h2", "sec-title", title));
    items.forEach((c) => v.appendChild(circleCard(c)));
  };
  draw(T().rec, rec);
  v.appendChild(el("h2", "sec-title", T().popular));
  if (!pop.length && !rec.length) v.appendChild(el("p", "sec-sub", T().matchEmpty));
  pop.forEach((c) => v.appendChild(circleCard(c)));
}
function circleCard(c) {
  const card = el("div", "card plan");
  const main = el("div", "p-main");
  const nm = (c.name || {})[state.lang] || (c.name || {}).et || (c.name || {}).ru || c.id;
  main.appendChild(el("b", null, nm));
  const why = (c.why || {})[state.lang] || (c.why || {}).et || (c.why || {}).ru;
  const desc = (c.desc || {})[state.lang] || (c.desc || {}).et || (c.desc || {}).ru;
  main.appendChild(el("span", null, why || desc || [c.category, c.city].filter(Boolean).join(" · ")));
  card.appendChild(main);
  const g = el("div", "going");
  g.appendChild(el("b", null, String(c.members ?? 0)));
  g.appendChild(el("span", null, T().members));
  card.appendChild(g);
  const btn = el("button", "join-btn", c.joined ? T().leave : T().join);
  btn.type = "button";
  btn.setAttribute("aria-pressed", c.joined ? "true" : "false");
  btn.addEventListener("click", async () => {
    btn.disabled = true;
    try {
      const d = await api("/api/circles/" + encodeURIComponent(c.id) + "/join", { method: "POST" });
      c.joined = !!(d && d.joined);
      if (d && typeof d.members === "number") c.members = d.members;
      btn.textContent = c.joined ? T().leave : T().join;
      btn.setAttribute("aria-pressed", c.joined ? "true" : "false");
      const b2 = g.querySelector("b"); if (b2) b2.textContent = String(c.members ?? 0);
    } catch (e) { showError(e.message); }
    finally { btn.disabled = false; }
  });
  card.appendChild(btn);
  return card;
}

function renderPlans(v) {
  const load = async () => {
    try {
      const d = await api("/api/plans");
      state.plans = ((d && d.plans) || []).slice().sort((a, b) => (b.going || 0) - (a.going || 0));
    } catch (e) { showError(e.message); state.plans = []; }
    render();
  };
  if (!state.plans) { load(); v.appendChild(el("p", "sec-sub", T().loading)); return; }
  v.appendChild(el("h2", "sec-title", T().plansTitle));
  // add-plan form
  const form = el("div", "card");
  form.appendChild(el("b", null, T().addPlan));
  const mkIn = (label, ph, key) => {
    form.appendChild(el("label", "f", label));
    const i = document.createElement("input");
    i.type = "text"; i.placeholder = ph; i.value = (state.newPlan && state.newPlan[key]) || "";
    i.addEventListener("input", () => { state.newPlan = state.newPlan || {}; state.newPlan[key] = i.value; });
    form.appendChild(i);
    return i;
  };
  const tI = mkIn(T().fTitle, T().fTitlePh, "title");
  mkIn(T().fWhen, T().fWhenPh, "when");
  mkIn(T().fCity, T().fCityPh, "city");
  const add = el("button", "btn amber", T().add);
  add.type = "button"; add.style.marginTop = "14px";
  add.addEventListener("click", async () => {
    const np = state.newPlan || {};
    const title = String(np.title || "").trim(), when = String(np.when || "").trim(), city = String(np.city || "").trim();
    if (title.length < 3 || title.length > 60 || !when.length || !city.length) { showError(T().errPlan); return; }
    showError(null); add.disabled = true;
    try {
      const d = await api("/api/plans", { method: "POST", body: { title, when, city } });
      if (d && d.id) state.plans.unshift(d);
      state.newPlan = {};
      render();
    } catch (e) { showError(e.message); }
    finally { add.disabled = false; }
  });
  form.appendChild(add);
  v.appendChild(form);
  if (!state.plans.length) {
    const e2 = el("div", "card empty");
    e2.appendChild(el("span", "big", "🗓️"));
    e2.appendChild(el("p", null, T().noPlans));
    v.appendChild(e2);
    return;
  }
  state.plans.forEach((p) => {
    const card = el("div", "card plan");
    const main = el("div", "p-main");
    main.appendChild(el("b", null, (p.title || {})[state.lang] || (p.title || {}).et || (p.title || {}).ru || ""));
    main.appendChild(el("span", null, [((p.when || {})[state.lang] || (p.when || {}).et || (p.when || {}).ru || ""), p.city].filter(Boolean).join(" · ")));
    card.appendChild(main);
    const g = el("div", "going");
    g.appendChild(el("b", null, String(p.going ?? 0)));
    g.appendChild(el("span", null, T().going));
    card.appendChild(g);
    const btn = el("button", "join-btn", p.joined ? T().joined : T().join);
    btn.type = "button";
    btn.setAttribute("aria-pressed", p.joined ? "true" : "false");
    btn.addEventListener("click", async () => {
      btn.disabled = true;
      try {
        const d = await api("/api/plans/" + encodeURIComponent(p.id) + "/join", { method: "POST" });
        p.joined = !!(d && d.joined);
        if (d && typeof d.going === "number") p.going = d.going;
        btn.textContent = p.joined ? T().joined : T().join;
        btn.setAttribute("aria-pressed", p.joined ? "true" : "false");
        const b2 = g.querySelector("b"); if (b2) b2.textContent = String(p.going ?? 0);
      } catch (e) { showError(e.message); }
      finally { btn.disabled = false; }
    });
    card.appendChild(btn);
    v.appendChild(card);
  });
  if (tI && !state.newPlan) tI.value = "";
}

/* ---------- boot ---------- */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
}
applyLang();
if (state.token) {
  state.screen = "me";
  api("/api/me").then((d) => { state.me = d; render(); })
    .catch(() => { state.token = null; localStorage.removeItem(LS_TOKEN); state.screen = "landing"; render(); });
}
