import store from './store';
import { findDishByCategoryAndName, findExtrasForDishCategoryAndName } from './menu';

import findIndex from 'lodash/findIndex';


// import Immutable from 'immutable';
// console.log(Immutable);

import merge from 'lodash/merge';

const defaultState = { items: [], address: { city: 'Gyöngyös', name: '', phone: '', street: '', notes: '' }, deliveryFees: {}, minOrderValueReached: false, deliveryFee: 0, total: 0, grandTotal: 0 };

export const orderReducer = (state = defaultState, action) => {

    let newState = state;

    switch(action.type) {

        case 'add-delivery-city':
            newState = Object.assign({}, state, { deliveryFees: Object.assign({}, state.deliveryFees, { [action.city] : { fix: action.fix, min: action.min } }) });
            break;

        case 'update-address':
            newState = Object.assign({}, state, { address: action.address });
            console.log(newState.address);
            break;

        case 'clear-order':
            newState = defaultState;
            break;

        case 'restore-order':
            newState = Object.assign({}, action.order);
            break;

        case 'add-item-to-order':
            newState = Object.assign({}, state, { items: [...state.items, merge({}, action.item)] });
            break;

        case 'duplicate-item-in-order':
            const idx = findIndex(state.items, { time: action.itemTime });
            const item = state.items[idx];
            const newItems = [...state.items];
            newItems.splice(idx, 0, Object.assign({}, item));
            newState = Object.assign({}, state, { items: newItems });
            break;

        case 'remove-item-from-order':
            const idx2 = findIndex(state.items, { time: action.itemTime });
            const newItems2 = [...state.items];
            newItems2.splice(idx2, 1);
            newState = Object.assign({}, state, { items: newItems2 });
            break;

        default:
            return state;
    }

    newState.total = 0;

    newState.items.forEach(item => {
        newState.total += item.price;

        if (item.extras && item.extras.optional) {
            Object.keys(item.extras.optional).forEach(x => {
                newState.total += item.extras.optional[x].price * item.extras.optional[x].selection.length;
            });
        }
    });

    newState.minOrderValueReached = newState.deliveryFees && newState.deliveryFees[newState.address.city] && newState.deliveryFees[newState.address.city].min <= newState.total;
    newState.deliveryFee = newState.deliveryFees[newState.address.city] && newState.deliveryFees[newState.address.city].fix;
    newState.minOrderValue = newState.deliveryFees[newState.address.city] && newState.deliveryFees[newState.address.city].min;

    newState.grandTotal = newState.total + newState.deliveryFee;

    return newState;
};

export const clearOrder = () => {
    store.dispatch({ type: 'clear-order' });
};

import { default as deliveryFees } from '../../data/delivery-fees.yml';

export const init = orderToRestore => {
    Object.keys(deliveryFees.Cities).forEach(city => {
        store.dispatch({
            type: 'add-delivery-city',
            city,
            min: deliveryFees.Cities[city].min || 0,
            fix: deliveryFees.Cities[city].fix || 0
        });
    });

    if (orderToRestore) {

        console.log(orderToRestore);

        store.dispatch({
            type: 'restore-order',
            order: orderToRestore
        });
    }
};

import find from 'lodash/find';

export const addItem = item => {
    const dish = findDishByCategoryAndName(item.category, item.name);

    if (Object.keys(dish.variants).length > 1 && !item.variant) {
        throw new Error('Variant must be provided.');
    }

    store.dispatch({
        type: 'add-item-to-order',
        item: {
            time: Date.now(),
            name: dish.name,
            category: dish.category,
            price: dish.variants[item.variant],
            variant: item.variant,
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

export const updateAddress = address => {
    store.dispatch({
        type: 'update-address',
        address
    });
};

export const validateOrder = order => {
    return order.minOrderValueReached && order.items.length > 0;
};
