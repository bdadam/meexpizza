import * as polyfills from './polyfills';

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

menuInit();
openingHoursInit();

// console.log(findDishByCategoryAndName('Klasszikus Pizzák', 'Margarita pizza'));
// console.log(findExtrasForDishCategoryAndName('Klasszikus Pizzák', 'Margarita pizza'));
// const x = findExtrasForDishCategoryAndName('Extra pizzák', 'Három kívánság pizza');
// const x = findExtrasForDishCategoryAndName('Klasszikus Pizzák', 'Hawaii pizza');
// console.log(x);

registerFbBox(Vue);
registerGoogleMap(Vue);
registerChooseDetails(Vue);
registerClosedMessage(Vue);
registerAddToCart(Vue);
registerShoppingCarts(Vue);


import { addItem as addItemToOrder } from './order';

let oldOrder;
store.subscribe(() => {
    const order = store.getState().order;
    if (order !== oldOrder) {
        oldOrder = order;
    }
});

const vm = new Vue({
    el: '#app-root',
    data: {
        currentDish: {
            name: '',
            category: '',
            variant: ''
        }
    },
    props: {
        page: 'home',
        secondPage: null,
        pageTransition: null,
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
            this.secondPage = 'choose-details';
            this.pageTransition = 'show-second-page';
        },

        addToCart(product) {
            const dish = findDishByCategoryAndName(product.category, product.name);

            if (Object.keys(dish.variants).length === 1) {
                return addItemToOrder(product);
            }

            this.currentDish.name = product.name;
            this.currentDish.category = product.category;
            this.currentDish.variant = product.variant;
            this.secondPage = 'choose-details';
            this.pageTransition = 'show-second-page';
        },
        productCustomized(product) {
            store.dispatch({ type: 'add-item', product: product, id: Date.now() });
        },
        back() {
            this.pageTransition = null;
        }
    }
});
