import { createStore, combineReducers } from 'redux';

const address = (state = {}, action) => {
    switch (action.type) {
        case 'select-city':
        case 'set-name':
        case 'set-street':
        case 'set-phone':
        case 'set-note':
            return state;
        default:
            return state;
    }
};

const cart = (state = {}, action) => {
    switch(action.type) {
        case 'add-item':
            return state;
        case 'remove-item':
            return state;
        case 'duplicate-item':
            return state;
        case 'change-item':
            return state;
        default:
            return state;
    }
};

const openingHours = (state = { isOpen: false }, action) => {
    if (action.type !== 'set-current-date') {
        return state;
    }

    const openingHoursPerDay = [
        [1030, 2030], // Sunday
        [1030, 2130],
        [1030, 2130],
        [1030, 2130],
        [1030, 2130],
        [1030, 2230],
        [1030, 2230]
    ];

    const currentDay = action.date.getDay();
    const currentTime = action.date.getHours() * 100 + action.date.getMinutes();
    const currentOpeningHours = openingHoursPerDay[currentDay];
    const isOpen = currentTime >= currentOpeningHours[0] && currentTime <= currentOpeningHours[1];

    return { isOpen };
};

// class Product {
//     constructor(id, data) {}
// }
//
// class ProductManager {
//     constructor(products, extras) {}
//
//     getProductById(id) {}
// }

const menu = (state = {}, action) => {
    switch (action.type) {
        case 'full-menu-loaded':

            const extraPriceById = {};
            for(let category in action.fullMenu['Extrák']) {
                if (action.fullMenu['Extrák'][category].single) {
                    action.fullMenu['Extrák'][category].single.forEach(name => {
                        extraPriceById[`${category}|${name}`] = action.fullMenu['Extrák'][category].price;
                    });
                }

                if (action.fullMenu['Extrák'][category].multi) {
                    action.fullMenu['Extrák'][category].multi.forEach(name => {
                        extraPriceById[`${category}|${name}`] =     action.fullMenu['Extrák'][category].price;
                    });
                }
            }

            return Object.assign({}, { dishes: action.fullMenu['Étlap'], extras: action.fullMenu['Extrák'], extraPriceById });
        default:
            return state;

    }
};

const store = createStore(combineReducers({
    cart,
    address,
    openingHours,
    menu
}));

export default store;
