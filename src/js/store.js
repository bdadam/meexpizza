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

import { openingHoursReducer } from './opening-hours';
import { menuReducer } from './menu';
import { orderReducer } from './order';

const store = createStore(combineReducers({
    address,
    openingHours: openingHoursReducer,
    menu: menuReducer,
    order: orderReducer
}));


export default store;
