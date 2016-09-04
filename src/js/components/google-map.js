export const register = Vue => {
    Vue.component('google-map', {
        replace: false,
        props: ['title', 'href'],
        data() {
            return { src: '' };
        },
        template: '<a target="_blank" rel="noopener" :href="href" :title="title"><img :src="src"><p>Kattints a nagyobb térképhez!</p></a>',
        ready() {
            this.calcSrc();
            window.addEventListener('resize', () => this.calcSrc());
        },
        methods: {
            calcSrc() {
                const width = this.$el.parentNode.clientWidth | 0;
                if (!width) { return; }

                const height = width * 0.75 | 0;
                const scale = (window.devicePixelRatio > 1) ? 2 : 1;
                const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?zoom=15&size=${width}x${height}&scale=${scale}&maptype=roadmap&markers=color:blue%7Clabel:M%7C3200+Gyöngyös,+Orczy+út+1.&format=png&key=AIzaSyCv-L_Za8GWc4L_s4hcVX3frfJm5toJc6k`;

                this.src = staticMapUrl;
            }
        }
    });
};
