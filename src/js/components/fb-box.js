export const register = Vue => {
    Vue.component('fb-box', {
        replace: false,
        props: ['page', 'height', 'width'],
        ready() {
            window.addEventListener('resize', () => this.resize());
            this.resize();
        },
        methods: {
            resize() {
                this.width = this.$el.parentNode.clientWidth;
            }
        },
        template: '<iframe scrolling="no" frameborder="0" allowtransparency="true" style="border:0;height:{{ height }}px;width:{{ width }}px;display:block;" src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2F{{ page }}&tabs=timeline%2Cmessages&width={{ width }}&height={{ height }}&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId"></iframe>'
    });
};
