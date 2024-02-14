const config = require('./utils/config');
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const characterRouter = require('./controllers/character');
const userRouter = require('./controllers/user');
const loginRouter = require('./controllers/login');
const logger = require('./utils/logger');
const middleware = require('./utils/middleware');

mongoose.set('strictQuery', false);

logger.info('connecing to', config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => logger.info('connnected to mongoDB'))
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message);
  });

app.use(cors());
app.use(express.static('dist'));
app.use(express.json());

app.use('/api/character', characterRouter);
app.use('/api/user', userRouter);
app.use('/api/login', loginRouter);

app.use(middleware.requestLogger);
app.use(middleware.unknownEndPoint);
app.use(middleware.errorHandler);

module.exports = app;
