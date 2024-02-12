const logger = require('./logger');

const requestLogger = (req, res, next) => {
  logger.info('Method: ', req.method);
  logger.info('Path: ', request.path);
  logger.info('Body: ', req.body);
  logger.info('----');
  next();
};

const errorHandler = (error, req, res, next) => {
  console.log(error.message);

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  }
  next(error);
};

const unknownEndPoint = (req, res) => {
  res.status(404).send({ error: 'unknow endpoint' });
};

module.exports = { requestLogger, errorHandler, unknownEndPoint };
