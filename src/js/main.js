// require('babel-polyfill');

// require('zepto/zepto.min');
// import zepto from 'zepto/zepto.min.js';
// window.jQuery = window.$;

require('es6-object-assign').polyfill();
require('lazysizes/lazysizes');
require('document-register-element');

require('./navi').init();

const redux = require('redux');

const menucard = require('../../data/menucard.generated');
const deliveryFees = require('../../data/delivery-fees.generated');

var defaultState = {
    inCart: [],
    serializedForm: '',
    isEmpty: true,
    address: { city: 'Gyöngyös' }
};

const flatMap = require('lodash/flatMap');

const shoppingCart = redux.createStore((state = defaultState, action) => {
    let newState = defaultState;

    switch(action.type) {
        case 'ADD':
            newState = Object.assign({}, state, { inCart: [...state.inCart, { dish: action.dish, timestamp: action.timestamp }] });
            break;
        case 'REMOVE':
            const inCart = state.inCart.filter(x => x.timestamp !== action.timestamp);
            newState = Object.assign({}, state, { inCart });
            break;
        case 'DUPLICATE':
            newState = Object.assign({}, state, {
                inCart: flatMap(state.inCart, item => {
                                    return item.timestamp !== action.timestamp
                                        ? item
                                        : [item, Object.assign({}, item, { timestamp: +new Date() })];
                                    })
                                });
            break;
        case 'RESTORE':
            newState = Object.assign({}, state, defaultState, action.state);
            break;
        case 'ADDRESS_CHANGE':
            newState = Object.assign({}, state, { address: action.address });
            break;
        default:
            // no-op
            return state;
    }

    // newState.total = newState.inCart.reduce(item => item.)
    newState.isEmpty = newState.inCart.length === 0;
    newState.deliveryFee = deliveryFees[newState.address.city].fix || 0;
    newState.deliveryFreeFrom = deliveryFees[newState.address.city].min || 0;

    return newState;
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
        const x = menucard.dishes.filter(dish => dish.id === item.dish.id)[0];
        itemsContainer.append(`<tr><td>${x.name} (${item.dish.variant})</td><td><button data-duplicate-order-item="${item.timestamp}"><svg><use xlink:href="#icon-plus"></use></svg></button><button data-remove-order-item="${item.timestamp}"><svg><use xlink:href="#icon-minus"></use></svg></button></div></td><td>${x.variants[item.dish.variant]}&nbsp;Ft</td></tr>`);
    });

    if (!state.isEmpty) {
        const sum = state.inCart.reduce((prev, item) => {
            var x = menucard.dishes.filter(dish => dish.id === item.dish.id)[0];
            return prev + x.variants[item.dish.variant];
        }, 0);

        itemsContainer.append(`<tfoot><tr><td>Végösszeg</td><td colspan="2">${sum}&nbsp;Ft</td></tr></tfoot>`);
    }
});


shoppingCart.subscribe(() => {
    const address = shoppingCart.getState().address;
    const orderForm = $('#side-cart .order-form')

    orderForm.find('[name=city]').val(address.city);
    orderForm.find('[name=name]').val(address.name);
    orderForm.find('[name=street]').val(address.street);
    orderForm.find('[name=phone]').val(address.phone);
});

const orderForm = $('#side-cart .order-form').on('input change', (e) => {
    const address = {
        city: orderForm.find('[name=city]').val(),
        name: orderForm.find('[name=name]').val(),
        street: orderForm.find('[name=street]').val(),
        phone: orderForm.find('[name=phone]').val()
    };

    shoppingCart.dispatch({ type: 'ADDRESS_CHANGE', address });
});

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
    var variant = item.find('[name=variant]').val() || item.find('[data-variant]').text() || '';

    shoppingCart.dispatch({ type: 'ADD', dish: { id, variant, categoryId }, timestamp: +new Date() });

    // const template = require('./templates/pizza-options.html');
    // const html = template();
    // const modal = nanoModal(html, {
    //     overlayClose: false,
    //     buttons: [{
    //         text: 'Hozzáadás a rendeléshez',
    //         handler: m => m.hide(),
    //         primary: true
    //     }, {
    //         text: 'Mégsem',
    //         handler: 'hide'
    //     }]
    // });
    // modal.show();

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

document.registerElement('google-map', {
    extends: 'a',
    prototype: Object.create(HTMLElement.prototype, {
        attachedCallback: {
            value: function() {
                var el = this;
                setTimeout(() => {
                    // 47.785625, 19.932675
                    const width = el.clientWidth | 0;

                    if (width === 0) { return; }

                    const height = width * 0.75 | 0;
                    const scale = (window.devicePixelRatio > 1) ? 2 : 1;
                    const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?zoom=15&size=${width}x${height}&scale=${scale}&maptype=roadmap&markers=color:blue%7Clabel:M%7C3200+Gyöngyös,+Orczy+út+1.&format=png`;
                    const img = document.createElement('img');
                    img.alt = el.getAttribute('title');
                    img.src = staticMapUrl;
                    el.insertBefore(img, el.firstChild);
                });
            }
        }
    })
});

const dayOfWeek = new Date().getDay();
$(`#opening-hours dd:nth-of-type(${dayOfWeek}), #opening-hours dt:nth-of-type(${dayOfWeek})`).css({ fontWeight: 700 });


var currentOrder = {
    timestamp: 1234,
    dishId: 'asdf',
    variant: '30cm',
    pizzaExtras: ['errt', 'dfgfdg', 'dfgfdg'],
    hamburgerExtras: ['errt', 'dfgfdg', 'dfgfdg']
};

//
// const openModal = () => {
//     const tpl = require('./templates/pizza-options.html');
//     const html = tpl({ id: 'pizza-modal' });
//
//     const currentScroll = window.scrollY;
//
//     $(document.body).append(html);
//
//     $(document).on('click', '[data-close]', () => {
//         $('#pizza-modal').remove();
//         window.scrollY = currentScroll;
//     });
// };
//
// openModal();

// require('vue')
