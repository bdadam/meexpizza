'use strict';

const fs   = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const _ = require('lodash');

const getslug = text => require('speakingurl')(text, { lang: 'hu' });

const menucardYaml = yaml.safeLoad(fs.readFileSync(path.resolve(__dirname, './menu.yml'), 'utf8'));
const pizzaExtrasYaml = yaml.safeLoad(fs.readFileSync(path.resolve(__dirname, './pizza-feltetek.yml'), 'utf8'));
const hamburgerExtrasYaml = yaml.safeLoad(fs.readFileSync(path.resolve(__dirname, './hamburger-feltetek.yml'), 'utf8'));

const dishes = [];
const categories = [];

Object.keys(menucardYaml).forEach(category => {

    categories.push({ name: category, id: getslug(category) });

    const section = menucardYaml[category];
    const listObj = section['Választék'];

    Object.keys(listObj).forEach(dishName => {
        const dish = listObj[dishName];
        const description = dish['Leírás'] || '';
        const type = dish.type || 'none';
        const variantsObj = dish['Árak'];

        const variants = [];

        Object.keys(variantsObj).forEach(variantName => {
            variants.push({
                name: variantName,
                price: variantsObj[variantName]
            });
        });

        const options = [];

        const optionsObj = dish['Opciók'];
        if (optionsObj) {
            Object.keys(dish['Opciók']).forEach(option => {
                options.push({ name: option, list: optionsObj[option] });
            });
        }

        dishes.push({
            categoryId: getslug(category),
            id: getslug(dishName),
            category,
            name: dishName,
            description,
            type,
            variants,
            options
        });
    });
});

const pizzaExtras = [];
Object.keys(pizzaExtrasYaml).forEach(extraName => {
    pizzaExtras.push({
        name: extraName,
        price: pizzaExtrasYaml[extraName]['Ár'],
        list: pizzaExtrasYaml[extraName]['Választék']
    });
});

const hamburgerExtras = [];
Object.keys(hamburgerExtrasYaml).forEach(extraName => {
    hamburgerExtras.push({
        name: extraName,
        price: hamburgerExtrasYaml[extraName]['Ár'],
        list: hamburgerExtrasYaml[extraName]['Választék']
    });
});

const menucard = {
    categories,
    dishes,
    pizzaExtras,
    hamburgerExtras
};

menucard.version = require('crypto').createHash('md5').update(JSON.stringify(menucard)).digest("hex");

fs.writeFileSync(path.resolve(__dirname, './menucard2.generated.js'), `module.exports = ${JSON.stringify(menucard, null, '    ')};`);
