import { default as html } from './shopping-cart.html';

export const register = Vue => {
    Vue.component('shopping-cart', {
        replace: false,
        template: html
    });

    Vue.component('mini-shopping-cart', {
        replace: false,
        template: 'mini-shopping-cart'
    });
};
