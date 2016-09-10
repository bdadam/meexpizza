import { createStore, combineReducers } from 'redux';

import { openingHoursReducer } from './opening-hours';
import { menuReducer } from './menu';
import { orderReducer } from './order';

const store = createStore(combineReducers({
    openingHours: openingHoursReducer,
    menu: menuReducer,
    order: orderReducer
}));


export default store;
