'use strict';

require('babel/register')({blacklist: ['regenerator']});

const _ = require('lodash');

_.defaults(process.env, {
  NODE_ENV: 'development',
  HOST: '0.0.0.0',
  PORT: 3000,
  TIMEOUT: 6000,
  BACKLOG: 511
});
