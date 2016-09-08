import store from './store';
import { findDishByCategoryAndName, findExtrasForDishCategoryAndName } from './menu';

import findIndex from 'lodash/findIndex';

import { default as deliveryFees } from '../../data/delivery-fees.yml';

console.log(deliveryFees);

// import Immutable from 'immutable';
// console.log(Immutable);

const defaultState = { items: [], address: { city: 'Gyöngyös', name: '', phone: '', street: '', notes: '' } };

export const orderReducer = (state = defaultState, action) => {
    switch(action.type) {
        case 'clear-order':
            return defaultState;

        case 'restore-order':
            return Object.assign({}, action.state);

        case 'add-item-to-order':
            // return Object.assign({}, state, { items: state.items.push(Object.assign({}, action.item)) });
            return Object.assign({}, state, { items: [...state.items, Object.assign({}, action.item)] });

        case 'duplicate-item-in-order':
            // const idx = state.items.findIndex(i => i.time === action.item.time);
            // return Object.assign({}, state, { items: state.items.insert(idx, Object.assign({}, action.item)) })
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

export const addItem = (item, itemExtras) => {
    const dish = findDishByCategoryAndName(item.category, item.name);

    if (Object.keys(dish.variants).length > 1 && !item.variant) {
        throw new Error('Variant must be provided.');
    }

    // const extras = findExtrasForDishCategoryAndName(product.category, product.name);

    store.dispatch({
        type: 'add-item-to-order',
        item: {
            time: Date.now(),
            dishName: dish.name,
            dishCategory: dish.category,
            price: dish.variants[item.variant],

            extras: []
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
