import { default as lazysizes } from 'lazysizes/lazysizes';

import Vue from 'vue';
import store from './store';
import { default as fullMenu } from '../../data/test.yaml';

import { register as registerFbBox } from './components/fb-box';
import { register as registerGoogleMap } from './components/google-map';
import { register as registerChooseDetails } from './components/choose-details';
import { register as registerClosedMessage } from './components/closed-message';
import { register as registerAddToCart } from './components/add-to-cart';
import { register as registerShoppingCarts } from './components/shopping-cart';

store.dispatch({
    type: 'full-menu-loaded',
    fullMenu
});

// console.log(fullMenu);

registerFbBox(Vue);
registerGoogleMap(Vue);
registerChooseDetails(Vue);
registerClosedMessage(Vue);
registerAddToCart(Vue);
registerShoppingCarts(Vue);

// Vue.component('change-variant', {
//     replace: false,
//     props: ['category', 'name', 'variant'],
//     data() { return { variants: {} }; },
//     template: 'CHOOSE VARIANT <select v-model="variant"><option v-for="(v, price) in variants" value="v">{{ v }} - {{ price }} Ft</option></select>',
//     ready() {
//         // this.variants = store.getState().menu.dishes[this.category][this.name]['Árak'];
//     }
// });

const createOrder = (order = {}) => {
    return {
        id: order.id || Date.now(),
    };
};

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
            this.currentDish.name = product.name;
            this.currentDish.category = product.category;
            this.currentDish.variant = product.variant;

            const dishOnMenu = store.getState().menu.dishes[this.currentDish.category][this.currentDish.name];
            if (dishOnMenu['Választható'] && dishOnMenu['Választható'].length > 0) {
                this.secondPage = 'choose-details';
                this.pageTransition = 'show-second-page';
            } else {
                store.dispatch({ type: 'add-item', product: dishOnMenu, id: Date.now() })
            }
        },
        productCustomized(product) {
            store.dispatch({ type: 'add-item', product: product, id: Date.now() });
        },
        back() {
            this.pageTransition = null;
        }
    }
});
