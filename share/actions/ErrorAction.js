'use strict';

const keyMirror = require('react/lib/keyMirror');
const debug = require('../utils/Debug')('action:error');

let ErrorAction;
ErrorAction = (actionContext, payload) => {
  debug('<== execute: %s', payload.get('type'));

  switch (payload.get('type')) {

    case ErrorAction.ActionTypes.ClearError:
      return new Promise(resolve => {
        debug('==> dispatch: %s', ErrorAction.DispatchTypes.CLEAR_ERROR);
        actionContext.dispatch(ErrorAction.DispatchTypes.CLEAR_ERROR);
        resolve();
      });

    case ErrorAction.ActionTypes.GenericError:
      return new Promise(resolve => {
        let message = payload.getIn(['entity', 'error', 'message']);
        debug('==> dispatch: %s, "%s"', ErrorAction.DispatchTypes.GENERIC_ERROR, message);
        let error = payload.getIn(['entity', 'error']).toJS();
        actionContext.dispatch(ErrorAction.DispatchTypes.GENERIC_ERROR, {error});
        resolve();
      });

    default:
      return Promise.reject(new Error(`ActionType ${payload.get('type')} was not defined.`));

  }
};

ErrorAction.ActionTypes = keyMirror({
  ClearError: null,
  GenericError: null
});

ErrorAction.DispatchTypes = keyMirror({
  CLEAR_ERROR: null,
  GENERIC_ERROR: null
});

module.exports = ErrorAction;
