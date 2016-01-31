var gulp = require('gulp');

require('./gulptasks/sass')(gulp); // sass, sass:watch
require('./gulptasks/webpack')(gulp); // webpack
require('./gulptasks/html')(gulp); // html, html:watch

gulp.task('webserver', function() {
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
            width: 120,
            height: 120
        }))
        .pipe(gulp.dest('dist/food-images/small'));
});

gulp.task('build', ['webpack', 'sass', 'html']);
gulp.task('watchwithoutwebserver', ['sass:watch', 'html:watch'])
gulp.task('default', ['build', 'watch']);
