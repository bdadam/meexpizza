import { default as lazysizes } from 'lazysizes/lazysizes';

import Vue from 'vue';
import store from './store';
import { default as fullMenu } from '../../data/test.yaml';

import { register as registerFbBox } from './components/fb-box';
import { register as registerGoogleMap } from './components/google-map';
import { register as registerChooseDetails } from './components/choose-details';
import { register as registerClosedMessage } from './components/closed-message';
import { register as registerAddToCart } from './components/add-to-cart';

store.dispatch({
    type: 'full-menu-loaded',
    fullMenu
});

registerFbBox(Vue);
registerGoogleMap(Vue);
registerChooseDetails(Vue);
registerClosedMessage(Vue);
registerAddToCart(Vue);

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
        addToCart(product) {
            this.currentDish.name = product.name;
            this.currentDish.category = product.category;
            this.currentDish.variant = product.variant;

            this.secondPage = 'choose-details';
            this.pageTransition = 'show-second-page';
        },
        productCustomized(product) {
            console.log('cust', product);
        },
        back() {
            // this.secondPage = null;
            this.pageTransition = null;
        }
    }
});
