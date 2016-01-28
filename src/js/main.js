console.log('main');
var redux = require('redux');

console.log(redux);

var cart = redux.createStore((state = {}, action) => {

    switch(action) {
        case 'ADD':
            return state;
    }

    return state;
});

cart.subscribe(() => {
    console.log(cart.getState())
});

cart.dispatch({ type: 'ADD', data: { id: '1', size: '30',  } })
