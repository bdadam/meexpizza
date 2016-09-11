import store from '../store';

export const register = Vue => {
    Vue.component('closed-message', {
        replace: false,
        template: '<div v-if="closed && !hidden" transition="slide-down"><svg class="icon-cart" style="fill: #b71c1c; width: 24px; height: 24px; vertical-align: text-bottom;"><use xlink:href="#icon-notification"></use></svg> Jelenleg zárva vagyunk, csak előrendelést tudunk felvenni! <span style="white-space: nowrap;">Következő nyitás: {{ nextOpen }}</span>. <button class="dismiss" @click="hidden = true">&times;</button></div>',
        data() {
            return { closed: false, hidden: false, nextOpen: '' };
        },
        ready() {
            store.subscribe(() => {
                this.closed = !store.getState().openingHours.isOpen;
                this.nextOpen = store.getState().openingHours.nextOpen;
            });

            this.closed = !store.getState().openingHours.isOpen;
            this.nextOpen = store.getState().openingHours.nextOpen;
        }
    });
};
