var $ = require("jquery");

module.exports = {
    init() {

        const navigation = $('#site-navigation');

        var menuToggle = $('.menu-toggle').click(() => {
            menuToggle.toggleClass('active');
            navigation.toggleClass('open');
        });

        navigation.on('click', 'a', () => {
            menuToggle.removeClass('active');
            navigation.removeClass('open');
        });

    }
};
