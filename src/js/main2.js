import { default as lazysizes } from 'lazysizes/lazysizes';

import Vue from 'vue';

import store from './store';

import { default as fullMenu } from '../../data/test.yaml';

import { register as registerFbBox } from './components/fb-box';
import { register as registerGoogleMap } from './components/google-map';

registerFbBox(Vue);
registerGoogleMap(Vue);

// store.subscribe(() => {
//     const menu = store.getState().menu;
//     console.log(menu);
// });

store.dispatch({
    type: 'full-menu-loaded',
    fullMenu
});




const AddToCart = Vue.component('add-cart', {
    props: ['prices', 'category', 'name'],
    replace: false,
    template: '<select v-model="selectedVariant"><option v-for="(variant, price) in prices" :value="variant">{{ variant }} - {{ price }} Ft</option></select><button @click.prevent="addToCart">Kosárba vele</button>',
    created() {
        this.selectedVariant = Object.keys(this.prices)[0];
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart', { category: this.category, name: this.name, variant: this.selectedVariant });
        }
    }
});

const PizzaDetails = Vue.component('pizza-details', {
    replace: false,
    props: ['name', 'category'],
    template: '<h1>Pizza</h1><button @click="back">Back</button>',
    methods: {
        back() {
            this.$emit('done');
        }
    }
});

const ChooseDetails = Vue.component('choose-details', {
    replace: false,
    props: ['dish'],
    template: '<h1>{{ dish.name }} {{ dish.category }} {{ dish.variant }}</h1><button @click="cancel">Back</button>',
    ready() {
        const menu = store.getState().menu;
        const menuDish = menu[this.dish.category][this.dish.name];
        const options = menuDish['Választható'];

        console.log(menuDish, options);
    },
    methods: {
        add() {},
        cancel() {
            this.$emit('done');
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

            console.log('ADD', product);
            this.secondPage = 'choose-details';
            this.pageTransition = 'show-second-page';
        },
        back() {
            // this.secondPage = null;
            this.pageTransition = null;
        }
    }
});
