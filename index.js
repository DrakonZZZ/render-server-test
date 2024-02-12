const config = require('./utils/config');
const express = require('express');
const app = express();
const cors = require('cors');
const characterRouter = require('./controllers/character');
const logger = require('./utils/logger');
const middleware = require('./utils/middleware');
const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const url = process.env.MONGODB_URI;

logger.info('connecing to', url);

mongoose
  .connect(url)
  .then(() => logger.info('connnected to mongoDB'))
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message);
  });

app.use(cors());
app.use(express.static('dist'));
app.use(express.json());

app.use('/api/character', characterRouter);

app.use(middleware.requestLogger);
app.use(middleware.unknownEndPoint);
app.use(middleware.errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, logger.info(`Server running on port ${config.PORT}`));
