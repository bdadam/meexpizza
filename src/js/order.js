import store from './store';
import { findDishByCategoryAndName, findExtrasForDishCategoryAndName } from './menu';

import findIndex from 'lodash/findIndex';

import { default as deliveryFees } from '../../data/delivery-fees.yml';

console.log(deliveryFees);

// import Immutable from 'immutable';
// console.log(Immutable);

import merge from 'lodash/merge';

const defaultState = { items: [], address: { city: 'Gyöngyös', name: '', phone: '', street: '', notes: '' } };

export const orderReducer = (state = defaultState, action) => {
    switch(action.type) {
        case 'clear-order':
            return defaultState;

        case 'restore-order':
            return Object.assign({}, action.order);

        case 'add-item-to-order':
            return Object.assign({}, state, { items: [...state.items, merge({}, action.item)] });

        case 'duplicate-item-in-order':
            const idx = findIndex(state.items, { time: action.itemTime });
            const item = state.items[idx];
            const newItems = [...state.items];
            newItems.splice(idx, 0, Object.assign({}, item));
            return Object.assign({}, state, { items: newItems });

        case 'remove-item-from-order':
            const idx2 = findIndex(state.items, { time: action.itemTime });
            const newItems2 = [...state.items];
            newItems2.splice(idx2, 1);
            return Object.assign({}, state, { items: newItems2 });
    }

    return state;
};

export const clearOrder = () => {
    store.dispatch({ type: 'clear-order' });
};

// import transform from 'lodash/transform';
// import omit from 'lodash/omit';

import find from 'lodash/find';
// import merge from 'lodash/merge';
// import toPairs from 'lodash/toPairs';
// import omit from 'lodash/omit';
// import pickBy from 'lodash/pickBy';

// console.log(omit);

export const addItem = item => {
    const dish = findDishByCategoryAndName(item.category, item.name);

    if (Object.keys(dish.variants).length > 1 && !item.variant) {
        throw new Error('Variant must be provided.');
    }

    // const extras = {};
    // const allExtras = findExtrasForDishCategoryAndName(item.category, item.name);
    //
    // // const allx = pickBy(merge({}, item.extras.required, item.extras.optional), v => (Array.isArray(v) ) || typeof v === 'string');
    // const allx = pickBy(merge({}, item.extras.required, item.extras.optional), v => v.length > 0);
    //
    // // console.log('QQQ', allx);
    //
    // if (item.extras.required) {
    //     Object.keys(item.extras.required).forEach(category => {
    //         // extras[category] = { price: allExtras.required.find({ category: key }).price };
    //         const extra = find(allExtras.required, { category: category });
    //         const ex = item.extras.required[category];
    //
    //         // console.log(ex, extra);
    //
    //         // const name = item.extras
    //         // extras[extra] = { price: extra.price, category };
    //     });
    // }
    // //
    // // if (item.extras.optional) {
    // //     Object.keys(item.extras.optional).forEach(name => {
    // //         extras[name] = find(allExtras.optional, { category: name}).price;
    // //     });
    // // }
    //
    // console.log(allExtras);
    // console.log(extras);
    // // console.log(dish.freeExtras);

    store.dispatch({
        type: 'add-item-to-order',
        item: {
            time: Date.now(),
            name: dish.name,
            category: dish.category,
            price: dish.variants[item.variant],
            extras: item.extras
        }
    });
};

export const removeItem = item => {
    store.dispatch({
        type: 'remove-item-from-order',
        itemTime: item.time
    });
};

export const duplicateItem = item => {
    store.dispatch({
        type: 'duplicate-item-in-order',
        itemTime: item.time
    });
};
