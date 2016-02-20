const $ = require('jquery');

var scrollY;
var backdrop;
var modal;
var showing = false;

module.exports = {
    show: html => {
        if (showing) { return; }

        showing = true;
        scrollY = window.scrollY;

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

        modal = $('<div class="modal"></div>')
                            .css({
                                position: 'absolute',
                                top: scrollY,
                                left: 0,
                                right: 0,
                                'z-index': 1001
                            })
                            .appendTo('body')
                            .html(html);

        return {
            el: modal[0],
            hide: module.exports.hide
        };
    },

    hide: () => {
        if (showing) {
            modal.remove();
            backdrop.remove();
            showing = false;
        }
    }
};
