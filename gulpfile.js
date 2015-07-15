'use strict';

require('./lib/env');

const gulp = require('gulp');
const $ = require('gulp-load-plugins')({scope: ['dependencies', 'devDependencies', 'optionalDependencies']});

const del = require('del');
const run = require('run-sequence');
const webpack = require('webpack');
const DevServer = require('./config/utils/DevServer');

const src = {
  server: ['bin/server.js', 'config/server.js', 'lib/env.js', 'config/utils/HtmlComponent.js'],
  images: ['asset/images/**/*.{jpg,jpeg,gif,png,svg}'],
  styles: ['asset/styles/**/*.{css,styl}'],
  assets: ['asset/assets/**/*.*'],
  statics: ['share/statics/**/*.md'],
  lints: ['*.js', '{bin,config,lib,share,spec}/**/*.js'],
  tests: ['spec/**/*.spec.js']
};

const server = new DevServer({script: './bin/server.js', browser: true});

let serverStarted = false;
let watch = false;

// tasks

gulp.task('build', function(callback) {
  return run('build:clean', 'build:images', ['build:styles', 'build:assets'], 'build:script', callback);
});

gulp.task('watch', function() {
  watch = true;
  return run('build', 'server:restart', function() {
    gulp.watch(src.server, function() { return run('lint', 'server:restart'); });
    gulp.watch(src.styles, function() { return run('build:styles', 'server:restart'); });
    gulp.watch(src.images, function() { return run('build:images', 'server:restart'); });
    gulp.watch(src.assets, function() { return run('build:assets', 'server:restart'); });
  });
});

gulp.task('lint', function(callback) {
  return run('lint:jscs', 'lint:eslint', callback);
});

gulp.task('test', function(callback) {
  return run('lint', require('gulp-jsx-coverage').createTask({
    src: src.tests,
    istanbul: {coverageVariable: '__MY_TEST_COVERAGE__', exclude: /node_modules|spec/},
    transpile: {babel: {include: /\.js$/, exclude: /node_modules/}},
    coverage: {reporters: ['text', 'json', 'lcov'], directory: process.env.CIRCLE_ARTIFACTS || 'tmp/coverage'},
    mocha: {reporter: 'spec'},
    babel: {stage: 0, sourceMaps: 'inline', auxiliaryCommentBefore: 'istanbul ignore next'},
    cleanup: function() {
      callback();
      process.exit(0);
    }
  }));
});

// operations

gulp.task('server:restart', function(callback) {
  server.restart().then(function() {
    serverStarted = true;
    callback();
  }, callback);
});

// builds

gulp.task('build:clean', function(callback) {
  return del(['public/*'], callback);
});

gulp.task('build:script', function(callback) {
  let started = false;
  let config = require('./webpack.config');
  config.output.path = './public';
  let bundle = function(reason, stats) {
    if (reason) {
      throw new $.util.PluginError('webpack', reason);
    } else {
      $.util.log(stats.toString(config.stats));
    }
    if (!started) {
      started = true;
      callback();
    }
    watch && serverStarted && run('lint', 'server:restart');
  };
  watch ? webpack(config).watch(120, bundle) : webpack(config).run(bundle);
});

gulp.task('build:styles', function() {
  return gulp.src('asset/styles/bundle.styl')
    .pipe($.plumber())
    .pipe($.stylus({use: [require('nib')()], compress: true}))
    .pipe(gulp.dest('public'));
});

gulp.task('build:images', function() {
  return gulp.src(src.images)
    .pipe($.changed('images'))
    .pipe($.imagemin({optimizationLevel: 3, progressive: true, interlaced: true}))
    .pipe(gulp.dest('public/images'));
});

gulp.task('build:assets', function() {
  return gulp.src(src.assets)
    .pipe($.changed('assets'))
    .pipe(gulp.dest('public'));
});

// lints

gulp.task('lint:eslint', function() {
  return gulp.src(src.lints)
    .pipe($.eslint())
    .pipe($.eslint.format('stylish'))
    .pipe($.eslint.failOnError());
});

gulp.task('lint:jscs', function() {
  return gulp.src(src.lints)
    .pipe($.jscs());
});
