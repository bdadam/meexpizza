import { default as html } from './shopping-cart.html';

import store from '../store';

import merge from 'lodash/merge';

import { duplicateItem, removeItem, updateAddress, validateOrder, sendOrder } from '../order';

export const register = Vue => {
    Vue.component('shopping-cart', {
        replace: false,
        template: html,
        props: ['showcancelbutton'],
        data() {
            return { order: [], address: { city: 'Gyöngyös', name: '', phone: '', street: '', notes: '', submittingOrder: false } };
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

            cancel() {
                this.$emit('done');
            },

            submitOrder() {
                if (!this.validate()) {
                    return;
                }

                this.submittingOrder = true;

                const isTest = location.hostname.indexOf('localhost') >= 0;
                const url = isTest
                    ? 'https://meexpizza-test.firebaseio.com/orders.json'
                    : 'https://meexpizza-admin.firebaseio.com/orders.json';

                const body = JSON.stringify(Object.assign({}, this.order, { test: isTest, timestamp: { '.sv': 'timestamp' } }));

                const xmlhttp = new XMLHttpRequest();
                xmlhttp.open('POST', url);
                xmlhttp.setRequestHeader('Content-Type', 'application/json');

                xmlhttp.onreadystatechange = () => {
                    if (xmlhttp.readyState === 4) {
                        if (xmlhttp.status === 200) {
                            sendOrder();
                            this.submittingOrder = false;
                            this.$emit('done');
                            this.$emit('order-successful');
                        } else {
                            this.submittingOrder = false;
                            this.$emit('done');
                            this.$emit('order-error');
                        }
                    }
                };

                xmlhttp.send(body);

                // window.fetch(url, {
                //         method: 'POST',
                //         mode: 'cors',
                //         cache: false,
                //         headers: {
                //             'Accept': 'application/json',
                //             'Content-Type': 'application/json'
                //         },
                //         body: JSON.stringify(Object.assign({}, this.order, { test: isTest, timestamp: { '.sv': 'timestamp'} }))
                //     })
                //     .then(response => {
                //         sendOrder();
                //     })
                //     .catch(error => {
                //         this.submittingOrder = false;
                //         this.$emit('done');
                //         this.$emit('order-error');
                //     })
                //     .then(() => {
                //         this.submittingOrder = false;
                //         this.$emit('done');
                //         this.$emit('order-successful');
                //     });
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
