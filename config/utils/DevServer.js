'use strict';

const _ = require('lodash');
const cp = require('child_process');
const util = require('gulp-util');

class DevServer {

  constructor(options) {
    process.env.PORT = process.env.PORT || 3000;
    options = options || {};
    this.script = options.script;
    this.browser = !!options.browser;
    this.browserSync = _.defaults((options.browserSync || {}), {
      port: process.env.PORT,
      notify: false,
      ghostMode: false,
      logPrefix: 'App',
      logConnections: true
    });
    this.server = false;
    this.client = false;
    this.info = {};
  }

  restart() {
    return Promise.resolve()
      .then(() => this.stop())
      .then(() => this.start())
      .then(() => this.proxy())
      .catch(reason => process.stderr.write(reason.stack));
  }

  start() {
    return new Promise((resolve, reject) => {
      this.server = cp.fork(this.script, {env: _.extend({}, process.env, {PORT: this.info.port || ''})});
      this.server.on('close', () => {
        this.server = null;
        reject(util.PluginError(this.script, 'Fail to startup server.'));
      });
      this.server.on('message', res => {
        if (res.message && res.message === 'online') {
          this.server.removeAllListeners();
          this.info = res;
          util.log(`${this.script} listening on '${util.colors.green(`${this.info.address}:${this.info.port}`)}'`);
          resolve();
        }
      });
    });
  }

  stop() {
    return new Promise(resolve => {
      if (this.server) {
        this.server.removeAllListeners();
        this.server.once('close', () => resolve());
        this.server.kill();
      } else {
        resolve();
      }
    });
  }

  proxy() {
    return new Promise(resolve => {
      if (this.browser) {
        if (this.client) {
          this.client.reload();
          resolve();
        } else {
          this.client = require('browser-sync');
          this.client(_.extend(this.browserSync, {
            proxy: `${this.info.address}:${this.info.port}`,
            middleware: [(req, res, next) => {
              if (/^\/(api|media|session|fog-|assets|proxy\/image)/.test(req.url)) {
                let opts = require('url').parse(`${process.env.API_URL}${req.url}`, true);
                let query = (opts.search !== null) ? opts.search : '';
                opts.path = query ? opts.pathname + query : opts.pathname;
                opts.path = opts.path.replace(/^\/proxy\/image\/(.+)$/, '/$1');
                opts.method = req.method;
                opts.headers = req.headers;
                opts.headers.via = opts.headers.via || `1.1 ${require('os').hostname()}`;
                delete opts.headers.host;
                res.setTimeout(parseInt(process.env.TIMEOUT, 10));
                let pipe = require('http').request(opts, response => {
                  response.headers.via = opts.headers.via;
                  if (/^\/session/.test(req.url) && response.headers.location) {
                    let host = `http://localhost:${process.env.PORT}`;
                    let location = response.headers.location.replace(process.env.API_URL, host);
                    response.headers.refresh = response.headers.location = location;
                  }
                  res.writeHead(response.statusCode, response.headers);
                  response.on('error', next);
                  response.pipe(res);
                });
                pipe.on('error', next);
                setTimeout(() => {
                  !req.readable ? pipe.end() : req.pipe(pipe);
                }, 1200);
              } else {
                return next();
              }
            }]
          }), () => resolve());
        }
      } else {
        resolve();
      }
    });
  }
}

module.exports = DevServer;
