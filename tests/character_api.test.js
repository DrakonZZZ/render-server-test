const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./test_helper');
const app = require('../app');
const api = supertest(app);
const bcrypt = require('bcrypt');
const Character = require('../models/character');
const User = require('../models/user');

beforeEach(async () => {
  await Character.deleteMany({});

  for (let char of helper.initialInfo) {
    let charObj = new Character(char);
    await charObj.save();
  }
});

test('characters are returned in json', async () => {
  await api
    .get('/api/character')
    .expect(200)
    .expect('content-type', /application\/json/);
}, 1e5);

test('all character recieved', async () => {
  const res = await api.get('/api/character');
  expect(res.body).toHaveLength(helper.initialInfo.length);
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

  const charactetAtEnd = await helper.characterInDb();
  expect(charactetAtEnd).toHaveLength(helper.initialInfo.length + 1);

  const contents = charactetAtEnd.map((item) => item.content);
  expect(contents).toContain('Specer');
});

test('character without content is not added', async () => {
  const newCharacter = {
    important: true,
  };

  await api.post('/api/character').send(newCharacter).expect(400);

  const charactetAtEnd = await helper.characterInDb();
  expect(charactetAtEnd).toHaveLength(helper.initialInfo.length);
});

test('a specific note can be viewed', async () => {
  const characterAtStart = await helper.characterInDb();

  const characterToView = characterAtStart[0];

  const resultChar = await api
    .get(`/api/character/${characterToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/);

  expect(resultChar.body).toEqual(characterToView);
});

test('a character to be deleted', async () => {
  const characterAtStart = await helper.characterInDb();
  const characterToDelete = characterAtStart[0];

  await api.delete(`/api/character/${characterToDelete.id}`).expect(204);

  const characterAtEnd = await helper.characterInDb();
  expect(characterAtEnd).toHaveLength(helper.initialInfo.length - 1);

  const contents = characterAtEnd.map((item) => item.content);

  expect(contents).not.toContain(characterToDelete.content);
});

describe('when theres one initial user', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('seekrat', 10);
    const user = new User({ username: 'admin', passwordHash });

    await user.save();
  });

  test('new user creation failed with message and statuscode', async () => {
    const userAtStart = await helper.usersInDb();

    const newUser = {
      username: 'kanye',
      name: 'kanye ye',
      password: 'jesus4lyfe',
    };

    const result = (await api.post('/api/user'))
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('expected `username` to be unique');

    const userAtEnd = await helper.usersInDb();
    expect(userAtEnd).toEqual(userAtStart);
  });

  test('creation of a new user successfully', async () => {
    const userAtStart = await helper.usersInDb();

    const newUser = {
      username: 'kanye',
      name: 'kanye west',
      password: 'jesus4life',
    };

    await api
      .post('/api/user')
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const userAtEnd = await helper.usersInDb();
    expect(userAtEnd).toHaveLength(userAtStart.length + 1);

    const username = userAtEnd.map((u) => u.username);
    expect(username).toContain(newUser.username);
  });
});

afterAll(async () => {
  await mongoose.connection.close;
});
