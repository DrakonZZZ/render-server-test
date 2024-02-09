const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let data = [
  {
    id: 1,
    content: 'HTML is easy',
    important: true,
  },
  {
    id: 2,
    content: 'Browser can execute only JavaScript',
    important: false,
  },
  {
    id: 3,
    content: 'GET and POST are the most important methods of HTTP protocol',
    important: true,
  },
];

app.get('/', (req, res) => res.send('api working!'));

app.get('/api/persons', (req, res) => {
  res.send(data);
});

app.get('/api/info', (req, res) => {
  const totalInfo = data.length;
  const infoHtml = `
      <div>
        <p>Phonebook has info for ${totalInfo} people</p>
        <p>${new Date()}</p>
      </div>
    `;
  res.send(infoHtml);
});

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  const newInfo = data.find((person) => person.id === +id);
  if (newInfo) {
    res.send(newInfo);
  } else {
    res.status(404).end();
  }
});

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  data = data.filter((person) => person.id !== id);
  res.status(204).end();
});

const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
  return maxId + 1;
};

app.post('/api/persons', (req, res) => {
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
