'use strict';

/*
 * TODO :
 * - build custom Zepto with a gulp task and remove this 3rd-party lib from version control
 * - build custom OpenLayers with a gulp task and remove this 3rd-party lib from version control
 * - jshint :
 *      "jshint-stylish": "^1.0.0",    dans package.json
 * - integrate Ripple for easier testing:
 *      http://danhough.com/blog/gulp-browserify-phonegap-ripple/
 *      http://www.100percentjs.com/just-like-grunt-gulp-browserify-now/
 * - minifier, d�sactiver le d�bug seulement pour un build de prod :
 *      https://github.com/gulpjs/gulp/blob/master/docs/recipes/pass-arguments-from-cli.md
 * - configurer diff�rents param�tre pour test ou prod :
 *      config = { debug: true, flickrConsumerKey: '', flickrConsumerSecret: '', wikimediaApiUrl: '' }
 *  - g�rer Cordova via le package.json et le gulpfile.js pour avoir une meilleure isolation et ma�trise des versions
 *  - faire les build de prod ios/android/autre via des t�ches gulp ? pour se passer de PGBuild mais automatiser quand m�me.
 */

var gulp = require('gulp');

/*
 * Clean-up build files
 */

var del = require('del');
gulp.task('clean', function (cb) {
    del(['www'], cb);
});

/*
 * Concatenate and minify JS/HTML/CSS
 */

var replace = require('gulp-replace');
var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');
var minifyHtml = require('gulp-minify-html');
var minifyCss = require('gulp-minify-css');

gulp.task('usemin', function () {
    return gulp.src('src/*.html')
        .pipe(usemin({
            css: [minifyCss(), replace(/\.\.\//g, './resources/'), 'concat'], // fix relative img path on-the-fly
            html: [minifyHtml({empty: true})],
            js1: [uglify()],
            //js2: [uglify()] // FIXME: ne peut-on pas utiliser simplement 2 fois le m�me pipeline ? c'est nul...
        }))
        .pipe(gulp.dest('www/'));
});

gulp.task('cpanimation', function() {
    return gulp.src(['src/resources/animation/**/*']).pipe(gulp.dest('www/resources/animation'));
});

gulp.task('cpanimationjs', function() {
    return gulp.src(['src/animation_homepage_edge.js']).pipe(gulp.dest('www'));
});

gulp.task('cpimages', function() {
    return gulp.src(['src/resources/images/**/*']).pipe(gulp.dest('www/resources/images'));
});

gulp.task('cpfonts', function() {
    return gulp.src(['src/resources/fonts/**/*']).pipe(gulp.dest('www/resources/fonts'));
});

gulp.task('copy', ['cpanimation', 'cpimages', 'cpfonts', 'cpanimationjs']);

/*
 * Image optimizations
 */

var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');

gulp.task('imagemin1', function () {
    return gulp.src(['icon.png', 'icon/*/*.png', 'img/*.{gif,png,jpg,jpeg}'], {cwd:'src', base: 'src'})
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('www/'));
});

gulp.task('imagemin2', function () {
    return gulp.src(['src/libs-custom/OpenLayers-2.12/img/*.png', 'src/libs-custom/bootstrap_2.3.1/img/*.png'])
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('www/img/'));
});

gulp.task('imagemin', ['imagemin1', 'imagemin2']);

/*
 * Tasks definition
 */

var runSequence = require('run-sequence');

gulp.task('build', function() {
    runSequence('clean', ['usemin', 'copy']);//, 'imagemin'
});
gulp.task('default', ['build']);
