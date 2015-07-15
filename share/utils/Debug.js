'use strict';

const isClient = typeof window !== 'undefined';
const debug = require('debug');
const root = isClient ? window : process;
root.env && ['development', 'sandbox'].indexOf(root.env.NODE_ENV) > -1 && debug.enable('app:*');

module.exports = label => debug(`app:${label}`);
