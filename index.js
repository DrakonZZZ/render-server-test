const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('dist'));
let data = [
  {
    id: 1,
    content: 'Leon-kennedy',
    important: true,
  },
  {
    id: 2,
    content: 'Chris Redfield',
    important: false,
  },
  {
    id: 3,
    content: 'Claire Redfield',
    important: true,
  },
];

app.get('/', (req, res) => res.send('api working!'));

app.get('/api/character', (req, res) => {
  res.send(data);
});

app.get('/api/character/:id', (req, res) => {
  const id = req.params.id;
  const newInfo = data.find((person) => person.id === +id);
  if (newInfo) {
    res.send(newInfo);
  } else {
    res.status(404).end();
  }
});

app.delete('/api/character/:id', (req, res) => {
  const id = req.params.id;
  data = data.filter((person) => person.id !== id);
  res.status(204).end();
});

const generateId = () => {
  const maxId =
    character.length > 0 ? Math.max(...character.map((n) => n.id)) : 0;
  return maxId + 1;
};

app.post('/api/character', (req, res) => {
  const body = req.body;

  if (!body.content) {
    return res.status(400).json({
      error: 'content missing',
    });
  }

  const newData = {
    content: body.content,
    important: Boolean(body.important) || false,
    id: generateId(),
  };

  data = data.concat(newData);

  res.json(note);
});

const unknownEndPoint = (req, res) => {
  res.status(404).send({ error: 'unknow endpoint' });
};
app.use(unknownEndPoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, console.log('connected to port 3001'));
