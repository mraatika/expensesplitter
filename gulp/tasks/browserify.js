'use strict';

var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var watchify = require('watchify');
var connect = require('gulp-connect');
var gulpif = require('gulp-if');
var config = require('../config').browserify;

// set up the browserify instance on a task basis
var b = watchify(browserify(config, watchify.args));

config.settings.transform.forEach(function(transformation) {
    b.transform(transformation);
});

function bundle() {
    return b.bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source(config.outputName))
    .pipe(buffer())
    .pipe(gulpif(config.debug, sourcemaps.init(config.sourcemaps.settings)))
        // Add transformation tasks to the pipeline here.
        .pipe(gulpif(!config.debug, uglify()))
        .on('error', gutil.log)
    .pipe(gulpif(config.debug, sourcemaps.write(config.sourcemaps.dest)))
    .pipe(gulp.dest(config.dest))
    .pipe(connect.reload());
}

gulp.task('browserify', ['lint'], bundle);
b.on('update', bundle);
b.on('log', gutil.log);
