var webpack = require('webpack-stream');

module.exports = (gulp) => {
    gulp.task('webpack', function() {
        gulp.src('src/js/main.js')
                    .pipe(webpack(require('../webpack.config.js')))
                    .on('error', err => {
                        console.error(err);
                    })
                    .pipe(gulp.dest('dist/'));

        gulp.src('src/admin-js/admin.js')
                    .pipe(webpack(require('../webpack.admin.config.js')))
                    .on('error', err => {
                        console.error(err);
                    })
                    .pipe(gulp.dest('dist/admin'));
    });
};
