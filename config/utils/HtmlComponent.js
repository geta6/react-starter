'use strict';

const _ = require('lodash');
const React = require('react');

const HtmlComponent = React.createClass({
  displayName: 'HtmlComponent',

  propTypes: {
    state: React.PropTypes.string.isRequired,
    markup: React.PropTypes.string.isRequired,
    context: React.PropTypes.shape({getStore: React.PropTypes.func}).isRequired
  },

  externals: process.env.NODE_ENV === 'production' ? {} : {
    react: '/node_modules/react/dist/react-with-addons.js',
    _: '/node_modules/lodash/index.js'
  },

  render() {
    let currentMeta = this.props.context.getStore('ApplicationStore').getCurrentMeta();
    return (
      <html>
        <head>
          <meta charSet='utf-8' />
          <title>{currentMeta.get('title')}</title>
          <link rel='stylesheet' href='/bundle.css' />
        </head>
        <body>
          <div id='app' dangerouslySetInnerHTML={{__html: this.props.markup}}/>
          {_.map(this.externals, (src, key) => <script key={key} src={src} />)}
          <script dangerouslySetInnerHTML={{__html: this.props.state}} />
          <script src='/bundle.js' defer />
        </body>
      </html>
    );
  }
});

module.exports = HtmlComponent;
