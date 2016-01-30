var redux = require('redux');

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


cart.dispatch({ type: 'ADD', data: { id: '1', category: 'pizza', size: '30', extras: ['17', '21', '32']  } })
cart.dispatch({ type: 'ADD', data: { id: '13', category: 'pasta', size: '30', extras: ['17', '21', '32']  } })

var menuToggle = document.querySelector('.menu-toggle');
var navi = document.querySelector('#site-navigation');
menuToggle.addEventListener('click', (e) => {
    e.preventDefault();
    menuToggle.classList.toggle('active');
    navi.classList.toggle('open');
});
