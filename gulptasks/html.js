const fs = require('fs');
const path = require('path');
const htmlmin = require('html-minifier');
const Datastore = require('nedb');
const suspend = require('suspend');
const resume = suspend.resume;
const nunjucks = require('nunjucks');
const _ = require('lodash');

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
    gulp.task('html', (done) => {

        delete require.cache[require.resolve('../menu')];
        var menucard = require('../menu');

        delete require.cache[require.resolve('../data-test')];
        var menu = require('../data-test');

        const html = nunjucks.render('index.html', {
            menucard,
            menucardJson: JSON.stringify(menucard),
            menu
        });

        const minhtml = htmlmin.minify(html, {
            collapseWhitespace: true,
            preserveLineBreaks: true
        });

        fs.writeFile('./dist/index.html', html, done);
    });

    gulp.task('html:watch', () => {
        gulp.watch('src/content/**/*', ['html']);
    });
};
