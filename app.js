const express = require('express');
const process = require('process');
const logger = require('morgan');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const boolParser = require('express-query-boolean');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const apiRouter = require('./routes/api/');

const {
  HttpCode: { NOT_FOUND, INTERNAL_SERVER_ERROR },
  limiterAPI,
} = require('./helpers');

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(helmet());

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json({ limit: 10000 }));
app.use(boolParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1/', rateLimit(limiterAPI));

app.use('/api/v1/', apiRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((_req, res) => {
  res
    .status(NOT_FOUND)
    .json({ status: 'error', code: NOT_FOUND, message: 'Not found' });
});

app.use((err, _req, res, _next) => {
  const status = err.status || INTERNAL_SERVER_ERROR;
  res.status(status).json({
    status: 'fail',
    code: status,
    message: err.message.replace(/"/gi, ''),
  });
});

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
});

module.exports = app;
