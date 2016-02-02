// require('babel-polyfill');

require('es6-object-assign').polyfill();
require('lazysizes/lazysizes');

require('./navi').init();

const redux = require('redux');
// const menucard = require('../../menu');

var defaultState = {
    inCart: [],
    serializedForm: '',
    isEmpty: true
};

const flatMap = require('lodash/flatMap');

const shoppingCart = redux.createStore((state = defaultState, action) => {
    switch(action.type) {
        case 'ADD':
            return Object.assign({}, state, { isEmpty: false, inCart: [...state.inCart, { dish: action.dish, timestamp: action.timestamp }] });
        case 'REMOVE':
            const inCart = state.inCart.filter(x => x.timestamp !== action.timestamp);
            return Object.assign({}, state, { isEmpty: !inCart.length, inCart: inCart });
        case 'DUPLICATE':
            return Object.assign({}, state, {
                inCart: flatMap(state.inCart, item => {
                                    return item.timestamp !== action.timestamp
                                        ? item
                                        : [item, Object.assign({}, item, { timestamp: +new Date() })];
                                    })
                                });
        case 'RESTORE':
            return Object.assign({}, state, defaultState, action.state, { isEmpty: !action.state.inCart.length });
        case 'ORDER_FORM_CHANGE':
            return Object.assign({}, state, { serializedForm: action.serializedForm });
    }
});

shoppingCart.subscribe(() => {
    try {
        localStorage.shoppingCart = JSON.stringify(shoppingCart.getState());
    } catch(ex) { }
});

setTimeout(() => {
    try {
        const state = JSON.parse(localStorage.shoppingCart);
        shoppingCart.dispatch({ type: 'RESTORE', state })
    } catch(ex) { }
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
    if (state.isEmpty) {
        $('#side-cart .default-content').show();
        // $('#side-cart .order-form').hide();
        $('#side-cart button.order').attr('disabled', true);
    } else {
        $('#side-cart .default-content').hide();
        // $('#side-cart .order-form').show();
        $('#side-cart button.order').attr('disabled', false);
    }

    const itemsContainer = $('#side-cart .items');
    itemsContainer.empty();

    state.inCart.forEach(item => {
        var cat = window.menucard.menu.filter(category => category.id === item.dish.categoryId)[0];
        var x = cat.items.filter(dish => dish.id === item.dish.id)[0];
        itemsContainer.append(`<tr><td>${x.name}<div><button data-duplicate-order-item="${item.timestamp}">Még ebből!</button> <button data-remove-order-item="${item.timestamp}">Eltávolítás</button></div></td><td>${x.variants[item.dish.variant]} Ft</td></tr>`);
    });

    if (state.inCart.length > 0) {
        const sum = state.inCart.reduce((prev, item) => {
            var cat = window.menucard.menu.filter(category => category.id === item.dish.categoryId)[0];
            var x = cat.items.filter(dish => dish.id === item.dish.id)[0];
            return prev + x.variants[item.dish.variant];
        }, 0);

        itemsContainer.append(`<tfoot><tr><td>Végösszeg</td><td>${sum} Ft</td></tr></tfoot>`);
    }
});

shoppingCart.subscribe(() => {
    const state = shoppingCart.getState();
    state.serializedForm.split('&').map(x => x.split('=').map(x => x.replace(/\+/g, ' ')).map(decodeURIComponent)).forEach(kv => {
        $(`.order-form [name="${kv[0]}"]`).val(kv[1]);
    });
});

const orderForm = $('#side-cart .order-form').on('input change', (e) => {
    var serializedForm = $('#side-cart .order-form').serialize();
    shoppingCart.dispatch({ type: 'ORDER_FORM_CHANGE', serializedForm });
})

$(document).on('click', 'button[data-remove-order-item]', function(e) {
    var timestamp = $(this).data('removeOrderItem');
    shoppingCart.dispatch({ type: 'REMOVE', timestamp: timestamp });
});

$(document).on('click', 'button[data-duplicate-order-item]', function(e) {
    var timestamp = $(this).data('duplicateOrderItem');
    shoppingCart.dispatch({ type: 'DUPLICATE', timestamp: timestamp });
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

// var orderItemTemplate = require('./templates/order-item.html');
// console.log(orderItemTemplate({ id: 'jfsjkfsdf', qwe: 'jshdfjkhsdfkjhs' }));

window.sc = shoppingCart;
