const Character = require('../models/character');
const User = require('../models/user');

const initialInfo = [
  { content: 'Lady demetricus', important: true },
  { content: 'Albert Wesker', important: true },
];

const nonExistingId = async () => {
  const character = new Character({ content: 'Spencer' });
  await character.save();
  await character.deleteOne();

  return character._id.toString();
};

const characterInDb = async () => {
  const character = await Character.find({});
  return character.map((item) => item.toJSON());
};

const usersInDb = async () => {
  const user = await User.find({});
  return user.map((u) => u.toJSON());
};

module.exports = { initialInfo, nonExistingId, characterInDb, usersInDb };
