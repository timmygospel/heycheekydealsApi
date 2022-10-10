const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const compress = require('compression')
const helmet = require('helmet');
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const services = require('./services')
const mongoose = require('mongoose')

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use(compress());
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)
app.use(helmet());

app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", "data:", "*.amazonaws.com"]
  }
}));

const serviceNames = Object.keys(services);
for (let i = 0; i < serviceNames.length; i += 1) {
  const name = serviceNames[i];
  if (name === 'graphql') {
    (async () => {
      await services[name].start();
      services[name].applyMiddleware({ app });
    })();
  } else {
    app.use('/y${name}', services[name]);
  }
}

app.use(helmet.referrerPolicy({ policy: 'same-origin' }));


app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app