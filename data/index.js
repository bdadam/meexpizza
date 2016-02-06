const fs   = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const _ = require('lodash');

const getslug = text => require('speakingurl')(text, { lang: 'hu' });

const fileContent = fs.readFileSync(path.resolve(__dirname, './menu.yml'), 'utf8');
const doc = yaml.safeLoad(fileContent);

const cats = Object.keys(doc).filter(cat => !doc[cat].hidden).map(name => ({
    name,
    id: getslug(name)
}));

const dishes = _.flatten(cats.map(cat => {
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
            variants: dish['Árak']
        };
    });
}));

var menucard = {
    categories,
    dishes
};

fs.writeFileSync(path.resolve(__dirname, './menucard.generated.json'), JSON.stringify(menucard, null, '    '));
fs.writeFileSync(path.resolve(__dirname, './menucard.generated.js'), `module.exports = ${JSON.stringify(menucard, null, '    ')};`);


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

const deliveryFeesContent = fs.readFileSync(path.resolve(__dirname, './delivery-fees.yml'), 'utf8');
const deliveryFees = yaml.safeLoad(deliveryFeesContent);
fs.writeFileSync(path.resolve(__dirname, './delivery-fees.generated.js'), `module.exports = ${JSON.stringify(deliveryFees, null, '    ')};`);
