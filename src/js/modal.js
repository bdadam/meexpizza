const $ = require('jquery');

var scrollY;
var backdrop;
var modal;
var showing = false;
// var isMobile = $(window).width() < 1024;

module.exports = {
    show: html => {
        if (showing) { return; }

        showing = true;
        scrollY = window.scrollY;

        // if (isMobile) {
        //     $('#mainpage').hide();
        // }

        backdrop = $('<div class="modal-backdrop"></div>')
                            .css({
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '100%',
                                'z-index': 1000
                            })
                            .appendTo('body');
        // if (isMobile) { backdrop.css({ position: fixed }); }

        modal = $('<div class="modal"></div>')
                            .css({
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                'z-index': 1001
                            })
                            .appendTo('body')
                            .html(html);

        // $('.qwe').hide();

        window.scrollTo(0, 0);

        return {
            el: modal[0],
            hide: module.exports.hide
        };
    },

    hide: () => {
        if (showing) {
            // $('.qwe').show();
            window.scrollTo(0, scrollY);
            modal.remove();
            backdrop.remove();
            showing = false;
        }
    }
};
