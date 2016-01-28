var gulp = require('gulp');
var webpack = require('webpack-stream');
// var nodemon = require('gulp-nodemon');

var sass = require('gulp-sass');
var pleeease = require('gulp-pleeease');

gulp.task('sass', function () {
    gulp.src('src/scss/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(pleeease())
        .pipe(gulp.dest('dist'));
});

gulp.task('sass:watch', function () {
    gulp.watch('src/scss/**/*.scss', ['sass']);
});

gulp.task('webpack', function() {
    return gulp.src('src/js/main.js')
                .pipe(webpack(require('./webpack.config.js')))
                .pipe(gulp.dest('dist/'));
});

// gulp.task('nodemon', function () {
//     nodemon({
//         script: 'index.js',
//         ext: 'js html',
//         env: { 'NODE_ENV': 'development' },
//         ignore: ['static/**/*']
//     });
// });

var webserver = require('gulp-webserver');

gulp.task('webserver', function() {
    gulp.src('./dist')
        .pipe(webserver({
            livereload: true,
            port: 3000
        }));
});

gulp.task('default', ['webpack', 'sass', 'sass:watch', 'webserver']);
