var $ = require("jquery");

module.exports = {
    init() {
        var menuToggle = $('.menu-toggle').click(() => {
            menuToggle.toggleClass('active');
            $('#site-navigation').toggleClass('open');
        });


        // var toggle = document.querySelector('.menu-toggle');
        // var navi = document.querySelector('#site-navigation');
        //
        // toggle.addEventListener('click', (e) => {
        //     e.preventDefault();
        //     menuToggle.classList.toggle('active');
        //     navi.classList.toggle('open');
        // });
    }
};
