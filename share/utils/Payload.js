'use strict';

const _ = require('lodash');
const Immutable = require('immutable');

class Payload extends Immutable.Map {
  constructor(payload) {
    if (_.size(_.omit(payload, ['type', 'entity', 'config'])) > 0) {
      throw new Error('Payload should declared by keys of `type`, `entity` or `config`.');
    }
    payload = _.pick(_.defaults({}, payload, {type: '', entity: {}, config: {}}), ['type', 'entity', 'config']);
    return super(Immutable.fromJS(payload));
  }
}

module.exports = Payload;
