'use strict';

const React = require('react');
const ImmutablePropTyps = require('react-immutable-proptypes');
const {NavLink} = require('fluxible-router');
const {connectToStores} = require('fluxible-addons-react');
const debug = require('../utils/Debug')('handler:error');

let ErrorHandler = React.createClass({
  displayName: 'ErrorHandler',

  propTypes: {
    currentError: ImmutablePropTyps.map.isRequired
  },

  contextTypes: {
    getStore: React.PropTypes.func.isRequired,
    executeAction: React.PropTypes.func.isRequired
  },

  render() {
    debug('render');
    return (
      <div id='ErrorHandler'>
        <h1>{this.props.currentError.get('statusCode')}</h1>
        <pre>
          <code>{this.props.currentError.get('message')}</code>
        </pre>
        <NavLink routeName='index'>トップページ</NavLink>
      </div>
    );
  }
});

ErrorHandler = connectToStores(ErrorHandler, ['ErrorStore'], context => {
  return {
    currentError: context.getStore('ErrorStore').getCurrentError()
  };
});

module.exports = ErrorHandler;
