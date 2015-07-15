'use strict';

const _ = require('lodash');
const React = require('react');
const serialize = require('serialize-javascript');
const {navigateAction} = require('fluxible-router');
const {createElementWithContext} = require('fluxible-addons-react');
const ErrorAction = require('../share/actions/ErrorAction');
const Payload = require('../share/utils/Payload');
const HtmlComponent = require('./utils/HtmlComponent');

const app = require('../share');
const srv = module.exports = require('koa')();

// to resolve externals
if (['production'].indexOf(process.env.NODE_ENV) === -1) {
  srv.use(function*(next) {
    if (/^\/node_modules/.test(this.path)) {
      yield require('koa-static')(`${__dirname}/../`);
    } else {
      yield next;
    }
  });
}

// mount modules
srv.use(require('koa-static')(`${__dirname}/../public`, {maxage: 1000 * 60 * 60 * 24}));
['test'].indexOf(process.env.NODE_ENV) === -1 && srv.use(require('koa-logger')());

// create context, routing handle, error handle, render content
srv.use(function*() {
  this.context = app.createContext();
  try {
    yield this.context.executeAction(navigateAction, {
      url: this.path,
      config: {cookie: this.headers.cookie}
    });
  } catch (reason) {
    this.status = reason.status || reason.statusCode || 500;
    this.status >= 500 && process.stderr.write(reason.stack);
    yield this.context.executeAction(ErrorAction, new Payload({
      type: ErrorAction.ActionTypes.GenericError,
      entity: {error: {statusCode: this.status, message: reason.message}}
    }));
  } finally {
    let status = this.context.getStore('ErrorStore').getCurrentError().get('statusCode');
    status && (this.status = status);
    this.body = '<!DOCTYPE html>' + React.renderToStaticMarkup(React.createElement(HtmlComponent, {
      state: _.map({
        env: serialize(_.pick(process.env, ['NODE_ENV', 'TIMEOUT', 'FIREBASE_URL', 'IMAGE_URL_PATTERN'])),
        App: serialize(app.dehydrate(this.context))
      }, ((script, name) => `window.${name}=${script};`)).join(''),
      markup: React.renderToString(createElementWithContext(this.context)),
      context: this.context.getComponentContext()
    }));
  }
});
