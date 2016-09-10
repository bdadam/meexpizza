import { default as html } from './shopping-cart.html';

import store from '../store';

import merge from 'lodash/merge';

import { duplicateItem, removeItem, updateAddress, validateOrder } from '../order';

export const register = Vue => {
    Vue.component('shopping-cart', {
        replace: false,
        template: html,
        data() {
            return { order: [], address: { city: 'Gyöngyös', name: '', phone: '', street: '', notes: '' } };
        },
        ready() {
            const state = store.getState();
            this.order = merge({}, state.order);
            this.address = merge({}, state.order.address);

            store.subscribe(() => {
                const state = store.getState();
                this.order = merge({}, state.order);
                this.address = merge({}, state.order.address);
            });
        },

        computed: {
            isEmpty() {
                return !this.order || !this.order.items || this.order.items.length <= 0;
            }
        },

        methods: {
            duplicate(item) {
                duplicateItem(item);
            },

            remove(item) {
                removeItem(item);
            },

            updateAddress() {
                updateAddress(this.address);
            },

            validate() {
                const isAddressValid = this.address && this.address.city && this.address.phone && this.address.name && this.address.street;
                const isOrderValid = validateOrder(this.order);

                return isAddressValid && isOrderValid;
            },

            submitOrder() {
                if (!this.validate()) {
                    return console.log('BLEHH');
                }

                // $.ajax({
                //     url: 'https://meexpizza.firebaseio.com/orders.json',
                //     type: 'POST',
                //     accept: 'application/json',
                //     contentType: 'application/json',
                //     dataType: 'json',
                //     data: JSON.stringify(data),
                //     success: (d) => {
                //         model.succeed();
                //         shoppingCartStore.dispatch({ type: 'ORDER_SUCCESS' });
                //     },
                //     error: x => {
                //         model.error();
                //         shoppingCartStore.dispatch({ type: 'ORDER_ERROR' });
                //     }
                // });
            }
        }
    });

    Vue.component('mini-shopping-cart', {
        replace: false,
        template: '<div class="mini-shopping-cart"><svg class="icon-cart" style="fill: green;"><use xlink:href="#icon-cart"></use></svg> &times; {{ items.length }}</div>',
        data() { return { items: [] }; },

        ready() {
            store.subscribe(() => {
                this.items = store.getState().order.items;
            });
        }
    });
};
