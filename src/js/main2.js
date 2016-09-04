import { default as lazysizes } from 'lazysizes/lazysizes';

import Vue from 'vue';

import store from './store';

import { default as fullMenu } from '../../data/test.yaml';

import { register as registerFbBox } from './components/fb-box';
import { register as registerGoogleMap } from './components/google-map';
import { register as registerChooseDetails } from './components/choose-details';

registerFbBox(Vue);
registerGoogleMap(Vue);
registerChooseDetails(Vue);

store.dispatch({
    type: 'full-menu-loaded',
    fullMenu
});

const AddToCart = Vue.component('add-cart', {
    props: ['prices', 'category', 'name', 'productid'],
    replace: false,
    template: '<select class="variant-selector" v-model="selectedVariant" v-if="hasMultiVariants"><option v-for="(variant, price) in prices" :value="variant">{{ variant }} - {{ price }} Ft</option></select><span v-if="!hasMultiVariants">{{ singlePrice }} Ft</span><button @click.prevent="addToCart"><svg class="icon-cart" style="fill: white;"><use xlink:href="#icon-cart"></use></svg> Kosárba vele</button>',
    created() {
        this.selectedVariant = Object.keys(this.prices)[0];
        this.singlePrice = this.prices[this.selectedVariant];

        // console.log(this.productid);
    },
    computed: {
        hasMultiVariants() {
            return Object.keys(this.prices).length > 1;
        }
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart', { category: this.category, name: this.name, variant: this.selectedVariant });
        }
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
