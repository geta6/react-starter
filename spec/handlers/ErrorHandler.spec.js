'use strict';

const {expect} = require('chai');
const {createMockComponentContext} = require('fluxible/utils');
const jsdom = require('jsdom');
const mockery = require('mockery');

describe('ErrorHandler', () => {
  let componentContext;
  let React;
  let ReactTestUtils;
  let provideContext;

  let ErrorStore = require('../../share/stores/ErrorStore');
  let RouteStore = require('../../share/stores/RouteStore');
  let ApplicationStore = require('../../share/stores/ApplicationStore');
  let Payload = require('../../share/utils/Payload');

  class MockErrorStore extends ErrorStore {}
  class MockRouteStore extends RouteStore {}
  class MockApplicationStore extends ApplicationStore {}

  beforeEach(done => {
    mockery.enable({useCleanCache: true, warnOnUnregistered: false});
    componentContext = createMockComponentContext({stores: [MockErrorStore, MockRouteStore, MockApplicationStore]});
    jsdom.env('<html><body></body></html>', [], (reason, window) => {
      global.window = window;
      global.document = window.document;
      global.navigator = window.navigator;
      React = require('react');
      ReactTestUtils = require('react/lib/ReactTestUtils');
      provideContext = require('fluxible-addons-react/provideContext');
      done();
    });
  });

  afterEach(() => {
    delete global.window;
    delete global.document;
    delete global.navigator;
    mockery.disable();
  });

  describe('#render', () => {
    it('should display valid message for status 404, 500 and 503', done => {
      let ErrorHandler = provideContext(require('../../share/handlers/ErrorHandler'));
      let ErrorAction = require('../../share/actions/ErrorAction');
      let component = ReactTestUtils.renderIntoDocument(<ErrorHandler context={componentContext} />);
      let node = component.getDOMNode();
      expect(node.querySelector('#ErrorHandler code').innerHTML).to.equal('');

      componentContext.executeAction(ErrorAction, new Payload({
        type: ErrorAction.ActionTypes.GenericError,
        entity: {error: {statusCode: 404, message: 'foo'}}
      }));
      expect(node.querySelector('#ErrorHandler h1').innerHTML).to.equal('404');
      expect(node.querySelector('#ErrorHandler code').innerHTML).to.equal('foo');

      componentContext.executeAction(ErrorAction, new Payload({
        type: ErrorAction.ActionTypes.GenericError,
        entity: {error: {statusCode: 500, message: 'bar'}}
      }));
      expect(node.querySelector('#ErrorHandler h1').innerHTML).to.equal('500');
      expect(node.querySelector('#ErrorHandler code').innerHTML).to.equal('bar');

      componentContext.executeAction(ErrorAction, new Payload({
        type: ErrorAction.ActionTypes.GenericError,
        entity: {error: {statusCode: 503, message: 'baz'}}
      }));
      expect(node.querySelector('#ErrorHandler h1').innerHTML).to.equal('503');
      expect(node.querySelector('#ErrorHandler code').innerHTML).to.equal('baz');
      done();
    });
  });
});
