var sass = require('gulp-sass');
var pleeease = require('gulp-pleeease');

module.exports = (gulp) => {
    gulp.task('sass', function () {
        gulp.src('src/scss/main.scss')
            .pipe(sass({
                importer: require('node-sass-import')
            })
            .on('error', sass.logError))
            .pipe(pleeease())
            .pipe(gulp.dest('dist'));

        gulp.src('src/admin-scss/admin.scss')
            .pipe(sass().on('error', sass.logError))
            .pipe(pleeease())
            .pipe(gulp.dest('dist/admin'));
    });

    gulp.task('sass:watch', function () {
        gulp.watch('src/scss/**/*.scss', ['sass']);
        gulp.watch('src/admin-scss/**/*.scss', ['sass']);
    });
};
