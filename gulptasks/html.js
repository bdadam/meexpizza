const fs = require('fs');
const path = require('path');
const htmlmin = require('html-minifier');
const Datastore = require('nedb');
const suspend = require('suspend');
const resume = suspend.resume;
const nunjucks = require('nunjucks');
const _ = require('lodash');
const jade = require('jade');

nunjucks.configure('src/content/', { autoescape: true, noCache: true });

const generateData = suspend(function*() {
    const db = {
        category: new Datastore({ filename: path.resolve(process.cwd(), 'data/cat.nedb'), autoload: true }),
        food: new Datastore({ filename: path.resolve(process.cwd(), 'data/food.nedb'), autoload: true }),
    };

    var food = yield db.food.find().exec(resume());
    var categories = yield db.category.find().exec(resume());

    var sortedFood = _.sortBy(food, ['category', '_id']);
    var groupedFood = _.groupBy(sortedFood, 'category');
    console.log(groupedFood);
    return food;
});

module.exports = (gulp) => {
    gulp.task('html', () => {
        const YAML = require('yamljs');
        const menu = YAML.load('data/test.yaml');
        const getSlug = text => require('speakingurl')(text, { lang: 'hu' });

        const html = jade.renderFile('src/jade/layout.jade', {
            cssPath: 'main.css?v3',
            jsPath: 'main.js?v3',
            pretty: true,
            getSlug,
            menu
        });

        fs.writeFileSync('dist/index2.html', html);
        // done();
        // const fn = jade.compile('a(href=href) button(@click="asdf(\'#{id}\', \'#{name}\')")');
        // console.log(fn({ id: 123, name: 'name', href: 'HREF' }));


        // // delete require.cache[require.resolve('../menu')];
        // // var menucard = require('../menu');
        // //
        // delete require.cache[require.resolve('../data/index')];
        // var menu = require('../data/index');
        //
        // delete require.cache[require.resolve('../data/menucard2.generated')];
        // const menucard = require('../data/menucard2.generated');
        // const viewModel = {
        //     categories: menucard.categories.map(cat => {
        //         return {
        //             id: cat.id,
        //             name: cat.name,
        //             dishes: menucard.dishes.filter(dish => dish.category === cat.name)
        //         };
        //     })
        // };
        //
        // const html = nunjucks.render('index.html', {
        //     viewModel,
        //     menucard,
        //     menu,
        // });
        //
        // const minhtml = htmlmin.minify(html, {
        //     collapseWhitespace: true,
        //     preserveLineBreaks: true
        // });
        //
        // fs.writeFile('./dist/index.html', minhtml, done);
    });

    gulp.task('html:watch', () => {
        // gulp.watch('src/content/**/*.html', ['html']);
        gulp.watch('src/jade/**/*.jade', ['html']);
        gulp.watch('data/**/*', ['html']);
    });
};
