import { default as html } from './shopping-cart.html';

import store from '../store';

import merge from 'lodash/merge';

import { duplicateItem, removeItem } from '../order';

export const register = Vue => {
    Vue.component('shopping-cart', {
        replace: false,
        template: html,
        data() { return { order: [] }; },
        ready() {
            store.subscribe(() => {
                this.order = merge({}, store.getState().order);
            });
        },

        methods: {
            duplicate(item) {
                duplicateItem(item);
            },

            remove(item) {
                removeItem(item);
            }
        }
    });

    Vue.component('mini-shopping-cart', {
        replace: false,
        template: 'mini-shopping-cart'
    });
};
