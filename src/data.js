'use strict';

// Bilingual seed data for Venestlus: interest tags, option labels,
// personality archetypes, interest circles and the "where everyone is going" feed.

const TAGS = {
  music: { et: 'Muusika', ru: 'Музыка' },
  sport: { et: 'Sport', ru: 'Спорт' },
  food: { et: 'Toit', ru: 'Еда' },
  nature: { et: 'Loodus', ru: 'Природа' },
  games: { et: 'Mängud', ru: 'Игры' },
  art: { et: 'Kunst', ru: 'Искусство' },
  tech: { et: 'Tehnoloogia', ru: 'Технологии' },
  night: { et: 'Ööelu', ru: 'Ночная жизнь' },
  family: { et: 'Pere', ru: 'Семья' },
  travel: { et: 'Reisimine', ru: 'Путешествия' },
  languages: { et: 'Keeled', ru: 'Языки' },
  volunteering: { et: 'Vabatahtlikkus', ru: 'Волонтёрство' },
  reading: { et: 'Lugemine', ru: 'Чтение' },
  cinema: { et: 'Kino', ru: 'Кино' },
  photo: { et: 'Fotograafia', ru: 'Фотография' },
  dance: { et: 'Tants', ru: 'Танцы' },
};

// Trait deltas applied once per selected interest.
const TAG_TRAITS = {
  music: { avatus: 4 },
  sport: { seikluslikkus: 4, plaanitus: 3 },
  food: { avatus: 3, sotsiaalsus: 3 },
  nature: { plaanitus: 4, seikluslikkus: 2 },
  games: { sotsiaalsus: 4, avatus: 2 },
  art: { avatus: 6 },
  tech: { plaanitus: 5 },
  night: { sotsiaalsus: 6, seikluslikkus: 3 },
  family: { plaanitus: 6, sotsiaalsus: -2 },
  travel: { seikluslikkus: 6, avatus: 4 },
  languages: { avatus: 6 },
  volunteering: { sotsiaalsus: 4, avatus: 4 },
  reading: { plaanitus: 4, avatus: 2, sotsiaalsus: -3 },
  cinema: { avatus: 3, sotsiaalsus: 2 },
  photo: { avatus: 3, plaanitus: 2 },
  dance: { sotsiaalsus: 6, seikluslikkus: 4 },
};

const WEEKEND = {
  home: {
    et: 'Kodus puhkamas', ru: 'Дома отдыхаю',
    phrase: { et: 'rahulik kodune aeg', ru: 'спокойный отдых дома' },
    traits: { plaanitus: 10, sotsiaalsus: -15, avatus: -5 },
  },
  friends: {
    et: 'Sõpradega', ru: 'С друзьями',
    phrase: { et: 'aeg sõpradega', ru: 'время с друзьями' },
    traits: { sotsiaalsus: 20, plaanitus: 5 },
  },
  outdoors: {
    et: 'Õues', ru: 'На улице',
    phrase: { et: 'aeg õues ja looduses', ru: 'время на улице и на природе' },
    traits: { seikluslikkus: 20, avatus: 5 },
  },
  events: {
    et: 'Üritustel', ru: 'На мероприятиях',
    phrase: { et: 'inimeste ja ürituste keskel', ru: 'среда людей и мероприятий' },
    traits: { seikluslikkus: 15, sotsiaalsus: 15, plaanitus: 5 },
  },
};

const LOOKING = {
  friends: { et: 'Sõprust', ru: 'Дружбу', phrase: { et: 'uut sõprust', ru: 'новую дружбу' } },
  chat: { et: 'Vestlust', ru: 'Общение', phrase: { et: 'huvitavat vestlust', ru: 'интересный разговор' } },
  relationship: { et: 'Suhet', ru: 'Отношения', phrase: { et: 'tõsist suhet', ru: 'серьёзные отношения' } },
};

const TONGUE = {
  et: { et: 'Eesti keel', ru: 'Эстонский' },
  ru: { et: 'Vene keel', ru: 'Русский' },
  both: { et: 'Mõlemad', ru: 'Оба' },
};

const TRAIT_LABELS = {
  avatus: { et: 'Avatus', ru: 'Открытость' },
  sotsiaalsus: { et: 'Sotsiaalsus', ru: 'Общительность' },
  plaanitus: { et: 'Plaanitlus', ru: 'Планирование' },
  seikluslikkus: { et: 'Seikluslikkus', ru: 'Любопытство' },
};

// Archetypes: first matching rule wins. Names are shown in both languages.
const ARCHETYPES = [
  {
    test: (t) => t.seikluslikkus >= 65 && t.sotsiaalsus >= 60,
    name: { et: 'Seikleja', ru: 'Искатель приключений' },
  },
  {
    test: (t) => t.sotsiaalsus >= 68 && t.avatus >= 60,
    name: { et: 'Seltskonnahing', ru: 'Душа компании' },
  },
  {
    test: (t) => t.sotsiaalsus >= 68,
    name: { et: 'Vestleja', ru: 'Талантливый собеседник' },
  },
  {
    test: (t) => t.avatus >= 68 && t.seikluslikkus >= 55,
    name: { et: 'Uudishimulik', ru: 'Любознательный' },
  },
  {
    test: (t) => t.plaanitus >= 68 && t.sotsiaalsus >= 55,
    name: { et: 'Kindel korraldaja', ru: 'Надёжный организатор' },
  },
  {
    test: (t) => t.plaanitus >= 68,
    name: { et: 'Vaikne planeerija', ru: 'Тихий планировщик' },
  },
  {
    test: (t) => t.seikluslikkus >= 60,
    name: { et: 'Rahutu rändaja', ru: 'Беспокойный странник' },
  },
  { test: () => true, name: { et: 'Tasakaalukas', ru: 'Уравновешенный' } },
];

// Interest circles ("huviringid"). `tag` links a circle to an interest so the
// recommendation engine can say WHY a circle fits a profile.
const CIRCLES = [
  { id: 'c_lang', name: { et: 'Eesti-vene keelekohvik', ru: 'Языковой клуб' }, desc: { et: 'Iga nädal vestlusring, kus eestlased õpetavad eesti keelt ja venelased vene keelt — vabatahtlikult ja tasuta.', ru: 'Еженедельный разговорный клуб: эстонцы учат эстонский, русские — русский, добровольно и бесплатно.' }, tag: 'languages', city: 'Tallinn', base: 63 },
  { id: 'c_board', name: { et: 'Lauamängude õhtud', ru: 'Вечера настольных игр' }, desc: { et: 'Telliskivi tänaval mängime lauamänge, jagame lauda ja keelt pole vahet.', ru: 'В Теллискиви играем в настольные игры — язык не имеет значения.' }, tag: 'games', city: 'Tallinn', base: 41 },
  { id: 'c_run', name: { et: 'Tallinna jooksuseltskond', ru: 'Беговое сообщество Таллина' }, desc: { et: 'Kergejõustikrajal kohtume kolm korda nädalas; algajad teretulnud.', ru: 'Стадион, три тренировки в неделю, новичкам рады.' }, tag: 'sport', city: 'Tallinn', base: 52 },
  { id: 'c_hike', name: { et: 'Metsamatkad nädalavahetusel', ru: 'Походы на выходных' }, desc: { et: 'Rabamajad, rada ja lõke — kaks korda kuus üle Eesti.', ru: 'Болота, тропа и костёр — дважды в месяц по всей Эстонии.' }, tag: 'nature', city: 'Tartu', base: 46 },
  { id: 'c_kino', name: { et: 'Vene filmide klubi', ru: 'Клуб русского кино' }, desc: { et: 'Ekraan, mõlemad subtiitrid ja pikk arutelu pärast seanssi.', ru: 'Экран, обе субтитры и длинное обсуждение после сеанса.' }, tag: 'cinema', city: 'Tallinn', base: 27 },
  { id: 'c_vol', name: { et: 'Vabatahtlikud varjupaigas', ru: 'Волонтёры в приюте' }, desc: { et: 'Loomade jalutamine, kasside patsutamine ja ühine koristuspäev.', ru: 'Выгул животных, поглаживание кошек и общий день уборки.' }, tag: 'volunteering', city: 'Tallinn', base: 38 },
  { id: 'c_pub', name: { et: 'Tallinna pubirännakud', ru: 'Паб-прогулки по Таллину' }, desc: { et: 'Uued kohad, vanad legendid ja keegi ei jää üksi lauda.', ru: 'Новые места, старые легенды и никто не остаётся один за столом.' }, tag: 'night', city: 'Tallinn', base: 34 },
  { id: 'c_food', name: { et: 'Kodu köögi vahetus', ru: 'Обмен домашними блюдами' }, desc: { et: 'Iga kuu kokkame kodus, vahetame potte ja retsepte.', ru: 'Раз в месяц готовим дома, меняем кастрюли и рецепты.' }, tag: 'food', city: 'Tartu', base: 24 },
  { id: 'c_seto', name: { et: 'Seto leelo ja laul', ru: 'Сету: леело и песни' }, desc: { et: 'Kihelkonna laulmine, kus mitte keegi ei pea oskama kedagi keelt.', ru: 'Общее пение, где знать языки не обязательно.' }, tag: 'music', city: 'Võru', base: 15 },
  { id: 'c_dance', name: { et: 'Tantsuklubi Swing & Folk', ru: 'Танцевальный клуб' }, desc: { et: 'Swing teisipäeviti, folk laupäeviti; partnerit ei pea kaasa tooma.', ru: 'Свинг по вторникам, фольк по субботам; пару привозить не нужно.' }, tag: 'dance', city: 'Tallinn', base: 30 },
  { id: 'c_tech', name: { et: 'Tehnoloogiahuvilised', ru: 'Технологии и стартапы' }, desc: { et: 'Demo-õhtud, kiirvestlused ja ühine laud hackathonidel.', ru: 'Демо-вечера, спичи и общий стол на хакатонах.' }, tag: 'tech', city: 'Tallinn', base: 33 },
  { id: 'c_photo', name: { et: 'Tallinna tänavafotograafia', ru: 'Уличная фотография' }, desc: { et: 'Käime linna peal, pildistame ja anname tagasisidet ausalt.', ru: 'Гуляем по городу, снимаем и честно даём обратную связь.' }, tag: 'photo', city: 'Tallinn', base: 19 },
  { id: 'c_art', name: { et: 'Kunstihuvi pärastlõunad', ru: 'Дневные художественные встречи' }, desc: { et: 'Galeriid, savi ja akvarel; joonistada ei oska keegi.', ru: 'Галереи, глина и акварель; рисовать не умеет никто.' }, tag: 'art', city: 'Tartu', base: 22 },
  { id: 'c_family', name: { et: 'Perede pargipäevad', ru: 'Семейные дни в парке' }, desc: { et: 'Lapsed mängivad, täiskasvanud vestlevad; keel on kõrvaline.', ru: 'Дети играют, взрослые разговаривают — язык вторичен.' }, tag: 'family', city: 'Tallinn', base: 29 },
];

// The "kuhu kõik teised lähevad" feed — seeded with base attendance counts.
const PLANS = [
  { id: 'p_market', title: { et: 'Kalamaja kirbuturg', ru: 'Кирпичный рынок Каламая' }, when: { et: 'laupäev, keskpäev', ru: 'суббота, полдень' }, city: 'Tallinn', base: 57, tag: 'food' },
  { id: 'p_lang', title: { et: 'Eesti-vene keelekohvik', ru: 'Языковой клуб' }, when: { et: 'kolmapäev õhtul', ru: 'в среду вечером' }, city: 'Tallinn', base: 51, tag: 'languages' },
  { id: 'p_pub', title: { et: 'Pubirännak vanalinnas', ru: 'Паб-прогулка по Старому городу' }, when: { et: 'reede õhtul', ru: 'в пятницу вечером' }, city: 'Tallinn', base: 44, tag: 'night' },
  { id: 'p_hike', title: { et: 'Pääsküla rabamatk', ru: 'Поход по болоту Пяскюла' }, when: { et: 'pühapäev hommikul', ru: 'в воскресенье утром' }, city: 'Tallinn', base: 39, tag: 'nature' },
  { id: 'p_vol', title: { et: 'Varjupaiga vabatahtlik päev', ru: 'День волонтёров приюта' }, when: { et: 'laupäev hommikul', ru: 'в субботу утром' }, city: 'Tallinn', base: 31, tag: 'volunteering' },
  { id: 'p_board', title: { et: 'Lauamängude õhtu Telliskivis', ru: 'Вечер настольных игр в Теллискиви' }, when: { et: 'neljapäev õhtul', ru: 'в четверг вечером' }, city: 'Tallinn', base: 33, tag: 'games' },
  { id: 'p_run', title: { et: 'Keskpäevane jooksmine Kadriorus', ru: 'Дневной забег в Кадриорге' }, when: { et: 'teisipäev lõunal', ru: 'вторник днём' }, city: 'Tallinn', base: 28, tag: 'sport' },
  { id: 'p_kino', title: { et: 'Vene keelse filmi õhtu', ru: 'Вечер русскоязычного кино' }, when: { et: 'reede õhtul', ru: 'в пятницу вечером' }, city: 'Tallinn', base: 26, tag: 'cinema' },
  { id: 'p_food', title: { et: 'Kodu köögi vahetus', ru: 'Обмен домашними блюдами' }, when: { et: 'laupäev pärastlõunal', ru: 'в субботу днём' }, city: 'Tartu', base: 22, tag: 'food' },
  { id: 'p_dance', title: { et: 'Swing-tantsude õhtu', ru: 'Вечер свинг-танцев' }, when: { et: 'reede õhtul', ru: 'в пятницу вечером' }, city: 'Tallinn', base: 24, tag: 'dance' },
  { id: 'p_tech', title: { et: 'Tehnoloogia demo-õhtu', ru: 'Демо-вечер технологий' }, when: { et: 'teisipäev õhtul', ru: 'во вторник вечером' }, city: 'Tallinn', base: 20, tag: 'tech' },
  { id: 'p_concert', title: { et: 'Seto leelo kontsert', ru: 'Концерт сетской леело' }, when: { et: 'pühapäev pärastlõunal', ru: 'в воскресенье днём' }, city: 'Võru', base: 18, tag: 'music' },
];

const OPTIONS = {
  weekend: ['home', 'friends', 'outdoors', 'events'],
  looking: ['friends', 'chat', 'relationship'],
  tongue: ['et', 'ru', 'both'],
  lang: ['et', 'ru'],
};

module.exports = {
  TAGS, TAG_TRAITS, WEEKEND, LOOKING, TONGUE, TRAIT_LABELS,
  ARCHETYPES, CIRCLES, PLANS, OPTIONS,
};
