"use strict";

var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');



var paths = {
  'js.vendor': [
    'bower_components/react/react.js',
    'bower_components/react-router/build/global/ReactRouter.js'
  ],
  'js.vendor.min': [
    'bower_components/react/react.min.js',
    'bower_components/react-router/build/global/ReactRouter.min.js'
  ],
  'jsx.app': [
    'src/jsx/**'
  ]
};

gulp.task('js.vendor', function () {
  return gulp.src(paths['js.vendor'])
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('dist/js'));
});

gulp.task('js.vendor.min', function () {
  return gulp.src(paths['js.vendor.min'])
    .pipe(concat('vendor.min.js'))
    //.pipe(uglify({mangle: true}))  Temporarily disabling bc it takes hella long
    .pipe(gulp.dest('dist/js'))
});


gulp.task('js)
