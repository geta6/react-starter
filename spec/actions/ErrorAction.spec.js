'use strict';

const {expect} = require('chai');
const {createMockActionContext} = require('fluxible/utils');

describe('actions', () => {
  describe('ErrorAction', () => {
    const ErrorAction = require('../../share/actions/ErrorAction');
    const ErrorStore = require('../../share/stores/ErrorStore');
    const Payload = require('../../share/utils/Payload');

    // Mock store for unit testing
    class MockErrorStore extends ErrorStore {}

    let actionContext;

    beforeEach(() => {
      actionContext = createMockActionContext({stores: [MockErrorStore]});
    });

    it('should dispatch GENERIC_ERROR when execute GenericError', () => {
      let payload = new Payload({
        type: ErrorAction.ActionTypes.GenericError,
        entity: {error: {message: 'generic error spec'}}
      });
      return ErrorAction(actionContext, payload).then(() => {
        expect(actionContext.dispatchCalls.length).equal(1);
        expect(actionContext.dispatchCalls[0].name).equal('GENERIC_ERROR');
        expect(payload.getIn(['entity']).toJS()).to.deep.equal(actionContext.dispatchCalls[0].payload);
      });
    });

    it('should reject unknown action type', done => {
      let payload = new Payload({
        type: 'UnknownActionType'
      });
      ErrorAction(actionContext, payload).then(() => done(new Error('Unknown action resolved.'))).catch(reason => {
        expect(/UnknownActionType/.test(reason.message)).to.be.true;
        done();
      });
    });
  });
});
