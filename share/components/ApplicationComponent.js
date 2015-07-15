'use strict';

const React = require('react');
const Immutable = require('immutable');
const ImmutablePropTyps = require('react-immutable-proptypes');
const {handleHistory} = require('fluxible-router');
const {provideContext, connectToStores} = require('fluxible-addons-react');
const ErrorHandler = require('../handlers/ErrorHandler');
const debug = require('../utils/Debug')('component:application');

let ApplicationComponent = React.createClass({
  displayName: 'ApplicationComponent',

  propTypes: {
    context: React.PropTypes.object,
    currentMeta: ImmutablePropTyps.map.isRequired,
    currentError: ImmutablePropTyps.map.isRequired,
    currentRoute: ImmutablePropTyps.map
  },

  getDefaultProps() {
    return {
      currentRoute: Immutable.Map()
    };
  },

  componentDidUpdate() {
    document.title = this.props.currentMeta.get('title') ? this.props.currentMeta.get('title') : 'Not Found';
  },

  getRouteHandler() {
    let RouteHandler;
    if (this.props.currentRoute && this.props.currentError.isEmpty()) {
      RouteHandler = this.props.currentRoute.get('handler');
    } else {
      RouteHandler = ErrorHandler;
    }
    return <RouteHandler context={this.props.context} />;
  },

  render() {
    debug('render');
    return (
      <div id='ApplicationComponent'>
        {this.getRouteHandler()}
      </div>
    );
  }
});

ApplicationComponent = connectToStores(ApplicationComponent, ['ApplicationStore', 'ErrorStore'], context => {
  return {
    currentMeta: context.getStore('ApplicationStore').getCurrentMeta(),
    currentError: context.getStore('ErrorStore').getCurrentError()
  };
});
ApplicationComponent = handleHistory(ApplicationComponent);
ApplicationComponent = provideContext(ApplicationComponent);

module.exports = ApplicationComponent;
