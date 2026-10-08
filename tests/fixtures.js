'use strict';

// Shared questionnaire fixtures for tests.

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

module.exports = { SAMPLE, SAMPLE2 };
