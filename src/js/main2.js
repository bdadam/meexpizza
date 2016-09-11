import polyfillPromise from 'es6-promise';
polyfillPromise.polyfill();
import './polyfills';
import 'whatwg-fetch';

import { default as lazysizes } from 'lazysizes/lazysizes';
import Vue from 'vue';
import store from './store';

import { register as registerFbBox } from './components/fb-box';
import { register as registerGoogleMap } from './components/google-map';
import { register as registerChooseDetails } from './components/choose-details';
import { register as registerClosedMessage } from './components/closed-message';
import { register as registerAddToCart } from './components/add-to-cart';
import { register as registerShoppingCarts } from './components/shopping-cart';

import { init as openingHoursInit } from './opening-hours';
import { findDishByCategoryAndName, findExtrasForDishCategoryAndName, init as menuInit } from './menu';
import { addItem as addItemToCart, init as orderInit } from './order';

menuInit();
openingHoursInit();

const orderToRestore = JSON.parse(localStorage.getItem('order'));
orderInit(orderToRestore);

registerFbBox(Vue);
registerGoogleMap(Vue);
registerChooseDetails(Vue);
registerClosedMessage(Vue);
registerAddToCart(Vue);
registerShoppingCarts(Vue);

store.subscribe(() => {
    try {
        localStorage.setItem('order', JSON.stringify(store.getState().order));
    } catch(ex) {
        console.warn('Order not written to localStorage');
    }
});


const vm = new Vue({
    el: '#app-root',
    data: {
        currentDish: {
            name: '',
            category: '',
            variant: ''
        },
        orderItemCount: 0
    },
    props: {
        page: 'home',
        secondPage: null,
        pageTransition: null,
    },
    ready() {
        const onsub = () => {
            const state = store.getState();
            this.orderItemCount = state.order.items.length;

        };

        store.subscribe(onsub);
        onsub();
    },
    methods: {
        add(product) {
            const orderItemId = Date.now();
            const dishOnMenu = store.getState().menu.dishes[product.category][product.name];
            const hasOptions = dishOnMenu['Választható'] && dishOnMenu['Választható'].length > 0;

            if (!hasOptions) {
                return store.dispatch({ type: 'add-item', product, orderItemId });
            }

            this.showPage('choose-details', { product, orderItemId });
        },

        showPage(page, attributes) {
            this.secondPage = page;
            this.pageTransition = 'show-second-page';
        },

        addToCart(product) {
            const dish = findDishByCategoryAndName(product.category, product.name);

            if (Object.keys(dish.variants).length === 1) {
                return addItemToCart(product);
            }

            this.currentDish.name = product.name;
            this.currentDish.category = product.category;
            this.currentDish.variant = product.variant;
            // this.secondPage = 'choose-details';
            // this.secondPage = 'shopping-cart';
            // this.pageTransition = 'show-second-page';
            this.showPage('choose-details');
        },
        showCart() {
            this.showPage('shopping-cart');
        },
        productSelected(selection) {
            addItemToCart(selection);
        },
        back() {
            this.pageTransition = null;
        }
    }
});
