const fs = require('fs');
const jade = require('jade');
const path = require('path');
const YAML = require('yamljs');
const menu = YAML.load('data/menu.yaml');
const getSlug = text => require('speakingurl')(text, { lang: 'hu' });

module.exports = (gulp) => {
    gulp.task('html', () => {

        const html = jade.renderFile('src/jade/layout.jade', {
            cssPath: 'main.css?v3',
            jsPath: 'main.js?v3',
            pretty: true,
            getSlug,
            menu
        });

        fs.writeFileSync('dist/index.html', html);

        Object.keys(menu['Étlap']).forEach(category => {
            const urlCategory = getSlug(category);
            Object.keys(menu['Étlap'][category]).forEach(dish => {
                console.log(`${getSlug(category)}/${getSlug(dish)}/index.html`, category, dish);
            });
        });
    });

    gulp.task('html:watch', () => {
        gulp.watch('src/jade/**/*.jade', ['html']);
        gulp.watch('data/**/*', ['html']);
    });
};
