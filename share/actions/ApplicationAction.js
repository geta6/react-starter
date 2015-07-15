'use strict';

const keyMirror = require('react/lib/keyMirror');
const debug = require('../utils/Debug')('action:application');

let ApplicationAction;
ApplicationAction = (actionContext, payload) => {
  debug('<== execute: %s', payload.get('type'));

  switch (payload.get('type')) {

    case ApplicationAction.ActionTypes.ResetCurrentMeta:
      return new Promise(resolve => {
        let meta = payload.getIn(['entity', 'meta']).toJS();
        debug('==> dispatch: %s', ApplicationAction.DispatchTypes.RESET_CURRENT_META);
        actionContext.dispatch(ApplicationAction.DispatchTypes.RESET_CURRENT_META, {meta});
        resolve();
      });

    default:
      return Promise.reject(new Error(`ActionType "${payload.get('type')}" was not defined.`));

  }
};

ApplicationAction.ActionTypes = keyMirror({
  ResetCurrentMeta: null
});

ApplicationAction.DispatchTypes = keyMirror({
  RESET_CURRENT_META: null
});

module.exports = ApplicationAction;
