'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var nano = require('gulp-cssnano');
var config = require('../config.js').sass;
var gulpif = require('gulp-if');

gulp.task('styles', function() {
    gulp.src(config.src)
    .pipe(gulpif(config.debug, sourcemaps.init(config.sourcemaps.settings)))
        .pipe(sass(config.settings))
        .pipe(concat('main.css'))
        .pipe(autoprefixer(config.autoprefixer.settings))
        .pipe(nano())
    .pipe(gulpif(config.debug, sourcemaps.write(config.sourcemaps.dest)))
    .pipe(gulp.dest(config.dest))
    .pipe(connect.reload());
});
