var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var config = require('../config').images;
var connect = require('gulp-connect');

gulp.task('images', () => {
    return gulp.src(config.src)
        .pipe(imagemin(config.settings))
        .pipe(gulp.dest(config.dest))
        .pipe(connect.reload());
});