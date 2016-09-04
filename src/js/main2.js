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
    props: ['prices', 'category', 'name'],
    replace: false,
    template: '<select v-model="selectedVariant" v-if="hasMultiVariants"><option v-for="(variant, price) in prices" :value="variant">{{ variant }} - {{ price }} Ft</option></select><span v-if="!hasMultiVariants">{{ singlePrice }} Ft</span><button @click.prevent="addToCart">Kosárba vele</button>',
    created() {
        this.selectedVariant = Object.keys(this.prices)[0];
        this.singlePrice = this.prices[this.selectedVariant];
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
        back() {
            // this.secondPage = null;
            this.pageTransition = null;
        }
    }
});
