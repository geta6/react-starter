'use strict';

const React = require('react');
const {createElementWithContext} = require('fluxible-addons-react');
const app = require('../share');
const dehydratedState = window.App;

app.rehydrate(dehydratedState, (err, context) => {
  if (err) {
    throw err;
  } else {
    React.initializeTouchEvents(true);
    React.render(createElementWithContext(context), document.getElementById('app'));
  }
});
