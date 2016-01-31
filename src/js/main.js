// require('babel-polyfill');

require('lazysizes/lazysizes');

var navi = require('./navi');
navi.init();

var redux = require('redux');

var cart = redux.createStore((state = {}, action) => {

    switch(action) {
        case 'ADD':
            return state;
    }

    return state;
});



function on(elSelector, eventName, selector, fn) {
    var element = document.querySelector(elSelector);

    element.addEventListener(eventName, function(event) {
        var possibleTargets = element.querySelectorAll(selector);
        var target = event.target;

        for (var i = 0, l = possibleTargets.length; i < l; i++) {
            var el = target;
            var p = possibleTargets[i];

            while(el && el !== element) {
                if (el === p) {
                    return fn.call(p, event);
                }

                el = el.parentNode;
            }
        }
    });
}

const menucard = require('../../menu');
console.log(menucard);

on('body', 'click', 'button[data-add-to-cart]', function(e) {
    // var name, price;
    // console.log(e);
    // console.log(this);

    // cart.dispatch({ type: 'ADD', data: { id: '1', size: '30',  } })
});

var $ = require("jquery");

const nanoModal = require('nanomodal');

$(document).on('click', 'button[data-add-to-cart]', () => {
    $('#modal').scroll(e => {
        console.log(e);
        // e.preventDefault();
        // e.stopPropagation();
    });

    var modalWithNoButtons = nanoModal($('#modal')[0], {
        overlayClose: false,
        buttons: [{
            text: "I'm sure!",
            handler: function(modal) {
                alert("doing something...");
                modal.hide();
            },
            primary: true
        }, {
            text: "Maybe not...",
            handler: "hide"
        }]
    });

    modalWithNoButtons.show();
});
