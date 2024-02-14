const charactersRoute = require('express').Router();
const Character = require('../models/character');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const getTokenFrom = (req) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '');
  }
  return null;
};

charactersRoute.get('/', (req, res) => {
  Character.find({})
    .populate('user', { username: 1, name: 1 })
    .then((char) => {
      res.json(char);
    });
});

charactersRoute.get('/:id', (req, res, next) => {
  const id = req.params.id;
  Character.findById(id)
    .then((char) => {
      if (char) {
        res.json(char);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

charactersRoute.post('/', async (req, res, next) => {
  const body = req.body;

  try {
    const token = getTokenFrom(req);

    const decryptToken = jwt.verify(token, process.env.SECRET);

    if (!decryptToken.id) {
      return res.status(401).json({ error: 'Invalid Token!' });
    }

    const user = await User.findById(decryptToken.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!body.content) {
      return res.status(400).json({ error: 'Content missing' });
    }

    const character = new Character({
      content: body.content,
      important: body.important || false,
      user: user.id,
    });

    const savedCharacter = await character.save();

    user.characterList.push(savedCharacter._id);
    await user.save();

    res.status(201).json(savedCharacter);
  } catch (error) {
    next(error);
  }
});

charactersRoute.put('/:id', async (req, res, next) => {
  const body = req.body;

  try {
    const char = {
      content: body.content,
      important: body.important,
    };

    const updateChar = await Character.findByIdAndUpdate(req.params.id, char, {
      new: true,
    });
    res.json(updateChar);
  } catch (error) {
    next(error);
  }
});
charactersRoute.put('/:id', (req, res, next) => {
  const body = req.body;

  const char = {
    content: body.content,
    important: body.important,
  };

  Character.findByIdAndUpdate(req.params.id, char, { new: true })
    .then((updateChar) => {
      res.json(updateChar);
    })
    .catch((error) => next(error));
});

charactersRoute.delete('/:id', (req, res, next) => {
  Character.findByIdAndDelete(req.params.id)
    .then((result) => {
      console.log(result);
      res.status(204).end();
    })
    .catch((error) => next(error));
});

module.exports = charactersRoute;
