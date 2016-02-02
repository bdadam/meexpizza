const fs   = require('fs');
const yaml = require('js-yaml');
const _ = require('lodash');

const getslug = text => require('speakingurl')(text, { lang: 'hu' });

const fileContent = fs.readFileSync('menu.yml', 'utf8');
const doc = yaml.safeLoad(fileContent);

const cats = Object.keys(doc).filter(cat => !doc[cat].hidden).map(name => ({
    name,
    id: getslug(name)
}));

const dishes = _.flatten(cats.map(cat => {
    const x = doc[cat.name]['Választék'];
    const dishNames = Object.keys(x);
    const dishesForCategory = [];

    dishNames.forEach(dishName => {
        const dish = x[dishName];
        dishesForCategory.push({
            categoryId: getslug(cat.name),
            name: dishName,
            id: getslug(`${cat.name} ${dishName}`),
            variants: dish['Árak']
        });
    });

    return dishesForCategory;
}));

const dishes2 = _.flatten(cats.map(cat => {
    const x = doc[cat.name]['Választék'];
    const dishNames = Object.keys(x);
    const dishesForCategory = [];

    return dishNames.map(dishName => {
        const dish = x[dishName];
        return {
            categoryId: getslug(cat.name),
            name: dishName,
            // text: dish['Leírás'],
            id: getslug(`${cat.name} ${dishName}`),
            variants: dish['Árak'],

        };
    });
}));

// console.log(dishes2);
// console.log(dishes2.length === dishes.length);
// console.log(dishes2[52].name === dishes[52].name);

var menucard = {
    categories,
    dishes: dishes2
};

// fs.writeFileSync('menucard.json', JSON.stringify(menucard, null, '    '));
fs.writeFileSync('menucard.json', JSON.stringify(menucard));


const version = fileContent.match(/version\:\s([\S]+)/)[1];
const categories = Object.keys(doc).filter(key => !doc[key].hidden);

const convertItems = (items, categoryName) => {
    if (!items) { return null; }

    return Object.keys(items).map(name => ({
        name,
        id: `${getslug(categoryName)}-${getslug(name)}`,
        speakingName: getslug(name),
        imageName: items[name].image || getslug(name),
        text: items[name]['Leírás'] || '',
        variants: items[name]['Árak'],
        hasMultiVariants: !!(Object.keys(items[name]['Árak']).length > 1)
    }));
};

const convert = () => {

    return {
        version,
        categories,
        menu: categories.map(cat => ({ name: cat, id: getslug(cat), items: convertItems(doc[cat]['Választék'], cat) })),
        pizzaExtras: doc['Pizzafeltétek'],
        ref: doc,
        refJson: JSON.toString(doc)
    };

};

module.exports = convert();

// console.log(require('util').inspect(convert().menu, { depth: null }));
// console.log(require('util').inspect(convert().pizzaExtras, { depth: null }));
