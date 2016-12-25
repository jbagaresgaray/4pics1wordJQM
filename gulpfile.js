var gulp = require('gulp');
var browserSync = require('browser-sync');
var packageJson = require('./package.json');
var usemin = require('gulp-usemin');
var wrap = require('gulp-wrap');
var minifyCss = require('gulp-minify-css');
var minifyJs = require('gulp-uglify');
var concat = require('gulp-concat');
var minifyHTML = require('gulp-minify-html');
var clean = require('gulp-clean');
var rename = require('gulp-rename');
var less = require('gulp-less');

var runSeq = require('run-sequence');


var paths = {
    styles: './styles/**/*.*',
    images: './images/**/*.*',
    templates: './modules/**/*.html',
    index: 'index.html'
};


gulp.task('less', function() {
    return gulp.src('./styles/**/*.less')
        .pipe(less())
        .pipe(gulp.dest('./styles/css'));
});

gulp.task('clean', function() {
    return gulp.src('dist').pipe(clean({
        force: true
    }));
});

gulp.task('copyfonts', function(callback) {
    return gulp.src([
            './lib/bower_components/font-awesome/fonts/fontawesome-webfont.*',
            './lib/bower_components/ionicons/fonts/ionicons.*',
            './lib/bootstrap/fonts/*.*'
        ])
        .pipe(gulp.dest('dist/fonts'));
});

gulp.task('copyfootable', function() {
    return gulp.src('./lib/bower_components/footable/css/fonts/*.*')
        .pipe(gulp.dest('dist/css/fonts'));
});

gulp.task('copyimages', function() {
    return gulp.src(paths.images)
        .pipe(gulp.dest('dist/images'));
});

gulp.task('copytreeviewimages', function() {
    return gulp.src('./lib/bower_components/angular.treeview/img/*.*')
        .pipe(gulp.dest('dist/img'));
});

gulp.task('minify', function() {
    return gulp.src(paths.index)
        .pipe(usemin({
            js: [minifyJs(), 'concat'],
            js1: [minifyJs(), 'concat'],
            js2: [minifyJs(), 'concat'],
            js3: ['concat'],
            css: [minifyCss({
                keepSpecialComments: 0
            }), 'concat'],
            css1: [minifyCss({
                keepSpecialComments: 0
            }), 'concat'],
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('copytemplates', function() {
    return gulp.src(paths.templates)
        .pipe(gulp.dest('dist/modules'));
});

gulp.task('serve', function() {
    browserSync.init({
        notify: false,
        port: 9003,
        server: "./www",
        ui: {
            port: 24680
        }
    });

    gulp.watch(['www/index.html'])
        .on('change', browserSync.reload);
});


gulp.task('build', function() {
    return runSeq('clean', 'minify', 'copytemplates', 'copyfonts','copyfootable', 'copyimages', 'copytreeviewimages');
});

gulp.task('dist', function() {
    return runSeq('minify', 'copytemplates', 'copyfonts','copyfootable', 'copyimages', 'copytreeviewimages');
});
