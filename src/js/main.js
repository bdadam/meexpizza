require('es6-object-assign').polyfill();
require('lazysizes/lazysizes');
require('document-register-element');

require('./navi').init();
require('./social');
require('./google-map');

const Vue = require('vue');
const page = require('page');
const redux = require('redux');
const flatMap = require('lodash/flatMap');
const find = require('lodash/find');
const $ = require("jquery");

const tracking = require('./tracking');

page((context, next) => {
    tracking.pageview();
    next();
});

const menucard = require('../../data/menucard2.generated');

var defaultState = {
    inCart: [],
    serializedForm: '',
    isEmpty: true,
    address: { city: 'Gyöngyös' }
};

const shoppingCart = redux.createStore((state = defaultState, action) => {
    let newState = defaultState;

    switch(action.type) {
        // case 'ADD':
        //     newState = Object.assign({}, state, { inCart: [...state.inCart, { dish: action.dish, timestamp: action.timestamp }] });
        //     break;
        case 'ADD_ORDER_ITEM':

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

    newState.isEmpty = newState.inCart.length === 0;
    newState.deliveryFee = menucard.deliveryFees[newState.address.city].fix || 0;
    newState.deliveryFreeFrom = menucard.deliveryFees[newState.address.city].min || 0;

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
            const dishFromCard = find(menucard.dishes, dish => dish.id === item.dishId);
            if (dishFromCard) {
                return { id: item.timestamp, name: `${dishFromCard.name} (${item.variant})`, price: find(dishFromCard.variants, v => v.name === item.variant).price };
            }
        }),
        deliveryFee: menucard.deliveryFees[state.address.city].fix || 0,
        minForFreeDelivery: menucard.deliveryFees[state.address.city].min || 0
    };

    viewModel.total = viewModel.lines.reduce((prev, l) => prev + l.price, 0) + viewModel.deliveryFee;
    viewModel.minTotalNotReached = viewModel.total < viewModel.minForFreeDelivery;
    viewModel.showMinForFreeDeliveryMessage = state.inCart.length > 0 && viewModel.minTotalNotReached;

    var tpl = require('mustache!./templates/shopping-cart.html');
    $('.cart-calculation').html(tpl(viewModel));
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
    const id = el.data('id');
    const variant = el.data('variant');
    const dish = find(menucard.dishes, d => d.id === id);

    const orderItem = {
        dishId: id,
        variant,
        extras: [],
        timestamp: +new Date()
    };

    // TODO: pizza-3-free-options

    if (dish.type !== 'none' || (dish.options && dish.options.length)) {
        showDishOptionsModal(orderItem);
    } else {
        shoppingCart.dispatch({ type: 'ADD_ORDER_ITEM', orderItem });
    }
});


const LocalStorage = {
    read: (key, defaultValue = '') => {
        try {
            return localStorage.getItem(key) || defaultValue;
        } catch(ex) { return defaultValue; }
    },

    readJson: (key, defaultObject = null) => {
        try {
            return JSON.parse(localStorage.getItem(key)) || defaultObject;
        } catch(ex) {
            return defaultObject;
        }
    },

    write: (key, value) => {
        try {
            localStorage.setItem(key, value);
        } catch(ex) {}
    },

    writeJson: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch(ex) {}
    }
};

const shoppingCartModel = new Vue({
    el: '#shopping-cart-placeholder',
    template: require('html!./templates/shop-cart.html'),
    data: {
        availableCities: Object.keys(menucard.deliveryFees),
        items: LocalStorage.readJson('items', []),
        address: {
            name: LocalStorage.read('name'),
            city: LocalStorage.read('city'),
            street: LocalStorage.read('street'),
            phone: LocalStorage.read('phone')
        },
        notes: LocalStorage.read('notes')
    },

    watch: {
        'address.city': _ => LocalStorage.write('city', shoppingCartModel.address.city),
        'address.name': _ => LocalStorage.write('name', shoppingCartModel.address.name),
        'address.street': _ => LocalStorage.write('street', shoppingCartModel.address.street),
        'address.phone': _ => LocalStorage.write('phone', shoppingCartModel.address.phone),
        notes: _ => LocalStorage.write('notes', shoppingCartModel.notes),
        items: _ => LocalStorage.writeJson('items', shoppingCartModel.items)
    },

    computed: {
        visibleItems: function() {
            return this.items.map(item => {
                const dish = find(menucard.dishes, d => d.id === item.dishId);
                const variant = item.variant;
                const price = find(dish.variants, v => v.name === item.variant).price;
                const extras = item.extras;
                return { dish, variant, price, extras };
            });
        },
        totalPrice: function() {
            return this.items.map(item => {
                const dish = find(menucard.dishes, d => d.id === item.dishId);
                const variant = item.variant;
                const price = find(dish.variants, v => v.name === item.variant).price;
                const extras = item.extras;

                return price + extras.reduce((prevSum, cur) => prevSum + cur.price, 0);
            }).reduce((prevSum, cur) => prevSum + cur);
        },
        deliveryFee: _ => 800
    },

    methods: {
        addOrderItem: item => {
            shoppingCartModel.items.push(item);
        },
        removeOrderItem: id => {

        },
        duplicateOrderItem: id => {
            let idx;
            let itemToDuplicate;

            


            // shoppingCartModel.items.forEach((i, index) => {
            //     console.log(i, index);
            //     if (i.timestamp === id) {
            //         idx = index;
            //         itemToDuplicate = i;
            //     }
            // });

            // console.log(idx, itemToDuplicate);

            // if (idx >= 0 && itemToDuplicate) {
            //     const newItem = Object.assign({}, itemToDuplicate, { timestamp: +new Date() });
            //     shoppingCartModel.items.splice(idx, 0, newItem);
            // }
        },
        clear: _ => {},

        submitOrder: _ => {
            console.log(shoppingCartModel.address);
            console.log(shoppingCartModel.items);
        }
    }
});

const dishOptionsModalHtml = require('html!./templates/dish-options-modal.html');
const modal = require('./modal');

const showDishOptionsModal = order => {
    const dish = find(menucard.dishes, d => d.id === order.dishId);
    const m = modal.show(dishOptionsModalHtml);
    const model = new Vue({
        el: m.el,
        data: {
            dish: dish,
            order: order
        },

        computed: {
            availableExtras: () => {
                if (dish.type === 'pizza') {
                    return menucard.pizzaExtras;
                }

                if (dish.type === 'hamburger') {
                    return menucard.hamburgerExtras;
                }

                return [];
            },
            totalPrice: function () {
                const base = find(dish.variants, v => v.name === order.variant).price;
                const extras = order.extras.reduce((prev, curr) => curr.price + prev, 0);
                return base + extras;
            }
        },

        methods: {
            addExtra: (category, name, price) => {
                const alreadyAdded = order.extras.filter(x => x.category === category && x.name === name).length > 0;
                if (!alreadyAdded) {
                    order.extras.push({ category, name, price });
                }
            },
            removeExtra: (extra) => {
                order.extras = order.extras.filter(ex => ex.name !== extra.name || ex.category !== extra.category);
            },
            cancel: () => {
                modal.hide();
                model.$destroy();
            },
            addToCart: () => {
                shoppingCart.dispatch({ type: 'ADD_ORDER_ITEM', order: model.order });
                shoppingCartModel.addOrderItem(model.order);
                modal.hide();
                model.$destroy();
            }
        }
    });
};


const dayOfWeek = new Date().getDay() || 7;
$(`.opening-hours dd:nth-of-type(${dayOfWeek}), .opening-hours dt:nth-of-type(${dayOfWeek})`).css({ fontWeight: 700 });

const isDeliveryClosedNow = (now = new Date()) => {
    const day = now.getDay();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    const openingHours = [
        [1030, 2030], // Sunday
        [11030, 12130], // Monday
        [21030, 22130],
        [31030, 32130],
        [41030, 42130],
        [51030, 52230],
        [61030, 62230]
    ];

    const num = day * 10000 + hours * 100 + minutes;

    for (let day of openingHours) {
        if (num >= day[0] && num <= day[1]) {
            return false;
        }
    }

    return true;
};



// Vue.component('preorder-warning', {
//     template: '<p x-v-if="!closed">Éttermünk jelenleg zárva van. Kiszállítást csak a következő nyitás után tudunk vállalni.</p>',
//     computed: { closed: isDeliveryClosedNow }
// });


// var MyComponent = Vue.extend({
//     template: '<div>A custom component!</div>'
// });
//
// Vue.component('preorder-warning', MyComponent);
//
// new Vue({
//   el: 'body'
// })


// setTimeout(() => {
//
// Vue.component('preorder-warning', {
//   template: '<div>A custom component!</div>'
// });
// }, 2000);

// setInterval(_ => {
//
//
//
// }, 1000);

// console.log(isDeliveryClosedNow(new Date(2016, 1, 26, 22, 31)));

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



// $.ajax({
//     url: 'https://meexpizza.firebaseio.com/orders.json',
//     type: 'PUT',
//     accept: 'application/json',
//     contentType: 'application/json',
//     dataType: 'json',
//     data: JSON.stringify({
//         name: '-KAVQ_7P8Z1TldJR_eXz',
//         title: 'TEST2',
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
//


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


// const showPizzaModal = (id, variant) => {
//     const Vue = require('vue');
//     const html = require('html!./templates/pizza-extras-modal.html');
//     const modal = require('./modal');
//
//     const dish = menucard.dishes.filter(d => d.id === id)[0];
//
//     const m = modal.show(html);
//     const model = window.model = new Vue({
//         el: m.el,
//         data: {
//             selectedExtras: [],
//             sizes: [],
//             selectedSize: '',
//             variants: dish.variants,
//             selectedVariant: variant,
//             imageName: dish.imageName,
//
//             name: dish.name,
//             description: dish.description
//         },
//
//         computed: {
//             availableExtras: () => {
//                 return menucard.pizzaExtras;
//             },
//             totalPrice: function () {
//                 const selectedVariant = this.selectedVariant;
//                 const basePrice = this.variants.filter(v => v.name === selectedVariant)[0].price;
//                 const extraPrice = this.selectedExtras.reduce((prev, curr) => curr.price + prev, 0);
//                 return basePrice + extraPrice;
//             }
//         },
//
//         methods: {
//             addExtra: (category, name, price) => {
//                 const alreadyAdded = model.selectedExtras.filter(x => x.category === category && x.name === name).length > 0;
//                 if (!alreadyAdded) {
//                     model.selectedExtras.push({ category, name, price });
//                 }
//             },
//             removeExtra: (extra) => {
//                 model.selectedExtras = model.selectedExtras.filter(ex => ex.name !== extra.name || ex.category !== extra.category);
//             },
//             cancel: () => {
//                 modal.hide();
//                 model.$destroy();
//             },
//             addToCart: () => {
//                 shoppingCart.dispatch({ type: 'ADD', dish: { id, variant: model.selectedVariant, extras: model.selectedExtras.map(ex => ({ name: ex.name, category: ex.category })) }, timestamp: +new Date() });
//                 modal.hide();
//                 model.$destroy();
//             }
//         }
//     });
// };
//
// const showHamburgerModal = (id, variant) => {
//
// };
