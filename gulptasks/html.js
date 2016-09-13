const fs = require('fs');
const jade = require('jade');
const path = require('path');
const YAML = require('yamljs');
const menu = YAML.load('data/menu.yaml');
const getSlug = text => require('speakingurl')(text, { lang: 'hu' });
const mkdirp = require('mkdirp');

module.exports = (gulp) => {
    gulp.task('html', () => {

        const template = jade.compileFile('src/jade/layout.jade');

        const html = template({
            cssPath: '/main.css?v3',
            jsPath: '/main.js?v3',
            pretty: true,
            getSlug,
            menu,
            isDetailPage: false,
            canonical: 'http://www.meexpizza.hu/'
        });

        fs.writeFileSync('dist/index.html', html);

        const generateDetailPageFor = (directory, category, dish, data) => {
            mkdirp.sync(directory);

            const page = template({
                cssPath: '/main.css?v3',
                jsPath: '/main.js?v3',
                pretty: true,
                getSlug,
                menu,
                isDetailPage: true,
                canonical: `http://www.meexpizza.hu/${getSlug(category)}/${getSlug(dish)}/`,
                dishCategory: category,
                dishName: dish,
                dishDetails: data
            });

            fs.writeFileSync(`${directory}/index.html`, page);
        };

        Object.keys(menu['Étlap']).forEach(category => {
            const urlCategory = getSlug(category);
            Object.keys(menu['Étlap'][category]).forEach(dish => {
                const directory = `dist/${getSlug(category)}/${getSlug(dish)}`;
                generateDetailPageFor(directory, category, dish, menu['Étlap'][category][dish]);
            });
        });
    });

    gulp.task('html:watch', () => {
        gulp.watch('src/jade/**/*.jade', ['html']);
        gulp.watch('data/**/*', ['html']);
    });
};
