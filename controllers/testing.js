const testingRouter = require('express').Router();
const Characters = require('../models/character');
const User = require('../models/user');

testingRouter.post('/reset', async (req, res) => {
  await Characters.deleteMany({});
  await User.deleteMany({});

  res.status(204).end();
});

module.exports = testingRouter;
