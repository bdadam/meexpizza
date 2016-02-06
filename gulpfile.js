var gulp = require('gulp');

require('./gulptasks/sass')(gulp); // sass, sass:watch
require('./gulptasks/webpack')(gulp); // webpack
require('./gulptasks/html')(gulp); // html, html:watch

gulp.task('webserver', function() {
    // const spawn = require('child_process').spawn;
    // spawn('php', ['-S', 'localhost:3000', '-t', 'dist']);
    var webserver = require('gulp-webserver');
    gulp.src('./dist')
        .pipe(webserver({
            livereload: true,
            port: 3000,
            host: '0.0.0.0'
        }));
});

gulp.task('watch', ['watchwithoutwebserver', 'webserver'], () => {
    var spawn = require('child_process').spawn;
    var proc;
    gulp.watch(['gulpfile.js', 'gulptasks/**/*.js'], () => {
        if (proc) { proc.kill(); }
        proc = spawn('gulp.cmd', ['build', 'watchwithoutwebserver'], { stdio: 'inherit' });
    });
});

// gulp.task('watch', ['sass:watch', 'html:watch', 'webserver']);

gulp.task('images', () => {
    var imageResize = require('gulp-image-resize');
    gulp.src('food-images/**/*')
        .pipe(imageResize({
            format: 'jpeg',
            quality: 0.8,
            width: 100,
            height: 160
        }))
        .pipe(gulp.dest('dist/food-images/100'));

    gulp.src('food-images/**/*')
        .pipe(imageResize({
            format: 'jpeg',
            quality: 0.8,
            width: 160,
            height: 160
        }))
        .pipe(gulp.dest('dist/food-images/160'));

});

const spritesmith = require('gulp.spritesmith');

gulp.task('sprite', function () {
    gulp.src('dist/food-images/100/*.jpeg')
        .pipe(spritesmith({
            imgName: 'food-sprite-100.jpeg',
            cssName: 'food-sprite-100.css',
            imgPath: 'food-images/sprites/food-sprite-100.jpeg',
            imgOpts: { quality: 80 }
        }))
        .pipe(gulp.dest('dist/food-images/sprites'));

    gulp.src('dist/food-images/160/*.jpeg')
        .pipe(spritesmith({
            imgName: 'food-sprite-160.jpeg',
            cssName: 'food-sprite-160.css',
            imgPath: 'food-images/sprites/food-sprite-160.jpeg',
            imgOpts: { quality: 80 }
        }))
        .pipe(gulp.dest('dist/food-images/sprites'));
});

gulp.task('build', ['webpack', 'sass', 'html']);
gulp.task('watchwithoutwebserver', ['sass:watch', 'html:watch'])
gulp.task('default', ['build', 'watch']);
