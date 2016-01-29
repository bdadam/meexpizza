var webpack = require('webpack-stream');

module.exports = (gulp) => {
    gulp.task('webpack', function() {
        return gulp.src('src/js/main.js')
                    .pipe(webpack(require('../webpack.config.js')))
                    .pipe(gulp.dest('dist/'));
    });
};
