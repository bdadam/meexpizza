const gulp = require('gulp');

const options = {
    production: true
};

gulp.task('set-dev', () => {
    options.production = false;
});

require('./gulptasks/sass')(gulp, options); // sass, sass:watch
require('./gulptasks/html')(gulp); // html, html:watch
require('./gulptasks/rollup')(gulp, options);

gulp.task('browser-sync', () => {
    const browserSync = require('browser-sync').create();

    browserSync.init({
        open: false,
        server: './dist'
    });

    gulp.watch("dist/*").on('change', browserSync.reload);
});

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

gulp.task('build', ['js', 'sass', 'html']);
gulp.task('default', ['dev']);
gulp.task('dev', ['set-dev', 'build', 'browser-sync', 'sass:watch', 'html:watch', 'js:watch']);
