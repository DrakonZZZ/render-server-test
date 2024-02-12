const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const Character = require('../models/character');

const initialInfo = [
  { content: 'Lady demetricus', important: true },
  { content: 'Albert Wesker', important: true },
];

beforeEach(async () => {
  await Character.deleteMany({});
  let charObj = new Character(initialInfo[0]);
  await charObj.save();
  charObj = new Character(initialInfo[1]);
  await charObj.save();
});

test('characters are returned in json', async () => {
  await api
    .get('/api/character')
    .expect(200)
    .expect('content-type', /application\/json/);
}, 1e5);

test('all character recieved', async () => {
  const res = await api.get('/api/character');
  expect(res.body).toHaveLength(initialInfo.length);
});

test('http methods', async () => {
  const res = await api.get('/api/character');
  expect(res.body[0].content).toBe('Lady demetricus');
});

test('a specific note is within the returned notes', async () => {
  const res = await api.get('/api/character');
  const contents = res.body.map((item) => item.content);
  expect(contents).toContain('Albert Wesker');
});

test('a valid character can be added', async () => {
  const newCharacter = {
    content: 'Specer',
    import: false,
  };

  await api
    .post('/api/character')
    .send(newCharacter)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const res = await api.get('/api/character');

  const contents = res.body.map((item) => item.content);
  expect(res.body).toHaveLength(initialInfo.toHaveLength + 1);

  expect(contents).toContain('Specer');
});


test()

afterAll(async () => {
  await mongoose.connection.close;
});
