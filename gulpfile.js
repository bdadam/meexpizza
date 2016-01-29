var gulp = require('gulp');

require('./gulptasks/sass')(gulp); // sass, sass:watch
require('./gulptasks/webpack')(gulp); // webpack
require('./gulptasks/html')(gulp); // html, html:watch

gulp.task('webserver', function() {
    var webserver = require('gulp-webserver');
    gulp.src('./dist')
        .pipe(webserver({
            livereload: true,
            port: 3000
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

gulp.task('build', ['webpack', 'sass', 'html']);
gulp.task('watchwithoutwebserver', ['sass:watch', 'html:watch'])
gulp.task('default', ['build', 'watch']);
