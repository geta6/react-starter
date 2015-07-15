'use strict';

const _ = require('lodash');
const Immutable = require('immutable');
const {createStore} = require('fluxible/addons');
const debug = require('../utils/Debug')('store:error');

module.exports = createStore({
  storeName: 'ErrorStore',

  handlers: {
    CLEAR_ERROR: 'clearCurrentError',
    GENERIC_ERROR: 'setCurrentError',
    NAVIGATE_SUCCESS: 'onNavigateSuccess',
    NAVIGATE_FAILURE: 'onNavigateFailure'
  },

  defaults: {
    currentError: {
      statusCode: 200,
      message: ''
    }
  },

  initialize() {
    this.currentError = Immutable.Map();
  },

  onNavigateSuccess() {
    this.clearCurrentError();
  },

  onNavigateFailure(error) {
    this.setCurrentError(error);
  },

  clearCurrentError() {
    debug('clearCurrentError');
    let currentError = Immutable.Map();
    if (!Immutable.is(this.currentError, currentError)) {
      this.currentError = currentError;
      this.emitChange();
    }
  },

  setCurrentError(dispatched) {
    let {error} = dispatched;
    error = _.defaults(_.pick(error, _.keys(this.defaults.currentError)), this.defaults.currentError);
    debug('setCurrentError: %s, "%s"', error.statusCode, error.message);
    let currentError = Immutable.fromJS(error);
    if (!Immutable.is(this.currentError, currentError)) {
      this.currentError = currentError;
      this.emitChange();
    }
  },

  getCurrentError() {
    return this.currentError;
  },

  dehydrate() {
    return {
      error: this.currentError.toJS()
    };
  },

  rehydrate(dehydrated) {
    this.setCurrentError(dehydrated);
  }
});
