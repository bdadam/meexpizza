const redux = require('redux');

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

const store = redux.createStore(redux.combineReducers({
    cart,
    address,
    openingHours
}));

// export default store;

module.exports = store;

// export default store;
