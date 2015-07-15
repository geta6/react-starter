'use strict';

const Fluxible = require('fluxible');

module.exports = new Fluxible({
  component: require('./components/ApplicationComponent'),
  stores: [
    require('./stores/ErrorStore'),
    require('./stores/RouteStore'),
    require('./stores/ApplicationStore')
  ]
});
