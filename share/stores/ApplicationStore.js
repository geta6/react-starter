'use strict';

const _ = require('lodash');
const Immutable = require('immutable');
const {createStore} = require('fluxible/addons');
const debug = require('../utils/Debug')('store:application');

module.exports = createStore({
  storeName: 'ApplicationStore',

  handlers: {
    RESET_CURRENT_META: 'resetCurrentMeta'
  },

  defaults: {
    currentMeta: {
      title: 'React'
    }
  },

  initialize() {
    this.currentMeta = Immutable.Map();
  },

  resetCurrentMeta(dispatched) {
    let {meta} = dispatched;
    debug('setCurrentMeta: %s', _.keys(meta).join(', '));
    let currentMeta = Immutable.fromJS(_.defaults(meta, this.defaults.currentMeta));
    if (!Immutable.is(this.currentMeta, currentMeta)) {
      this.currentMeta = currentMeta;
      this.emitChange();
    }
  },

  getCurrentMeta() {
    return this.currentMeta;
  },

  dehydrate() {
    return {
      meta: this.currentMeta.toJS()
    };
  },

  rehydrate(dehydrated) {
    this.resetCurrentMeta(dehydrated);
  }
});
