module.exports = (gulp) => {
    const gutil = require('gulp-util');
    const ftp = require('vinyl-ftp');

    var sharedConnection = null;
    const connect = () => {
        if (!sharedConnection) {
            sharedConnection = ftp.create({
                host: 'meexpizza.hu',
                user: process.env.FTP_USER,
                password: process.env.FTP_PASSWORD,
                parallel: 6,
                log: gutil.log
            });
        }

        return sharedConnection;
    };

    gulp.task('ftp-upload-images', () => {
        const conn = connect();
        return gulp.src(['dist/**/*.jpg', 'dist/**/*.jpeg', 'dist/**/*.png'], { base: 'dist', buffer: false })
                    .pipe(conn.differentSize('/web'))
                    .pipe(conn.dest('/web'));
    });

    gulp.task('ftp-upload-code', () => {
        const conn = connect();
        return gulp.src(['dist/**/*.html', 'dist/**/*.js', 'dist/**/*.css', 'dist/**/*.xml'], { base: 'dist', buffer: false })
                    .pipe(conn.dest('/web'));
    });

    gulp.task('ftp-upload', ['ftp-upload-images', 'ftp-upload-code']);
};
