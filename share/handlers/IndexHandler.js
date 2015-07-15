'use strict';

const React = require('react');
const debug = require('../utils/Debug')('handler:index');

let IndexHandler = React.createClass({
  displayName: 'IndexHandler',

  contextTypes: {
    getStore: React.PropTypes.func.isRequired,
    executeAction: React.PropTypes.func.isRequired
  },

  render() {
    debug('render');
    return (
      <div id='IndexHandler'>
        <h1>React</h1>
        <p>Welcome to React</p>
      </div>
    );
  }
});

module.exports = IndexHandler;
