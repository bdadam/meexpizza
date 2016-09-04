export const register = Vue => {
    Vue.component('add-cart', {
        props: ['prices', 'category', 'name', 'productid'],
        replace: false,
        template: '<select class="variant-selector" v-model="selectedVariant" v-if="hasMultiVariants"><option v-for="(variant, price) in prices" :value="variant">{{ variant }} - {{ price }} Ft</option></select><span v-if="!hasMultiVariants">{{ singlePrice }} Ft</span><button @click.prevent="addToCart"><svg class="icon-cart" style="fill: white;"><use xlink:href="#icon-cart"></use></svg> Kosárba vele</button>',
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
};
