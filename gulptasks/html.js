const fs = require('fs');
const jade = require('jade');
const path = require('path');
const YAML = require('yamljs');
const menu = YAML.load('data/menu.yaml');
const getSlug = text => require('speakingurl')(text, { lang: 'hu' });
const mkdirp = require('mkdirp');

module.exports = (gulp) => {
    gulp.task('html', () => {
        const urls = ['http://www.meexpizza.hu/'];

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
            const canonical = `http://www.meexpizza.hu/${getSlug(category)}/${getSlug(dish)}/`;
            const page = template({
                cssPath: '/main.css?v3',
                jsPath: '/main.js?v3',
                pretty: true,
                getSlug,
                menu,
                isDetailPage: true,
                canonical,
                dishCategory: category,
                dishName: dish,
                dishDetails: data
            });

            urls.push(canonical);

            fs.writeFileSync(`${directory}/index.html`, page);
        };

        Object.keys(menu['Étlap']).forEach(category => {
            const urlCategory = getSlug(category);
            Object.keys(menu['Étlap'][category]).forEach(dish => {
                const directory = `dist/${getSlug(category)}/${getSlug(dish)}`;
                generateDetailPageFor(directory, category, dish, menu['Étlap'][category][dish]);
            });
        });

        const sitemap = jade.renderFile('src/jade/sitemap.jade', { urls });
        fs.writeFileSync('dist/sitemap.xml', sitemap);
    });

    gulp.task('html:watch', () => {
        gulp.watch('src/jade/**/*.jade', ['html']);
        gulp.watch('data/**/*', ['html']);
    });
};
