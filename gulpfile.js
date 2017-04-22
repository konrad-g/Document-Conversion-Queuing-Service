var gulp = require('gulp');
var fs = require("fs");
var clean = require('gulp-clean');
var runSequence = require('gulp-run-sequence');
var cleanCSS = require('gulp-clean-css');
var concatJs = require('gulp-concat');
var concatCss = require('gulp-concat-css');
var rename = require("gulp-rename");
var replace = require('gulp-replace');

var OUTPIT_FOLDER_PATH = './src/client/final';

var IMPORT_SCRIPTS = [
    "bower_components/angular/angular.min.js",
    "bower_components/angular-aria/angular-aria.min.js",
    "bower_components/angular-animate/angular-animate.min.js",
    "bower_components/angular-material/angular-material.min.js",
    "bower_components/angular-resource/angular-resource.min.js",
    "bower_components/angular-route/angular-route.min.js",
    "bower_components/angular-material-data-table/dist/md-data-table.min.js",
    "bower_components/socket.io-client/dist/socket.io.min.js",
    "bower_components/jquery/dist/jquery.min.js",
    "bower_components/bootstrap/dist/js/bootstrap.min.js",
    "bower_components/toastr/toastr.min.js",
    "src/client/Client.js",
    "src/client/DownloadButton.js"
];

var IMPORT_STYLES = [
    "bower_components/bootstrap/dist/css/bootstrap.min.css",
    "bower_components/toastr/toastr.min.css",
    "bower_components/angular-material/angular-material.min.css",
    "bower_components/angular-material-data-table/dist/md-data-table.min.css",
    "src/client/stylesheets/main.css"
];

gulp.task('clean', function () {
    return gulp.src(OUTPIT_FOLDER_PATH, {read: false})
        .pipe(clean({force: true}));
});

gulp.task('minimize-js', function () {
    gulp.src(IMPORT_SCRIPTS)
        .pipe(concatJs({path: 'scripts.min.js'}))
        .pipe(gulp.dest(OUTPIT_FOLDER_PATH));
});

gulp.task('minimize-css', function () {
    gulp.src(IMPORT_STYLES)
        .pipe(concatCss('styles.min.css', {rebaseUrls: true}))
        .pipe(cleanCSS({relativeTo: './public/out/', target: './public/out/', rebase: true}))
        .pipe(gulp.dest(OUTPIT_FOLDER_PATH));
});

gulp.task('make', ['clean'], function () {
    runSequence(
        'minimize-js', 'minimize-css');
});
