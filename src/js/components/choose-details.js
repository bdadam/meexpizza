import startsWith from 'lodash/startsWith';

import { default as html } from './choose-details.html';
import store from '../store';

// import union from 'lodash/union';

// import pick from 'lodash/pick';
// import pickBy from 'lodash/pickBy';
// import includes from 'lodash/includes';

export const register = Vue => {
    Vue.component('choose-details', {
        replace: false,
        props: ['dish'],
        data() {
            return { selectedDish: null, extras: {}, variants: null, availableOptions: [] }
        },
        template: html,
        ready() {
            const state = store.getState();
            const menu = state.menu;
            const menuDish = menu.dishes[this.dish.category][this.dish.name];
            // const options = union(menuDish['Választható'], menu.dishes[this.dish.category]['Választható']);
            const options = menuDish['Választható'] || [];

            this.availableOptions = options;

            this.selectedDish = Object.assign({}, this.dish, { extras: {} });
            this.extras = {};

            options.forEach(o => {
                const keys = Object.keys(menu.extras);
                keys.forEach(key => {
                    if (startsWith(key, o)) {
                        this.extras[key] = menu.extras[key];
                    }
                });
            });

            this.variants = Object.assign({}, menuDish['Árak']);
        },
        methods: {
            add() {
                console.log(this.selectedDish);
                this.$emit('product-customized', { product: this.selectedDish });
                this.$emit('done');
            },
            cancel() {
                this.$emit('done');
            }
        },

        computed: {
            allExtras() {
                console.log(store.getState().menu.extras);
                return store.getState().menu.extras;
            },
            // selectedExtras() {
            //     return this.extras
            // },
            total() {
                const state = store.getState();
                const menu = state.menu;
                const menuDish = menu.dishes[this.dish.category][this.dish.name];

                const basePrice = menuDish['Árak'][this.selectedDish.variant];
                let extraPrice = 0;

                Object.keys(this.selectedDish.extras).forEach(key => {
                    Object.keys(this.selectedDish.extras[key]).forEach(extraKey => {
                        if(this.selectedDish.extras[key][extraKey].selected) {
                            extraPrice += menu.extras[key].price;
                        }
                    });
                });

                return basePrice + extraPrice;
            }
        }
    });
};
