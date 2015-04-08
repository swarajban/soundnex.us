"use strict";

var gulp = require('gulp');
var concat = require('gulp-concat');
var babel = require('gulp-babel');
var inject = require('gulp-inject');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var minifyCSS = require('gulp-minify-css');
var connect = require('gulp-connect');
var sass = require('gulp-sass');


// Build Paths
var src = 'src/';
var jsxSource = src + 'jsx/';
var sassSource = src + 'sass/';
var jsxComponents = jsxSource + 'components/';
var bower = 'bower_components/';
var dist = 'dist/';

var paths = {
  src: {
    js: [
      jsxComponents + 'helloMessage.jsx',
      jsxSource + 'app.jsx'
    ],
    sass: sassSource + 'app.scss',
    html: src + 'index.html'
  },
  vendor: {
    js: [
      bower + 'react/react.js',
      bower + 'react-router/build/global/ReactRouter.js',
      bower + 'classnames/index.js'
    ],
    jsmin: [
      bower + 'react/react.min.js',
      bower + 'react-router/build/global/ReactRouter.min.js',
      bower + 'classnames/index.js'
    ]
  },
  dist: {
    js: dist + 'js/',
    css: dist + 'css/',
    html: dist
  }
};

// HTML tasks
gulp.task('html.dev', ['js', 'css'], function () {
  return injectHTML([
    'css/app.css',
    'js/vendor.js',
    'js/app.js'
  ], 'index.dev.html');
});

gulp.task('html.min', ['js', 'css'], function () {
  return injectHTML([
    'css/app.min.css',
    'js/vendor.min.js',
    'js/app.min.js'
  ], 'index.html');
});


gulp.task('html', ['html.dev', 'html.min']);

gulp.task('watch.html', ['html'], function () {
  gulp.watch(paths.src.html, ['html']);
});

function injectHTML (sourcePaths, outputName) {
  var injectSources = gulp.src(sourcePaths, {
    read: false,
    cwd: dist
  });

  return gulp.src(paths.src.html)
    .pipe(inject(injectSources, {
      addRootSlash: false
    }))
    .pipe(rename(outputName))
    .pipe(gulp.dest(paths.dist.html));
}


// JS Tasks

gulp.task('vendor.js', function () {
  return gulp.src(paths.vendor.js)
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest(paths.dist.js));
});

gulp.task('vendor.jsmin', function () {
  return gulp.src(paths.vendor.jsmin)
    .pipe(concat('vendor.min.js'))
    //.pipe(uglify({mangle: true}))  Temporarily disabling bc it takes hella long
    .pipe(gulp.dest('dist/js'))
});


gulp.task('src.js', function () {
  return gulp.src(paths.src.js)
    .pipe(concat('app.js'))
    .pipe(babel())
    .pipe(gulp.dest(paths.dist.js))
    .pipe(uglify({
      mangle: true
    }))
    .pipe(rename('app.min.js'))
    .pipe(gulp.dest(paths.dist.js))
    .pipe(connect.reload());
});

gulp.task('js', ['src.js', 'vendor.js', 'vendor.jsmin']);

gulp.task('watch.js', ['js'], function () {
  gulp.watch(paths.src.js, ['src.js']);
  gulp.watch(paths.vendor.js, ['vendor.js']);
  gulp.watch(paths.vendor.jsmin, ['vendor.jsmin']);
});

// CSS Tasks
gulp.task('src.sass', function () {
  return gulp.src(paths.src.sass)
    .pipe(sass())
    .pipe(gulp.dest(paths.dist.css))
    .pipe(rename('app.min.css'))
    .pipe(minifyCSS())
    .pipe(gulp.dest(paths.dist.css))
    .pipe(connect.reload());
});

gulp.task('css', ['src.sass']);

gulp.task('watch.css', ['css'], function () {
  gulp.watch(sassSource + '**', ['src.sass']);
});


// General Tasks
gulp.task('watch', ['watch.js', 'watch.css', 'watch.html']);

// Start local server on localhost:8000
gulp.task('serve', ['watch'], function () {
  connect.server({
    root: 'dist',
    port: 8000,
    livereload: true
  });
});

gulp.task('build', ['js', 'css', 'html']);

gulp.task('default', ['build']);
