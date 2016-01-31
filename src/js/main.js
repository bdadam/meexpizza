// require('babel-polyfill');

require('es6-object-assign').polyfill();
require('lazysizes/lazysizes');

require('./navi').init();

const redux = require('redux');
// const menucard = require('../../menu');

var defaultState = {
    inCart: [],
    address: {
        name: '',
        street: '',
        city: '',
    }
};

const shoppingCart = redux.createStore((state = defaultState, action) => {
    var newState;
    switch(action.type) {
        case 'ADD':
            return Object.assign({}, state, { inCart: [...state.inCart, { dish: action.dish, timestamp: action.timestamp }] });
        case 'REMOVE':
            return Object.assign({}, state, { inCart: state.inCart.filter(x => x.timestamp !== action.timestamp) });
        case 'RESTORE':
            return Object.assign({}, state, action.state);
    }
});

const $ = require("jquery");
const nanoModal = require('nanomodal');

shoppingCart.subscribe(() => {
    const state = shoppingCart.getState();
    var ids = {};
    state.inCart.forEach(obj => {
        ids[obj.dish.id] = (ids[obj.dish.id] || 0) + 1;
    });

    $(`[data-dish-id] .in-cart-count`).text('');

    Object.keys(ids).forEach(id => {
        var count = ids[id];
        $(`[data-dish-id=${id}] .in-cart-count`).text(`${count} db`);
    });
});

shoppingCart.subscribe(() => {
    const state = shoppingCart.getState();
    $('[data-shopping-cart-count]').text(state.inCart.length + ' × ');
});

shoppingCart.subscribe(() => {
    const state = shoppingCart.getState();
    const count = state.inCart.length;
    if (count === 0) {
        $('#side-cart .default-content').show();
        $('#side-cart button.order').attr('disabled', true);
    } else {
        $('#side-cart .default-content').hide();
        $('#side-cart button.order').attr('disabled', false);
    }

    const itemsContainer = $('#side-cart .items');
    itemsContainer.empty();

    state.inCart.forEach(item => {
        var cat = window.menucard.menu.filter(category => category.id = item.dish.categoryId)[0];
        var x = cat.items.filter(dish => dish.id === item.dish.id)[0];
        itemsContainer.append(`<p>${x.name} - ${x.variants[item.dish.variant]} Ft <button data-duplicate-order-item="${item.timestamp}">Még ebből!</button> <button data-remove-order-item="${item.timestamp}">Eltávolítás</button></p>`);
    });
});

$(document).on('click', 'button[data-remove-order-item]', function(e) {
    var timestamp = $(this).data('removeOrderItem');
    shoppingCart.dispatch({ type: 'REMOVE', timestamp: timestamp });
});

$(document).on('click', 'button[data-add-to-cart]', (e) => {
    var item = $(e.target).parents('[data-dish-id]')

    var categoryId = item.data('dishCategoryId');
    var id = item.data('dishId');
    var variant = item.find('[name=variant]').val() || item.find('[data-variant]').text();

    shoppingCart.dispatch({ type: 'ADD', dish: { id, variant, categoryId }, timestamp: +new Date() });

    // $('#modal').scroll(e => {
    //     console.log(e);
    //     // e.preventDefault();
    //     // e.stopPropagation();
    // });
    //
    // var modalWithNoButtons = nanoModal($('#modal')[0], {
    //     overlayClose: false,
    //     buttons: [{
    //         text: "I'm sure!",
    //         handler: function(modal) {
    //             alert("doing something...");
    //             modal.hide();
    //         },
    //         primary: true
    //     }, {
    //         text: "Maybe not...",
    //         handler: "hide"
    //     }]
    // });
    //
    // modalWithNoButtons.show();
});

shoppingCart.subscribe(() => {
    try {
        localStorage.shoppingCart = JSON.stringify(shoppingCart.getState());
    } catch(ex) { }
});

try {
    const state = JSON.parse(localStorage.shoppingCart);
    shoppingCart.dispatch({ type: 'RESTORE', state })
} catch(ex) { }


// var orderItemTemplate = require('./templates/order-item.html');
// console.log(orderItemTemplate({ id: 'jfsjkfsdf', qwe: 'jshdfjkhsdfkjhs' }));
