import includes from 'lodash/includes';
import some from 'lodash/some';
import startsWith from 'lodash/startsWith';
import merge from 'lodash/merge';

import speakingurl from 'speakingurl';

import store from './store';
import { default as fullMenu } from '../../data/test.yaml';

export const menuReducer = (state = { dishes2: [], extras2: [] }, action) => {
    switch (action.type) {
        case 'add-dish-to-menu':
            return Object.assign({}, state, { dishes2: [...state.dishes2, merge({}, action.dish)] });
        case 'add-extra-to-menu':
            return Object.assign({}, state, { extras2: [...state.extras2, merge({}, action.extra)] });
        default:
            return state;
    }
};

export const init = () => {
    const extras = fullMenu['Extrák'];
    Object.keys(extras).forEach(category => {
        const extra = extras[category];
        store.dispatch({
            type: 'add-extra-to-menu',
            extra: {
                category: category,
                price: extra.price,
                multi: extra.multi,
                single: extra.single
            }
        });
    });

    const getSlug = text => speakingurl(text, { lang: 'hu' });

    const menu = fullMenu['Étlap'];
    Object.keys(menu).forEach(categoryName => {
        const category = menu[categoryName];
        Object.keys(category).forEach(dishName => {
            const dish = category[dishName];
            const rawOptions = dish['Választható'] || [];

            const requiredOptions = [];
            const options = [];
            let freeExtras = 0;

            rawOptions.forEach(o => {
                if (o.indexOf('[3 ingyen]')) {
                    freeExtras = 3;
                    o = o.replace('[3 ingyen]', '').trim();
                }

                if (o.indexOf('[kötelező]') > 0) {
                    requiredOptions.push(o.replace('[kötelező]', '').trim());
                }

                options.push(o.trim());
            });

            store.dispatch({
                type: 'add-dish-to-menu',
                dish: {
                    category: categoryName,
                    name: dishName,
                    description: dish['Összetevők'],
                    variants: dish['Árak'],
                    requiredOptions,
                    options,
                    freeExtras,
                    image: `/food-images/160/${dish.image || getSlug(dishName)}.jpeg`
                }
            });
        });
    });
};

export const findDishByCategoryAndName = (category, name) => {
    const results = store.getState().menu.dishes2.filter(d => d.category === category && d.name === name);
    if (results && results.length === 1) {
        return results[0];
    }

    return null;
};


export const findExtrasForDishCategoryAndName = (category, name) => {
    const dish = findDishByCategoryAndName(category, name);
    if (!dish) return null;

    const extras = store.getState().menu.extras2;

    return {
        required: extras.filter(e => some(dish.requiredOptions, o => startsWith(e.category, o))),
        optional: extras.filter(e => some(dish.options, o => startsWith(e.category, o)))
    };
};
