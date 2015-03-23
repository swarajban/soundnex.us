"use strict";

var gulp = require('gulp');
var concat = require('gulp-concat');
var babel = require('gulp-babel');
var livereload = require('gulp-livereload');
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
    sass: [
      sassSource + 'main.scss'
    ],
    html: [
      src + 'index.html'
    ]
  },
  vendor: {
    js: [
      bower + 'react/react.js',
      bower + 'react-router/build/global/ReactRouter.js',
      bower + 'classnames/index.js'
    ],
    jsmin: [
      bower + 'react/react.min.js',
      bower + 'react-router/build/global/ReactRouter.min.js'
    ]
  },
  dist: {
    js: dist + 'js/',
    css: dist + 'css/',
    html: dist
  }
};

gulp.task('html', function () {
  return gulp.src(paths.src.html)
    .pipe(gulp.dest(paths.dist.html));
});


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
    .pipe(livereload());
});

gulp.task('js', ['src.js', 'vendor.js', 'vendor.jsmin']);

gulp.task('watch.js', ['js'], function () {
  gulp.watch(paths.src.js, ['src.js']);
  gulp.watch(paths.vendor.js, ['vendor.js']);
  gulp.watch(paths.vendor.jsmin, ['vendor.jsmin']);
});

gulp.task('src.sass', function () {
  return gulp.src(paths.src.sass)
    .pipe(sass())
    .pipe(gulp.dest(paths.dist.css))
    .pipe(livereload());
});


gulp.task('watch', ['watch.js'], function () {
  return livereload.listen();
});


gulp.task('build', ['js', 'html']);

gulp.task('default', ['build']);

