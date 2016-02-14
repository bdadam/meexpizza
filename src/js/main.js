// require('babel-polyfill');

// require('zepto/zepto.min');
// import zepto from 'zepto/zepto.min.js';
// window.jQuery = window.$;

require('es6-object-assign').polyfill();
require('lazysizes/lazysizes');
require('document-register-element');

require('./navi').init();

const redux = require('redux');

const menucard = require('../../data/menucard2.generated');
const deliveryFees = require('../../data/delivery-fees.generated');

var defaultState = {
    inCart: [],
    serializedForm: '',
    isEmpty: true,
    address: { city: 'Gyöngyös' }
};

const flatMap = require('lodash/flatMap');
const find = require('lodash/find');

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
        case 'EMPTY_CART':
            newState = Object.assign({}, state, { inCart: [] });
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
        $(`[data-dish-id=${id}] .in-cart-count`).text(`${count} db a kosárban`);
    });
});

shoppingCart.subscribe(() => {
    const state = shoppingCart.getState();
    $('[data-shopping-cart-count]').text(state.inCart.length + ' × ');
});

shoppingCart.subscribe(() => {
    const state = shoppingCart.getState();

    if (state.isEmpty) {
        // $('#side-cart .default-content').show();
        $('#side-cart button.order').attr('disabled', true);
    } else {
        // $('#side-cart .default-content').hide();
        $('#side-cart button.order').attr('disabled', false);
    }

    const viewModel = {
        showEmptyMessage: state.inCart.length === 0,
        isEmpty: state.inCart.length === 0,
        lines: state.inCart.map(item => {
            const dishFromCard = find(menucard.dishes, dish => dish.id === item.dish.id); //menucard.dishes.filter()
            return { id: item.timestamp, name: `${dishFromCard.name} (${item.dish.variant})`, price: find(dishFromCard.variants, v => v.name === item.dish.variant).price }
        }),
        deliveryFee: menucard.deliveryFees[state.address.city].fix || 0,
        minForFreeDelivery: menucard.deliveryFees[state.address.city].min || 0
    };

    viewModel.total = viewModel.lines.reduce((prev, l) => prev + l.price, 0) + viewModel.deliveryFee;
    viewModel.minTotalNotReached = viewModel.total < viewModel.minForFreeDelivery;
    viewModel.showMinForFreeDeliveryMessage = state.inCart.length > 0 && viewModel.minTotalNotReached;

    var tpl = require('./templates/shopping-cart.html');
    $('.cart-calculation').html(tpl(viewModel));


    /*
    const itemsContainer = $('#side-cart .items');
    itemsContainer.empty();

    state.inCart.forEach(item => {
        const x = menucard.dishes.filter(dish => dish.id === item.dish.id)[0];
        const variant = x.variants.filter(v => v.name === item.dish.variant)[0];
        const price = variant.price;

        itemsContainer.append(`<tr><td>${x.name} (${item.dish.variant})<br><a href="" style="font-size:0.875rem;"><svg style="width: 16px;height:16px;"><use xlink:href="#icon-plus"></use></svg> Még</a>&nbsp;&nbsp;<a href=""><svg style="width: 16px;height:16px;"><use xlink:href="#icon-minus"></use></svg> Nem kérem</a> <a href="">Extrák</a></td><td><button data-duplicate-order-item="${item.timestamp}"><svg><use xlink:href="#icon-plus"></use></svg></button><button data-remove-order-item="${item.timestamp}"><svg><use xlink:href="#icon-minus"></use></svg></button></div></td><td>${price}&nbsp;Ft</td></tr>`);
    });

    if (!state.isEmpty) {
        let sum = state.inCart.reduce((prev, item) => {
            var dish = menucard.dishes.filter(dish => dish.id === item.dish.id)[0];
            const variant = dish.variants.filter(v => v.name === item.dish.variant)[0];
            return prev + variant.price;
        }, 0);

        const deliveryRule = menucard.deliveryFees[state.address.city];

        if (deliveryRule.fix) {
            sum += deliveryRule.fix;
            itemsContainer.append(`<tfoot><tr><td>Kiszállítási díj</td><td colspan="2">${deliveryRule.fix}&nbsp;Ft</td></tr></tfoot>`);
        } else if (deliveryRule.min && sum < deliveryRule.min) {
            itemsContainer.append(`<tfoot><tr><td colspan="3">A minimális ${deliveryRule.min} Ft rendelési értéket még nem érted el.</td></tr></tfoot>`);
        }

        itemsContainer.append(`<tfoot><tr><td>Végösszeg</td><td colspan="2">${sum}&nbsp;Ft</td></tr></tfoot>`);
    }
    */
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

$(document).on('click', 'button[data-add-to-cart]', function (e) {
    const el = $(this);
    const id = el.data('add-to-cart');
    const variant = el.data('variant');

    const type = find(menucard.dishes, d => d.id === id).type;
    const options = find(menucard.dishes, d => d.id === id).options;

    const order = {
        dish: { id, variant },
        timestamp: +new Date()
    };

    // showPizzaModalIfNeeded(type, order)
    // show3KivPizzaModalIfNeeded(type, order)
    // showHamburgerModalIfNeeded(type, order)
    // showOptionsModalIfNeeded(options, order)
    // placeOrderIfEverythingIsFine(order);

    // switch(type) {
    //     case 'pizza':
    //         break;
    //     case '3kiv':
    //         break;
    //     case 'hamburger':
    //         break;
    //
    //     default:
    //         if (options && options.length) {}
    // }

    // if (type === 'pizza') {
    //     // show pizza modal
    // } else if () {} else if (type === 'hamburger') {
    //     // show hamburger modal
    // } else if (options && options.length) {
    //     // // show options modal
    // } else {
    //     shoppingCart.dispatch({ type: 'ADD', dish: { id, variant }, timestamp: +new Date() });
    // }

    shoppingCart.dispatch({ type: 'ADD', dish: { id, variant }, timestamp: +new Date() });

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


document.registerElement('add-to-cart', {
    prototype: Object.create(HTMLElement.prototype, {
        attachedCallback: { value: function() {
            const el = $(this);
            const itemid = el.attr('dishid');
            const dish = menucard.dishes.filter(dish => dish.id === itemid)[0];
            const variants = dish.variants;
            const button = $(`<button data-add-to-cart="${dish.id}" data-variant="${variants[0].name}"><svg class="icon-cart white"><use xlink:href="#icon-cart"></use></svg> Kosárba</button>`);

            if (variants.length > 1) {
                const select = $('<select>' + variants.map(v => `<option value="${v.name}">${v.name} - ${v.price} Ft</option>`) + '</select>').on('change', e => button.data('variant', select.val()));
                el.append(select);
            } else {
                if (variants[0].name) {
                    el.append(`${variants[0].name} - `);
                }

                el.append(`<b>${variants[0].price} Ft</b>`)
            }

            el.append(button);
        }}
    })
});

const dayOfWeek = new Date().getDay() || 7;
$(`#opening-hours dd:nth-of-type(${dayOfWeek}), #opening-hours dt:nth-of-type(${dayOfWeek})`).css({ fontWeight: 700 });

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


/*
Events:
- add-to-cart - directly
- add-to-cart - extras should be chosen
- remove from cart
- duplicate cart item
- reset cart
- restore state
- change address
- change notes
- extra added to order item
- extra removed from order item
- note added to order item
- variant changed in order item
- city changed

Pizza kérdések:
(- Milyen méret?)
- Milyen extra feltétek?

3-kívánság pizza:
- Milyen alap?
- Milyen 3 ingyenes feltét?


Üdítő:
- Milyen méret?

Hamburger:
- Menü vagy sem?
- Milyen burgonya?
- Milyen szósz?

Rántott sajt:
- Milyen burgonya?
- Milyen szósz?

*/

const tracking = require('./tracking');
const page = require('page');

page((context, next) => {
    // console.log(context);
    tracking.pageview();
    next();
});

page();

//
// $.ajax({
//     url: 'https://meexpizza.firebaseio.com/orders.json',
//     type: 'POST',
//     accept: 'application/json',
//     contentType: 'application/json',
//     dataType: 'json',
//     data: JSON.stringify({
//         title: 'TEST',
//         city: 'Gyöngyös',
//         timestamp: { '.sv': 'timestamp' },
//         d: ''+new Date()
//     }),
//     success: (d) => {
//         console.log('SUCC', d);
//     },
//     error: x => {
//         console.log('ERR', x);
//     }
// });


// $.ajax({
//     url: 'https://meexpizza.firebaseio.com/orders.json',
//     data: { auth: 'v1pkhOcxNAyjQZlgj94v79wunDSLwPiFvIuwLfQX', orderBy: '"timestamp"' },
//     type: 'GET',
//     accept: 'application/json',
//     success: (data) => {
//         console.log('succ', data);
//     },
//     error: (e) => {
//         console.log('Error', e);
//     }
// })
