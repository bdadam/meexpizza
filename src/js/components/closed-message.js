import store from '../store';

export const register = Vue => {
    Vue.component('closed-message', {
        replace: false,
        template: '<div v-if="closed && !hidden">Jelenleg zárva vagyunk, csak előrendelést tudunk felvenni! <button class="dismiss" @click="hidden = true">&times;</button></div>',
        data() {
            return { closed: false, hidden: false };
        },
        ready() {
            store.subscribe(() => {
                this.closed = !store.getState().openingHours.isOpen;
            });

            this.closed = !store.getState().openingHours.isOpen;
        }
    });
};
