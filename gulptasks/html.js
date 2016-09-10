const fs = require('fs');
const jade = require('jade');

module.exports = (gulp) => {
    gulp.task('html', () => {
        const YAML = require('yamljs');
        const menu = YAML.load('data/menu.yaml');
        const getSlug = text => require('speakingurl')(text, { lang: 'hu' });

        const html = jade.renderFile('src/jade/layout.jade', {
            cssPath: 'main.css?v3',
            jsPath: 'main.js?v3',
            pretty: true,
            getSlug,
            menu
        });

        fs.writeFileSync('dist/index.html', html);
    });

    gulp.task('html:watch', () => {
        gulp.watch('src/jade/**/*.jade', ['html']);
        gulp.watch('data/**/*', ['html']);
    });
};
