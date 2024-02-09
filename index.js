require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const Character = require('./models/character');

app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

app.get('/', (req, res) => res.send('api working!'));

app.get('/api/character', (req, res) => {
  Character.find({}).then((char) => {
    res.json(char);
  });
});

app.get('/api/character/:id', (req, res, next) => {
  const id = req.params.id;
  Character.findById(id)
    .then((char) => {
      if (char) {
        res.json(char);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next.error);
});

app.post('/api/character', (req, res, next) => {
  const body = req.body;

  if (!body.content) {
    return res.status(400).json({
      error: 'content missing',
    });
  }

  const character = new Character({
    content: body.content,
    important: body.important || false,
  });

  character
    .save()
    .then((saveChar) => {
      res.json(saveChar);
    })
    .catch((error) => next(error));
});

app.put('/api/characters/:id', (req, res, next) => {
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

app.delete('/api/character/:id', (req, res, next) => {
  Character.findByIdAndDelete(req.params.id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

const unknownEndPoint = (req, res) => {
  res.status(404).send({ error: 'unknow endpoint' });
};
app.use(unknownEndPoint);

const errorHandler = (error, req, res, next) => {
  console.log(error.message);

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  }
  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, console.log('connected to port 3001'));
