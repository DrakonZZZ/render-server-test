const bcrypt = require('bcrypt');
const userRouter = require('express').Router();
const User = require('../models/user');

userRouter.get('/', async (req, res, next) => {
  try {
    const users = await User.find({}).populate('characterList', {
      content: 1,
      important: 1,
    });
    res.json(users);
  } catch (error) {
    next(error);
  }
});
userRouter.post('/', async (req, res, next) => {
  const { username, name, password } = req.body;

  const saltRound = 10;
  const passwordHash = await bcrypt.hash(password, saltRound);
  const newUser = new User({
    username,
    name,
    passwordHash,
  });

  newUser
    .save()
    .then((saveUser) => {
      res.status(201).json(saveUser);
    })
    .catch((error) => next(error));
});

module.exports = userRouter;
