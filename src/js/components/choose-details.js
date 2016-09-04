import startsWith from 'lodash/startsWith';

import { default as html } from './choose-details.html';
import store from '../store';

// import pick from 'lodash/pick';
// import pickBy from 'lodash/pickBy';
// import includes from 'lodash/includes';

export const register = Vue => {
    Vue.component('choose-details', {
        replace: false,
        props: ['dish'],
        data() {
            return { selectedDish: null, extras: {}, variants: null }
        },
        template: html,
        ready() {
            const state = store.getState();
            const menu = state.menu;
            const menuDish = menu.dishes[this.dish.category][this.dish.name];
            const options = menuDish['Választható'] || [];

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
                this.$emit('done');
            },
            cancel() {
                this.$emit('done');
            }
        }
    });
};
