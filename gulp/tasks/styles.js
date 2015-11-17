'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var connect = require('gulp-connect');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var minify = require('gulp-minify-css');
var config = require('../config.js').sass;

gulp.task('styles', function() {
  gulp.src(config.src)
    .pipe(sourcemaps.init(config.sourcemaps.settings))
        .pipe(sass(config.settings))
        .pipe(autoprefixer(config.autoprefixer.settings))
        .pipe(minify())
    .pipe(sourcemaps.write(config.sourcemaps.dest))
    .pipe(gulp.dest(config.dest))
    .pipe(connect.reload());
});
