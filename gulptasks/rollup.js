var cache;

module.exports = (gulp, options) => {
    gulp.task('js', () => {

        const rollup = require( 'rollup' );
        const babel = require('rollup-plugin-babel');
        const buble = require('rollup-plugin-buble');
        const commonjs = require('rollup-plugin-commonjs');
        const nodeResolve = require('rollup-plugin-node-resolve');
        const eslint = require('rollup-plugin-eslint');
        const uglify = require('rollup-plugin-uglify');
        const replace = require('rollup-plugin-replace');
        const strip = require('rollup-plugin-strip');
        const html = require('rollup-plugin-html');
        const yaml = require('rollup-plugin-yaml');
        const filesize = require('rollup-plugin-filesize');

        const config = {
            entry: 'src/js/main2.js',
            cache,
            plugins: [
                nodeResolve({ jsnext: true, main: true }),
                commonjs({
                    exclude: ['node_modules/symbol-observable/es/*']
                }),
                yaml(),
                html(),
                buble(),
                // babel({ exclude: ['node_modules/**', '**/*.html', '**/*.ya?ml'] }),
                // eslint(),
                replace({
                    'process.env.NODE_ENV': '"production"',
                    'process.env.VUE_ENV': '"browser"'
                }),
                uglify(),
                filesize()
            ]
        };

        if (options.production) {
            // config.plugins.push(strip());
            // config.plugins.push(uglify());
        }

        return rollup.rollup(config).then(bundle => {
            cache = bundle;

            return bundle.write({
                moduleName: 'asdf',
                format: 'iife',
                dest: 'dist/main.js',
                sourceMap: true
            });
        });
    });

    gulp.task('js:watch', function () {
        gulp.watch('src/js/**/*', ['js']);
        gulp.watch('data/**/*', ['js']);
        // gulp.watch(['data/**/*.yaml', 'data/**/*.yaml'], ['js']);
    });
};
