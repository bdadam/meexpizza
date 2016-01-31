const fs   = require('fs');
const yaml = require('js-yaml');

const getslug = text => require('speakingurl')(text, { lang: 'hu' });

const fileContent = fs.readFileSync('menu.yml', 'utf8');
const doc = yaml.safeLoad(fileContent);

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
