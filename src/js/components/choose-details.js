import startsWith from 'lodash/startsWith';

import { default as html } from './choose-details.html';
import store from '../store';

// import union from 'lodash/union';

// import pick from 'lodash/pick';
// import pickBy from 'lodash/pickBy';
// import includes from 'lodash/includes';

import { findDishByCategoryAndName, findExtrasForDishCategoryAndName } from '../menu';

export const register = Vue => {
    Vue.component('choose-details', {
        replace: false,
        props: ['dish'],
        data() {
            return { extras: {}, variants: null, selectedVariant: null, selectedOptionalExtras: {}, selectedRequiredExtras: {}, invalidFields: [] }
            // return { selectedDish: null, extras: {}, variants: null, availableOptions: [], selectedVariant: null, selectedExtras: {}, selectedOptionalExtras: {}, selectedRequiredExtras: {} }
        },
        template: html,
        ready() {
            const dish = findDishByCategoryAndName(this.dish.category, this.dish.name);

            this.variants = dish.variants;
            this.selectedVariant = this.dish.variant;

            this.extras = findExtrasForDishCategoryAndName(dish.category, dish.name);

            this.extras.required.forEach(group => {
                this.selectedRequiredExtras[group.category] = group.multi ? [] : null;
            });

            this.extras.optional.forEach(group => {
                this.selectedOptionalExtras[group.category] = group.multi ? [] : null;
            });

            // const state = store.getState();
            // const menu = state.menu;
            // const menuDish = menu.dishes[this.dish.category][this.dish.name];
            // // const options = union(menuDish['Választható'], menu.dishes[this.dish.category]['Választható']);
            // const options = menuDish['Választható'] || [];
            //
            // this.availableOptions = options;
            //
            // this.selectedDish = Object.assign({}, this.dish, { extras: {} });
            // this.extras = {};
            //
            // options.forEach(o => {
            //     const keys = Object.keys(menu.extras);
            //     keys.forEach(key => {
            //         if (startsWith(key, o)) {
            //             this.extras[key] = menu.extras[key];
            //         }
            //     });
            // });
            //
            // this.variants = Object.assign({}, menuDish['Árak']);
        },
        methods: {
            add() {
                if (!this.validate()) {
                    return;
                }

                console.log(this.selectedRequiredExtras);
                console.log(this.selectedOptionalExtras);

                // this.$emit('product-customized', { product: this.selectedDish });
                this.$emit('done');
            },
            cancel() {
                this.$emit('done');
            },
            validate() {
                const invalidRequiredExtras = this.extras.required.filter(x => this.selectedRequiredExtras[x.category] === null);
                this.invalidFields = invalidRequiredExtras.map(x => x.category);
                return invalidRequiredExtras.length === 0;

                //
                //
                // Object.keys(this.selectedRequiredExtras).forEach(cat => {
                //     console.log(this.selectedRequiredExtras[cat] !== null);
                //     this.validationByField[cat] = this.selectedRequiredExtras[cat] !== null;
                // });
            }
        },

        computed: {
            isValid() {
                return this.extras.required.filter(x => this.selectedRequiredExtras[x.category] === null).length === 0;
            },
            hasAllRequiredOptions() {
                let qwe = true;

                // console.log('WWW', this.selectedRequiredExtras);

                // console.log(this.extras.required);

                this.extras.required.forEach(x => {
                    qwe = qwe && (this.selectedRequiredExtras[x.category] !== null);
                    console.log(qwe);
                });

                return qwe;

                // console.log('QQQ', this.selectedRequiredExtras);
                // for (let key in this.selectedRequiredExtras) {
                //     console.log(key);
                // }
                //
                // return !!this.selectedRequiredExtras;
                // console.log(this.selectedRequiredExtras);
                // console.log('!!!', Object.keys(this.selectedRequiredExtras).map(cat => this.selectedRequiredExtras[cat] === null));
                // console.log('!!!', Object.keys(this.selectedRequiredExtras));
                // return Object.keys(this.selectedRequiredExtras).map(cat => this.selectedRequiredExtras[cat] === null).filter(e => !e).length === 0;
                // return this.selectedRequiredExtras.filter(e => e === null).length === 0;
            },
            // allExtras() {
            //     console.log(store.getState().menu.extras);
            //     return store.getState().menu.extras;
            // },
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
