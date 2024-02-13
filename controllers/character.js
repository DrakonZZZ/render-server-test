const charactersRoute = require('express').Router()
const Character = require('../models/character')

charactersRoute.get('/', (req, res) => {
  Character.find({}).then((char) => {
    res.json(char)
  })
})

charactersRoute.get('/:id', (req, res, next) => {
  const id = req.params.id
  Character.findById(id)
    .then((char) => {
      if (char) {
        res.json(char)
      } else {
        res.status(404).end()
      }
    })
    .catch((error) => next(error))
})

charactersRoute.post('/', (req, res, next) => {
  const body = req.body

  if (!body.content) {
    return res.status(400).json({
      error: 'content missing',
    })
  }

  const character = new Character({
    content: body.content,
    important: body.important || false,
  })

  character
    .save()
    .then((saveChar) => {
      res.status(201).json(saveChar)
    })
    .catch((error) => next(error))
})

charactersRoute.put('/:id', (req, res, next) => {
  const body = req.body

  const char = {
    content: body.content,
    important: body.important,
  }

  Character.findByIdAndUpdate(req.params.id, char, { new: true })
    .then((updateChar) => {
      res.json(updateChar)
    })
    .catch((error) => next(error))
})

charactersRoute.delete('/:id', (req, res, next) => {
  Character.findByIdAndDelete(req.params.id)
    .then((result) => {
      console.log(result)
      res.status(204).end()
    })
    .catch((error) => next(error))
})

module.exports = charactersRoute
