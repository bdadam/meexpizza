// require('es6-object-assign').polyfill();
// require('document-register-element');
//
// require('./navi').init();
// require('./social');
// require('./google-map');
//

// import Vue from 'vue';

// const Vue = require('vue');
const page = require('page');
// const redux = require('redux');
// const flatMap = require('lodash/flatMap');
// const find = require('lodash/find');
// const $ = require("jquery");
//
// const tracking = require('./tracking');
//
// page((context, next) => {
//     tracking.pageview();
//     next();
// });
//
// const menucard = require('../../data/menucard2.generated');
//
//
// const defaultState = { items: [] };
//
// const shoppingCartStore = redux.createStore((state = defaultState, action) => {
//     switch(action.type) {
//         case 'ADD':
//             const q = Object.assign({}, action.item);
//             // console.log([...state.items]);
//             // console.log([...state.items, Object.assign({}, action.item)]);
//             // const newItems = state.items.slice(0);
//             // newItems.push(Object.assign({}, action.item));
//             //
//             // const x = Object.assign({}, state, { items: newItems });
//             // console.log(x);
//
//             const x = Object.assign({}, state, { items: [...state.items, Object.assign({}, action.item)] });
//             return x;
//         case 'REMOVE':
//             return Object.assign({}, state, { items: state.items.filter(i => i.timestamp !== action.timestamp) });
//         case 'DUPLICATE':
//             return Object.assign({}, state, {
//                 items: flatMap(state.items, item => {
//                                     return item.timestamp !== action.timestamp
//                                         ? item
//                                         : [item, Object.assign({}, item, { timestamp: +new Date() })];
//                                     })
//                                 });
//         case 'RESTORE':
//             return Object.assign({}, state, { items: action.items || [] });
//         // case 'REPLACE':
//         case 'CLEAR':
//         case 'ORDER_SUCCESS':
//             return defaultState;
//         default:
//             return state;
//     }
// });
//
// shoppingCartStore.dispatch({ type: 'INIT' });
//
// $(document).on('click', 'button[data-add-to-cart]', function (e) {
//     const el = $(this);
//     const id = el.data('id');
//     const variant = el.data('variant');
//     const dish = find(menucard.dishes, d => d.id === id);
//     const type = dish.type;
//
//     const orderItem = {
//         dishId: id,
//         variant,
//         extras: [],
//         type,
//         timestamp: +new Date()
//     };
//
//     // TODO: pizza-3-free-options
//
//     if (dish.type !== 'none' || (dish.options && dish.options.length)) {
//         showDishOptionsModal(orderItem);
//     } else {
//         shoppingCartStore.dispatch({ type: 'ADD', item: orderItem });
//     }
// });
//
//
// const LocalStorage = require('./localStorage');
//
// const savedItems = LocalStorage.readJson('items');
// shoppingCartStore.dispatch({ type: 'RESTORE', items: savedItems });

// const shoppingCartTemplate = require('./templates/shop-cart.html');

// import shoppingCartTemplate from './templates/shop-cart.html';
// import orderModalHtml from './templates/order-modal.html';

// const shoppingCartModel = new Vue({
//     el: '#shopping-cart-placeholder',
//     template: shoppingCartTemplate,
//     data: {
//         availableCities: Object.keys(menucard.deliveryFees),
//         items: shoppingCartStore.getState().items,
//         address: {
//             name: LocalStorage.read('name'),
//             city: LocalStorage.read('city'),
//             street: LocalStorage.read('street'),
//             phone: LocalStorage.read('phone')
//         },
//         notes: LocalStorage.read('notes')
//     },
//
//     watch: {
//         'address.city': _ => LocalStorage.write('city', shoppingCartModel.address.city),
//         'address.name': _ => LocalStorage.write('name', shoppingCartModel.address.name),
//         'address.street': _ => LocalStorage.write('street', shoppingCartModel.address.street),
//         'address.phone': _ => LocalStorage.write('phone', shoppingCartModel.address.phone),
//         notes: _ => LocalStorage.write('notes', shoppingCartModel.notes),
//         items: _ => LocalStorage.writeJson('items', shoppingCartModel.items)
//     },
//
//     computed: {
//         visibleItems: function() {
//             return this.items.map(item => {
//                 const dish = find(menucard.dishes, d => d.id === item.dishId);
//                 const variant = item.variant;
//                 const price = find(dish.variants, v => v.name === item.variant).price;
//                 const extras = item.extras;
//                 const timestamp = item.timestamp;
//
//                 return { dish, variant, price, extras, timestamp };
//             });
//         },
//         totalPrice: function() {
//             const x = this.items.map(item => {
//                 const dish = find(menucard.dishes, d => d.id === item.dishId);
//                 const variant = item.variant;
//                 const price = find(dish.variants, v => v.name === item.variant).price;
//                 const extras = item.extras;
//                 const sumExtras = extras.reduce((prevSum, cur) => prevSum + cur.price, 0);
//                 return price + sumExtras;
//             }).reduce((prevSum, cur) => {
//                 return prevSum + cur;
//             }, 0) + this.deliveryFee;
//
//             return x;
//         },
//         deliveryFee: function() {
//             if (!this.address.city) {
//                 return 0;
//             }
//
//             return menucard.deliveryFees[this.address.city].fix || 0;
//         },
//         minOrderValue: function() {
//             return menucard.deliveryFees[this.address.city].min || 0;
//         },
//
//         orderToSubmit: function() {
//             const address = this.address;
//             const deliveryFee = this.deliveryFee;
//             const totalPrice = this.totalPrice;
//             const items = this.visibleItems.map(item => ({
//                 name: item.dish.name,
//                 variant: item.variant,
//                 price: item.price,
//                 extras: item.extras.map(extra => ({ name: extra.name, price: extra.price }))
//             }));
//
//             return { address, deliveryFee, totalPrice, items };
//         }
//     },
//
//     methods: {
//         addOrderItem: item => {
//             shoppingCartModel.items.push(item);
//         },
//         removeOrderItem: timestamp => {
//             shoppingCartStore.dispatch({ type: 'REMOVE', timestamp });
//         },
//         duplicateOrderItem: timestamp => {
//             shoppingCartStore.dispatch({ type: 'DUPLICATE', timestamp });
//         },
//         clear: _ => {
//             shoppingCartStore.dispatch({ type: 'CLEAR' });
//         },
//
//         submitOrder: _ => {
//             // var orderModalHtml = require('./templates/order-modal.html');
//             // var orderModalHtml = require('./templates/order-modal.html');
//             const m = modal.show(orderModalHtml);
//             const model = new Vue({
//                 el: m.el,
//                 data: {
//                     orderPending: true,
//                     orderSuccess: false,
//                     orderError: false
//                 },
//                 methods: {
//                     succeed: () => {
//                         model.orderSuccess = true;
//                         model.orderPending = false;
//                         model.orderError = false;
//                     },
//                     error: () => {
//                         model.orderError = true;
//                         model.orderPending = false;
//                         model.orderSuccess = false;
//                     },
//                     close: () => {
//                         modal.hide();
//                         model.$destroy();
//                     }
//                 }
//             });
//
//             const data = shoppingCartModel.orderToSubmit;
//             data.timestamp = { '.sv': 'timestamp' };
//
//             $.ajax({
//                 url: 'https://meexpizza.firebaseio.com/orders.json',
//                 type: 'POST',
//                 accept: 'application/json',
//                 contentType: 'application/json',
//                 dataType: 'json',
//                 data: JSON.stringify(data),
//                 success: (d) => {
//                     model.succeed();
//                     shoppingCartStore.dispatch({ type: 'ORDER_SUCCESS' });
//                 },
//                 error: x => {
//                     model.error();
//                     shoppingCartStore.dispatch({ type: 'ORDER_ERROR' });
//                 }
//             });
//
//         }
//     }
// });
//
// shoppingCartStore.subscribe(_ => {
//     const state = shoppingCartStore.getState();
//     Vue.set(shoppingCartModel, 'items',  state.items);
// });
