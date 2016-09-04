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

const menu = (state = {}, action) => {
    switch (action.type) {
        case 'full-menu-loaded':
            return Object.assign({}, { dishes: action.fullMenu['Étlap'], extras: action.fullMenu['Extrák'] });
            // return Object.assign({}, action.fullMenu['Étlap'], { extras: action.fullMenu });
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
