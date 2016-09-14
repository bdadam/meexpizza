import pickBy from 'lodash/pickBy'

import { default as html } from './choose-details.html';
import store from '../store';
import { findDishByCategoryAndName, findExtrasForDishCategoryAndName, findExtraPriceByCategoryAndName } from '../menu';

export const register = Vue => {
    Vue.component('choose-details', {
        replace: false,
        props: ['dish'],
        data() {
            return { extras: {}, variants: null, selectedVariant: null, selectedOptionalExtras: {}, selectedRequiredExtras: {}, invalidFields: [], totalPrice: 0 }
        },
        template: html,
        ready() {
            const dish = findDishByCategoryAndName(this.dish.category, this.dish.name);

            this.variants = dish.variants;
            this.selectedVariant = this.dish.variant;
            this.extras = findExtrasForDishCategoryAndName(dish.category, dish.name);

            this.extras.required.forEach(group => {
                this.selectedRequiredExtras[group.category] = { price: group.price, selection: group.multi ? [] : null };
            });

            this.extras.optional.forEach(group => {
                this.selectedOptionalExtras[group.category] = { price: group.price, selection: group.multi ? [] : null };
            });

            this.updateTotalPrice();
        },
        methods: {
            add() {
                if (!this.validate()) {
                    return;
                }

                this.$emit('product-selected', {
                    category: this.dish.category,
                    name: this.dish.name,
                    variant: this.selectedVariant,
                    extras: { required: this.selectedRequiredExtras, optional: pickBy(this.selectedOptionalExtras, (value, key) => value.selection.length > 0) }
                });

                this.$emit('done');
            },
            cancel() {
                this.$emit('done');
            },
            validate() {
                this.invalidFields = this.extras.required.filter(x => this.selectedRequiredExtras[x.category].selection === null).map(x => x.category);
                return this.invalidFields.length === 0;
            },
            updateTotalPrice() {
                const basePrice = this.variants[this.selectedVariant];
                const extraPrice = Object.keys(this.selectedOptionalExtras).map(cat => this.selectedOptionalExtras[cat].price * this.selectedOptionalExtras[cat].selection.length).reduce((prev, curr) => prev + curr, 0);
                this.totalPrice = basePrice + extraPrice;
            }
        },
        computed: {
            hasMultiVariants() {
                return Object.keys(this.variants).length > 1;
            }
        }
    });
};
