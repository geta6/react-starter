'use strict';

const _ = require('lodash');
const request = require('superagent');
const debug = require('./Debug')('utils:request');

const isClient = typeof window !== 'undefined';
const root = isClient ? window : process;

const assign = (values, assigner) => {
  _.each(values, (value, key) => _.each(_.isArray(value) ? value : [value], val => assigner(key, val)));
};

module.exports = (method, pathname, options, callback) => {
  method = method.toLowerCase();
  method = method === 'delete' ? 'del' : method;
  options = options || {};
  return new Promise((resolve, reject) => {
    pathname = pathname.replace(/^\/+/, '');
    pathname = pathname.split('/').map(decodeURI).map(encodeURI).join('/');
    options = options.toJS ? options.toJS() : options;
    options = _.omit(options, isClient ? ['actionType', 'cookie'] : ['actionType']);
    options = _.defaults((options || {}), {timeout: Number(root.env.TIMEOUT)});
    let url = /^https?:\/\//.test(pathname) ? pathname : `${isClient ? '' : root.env.API_URL}/${pathname}`;
    let req = request[method](url);
    options.timeout && req.timeout(options.timeout);
    options.cookie && req.set('Cookie', options.cookie);
    options.query && req.query(options.query);
    options.field && assign(options.field, (key, val) => req.field(key, val));
    options.attach && assign(options.attach, (key, val) => req.attach(key, val, val.name));
    debug(`--> req: ${method.toUpperCase()} %s`, url);
    req.end((reason, res) => {
      let status = _.result(res, 'status') || _.result(reason, 'status');
      debug(`<-- res: ${method.toUpperCase()} %s %s`, url, status);
      reason ? reject(reason) : resolve(res);
      callback && callback(reason, res);
    });
  });
};
