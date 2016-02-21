require('es6-object-assign').polyfill();
// require('lazysizes/lazysizes');
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

const defaultState = { items: [] };

const shoppingCartStore = redux.createStore((state = defaultState, action) => {

    switch(action.type) {
        case 'ADD':
            return Object.assign({}, state, { items: [...state.items, Object.assign({}, action.item)] });
        case 'REMOVE':
            return Object.assign({}, state, { items: state.items.filter(i => i.timestamp !== action.timestamp) });
        case 'DUPLICATE':
            return Object.assign({}, state, {
                items: flatMap(state.items, item => {
                                    return item.timestamp !== action.timestamp
                                        ? item
                                        : [item, Object.assign({}, item, { timestamp: +new Date() })];
                                    })
                                });
        case 'RESTORE':
            return Object.assign({}, state, { items: action.items });
        // case 'REPLACE':

        case 'CLEAR':
        // case 'ORDER_SUCCEEDED':
            return defaultState;
        default:
            return state;
    }
});

shoppingCartStore.dispatch({ type: 'INIT' });

$(document).on('click', 'button[data-add-to-cart]', function (e) {
    const el = $(this);
    const id = el.data('id');
    const variant = el.data('variant');
    const dish = find(menucard.dishes, d => d.id === id);
    const type = dish.type;

    const orderItem = {
        dishId: id,
        variant,
        extras: [],
        type,
        timestamp: +new Date()
    };

    // TODO: pizza-3-free-options

    if (dish.type !== 'none' || (dish.options && dish.options.length)) {
        showDishOptionsModal(orderItem);
    } else {
        shoppingCartStore.dispatch({ type: 'ADD', item: orderItem });
    }
});


const LocalStorage = require('./localStorage');

const savedItems = LocalStorage.readJson('items');
shoppingCartStore.dispatch({ type: 'RESTORE', items: savedItems });


const shoppingCartTemplate = require('./templates/shop-cart.html');

const shoppingCartModel = new Vue({
    el: '#shopping-cart-placeholder',
    template: shoppingCartTemplate,
    data: {
        availableCities: Object.keys(menucard.deliveryFees),
        items: shoppingCartStore.getState().items,
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
                const timestamp = item.timestamp;

                return { dish, variant, price, extras, timestamp };
            });
        },
        totalPrice: function() {
            const x = this.items.map(item => {
                const dish = find(menucard.dishes, d => d.id === item.dishId);
                const variant = item.variant;
                const price = find(dish.variants, v => v.name === item.variant).price;
                const extras = item.extras;
                const sumExtras = extras.reduce((prevSum, cur) => prevSum + cur.price, 0);
                return price + sumExtras;
            }).reduce((prevSum, cur) => {
                return prevSum + cur;
            }, 0) + this.deliveryFee;

            return x;
        },
        deliveryFee: function() {
            if (!this.address.city) {
                return 0;
            }

            return menucard.deliveryFees[this.address.city].fix || 0;
        },
        minOrderValue: function() {
            return menucard.deliveryFees[this.address.city].min || 0;
        },

        orderToSubmit: function() {
            const address = this.address;
            const deliveryFee = this.deliveryFee;
            const totalPrice = this.totalPrice;

            debugger;

            const items = this.visibleItems.map(item => ({
                name: item.dish.name,
                variant: item.variant,
                price: item.price,
                extras: item.extras.map(extra => ({ name: extra.name, price: extra.price }))
            }));

            console.log(items);

            return { address, deliveryFee, totalPrice, items };
        }
    },

    methods: {
        addOrderItem: item => {
            shoppingCartModel.items.push(item);
        },
        removeOrderItem: timestamp => {
            shoppingCartStore.dispatch({ type: 'REMOVE', timestamp });
        },
        duplicateOrderItem: timestamp => {
            shoppingCartStore.dispatch({ type: 'DUPLICATE', timestamp });
        },
        clear: _ => {
            shoppingCartStore.dispatch({ type: 'CLEAR' });
        },

        submitOrder: _ => {
            // console.log(shoppingCartModel.$data.address);
            // console.log(shoppingCartModel.$data.items);

            $.ajax({
                url: 'https://meexpizza.firebaseio.com/orders.json',
                type: 'POST',
                accept: 'application/json',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify(shoppingCartModel.orderToSubmit),
                // data: JSON.stringify({
                //     address: shoppingCartModel.address,
                //     items: shoppingCartModel.visibleItems,
                //     deliveryFee: shoppingCartModel.deliveryFee,
                //     totalPrice: shoppingCartModel.totalPrice
                // }),
                success: (d) => {
                    console.log('SUCC', d);
                },
                error: x => {
                    console.log('ERR', x);
                }
            });

        }
    }
});

shoppingCartStore.subscribe(_ => {
    const state = shoppingCartStore.getState();
    Vue.set(shoppingCartModel, 'items',  state.items);
});

const dishOptionsModalHtml = require('./templates/dish-options-modal.html');
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
                shoppingCartStore.dispatch({ type: 'ADD', item: model.order });
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

/*
3-kívánság pizza:
- Milyen alap?
- Milyen 3 ingyenes feltét?
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
