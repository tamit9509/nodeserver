
'use strict';

/***********************************
 **** node module defined here *****
 ***********************************/
const EXPRESS = require("express");
const Mongoose = require('mongoose');
Mongoose.Promise = require('bluebird');
require('dotenv').config();
const _ = require('lodash');
const io = require('socket.io');

const routes = require('./routes');
const CONFIG = require("./config");
const COMMON_FUN = require('./utils/commonFunction');
const routeUtils = require('./utils/routeUtils');

/**creating express server app for server */
const app = EXPRESS();

/********************************
 ***** Server Configuration *****
 ********************************/
app.set('port', CONFIG.SERVER.PORT);
app.use(require("body-parser").json({ limit: '50mb' }));
app.use(require("body-parser").urlencoded({ limit: '50mb', extended: true }));


/** middleware for api's logging with deployment mode */
let apiLooger = (req, res, next) => {
  COMMON_FUN.messageLogs(null, `api hitted ${req.url} ${req.method} ${process.env.NODE_ENV}`);
  next();
};

/** Used logger middleware for each api call **/
app.use(apiLooger);

/********************************
***** For handling CORS Error ***
*********************************/
app.all('/*', (request, response, next) => {
  response.header('Access-Control-Allow-Origin', '*');
  response.header('Access-Control-Allow-Headers', 'Content-Type, api_key, Authorization, x-requested-with, Total-Count, Total-Pages, Error-Message');
  response.header('Access-Control-Allow-Methods', 'POST, GET, DELETE, PUT, OPTIONS');
  response.header('Access-Control-Max-Age', 1800);
  next();
});

process.on('uncaughtException', reason => {
  console.log('uncaughtException', reason);
  process.exit(1);
})
process.on('unhandledRejection', reason => {
  console.log('unhandledRejection', reason);
  process.exit(1);
})

/** Server is running here */
let startNodeserver = () => {
  return new Promise((resolve, reject) => {
    app.listen(CONFIG.SERVER.PORT, (err) => {
      if (err) reject(err);
      resolve();
    })
  })
};

app.use('/public', EXPRESS.static('public'))

let startServer = async () => {
  //connect mongodb.
  await Mongoose.connect(CONFIG.DB.URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    reconnectTries: 20,
    reconnectInterval: 2000,
    useUnifiedTopology: true,
  });
  console.log('Mongo connected at ', CONFIG.DB.URL);
  await routeUtils.route(app, routes);
  await startNodeserver();
};

startServer()
  .then(() => {
    console.log('Node server running on ', CONFIG.SERVER.URL);
    console.log('server running on public domain ' + CONFIG.DOMAIN.URL)
  }).catch((err) => {
    console.log('Error in starting server', err);
    process.exit(1);
  });
