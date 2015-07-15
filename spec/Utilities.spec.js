'use strict';

const {expect} = require('chai');
const Immutable = require('immutable');

describe('utilities', function() {
  describe('Payload', function() {
    const Payload = require('../share/utils/Payload');

    it('should keep value equality', function() {
      let validPayload = {type: 'test', entity: {user: {id: 0}}, config: {}};
      let payload = new Payload(validPayload);
      expect(payload).to.be.an.instanceof(Immutable.Map);
      expect(Immutable.is(payload, Immutable.fromJS(validPayload))).to.be.true;
    });

    it('should throw errors with invalid key', function() {
      let invalidPayload = {foo: 'bar'};
      expect(() => new Payload(invalidPayload)).to.throw(Error);
    });
  });
});
