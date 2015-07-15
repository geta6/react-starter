'use strict';

const {RouteStore} = require('fluxible-router');
const ApplicationAction = require('../actions/ApplicationAction');
const Payload = require('../utils/Payload');
const debug = require('../utils/Debug')('store:route');

// Routing
const config = {
  index: {
    path: '/',
    method: 'get',
    handler: require('../handlers/IndexHandler'),
    action(context, payload, done) {
      debug('=====> index');
      Promise.all([
        context.executeAction(ApplicationAction, new Payload({
          type: ApplicationAction.ActionTypes.ResetCurrentMeta,
          entity: {meta: {}}
        }))
      ]).then(() => done(), done);
    }
  }
};

module.exports = RouteStore.withStaticRoutes(config);
