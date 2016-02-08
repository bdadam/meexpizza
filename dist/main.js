/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	// require('babel-polyfill');
	
	// require('zepto/zepto.min');
	// import zepto from 'zepto/zepto.min.js';
	// window.jQuery = window.$;
	
	__webpack_require__(1).polyfill();
	__webpack_require__(2);
	__webpack_require__(3);
	
	__webpack_require__(4).init();
	
	var redux = __webpack_require__(6);
	
	var menucard = __webpack_require__(15);
	var deliveryFees = __webpack_require__(16);
	
	var defaultState = {
	    inCart: [],
	    serializedForm: '',
	    isEmpty: true,
	    address: { city: 'Gyöngyös' }
	};
	
	var flatMap = __webpack_require__(17);
	var find = __webpack_require__(105);
	
	var shoppingCart = redux.createStore(function () {
	    var state = arguments.length <= 0 || arguments[0] === undefined ? defaultState : arguments[0];
	    var action = arguments[1];
	
	    var newState = defaultState;
	
	    switch (action.type) {
	        case 'ADD':
	            newState = Object.assign({}, state, { inCart: [].concat(_toConsumableArray(state.inCart), [{ dish: action.dish, timestamp: action.timestamp }]) });
	            break;
	        case 'REMOVE':
	            var inCart = state.inCart.filter(function (x) {
	                return x.timestamp !== action.timestamp;
	            });
	            newState = Object.assign({}, state, { inCart: inCart });
	            break;
	        case 'DUPLICATE':
	            newState = Object.assign({}, state, {
	                inCart: flatMap(state.inCart, function (item) {
	                    return item.timestamp !== action.timestamp ? item : [item, Object.assign({}, item, { timestamp: +new Date() })];
	                })
	            });
	            break;
	        case 'RESTORE':
	            newState = Object.assign({}, state, defaultState, action.state);
	            break;
	        case 'ADDRESS_CHANGE':
	            newState = Object.assign({}, state, { address: action.address });
	            break;
	        case 'EMPTY_CART':
	            newState = Object.assign({}, state, { inCart: [] });
	            break;
	        default:
	            // no-op
	            return state;
	    }
	
	    // newState.total = newState.inCart.reduce(item => item.)
	    newState.isEmpty = newState.inCart.length === 0;
	    newState.deliveryFee = deliveryFees[newState.address.city].fix || 0;
	    newState.deliveryFreeFrom = deliveryFees[newState.address.city].min || 0;
	
	    return newState;
	});
	
	shoppingCart.subscribe(function () {
	    try {
	        localStorage.shoppingCart = JSON.stringify(shoppingCart.getState());
	    } catch (ex) {}
	});
	
	setTimeout(function () {
	    try {
	        var state = JSON.parse(localStorage.shoppingCart);
	        shoppingCart.dispatch({ type: 'RESTORE', state: state });
	    } catch (ex) {}
	});
	
	var $ = __webpack_require__(5);
	var nanoModal = __webpack_require__(113);
	
	shoppingCart.subscribe(function () {
	    var state = shoppingCart.getState();
	    var ids = {};
	    state.inCart.forEach(function (obj) {
	        ids[obj.dish.id] = (ids[obj.dish.id] || 0) + 1;
	    });
	
	    $('[data-dish-id] .in-cart-count').text('');
	
	    Object.keys(ids).forEach(function (id) {
	        var count = ids[id];
	        $('[data-dish-id=' + id + '] .in-cart-count').text(count + ' db a kosárban');
	    });
	});
	
	shoppingCart.subscribe(function () {
	    var state = shoppingCart.getState();
	    $('[data-shopping-cart-count]').text(state.inCart.length + ' × ');
	});
	
	shoppingCart.subscribe(function () {
	
	    var state = shoppingCart.getState();
	
	    var shcart = {
	        lines: [
	            // { id, name, price, extras: [
	            // { name, price }
	            // ] }
	        ],
	        deliveryFee: 1000,
	        missingSumToFreeDelivery: 300,
	        address: {
	            // city
	            // name
	            // street
	            // phone
	        }
	    };
	
	    if (state.isEmpty) {
	        $('#side-cart .default-content').show();
	        $('#side-cart button.order').attr('disabled', true);
	    } else {
	        $('#side-cart .default-content').hide();
	        $('#side-cart button.order').attr('disabled', false);
	    }
	
	    var viewModel = {
	        showEmptyMessage: state.inCart.length === 0,
	        isEmpty: state.inCart.length === 0,
	        lines: state.inCart.map(function (item) {
	            var dishFromCard = find(menucard.dishes, function (dish) {
	                return dish.id === item.dish.id;
	            }); //menucard.dishes.filter()
	            return { id: item.timestamp, name: dishFromCard.name + ' (' + item.dish.variant + ')', price: find(dishFromCard.variants, function (v) {
	                    return v.name === item.dish.variant;
	                }).price };
	        }),
	        deliveryFee: menucard.deliveryFees[state.address.city].fix || 0,
	        minForFreeDelivery: menucard.deliveryFees[state.address.city].min || 0
	    };
	
	    viewModel.total = viewModel.lines.reduce(function (prev, l) {
	        return prev + l.price;
	    }, 0) + viewModel.deliveryFee;
	    viewModel.minTotalNotReached = viewModel.total < viewModel.minForFreeDelivery;
	    viewModel.showMinForFreeDeliveryMessage = state.inCart.length > 0 && viewModel.minTotalNotReached;
	
	    var tpl = __webpack_require__(114);
	    $('.cart-calculation').html(tpl(viewModel));
	
	    /*
	    const itemsContainer = $('#side-cart .items');
	    itemsContainer.empty();
	      state.inCart.forEach(item => {
	        const x = menucard.dishes.filter(dish => dish.id === item.dish.id)[0];
	        const variant = x.variants.filter(v => v.name === item.dish.variant)[0];
	        const price = variant.price;
	          itemsContainer.append(`<tr><td>${x.name} (${item.dish.variant})<br><a href="" style="font-size:0.875rem;"><svg style="width: 16px;height:16px;"><use xlink:href="#icon-plus"></use></svg> Még</a>&nbsp;&nbsp;<a href=""><svg style="width: 16px;height:16px;"><use xlink:href="#icon-minus"></use></svg> Nem kérem</a> <a href="">Extrák</a></td><td><button data-duplicate-order-item="${item.timestamp}"><svg><use xlink:href="#icon-plus"></use></svg></button><button data-remove-order-item="${item.timestamp}"><svg><use xlink:href="#icon-minus"></use></svg></button></div></td><td>${price}&nbsp;Ft</td></tr>`);
	    });
	      if (!state.isEmpty) {
	        let sum = state.inCart.reduce((prev, item) => {
	            var dish = menucard.dishes.filter(dish => dish.id === item.dish.id)[0];
	            const variant = dish.variants.filter(v => v.name === item.dish.variant)[0];
	            return prev + variant.price;
	        }, 0);
	          const deliveryRule = menucard.deliveryFees[state.address.city];
	          if (deliveryRule.fix) {
	            sum += deliveryRule.fix;
	            itemsContainer.append(`<tfoot><tr><td>Kiszállítási díj</td><td colspan="2">${deliveryRule.fix}&nbsp;Ft</td></tr></tfoot>`);
	        } else if (deliveryRule.min && sum < deliveryRule.min) {
	            itemsContainer.append(`<tfoot><tr><td colspan="3">A minimális ${deliveryRule.min} Ft rendelési értéket még nem érted el.</td></tr></tfoot>`);
	        }
	          itemsContainer.append(`<tfoot><tr><td>Végösszeg</td><td colspan="2">${sum}&nbsp;Ft</td></tr></tfoot>`);
	    }
	    */
	});
	
	shoppingCart.subscribe(function () {
	    var address = shoppingCart.getState().address;
	    var orderForm = $('#side-cart .order-form');
	
	    orderForm.find('[name=city]').val(address.city);
	    orderForm.find('[name=name]').val(address.name);
	    orderForm.find('[name=street]').val(address.street);
	    orderForm.find('[name=phone]').val(address.phone);
	});
	
	var orderForm = $('#side-cart .order-form').on('input change', function (e) {
	    var address = {
	        city: orderForm.find('[name=city]').val(),
	        name: orderForm.find('[name=name]').val(),
	        street: orderForm.find('[name=street]').val(),
	        phone: orderForm.find('[name=phone]').val()
	    };
	
	    shoppingCart.dispatch({ type: 'ADDRESS_CHANGE', address: address });
	});
	
	$(document).on('click', 'button[data-remove-order-item]', function (e) {
	    var timestamp = $(this).data('removeOrderItem');
	    shoppingCart.dispatch({ type: 'REMOVE', timestamp: timestamp });
	});
	
	$(document).on('click', 'button[data-duplicate-order-item]', function (e) {
	    var timestamp = $(this).data('duplicateOrderItem');
	    shoppingCart.dispatch({ type: 'DUPLICATE', timestamp: timestamp });
	});
	
	$(document).on('click', 'button[data-add-to-cart]', function (e) {
	    var el = $(this);
	    var id = el.data('add-to-cart');
	    var variant = el.data('variant');
	    shoppingCart.dispatch({ type: 'ADD', dish: { id: id, variant: variant }, timestamp: +new Date() });
	
	    // const template = require('./templates/pizza-options.html');
	    // const html = template();
	    // const modal = nanoModal(html, {
	    //     overlayClose: false,
	    //     buttons: [{
	    //         text: 'Hozzáadás a rendeléshez',
	    //         handler: m => m.hide(),
	    //         primary: true
	    //     }, {
	    //         text: 'Mégsem',
	    //         handler: 'hide'
	    //     }]
	    // });
	    // modal.show();
	
	    // $('#modal').scroll(e => {
	    //     console.log(e);
	    //     // e.preventDefault();
	    //     // e.stopPropagation();
	    // });
	    //
	    // var modalWithNoButtons = nanoModal($('#modal')[0], {
	    //     overlayClose: false,
	    //     buttons: [{
	    //         text: "I'm sure!",
	    //         handler: function(modal) {
	    //             alert("doing something...");
	    //             modal.hide();
	    //         },
	    //         primary: true
	    //     }, {
	    //         text: "Maybe not...",
	    //         handler: "hide"
	    //     }]
	    // });
	    //
	    // modalWithNoButtons.show();
	});
	
	// var orderItemTemplate = require('./templates/order-item.html');
	// console.log(orderItemTemplate({ id: 'jfsjkfsdf', qwe: 'jshdfjkhsdfkjhs' }));
	
	window.sc = shoppingCart;
	
	document.registerElement('google-map', {
	    extends: 'a',
	    prototype: Object.create(HTMLElement.prototype, {
	        attachedCallback: {
	            value: function value() {
	                var el = this;
	                setTimeout(function () {
	                    // 47.785625, 19.932675
	                    var width = el.clientWidth | 0;
	
	                    if (width === 0) {
	                        return;
	                    }
	
	                    var height = width * 0.75 | 0;
	                    var scale = window.devicePixelRatio > 1 ? 2 : 1;
	                    var staticMapUrl = 'https://maps.googleapis.com/maps/api/staticmap?zoom=15&size=' + width + 'x' + height + '&scale=' + scale + '&maptype=roadmap&markers=color:blue%7Clabel:M%7C3200+Gyöngyös,+Orczy+út+1.&format=png';
	                    var img = document.createElement('img');
	                    img.alt = el.getAttribute('title');
	                    img.src = staticMapUrl;
	                    el.insertBefore(img, el.firstChild);
	                });
	            }
	        }
	    })
	});
	
	document.registerElement('add-to-cart', {
	    prototype: Object.create(HTMLElement.prototype, {
	        attachedCallback: { value: function value() {
	                var el = $(this);
	                var itemid = el.attr('dishid');
	                var dish = menucard.dishes.filter(function (dish) {
	                    return dish.id === itemid;
	                })[0];
	                var variants = dish.variants;
	                var button = $('<button data-add-to-cart="' + dish.id + '" data-variant="' + variants[0].name + '"><svg class="icon-cart white"><use xlink:href="#icon-cart"></use></svg> Kosárba</button>');
	
	                if (variants.length > 1) {
	                    (function () {
	                        var select = $('<select>' + variants.map(function (v) {
	                            return '<option value="' + v.name + '">' + v.name + ' - ' + v.price + ' Ft</option>';
	                        }) + '</select>').on('change', function (e) {
	                            return button.data('variant', select.val());
	                        });
	                        el.append(select);
	                    })();
	                } else {
	                    if (variants[0].name) {
	                        el.append(variants[0].name + ' - ');
	                    }
	
	                    el.append('<b>' + variants[0].price + ' Ft</b>');
	                }
	
	                el.append(button);
	            } }
	    })
	});
	
	var dayOfWeek = new Date().getDay() || 7;
	$('#opening-hours dd:nth-of-type(' + dayOfWeek + '), #opening-hours dt:nth-of-type(' + dayOfWeek + ')').css({ fontWeight: 700 });
	
	//
	// const openModal = () => {
	//     const tpl = require('./templates/pizza-options.html');
	//     const html = tpl({ id: 'pizza-modal' });
	//
	//     const currentScroll = window.scrollY;
	//
	//     $(document.body).append(html);
	//
	//     $(document).on('click', '[data-close]', () => {
	//         $('#pizza-modal').remove();
	//         window.scrollY = currentScroll;
	//     });
	// };
	//
	// openModal();

	// require('vue')

	/*
	Events:
	- add-to-cart - directly
	- add-to-cart - extras should be chosen
	- remove from cart
	- duplicate cart item
	- reset cart
	- restore state
	- change address
	- change notes
	- extra added to order item
	- extra removed from order item
	- note added to order item
	- variant changed in order item
	- city changed

	Pizza kérdések:
	(- Milyen méret?)
	- Milyen extra feltétek?

	3-kívánság pizza:
	- Milyen alap?
	- Milyen 3 ingyenes feltét?


	Üdítő:
	- Milyen méret?

	Hamburger:
	- Menü vagy sem?
	- Milyen burgonya?
	- Milyen szósz?

	Rántott sajt:
	- Milyen burgonya?
	- Milyen szósz?

	*/

/***/ },
/* 1 */
/***/ function(module, exports) {

	/**
	 * Code refactored from Mozilla Developer Network:
	 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
	 */
	
	'use strict';
	
	function assign(target, firstSource) {
	  if (target === undefined || target === null) {
	    throw new TypeError('Cannot convert first argument to object');
	  }
	
	  var to = Object(target);
	  for (var i = 1; i < arguments.length; i++) {
	    var nextSource = arguments[i];
	    if (nextSource === undefined || nextSource === null) {
	      continue;
	    }
	
	    var keysArray = Object.keys(Object(nextSource));
	    for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
	      var nextKey = keysArray[nextIndex];
	      var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
	      if (desc !== undefined && desc.enumerable) {
	        to[nextKey] = nextSource[nextKey];
	      }
	    }
	  }
	  return to;
	}
	
	function polyfill() {
	  if (!Object.assign) {
	    Object.defineProperty(Object, 'assign', {
	      enumerable: false,
	      configurable: true,
	      writable: true,
	      value: assign
	    });
	  }
	}
	
	module.exports = {
	  assign: assign,
	  polyfill: polyfill
	};


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;(function(window, factory) {
		var lazySizes = factory(window, window.document);
		window.lazySizes = lazySizes;
		if(typeof module == 'object' && module.exports){
			module.exports = lazySizes;
		} else if (true) {
			!(__WEBPACK_AMD_DEFINE_FACTORY__ = (lazySizes), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		}
	}(window, function(window, document) {
		'use strict';
		/*jshint eqnull:true */
		if(!document.getElementsByClassName){return;}
	
		var lazySizesConfig;
	
		var docElem = document.documentElement;
	
		var supportPicture = window.HTMLPictureElement && ('sizes' in document.createElement('img'));
	
		var _addEventListener = 'addEventListener';
	
		var _getAttribute = 'getAttribute';
	
		var addEventListener = window[_addEventListener];
	
		var setTimeout = window.setTimeout;
	
		var rAF = window.requestAnimationFrame || setTimeout;
	
		var regPicture = /^picture$/i;
	
		var loadEvents = ['load', 'error', 'lazyincluded', '_lazyloaded'];
	
		var regClassCache = {};
	
		var forEach = Array.prototype.forEach;
	
		var hasClass = function(ele, cls) {
			if(!regClassCache[cls]){
				regClassCache[cls] = new RegExp('(\\s|^)'+cls+'(\\s|$)');
			}
			return regClassCache[cls].test(ele[_getAttribute]('class') || '') && regClassCache[cls];
		};
	
		var addClass = function(ele, cls) {
			if (!hasClass(ele, cls)){
				ele.setAttribute('class', (ele[_getAttribute]('class') || '').trim() + ' ' + cls);
			}
		};
	
		var removeClass = function(ele, cls) {
			var reg;
			if ((reg = hasClass(ele,cls))) {
				ele.setAttribute('class', (ele[_getAttribute]('class') || '').replace(reg, ' '));
			}
		};
	
		var addRemoveLoadEvents = function(dom, fn, add){
			var action = add ? _addEventListener : 'removeEventListener';
			if(add){
				addRemoveLoadEvents(dom, fn);
			}
			loadEvents.forEach(function(evt){
				dom[action](evt, fn);
			});
		};
	
		var triggerEvent = function(elem, name, detail, noBubbles, noCancelable){
			var event = document.createEvent('CustomEvent');
	
			event.initCustomEvent(name, !noBubbles, !noCancelable, detail || {});
	
			elem.dispatchEvent(event);
			return event;
		};
	
		var updatePolyfill = function (el, full){
			var polyfill;
			if( !supportPicture && ( polyfill = (window.picturefill || lazySizesConfig.pf) ) ){
				polyfill({reevaluate: true, elements: [el]});
			} else if(full && full.src){
				el.src = full.src;
			}
		};
	
		var getCSS = function (elem, style){
			return (getComputedStyle(elem, null) || {})[style];
		};
	
		var getWidth = function(elem, parent, width){
			width = width || elem.offsetWidth;
	
			while(width < lazySizesConfig.minSize && parent && !elem._lazysizesWidth){
				width =  parent.offsetWidth;
				parent = parent.parentNode;
			}
	
			return width;
		};
	
		var throttle = function(fn){
			var running;
			var lastTime = 0;
			var Date = window.Date;
			var run = function(){
				running = false;
				lastTime = Date.now();
				fn();
			};
			var afterAF = function(){
				setTimeout(run);
			};
			var getAF = function(){
				rAF(afterAF);
			};
	
			return function(){
				if(running){
					return;
				}
				var delay = 125 - (Date.now() - lastTime);
	
				running =  true;
	
				if(delay < 6){
					delay = 6;
				}
				setTimeout(getAF, delay);
			};
		};
	
		/*
		var throttle = function(fn){
			var running;
			var lastTime = 0;
			var Date = window.Date;
			var requestIdleCallback = window.requestIdleCallback;
			var gDelay = 125;
			var dTimeout = 999;
			var timeout = dTimeout;
			var fastCallThreshold = 0;
			var run = function(){
				running = false;
				lastTime = Date.now();
				fn();
			};
			var afterAF = function(){
				setTimeout(run);
			};
			var getAF = function(){
				rAF(afterAF);
			};
	
			if(requestIdleCallback){
				gDelay = 66;
				fastCallThreshold = 22;
				getAF = function(){
					requestIdleCallback(run, {timeout: timeout});
					if(timeout !== dTimeout){
						timeout = dTimeout;
					}
				};
			}
	
			return function(isPriority){
				var delay;
				if((isPriority = isPriority === true)){
					timeout = 40;
				}
	
				if(running){
					return;
				}
	
				running =  true;
	
				if(isPriority || (delay = gDelay - (Date.now() - lastTime)) < fastCallThreshold){
					getAF();
				} else {
					setTimeout(getAF, delay);
				}
			};
		};
		*/
	
		var loader = (function(){
			var lazyloadElems, preloadElems, isCompleted, resetPreloadingTimer, loadMode, started;
	
			var eLvW, elvH, eLtop, eLleft, eLright, eLbottom;
	
			var defaultExpand, preloadExpand, hFac;
	
			var regImg = /^img$/i;
			var regIframe = /^iframe$/i;
	
			var supportScroll = ('onscroll' in window) && !(/glebot/.test(navigator.userAgent));
	
			var shrinkExpand = 0;
			var currentExpand = 0;
	
			var isLoading = 0;
			var lowRuns = 0;
	
			var resetPreloading = function(e){
				isLoading--;
				if(e && e.target){
					addRemoveLoadEvents(e.target, resetPreloading);
				}
	
				if(!e || isLoading < 0 || !e.target){
					isLoading = 0;
				}
			};
	
			var isNestedVisible = function(elem, elemExpand){
				var outerRect;
				var parent = elem;
				var visible = getCSS(document.body, 'visibility') == 'hidden' || getCSS(elem, 'visibility') != 'hidden';
	
				eLtop -= elemExpand;
				eLbottom += elemExpand;
				eLleft -= elemExpand;
				eLright += elemExpand;
	
				while(visible && (parent = parent.offsetParent) && parent != document.body && parent != docElem){
					visible = ((getCSS(parent, 'opacity') || 1) > 0);
	
					if(visible && getCSS(parent, 'overflow') != 'visible'){
						outerRect = parent.getBoundingClientRect();
						visible = eLright > outerRect.left &&
						eLleft < outerRect.right &&
						eLbottom > outerRect.top - 1 &&
						eLtop < outerRect.bottom + 1
						;
					}
				}
	
				return visible;
			};
	
			var checkElements = function() {
				var eLlen, i, rect, autoLoadElem, loadedSomething, elemExpand, elemNegativeExpand, elemExpandVal, beforeExpandVal;
	
				if((loadMode = lazySizesConfig.loadMode) && isLoading < 8 && (eLlen = lazyloadElems.length)){
	
					i = 0;
	
					lowRuns++;
	
					if(preloadExpand == null){
						if(!('expand' in lazySizesConfig)){
							lazySizesConfig.expand = docElem.clientHeight > 600 ? docElem.clientWidth > 860 ? 500 : 410 : 359;
						}
	
						defaultExpand = lazySizesConfig.expand;
						preloadExpand = defaultExpand * lazySizesConfig.expFactor;
					}
	
					if(currentExpand < preloadExpand && isLoading < 1 && lowRuns > 3 && loadMode > 2){
						currentExpand = preloadExpand;
						lowRuns = 0;
					} else if(loadMode > 1 && lowRuns > 2 && isLoading < 6){
						currentExpand = defaultExpand;
					} else {
						currentExpand = shrinkExpand;
					}
	
					for(; i < eLlen; i++){
	
						if(!lazyloadElems[i] || lazyloadElems[i]._lazyRace){continue;}
	
						if(!supportScroll){unveilElement(lazyloadElems[i]);continue;}
	
						if(!(elemExpandVal = lazyloadElems[i][_getAttribute]('data-expand')) || !(elemExpand = elemExpandVal * 1)){
							elemExpand = currentExpand;
						}
	
						if(beforeExpandVal !== elemExpand){
							eLvW = innerWidth + (elemExpand * hFac);
							elvH = innerHeight + elemExpand;
							elemNegativeExpand = elemExpand * -1;
							beforeExpandVal = elemExpand;
						}
	
						rect = lazyloadElems[i].getBoundingClientRect();
	
						if ((eLbottom = rect.bottom) >= elemNegativeExpand &&
							(eLtop = rect.top) <= elvH &&
							(eLright = rect.right) >= elemNegativeExpand * hFac &&
							(eLleft = rect.left) <= eLvW &&
							(eLbottom || eLright || eLleft || eLtop) &&
							((isCompleted && isLoading < 3 && !elemExpandVal && (loadMode < 3 || lowRuns < 4)) || isNestedVisible(lazyloadElems[i], elemExpand))){
							unveilElement(lazyloadElems[i]);
							loadedSomething = true;
							if(isLoading > 9){break;}
						} else if(!loadedSomething && isCompleted && !autoLoadElem &&
							isLoading < 4 && lowRuns < 4 && loadMode > 2 &&
							(preloadElems[0] || lazySizesConfig.preloadAfterLoad) &&
							(preloadElems[0] || (!elemExpandVal && ((eLbottom || eLright || eLleft || eLtop) || lazyloadElems[i][_getAttribute](lazySizesConfig.sizesAttr) != 'auto')))){
							autoLoadElem = preloadElems[0] || lazyloadElems[i];
						}
					}
	
					if(autoLoadElem && !loadedSomething){
						unveilElement(autoLoadElem);
					}
				}
			};
	
			var throttledCheckElements = throttle(checkElements);
	
			var switchLoadingClass = function(e){
				addClass(e.target, lazySizesConfig.loadedClass);
				removeClass(e.target, lazySizesConfig.loadingClass);
				addRemoveLoadEvents(e.target, switchLoadingClass);
			};
	
			var changeIframeSrc = function(elem, src){
				try {
					elem.contentWindow.location.replace(src);
				} catch(e){
					elem.src = src;
				}
			};
	
			var handleSources = function(source){
				var customMedia, parent;
	
				var sourceSrcset = source[_getAttribute](lazySizesConfig.srcsetAttr);
	
				if( (customMedia = lazySizesConfig.customMedia[source[_getAttribute]('data-media') || source[_getAttribute]('media')]) ){
					source.setAttribute('media', customMedia);
				}
	
				if(sourceSrcset){
					source.setAttribute('srcset', sourceSrcset);
				}
	
				//https://bugzilla.mozilla.org/show_bug.cgi?id=1170572
				if(customMedia){
					parent = source.parentNode;
					parent.insertBefore(source.cloneNode(), source);
					parent.removeChild(source);
				}
			};
	
			var rafBatch = (function(){
				var isRunning;
				var batch = [];
				var runBatch = function(){
					while(batch.length){
						(batch.shift())();
					}
					isRunning = false;
				};
				return function(fn){
					batch.push(fn);
					if(!isRunning){
						isRunning = true;
						rAF(runBatch);
					}
				};
			})();
	
			var unveilElement = function (elem){
				var src, srcset, parent, isPicture, event, firesLoad, width;
	
				var isImg = regImg.test(elem.nodeName);
	
				//allow using sizes="auto", but don't use. it's invalid. Use data-sizes="auto" or a valid value for sizes instead (i.e.: sizes="80vw")
				var sizes = isImg && (elem[_getAttribute](lazySizesConfig.sizesAttr) || elem[_getAttribute]('sizes'));
				var isAuto = sizes == 'auto';
	
				if( (isAuto || !isCompleted) && isImg && (elem.src || elem.srcset) && !elem.complete && !hasClass(elem, lazySizesConfig.errorClass)){return;}
	
				if(isAuto){
					width = elem.offsetWidth;
				}
	
				elem._lazyRace = true;
				isLoading++;
	
				rafBatch(function lazyUnveil(){
					if(elem._lazyRace){
						delete elem._lazyRace;
					}
	
					if(!(event = triggerEvent(elem, 'lazybeforeunveil')).defaultPrevented){
	
						if(sizes){
							if(isAuto){
								autoSizer.updateElem(elem, true, width);
								addClass(elem, lazySizesConfig.autosizesClass);
							} else {
								elem.setAttribute('sizes', sizes);
							}
						}
	
						srcset = elem[_getAttribute](lazySizesConfig.srcsetAttr);
						src = elem[_getAttribute](lazySizesConfig.srcAttr);
	
						if(isImg) {
							parent = elem.parentNode;
							isPicture = parent && regPicture.test(parent.nodeName || '');
						}
	
						firesLoad = event.detail.firesLoad || (('src' in elem) && (srcset || src || isPicture));
	
						event = {target: elem};
	
						if(firesLoad){
							addRemoveLoadEvents(elem, resetPreloading, true);
							clearTimeout(resetPreloadingTimer);
							resetPreloadingTimer = setTimeout(resetPreloading, 2500);
	
							addClass(elem, lazySizesConfig.loadingClass);
							addRemoveLoadEvents(elem, switchLoadingClass, true);
						}
	
						if(isPicture){
							forEach.call(parent.getElementsByTagName('source'), handleSources);
						}
	
						if(srcset){
							elem.setAttribute('srcset', srcset);
						} else if(src && !isPicture){
							if(regIframe.test(elem.nodeName)){
								changeIframeSrc(elem, src);
							} else {
								elem.src = src;
							}
						}
	
						if(srcset || isPicture){
							updatePolyfill(elem, {src: src});
						}
					}
	
					removeClass(elem, lazySizesConfig.lazyClass);
	
					if( !firesLoad || elem.complete ){
						if(firesLoad){
							resetPreloading(event);
						} else {
							isLoading--;
						}
						switchLoadingClass(event);
					}
				});
			};
	
			var onload = function(){
				if(isCompleted){return;}
				if(Date.now() - started < 999){
					setTimeout(onload, 999);
					return;
				}
				var scrollTimer;
				var afterScroll = function(){
					lazySizesConfig.loadMode = 3;
					throttledCheckElements();
				};
	
				isCompleted = true;
	
				lazySizesConfig.loadMode = 3;
	
				if(!isLoading){
					if(lowRuns){
						throttledCheckElements();
					} else {
						setTimeout(checkElements);
					}
				}
	
				addEventListener('scroll', function(){
					if(lazySizesConfig.loadMode == 3){
						lazySizesConfig.loadMode = 2;
					}
					clearTimeout(scrollTimer);
					scrollTimer = setTimeout(afterScroll, 99);
				}, true);
			};
	
			/*
			var onload = function(){
				var scrollTimer, timestamp;
				var wait = 99;
				var afterScroll = function(){
					var last = (Date.now()) - timestamp;
	
					// if the latest call was less that the wait period ago
					// then we reset the timeout to wait for the difference
					if (last < wait) {
						scrollTimer = setTimeout(afterScroll, wait - last);
	
						// or if not we can null out the timer and run the latest
					} else {
						scrollTimer = null;
						lazySizesConfig.loadMode = 3;
						throttledCheckElements();
					}
				};
	
				isCompleted = true;
				lowRuns += 8;
	
				lazySizesConfig.loadMode = 3;
	
				addEventListener('scroll', function(){
					timestamp = Date.now();
					if(!scrollTimer){
						lazySizesConfig.loadMode = 2;
						scrollTimer = setTimeout(afterScroll, wait);
					}
				}, true);
			};
			*/
	
			return {
				_: function(){
					started = Date.now();
	
					lazyloadElems = document.getElementsByClassName(lazySizesConfig.lazyClass);
					preloadElems = document.getElementsByClassName(lazySizesConfig.lazyClass + ' ' + lazySizesConfig.preloadClass);
					hFac = lazySizesConfig.hFac;
	
					addEventListener('scroll', throttledCheckElements, true);
	
					addEventListener('resize', throttledCheckElements, true);
	
					if(window.MutationObserver){
						new MutationObserver( throttledCheckElements ).observe( docElem, {childList: true, subtree: true, attributes: true} );
					} else {
						docElem[_addEventListener]('DOMNodeInserted', throttledCheckElements, true);
						docElem[_addEventListener]('DOMAttrModified', throttledCheckElements, true);
						setInterval(throttledCheckElements, 999);
					}
	
					addEventListener('hashchange', throttledCheckElements, true);
	
					//, 'fullscreenchange'
					['focus', 'mouseover', 'click', 'load', 'transitionend', 'animationend', 'webkitAnimationEnd'].forEach(function(name){
						document[_addEventListener](name, throttledCheckElements, true);
					});
	
					if((/d$|^c/.test(document.readyState))){
						onload();
					} else {
						addEventListener('load', onload);
						document[_addEventListener]('DOMContentLoaded', throttledCheckElements);
						setTimeout(onload, 20000);
					}
	
					throttledCheckElements(lazyloadElems.length > 0);
				},
				checkElems: throttledCheckElements,
				unveil: unveilElement
			};
		})();
	
	
		var autoSizer = (function(){
			var autosizesElems;
	
			var sizeElement = function (elem, dataAttr, width){
				var sources, i, len, event;
				var parent = elem.parentNode;
	
				if(parent){
					width = getWidth(elem, parent, width);
					event = triggerEvent(elem, 'lazybeforesizes', {width: width, dataAttr: !!dataAttr});
	
					if(!event.defaultPrevented){
						width = event.detail.width;
	
						if(width && width !== elem._lazysizesWidth){
							elem._lazysizesWidth = width;
							width += 'px';
							elem.setAttribute('sizes', width);
	
							if(regPicture.test(parent.nodeName || '')){
								sources = parent.getElementsByTagName('source');
								for(i = 0, len = sources.length; i < len; i++){
									sources[i].setAttribute('sizes', width);
								}
							}
	
							if(!event.detail.dataAttr){
								updatePolyfill(elem, event.detail);
							}
						}
					}
				}
			};
	
			var updateElementsSizes = function(){
				var i;
				var len = autosizesElems.length;
				if(len){
					i = 0;
	
					for(; i < len; i++){
						sizeElement(autosizesElems[i]);
					}
				}
			};
	
			var throttledUpdateElementsSizes = throttle(updateElementsSizes);
	
			return {
				_: function(){
					autosizesElems = document.getElementsByClassName(lazySizesConfig.autosizesClass);
					addEventListener('resize', throttledUpdateElementsSizes);
				},
				checkElems: throttledUpdateElementsSizes,
				updateElem: sizeElement
			};
		})();
	
		var init = function(){
			if(!init.i){
				init.i = true;
				autoSizer._();
				loader._();
			}
		};
	
		(function(){
			var prop;
	
			var lazySizesDefaults = {
				lazyClass: 'lazyload',
				loadedClass: 'lazyloaded',
				loadingClass: 'lazyloading',
				preloadClass: 'lazypreload',
				errorClass: 'lazyerror',
				//strictClass: 'lazystrict',
				autosizesClass: 'lazyautosizes',
				srcAttr: 'data-src',
				srcsetAttr: 'data-srcset',
				sizesAttr: 'data-sizes',
				//preloadAfterLoad: false,
				minSize: 40,
				customMedia: {},
				init: true,
				expFactor: 1.7,
				hFac: 0.8,
				loadMode: 2
			};
	
			lazySizesConfig = window.lazySizesConfig || window.lazysizesConfig || {};
	
			for(prop in lazySizesDefaults){
				if(!(prop in lazySizesConfig)){
					lazySizesConfig[prop] = lazySizesDefaults[prop];
				}
			}
	
			window.lazySizesConfig = lazySizesConfig;
	
			setTimeout(function(){
				if(lazySizesConfig.init){
					init();
				}
			});
		})();
	
		return {
			cfg: lazySizesConfig,
			autoSizer: autoSizer,
			loader: loader,
			init: init,
			uP: updatePolyfill,
			aC: addClass,
			rC: removeClass,
			hC: hasClass,
			fire: triggerEvent,
			gW: getWidth
		};
	}));


/***/ },
/* 3 */
/***/ function(module, exports) {

	/*! (C) WebReflection Mit Style License */
	(function(e,t,n,r){"use strict";function rt(e,t){for(var n=0,r=e.length;n<r;n++)vt(e[n],t)}function it(e){for(var t=0,n=e.length,r;t<n;t++)r=e[t],nt(r,b[ot(r)])}function st(e){return function(t){j(t)&&(vt(t,e),rt(t.querySelectorAll(w),e))}}function ot(e){var t=e.getAttribute("is"),n=e.nodeName.toUpperCase(),r=S.call(y,t?v+t.toUpperCase():d+n);return t&&-1<r&&!ut(n,t)?-1:r}function ut(e,t){return-1<w.indexOf(e+'[is="'+t+'"]')}function at(e){var t=e.currentTarget,n=e.attrChange,r=e.attrName,i=e.target;Q&&(!i||i===t)&&t.attributeChangedCallback&&r!=="style"&&e.prevValue!==e.newValue&&t.attributeChangedCallback(r,n===e[a]?null:e.prevValue,n===e[l]?null:e.newValue)}function ft(e){var t=st(e);return function(e){X.push(t,e.target)}}function lt(e){K&&(K=!1,e.currentTarget.removeEventListener(h,lt)),rt((e.target||t).querySelectorAll(w),e.detail===o?o:s),B&&pt()}function ct(e,t){var n=this;q.call(n,e,t),G.call(n,{target:n})}function ht(e,t){D(e,t),et?et.observe(e,z):(J&&(e.setAttribute=ct,e[i]=Z(e),e.addEventListener(p,G)),e.addEventListener(c,at)),e.createdCallback&&Q&&(e.created=!0,e.createdCallback(),e.created=!1)}function pt(){for(var e,t=0,n=F.length;t<n;t++)e=F[t],E.contains(e)||(n--,F.splice(t--,1),vt(e,o))}function dt(e){throw new Error("A "+e+" type is already registered")}function vt(e,t){var n,r=ot(e);-1<r&&(tt(e,b[r]),r=0,t===s&&!e[s]?(e[o]=!1,e[s]=!0,r=1,B&&S.call(F,e)<0&&F.push(e)):t===o&&!e[o]&&(e[s]=!1,e[o]=!0,r=1),r&&(n=e[t+"Callback"])&&n.call(e))}if(r in t)return;var i="__"+r+(Math.random()*1e5>>0),s="attached",o="detached",u="extends",a="ADDITION",f="MODIFICATION",l="REMOVAL",c="DOMAttrModified",h="DOMContentLoaded",p="DOMSubtreeModified",d="<",v="=",m=/^[A-Z][A-Z0-9]*(?:-[A-Z0-9]+)+$/,g=["ANNOTATION-XML","COLOR-PROFILE","FONT-FACE","FONT-FACE-SRC","FONT-FACE-URI","FONT-FACE-FORMAT","FONT-FACE-NAME","MISSING-GLYPH"],y=[],b=[],w="",E=t.documentElement,S=y.indexOf||function(e){for(var t=this.length;t--&&this[t]!==e;);return t},x=n.prototype,T=x.hasOwnProperty,N=x.isPrototypeOf,C=n.defineProperty,k=n.getOwnPropertyDescriptor,L=n.getOwnPropertyNames,A=n.getPrototypeOf,O=n.setPrototypeOf,M=!!n.__proto__,_=n.create||function mt(e){return e?(mt.prototype=e,new mt):this},D=O||(M?function(e,t){return e.__proto__=t,e}:L&&k?function(){function e(e,t){for(var n,r=L(t),i=0,s=r.length;i<s;i++)n=r[i],T.call(e,n)||C(e,n,k(t,n))}return function(t,n){do e(t,n);while((n=A(n))&&!N.call(n,t));return t}}():function(e,t){for(var n in t)e[n]=t[n];return e}),P=e.MutationObserver||e.WebKitMutationObserver,H=(e.HTMLElement||e.Element||e.Node).prototype,B=!N.call(H,E),j=B?function(e){return e.nodeType===1}:function(e){return N.call(H,e)},F=B&&[],I=H.cloneNode,q=H.setAttribute,R=H.removeAttribute,U=t.createElement,z=P&&{attributes:!0,characterData:!0,attributeOldValue:!0},W=P||function(e){J=!1,E.removeEventListener(c,W)},X,V=e.requestAnimationFrame||e.webkitRequestAnimationFrame||e.mozRequestAnimationFrame||e.msRequestAnimationFrame||function(e){setTimeout(e,10)},$=!1,J=!0,K=!0,Q=!0,G,Y,Z,et,tt,nt;O||M?(tt=function(e,t){N.call(t,e)||ht(e,t)},nt=ht):(tt=function(e,t){e[i]||(e[i]=n(!0),ht(e,t))},nt=tt),B?(J=!1,function(){var e=k(H,"addEventListener"),t=e.value,n=function(e){var t=new CustomEvent(c,{bubbles:!0});t.attrName=e,t.prevValue=this.getAttribute(e),t.newValue=null,t[l]=t.attrChange=2,R.call(this,e),this.dispatchEvent(t)},r=function(e,t){var n=this.hasAttribute(e),r=n&&this.getAttribute(e),i=new CustomEvent(c,{bubbles:!0});q.call(this,e,t),i.attrName=e,i.prevValue=n?r:null,i.newValue=t,n?i[f]=i.attrChange=1:i[a]=i.attrChange=0,this.dispatchEvent(i)},s=function(e){var t=e.currentTarget,n=t[i],r=e.propertyName,s;n.hasOwnProperty(r)&&(n=n[r],s=new CustomEvent(c,{bubbles:!0}),s.attrName=n.name,s.prevValue=n.value||null,s.newValue=n.value=t[r]||null,s.prevValue==null?s[a]=s.attrChange=0:s[f]=s.attrChange=1,t.dispatchEvent(s))};e.value=function(e,o,u){e===c&&this.attributeChangedCallback&&this.setAttribute!==r&&(this[i]={className:{name:"class",value:this.className}},this.setAttribute=r,this.removeAttribute=n,t.call(this,"propertychange",s)),t.call(this,e,o,u)},C(H,"addEventListener",e)}()):P||(E.addEventListener(c,W),E.setAttribute(i,1),E.removeAttribute(i),J&&(G=function(e){var t=this,n,r,s;if(t===e.target){n=t[i],t[i]=r=Z(t);for(s in r){if(!(s in n))return Y(0,t,s,n[s],r[s],a);if(r[s]!==n[s])return Y(1,t,s,n[s],r[s],f)}for(s in n)if(!(s in r))return Y(2,t,s,n[s],r[s],l)}},Y=function(e,t,n,r,i,s){var o={attrChange:e,currentTarget:t,attrName:n,prevValue:r,newValue:i};o[s]=e,at(o)},Z=function(e){for(var t,n,r={},i=e.attributes,s=0,o=i.length;s<o;s++)t=i[s],n=t.name,n!=="setAttribute"&&(r[n]=t.value);return r})),t[r]=function(n,r){c=n.toUpperCase(),$||($=!0,P?(et=function(e,t){function n(e,t){for(var n=0,r=e.length;n<r;t(e[n++]));}return new P(function(r){for(var i,s,o,u=0,a=r.length;u<a;u++)i=r[u],i.type==="childList"?(n(i.addedNodes,e),n(i.removedNodes,t)):(s=i.target,Q&&s.attributeChangedCallback&&i.attributeName!=="style"&&(o=s.getAttribute(i.attributeName),o!==i.oldValue&&s.attributeChangedCallback(i.attributeName,i.oldValue,o)))})}(st(s),st(o)),et.observe(t,{childList:!0,subtree:!0})):(X=[],V(function E(){while(X.length)X.shift().call(null,X.shift());V(E)}),t.addEventListener("DOMNodeInserted",ft(s)),t.addEventListener("DOMNodeRemoved",ft(o))),t.addEventListener(h,lt),t.addEventListener("readystatechange",lt),t.createElement=function(e,n){var r=U.apply(t,arguments),i=""+e,s=S.call(y,(n?v:d)+(n||i).toUpperCase()),o=-1<s;return n&&(r.setAttribute("is",n=n.toLowerCase()),o&&(o=ut(i.toUpperCase(),n))),Q=!t.createElement.innerHTMLHelper,o&&nt(r,b[s]),r},H.cloneNode=function(e){var t=I.call(this,!!e),n=ot(t);return-1<n&&nt(t,b[n]),e&&it(t.querySelectorAll(w)),t}),-2<S.call(y,v+c)+S.call(y,d+c)&&dt(n);if(!m.test(c)||-1<S.call(g,c))throw new Error("The type "+n+" is invalid");var i=function(){return f?t.createElement(l,c):t.createElement(l)},a=r||x,f=T.call(a,u),l=f?r[u].toUpperCase():c,c,p;return f&&-1<S.call(y,d+l)&&dt(l),p=y.push((f?v:d)+c)-1,w=w.concat(w.length?",":"",f?l+'[is="'+n.toLowerCase()+'"]':l),i.prototype=b[p]=T.call(a,"prototype")?a.prototype:_(H),rt(t.querySelectorAll(w),s),i}})(window,document,Object,"registerElement");

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var $ = __webpack_require__(5);
	
	module.exports = {
	    init: function init() {
	
	        var navigation = $('#site-navigation');
	
	        var menuToggle = $('.menu-toggle').on('click', function () {
	            menuToggle.toggleClass('active');
	            navigation.toggleClass('open');
	        });
	
	        navigation.on('click', 'a', function () {
	            menuToggle.removeClass('active');
	            navigation.removeClass('open');
	        });
	    }
	};

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = jQuery;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _createStore = __webpack_require__(7);
	
	var _createStore2 = _interopRequireDefault(_createStore);
	
	var _combineReducers = __webpack_require__(9);
	
	var _combineReducers2 = _interopRequireDefault(_combineReducers);
	
	var _bindActionCreators = __webpack_require__(12);
	
	var _bindActionCreators2 = _interopRequireDefault(_bindActionCreators);
	
	var _applyMiddleware = __webpack_require__(13);
	
	var _applyMiddleware2 = _interopRequireDefault(_applyMiddleware);
	
	var _compose = __webpack_require__(14);
	
	var _compose2 = _interopRequireDefault(_compose);
	
	/*
	* This is a dummy function to check if the function name has been altered by minification.
	* If the function has been minified and NODE_ENV !== 'production', warn the user.
	*/
	function isCrushed() {}
	
	if (isCrushed.name !== 'isCrushed' && ("production") !== 'production') {
	  /*eslint-disable no-console */
	  console.error('You are currently using minified code outside of NODE_ENV === \'production\'. ' + 'This means that you are running a slower development build of Redux. ' + 'You can use loose-envify (https://github.com/zertosh/loose-envify) for browserify ' + 'or DefinePlugin for webpack (http://stackoverflow.com/questions/30030031) ' + 'to ensure you have the correct code for your production build.');
	  /*eslint-enable */
	}
	
	exports.createStore = _createStore2['default'];
	exports.combineReducers = _combineReducers2['default'];
	exports.bindActionCreators = _bindActionCreators2['default'];
	exports.applyMiddleware = _applyMiddleware2['default'];
	exports.compose = _compose2['default'];

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = createStore;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _utilsIsPlainObject = __webpack_require__(8);
	
	var _utilsIsPlainObject2 = _interopRequireDefault(_utilsIsPlainObject);
	
	/**
	 * These are private action types reserved by Redux.
	 * For any unknown actions, you must return the current state.
	 * If the current state is undefined, you must return the initial state.
	 * Do not reference these action types directly in your code.
	 */
	var ActionTypes = {
	  INIT: '@@redux/INIT'
	};
	
	exports.ActionTypes = ActionTypes;
	/**
	 * Creates a Redux store that holds the state tree.
	 * The only way to change the data in the store is to call `dispatch()` on it.
	 *
	 * There should only be a single store in your app. To specify how different
	 * parts of the state tree respond to actions, you may combine several reducers
	 * into a single reducer function by using `combineReducers`.
	 *
	 * @param {Function} reducer A function that returns the next state tree, given
	 * the current state tree and the action to handle.
	 *
	 * @param {any} [initialState] The initial state. You may optionally specify it
	 * to hydrate the state from the server in universal apps, or to restore a
	 * previously serialized user session.
	 * If you use `combineReducers` to produce the root reducer function, this must be
	 * an object with the same shape as `combineReducers` keys.
	 *
	 * @returns {Store} A Redux store that lets you read the state, dispatch actions
	 * and subscribe to changes.
	 */
	
	function createStore(reducer, initialState) {
	  if (typeof reducer !== 'function') {
	    throw new Error('Expected the reducer to be a function.');
	  }
	
	  var currentReducer = reducer;
	  var currentState = initialState;
	  var listeners = [];
	  var isDispatching = false;
	
	  /**
	   * Reads the state tree managed by the store.
	   *
	   * @returns {any} The current state tree of your application.
	   */
	  function getState() {
	    return currentState;
	  }
	
	  /**
	   * Adds a change listener. It will be called any time an action is dispatched,
	   * and some part of the state tree may potentially have changed. You may then
	   * call `getState()` to read the current state tree inside the callback.
	   *
	   * @param {Function} listener A callback to be invoked on every dispatch.
	   * @returns {Function} A function to remove this change listener.
	   */
	  function subscribe(listener) {
	    listeners.push(listener);
	    var isSubscribed = true;
	
	    return function unsubscribe() {
	      if (!isSubscribed) {
	        return;
	      }
	
	      isSubscribed = false;
	      var index = listeners.indexOf(listener);
	      listeners.splice(index, 1);
	    };
	  }
	
	  /**
	   * Dispatches an action. It is the only way to trigger a state change.
	   *
	   * The `reducer` function, used to create the store, will be called with the
	   * current state tree and the given `action`. Its return value will
	   * be considered the **next** state of the tree, and the change listeners
	   * will be notified.
	   *
	   * The base implementation only supports plain object actions. If you want to
	   * dispatch a Promise, an Observable, a thunk, or something else, you need to
	   * wrap your store creating function into the corresponding middleware. For
	   * example, see the documentation for the `redux-thunk` package. Even the
	   * middleware will eventually dispatch plain object actions using this method.
	   *
	   * @param {Object} action A plain object representing “what changed”. It is
	   * a good idea to keep actions serializable so you can record and replay user
	   * sessions, or use the time travelling `redux-devtools`. An action must have
	   * a `type` property which may not be `undefined`. It is a good idea to use
	   * string constants for action types.
	   *
	   * @returns {Object} For convenience, the same action object you dispatched.
	   *
	   * Note that, if you use a custom middleware, it may wrap `dispatch()` to
	   * return something else (for example, a Promise you can await).
	   */
	  function dispatch(action) {
	    if (!_utilsIsPlainObject2['default'](action)) {
	      throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
	    }
	
	    if (typeof action.type === 'undefined') {
	      throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
	    }
	
	    if (isDispatching) {
	      throw new Error('Reducers may not dispatch actions.');
	    }
	
	    try {
	      isDispatching = true;
	      currentState = currentReducer(currentState, action);
	    } finally {
	      isDispatching = false;
	    }
	
	    listeners.slice().forEach(function (listener) {
	      return listener();
	    });
	    return action;
	  }
	
	  /**
	   * Replaces the reducer currently used by the store to calculate the state.
	   *
	   * You might need this if your app implements code splitting and you want to
	   * load some of the reducers dynamically. You might also need this if you
	   * implement a hot reloading mechanism for Redux.
	   *
	   * @param {Function} nextReducer The reducer for the store to use instead.
	   * @returns {void}
	   */
	  function replaceReducer(nextReducer) {
	    currentReducer = nextReducer;
	    dispatch({ type: ActionTypes.INIT });
	  }
	
	  // When a store is created, an "INIT" action is dispatched so that every
	  // reducer returns their initial state. This effectively populates
	  // the initial state tree.
	  dispatch({ type: ActionTypes.INIT });
	
	  return {
	    dispatch: dispatch,
	    subscribe: subscribe,
	    getState: getState,
	    replaceReducer: replaceReducer
	  };
	}

/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = isPlainObject;
	var fnToString = function fnToString(fn) {
	  return Function.prototype.toString.call(fn);
	};
	var objStringValue = fnToString(Object);
	
	/**
	 * @param {any} obj The object to inspect.
	 * @returns {boolean} True if the argument appears to be a plain object.
	 */
	
	function isPlainObject(obj) {
	  if (!obj || typeof obj !== 'object') {
	    return false;
	  }
	
	  var proto = typeof obj.constructor === 'function' ? Object.getPrototypeOf(obj) : Object.prototype;
	
	  if (proto === null) {
	    return true;
	  }
	
	  var constructor = proto.constructor;
	
	  return typeof constructor === 'function' && constructor instanceof constructor && fnToString(constructor) === objStringValue;
	}
	
	module.exports = exports['default'];

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = combineReducers;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _createStore = __webpack_require__(7);
	
	var _utilsIsPlainObject = __webpack_require__(8);
	
	var _utilsIsPlainObject2 = _interopRequireDefault(_utilsIsPlainObject);
	
	var _utilsMapValues = __webpack_require__(10);
	
	var _utilsMapValues2 = _interopRequireDefault(_utilsMapValues);
	
	var _utilsPick = __webpack_require__(11);
	
	var _utilsPick2 = _interopRequireDefault(_utilsPick);
	
	/* eslint-disable no-console */
	
	function getUndefinedStateErrorMessage(key, action) {
	  var actionType = action && action.type;
	  var actionName = actionType && '"' + actionType.toString() + '"' || 'an action';
	
	  return 'Reducer "' + key + '" returned undefined handling ' + actionName + '. ' + 'To ignore an action, you must explicitly return the previous state.';
	}
	
	function getUnexpectedStateShapeWarningMessage(inputState, reducers, action) {
	  var reducerKeys = Object.keys(reducers);
	  var argumentName = action && action.type === _createStore.ActionTypes.INIT ? 'initialState argument passed to createStore' : 'previous state received by the reducer';
	
	  if (reducerKeys.length === 0) {
	    return 'Store does not have a valid reducer. Make sure the argument passed ' + 'to combineReducers is an object whose values are reducers.';
	  }
	
	  if (!_utilsIsPlainObject2['default'](inputState)) {
	    return 'The ' + argumentName + ' has unexpected type of "' + ({}).toString.call(inputState).match(/\s([a-z|A-Z]+)/)[1] + '". Expected argument to be an object with the following ' + ('keys: "' + reducerKeys.join('", "') + '"');
	  }
	
	  var unexpectedKeys = Object.keys(inputState).filter(function (key) {
	    return !reducers.hasOwnProperty(key);
	  });
	
	  if (unexpectedKeys.length > 0) {
	    return 'Unexpected ' + (unexpectedKeys.length > 1 ? 'keys' : 'key') + ' ' + ('"' + unexpectedKeys.join('", "') + '" found in ' + argumentName + '. ') + 'Expected to find one of the known reducer keys instead: ' + ('"' + reducerKeys.join('", "') + '". Unexpected keys will be ignored.');
	  }
	}
	
	function assertReducerSanity(reducers) {
	  Object.keys(reducers).forEach(function (key) {
	    var reducer = reducers[key];
	    var initialState = reducer(undefined, { type: _createStore.ActionTypes.INIT });
	
	    if (typeof initialState === 'undefined') {
	      throw new Error('Reducer "' + key + '" returned undefined during initialization. ' + 'If the state passed to the reducer is undefined, you must ' + 'explicitly return the initial state. The initial state may ' + 'not be undefined.');
	    }
	
	    var type = '@@redux/PROBE_UNKNOWN_ACTION_' + Math.random().toString(36).substring(7).split('').join('.');
	    if (typeof reducer(undefined, { type: type }) === 'undefined') {
	      throw new Error('Reducer "' + key + '" returned undefined when probed with a random type. ' + ('Don\'t try to handle ' + _createStore.ActionTypes.INIT + ' or other actions in "redux/*" ') + 'namespace. They are considered private. Instead, you must return the ' + 'current state for any unknown actions, unless it is undefined, ' + 'in which case you must return the initial state, regardless of the ' + 'action type. The initial state may not be undefined.');
	    }
	  });
	}
	
	/**
	 * Turns an object whose values are different reducer functions, into a single
	 * reducer function. It will call every child reducer, and gather their results
	 * into a single state object, whose keys correspond to the keys of the passed
	 * reducer functions.
	 *
	 * @param {Object} reducers An object whose values correspond to different
	 * reducer functions that need to be combined into one. One handy way to obtain
	 * it is to use ES6 `import * as reducers` syntax. The reducers may never return
	 * undefined for any action. Instead, they should return their initial state
	 * if the state passed to them was undefined, and the current state for any
	 * unrecognized action.
	 *
	 * @returns {Function} A reducer function that invokes every reducer inside the
	 * passed object, and builds a state object with the same shape.
	 */
	
	function combineReducers(reducers) {
	  var finalReducers = _utilsPick2['default'](reducers, function (val) {
	    return typeof val === 'function';
	  });
	  var sanityError;
	
	  try {
	    assertReducerSanity(finalReducers);
	  } catch (e) {
	    sanityError = e;
	  }
	
	  return function combination(state, action) {
	    if (state === undefined) state = {};
	
	    if (sanityError) {
	      throw sanityError;
	    }
	
	    if (false) {
	      var warningMessage = getUnexpectedStateShapeWarningMessage(state, finalReducers, action);
	      if (warningMessage) {
	        console.error(warningMessage);
	      }
	    }
	
	    var hasChanged = false;
	    var finalState = _utilsMapValues2['default'](finalReducers, function (reducer, key) {
	      var previousStateForKey = state[key];
	      var nextStateForKey = reducer(previousStateForKey, action);
	      if (typeof nextStateForKey === 'undefined') {
	        var errorMessage = getUndefinedStateErrorMessage(key, action);
	        throw new Error(errorMessage);
	      }
	      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
	      return nextStateForKey;
	    });
	
	    return hasChanged ? finalState : state;
	  };
	}
	
	module.exports = exports['default'];

/***/ },
/* 10 */
/***/ function(module, exports) {

	/**
	 * Applies a function to every key-value pair inside an object.
	 *
	 * @param {Object} obj The source object.
	 * @param {Function} fn The mapper function that receives the value and the key.
	 * @returns {Object} A new object that contains the mapped values for the keys.
	 */
	"use strict";
	
	exports.__esModule = true;
	exports["default"] = mapValues;
	
	function mapValues(obj, fn) {
	  return Object.keys(obj).reduce(function (result, key) {
	    result[key] = fn(obj[key], key);
	    return result;
	  }, {});
	}
	
	module.exports = exports["default"];

/***/ },
/* 11 */
/***/ function(module, exports) {

	/**
	 * Picks key-value pairs from an object where values satisfy a predicate.
	 *
	 * @param {Object} obj The object to pick from.
	 * @param {Function} fn The predicate the values must satisfy to be copied.
	 * @returns {Object} The object with the values that satisfied the predicate.
	 */
	"use strict";
	
	exports.__esModule = true;
	exports["default"] = pick;
	
	function pick(obj, fn) {
	  return Object.keys(obj).reduce(function (result, key) {
	    if (fn(obj[key])) {
	      result[key] = obj[key];
	    }
	    return result;
	  }, {});
	}
	
	module.exports = exports["default"];

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = bindActionCreators;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _utilsMapValues = __webpack_require__(10);
	
	var _utilsMapValues2 = _interopRequireDefault(_utilsMapValues);
	
	function bindActionCreator(actionCreator, dispatch) {
	  return function () {
	    return dispatch(actionCreator.apply(undefined, arguments));
	  };
	}
	
	/**
	 * Turns an object whose values are action creators, into an object with the
	 * same keys, but with every function wrapped into a `dispatch` call so they
	 * may be invoked directly. This is just a convenience method, as you can call
	 * `store.dispatch(MyActionCreators.doSomething())` yourself just fine.
	 *
	 * For convenience, you can also pass a single function as the first argument,
	 * and get a function in return.
	 *
	 * @param {Function|Object} actionCreators An object whose values are action
	 * creator functions. One handy way to obtain it is to use ES6 `import * as`
	 * syntax. You may also pass a single function.
	 *
	 * @param {Function} dispatch The `dispatch` function available on your Redux
	 * store.
	 *
	 * @returns {Function|Object} The object mimicking the original object, but with
	 * every action creator wrapped into the `dispatch` call. If you passed a
	 * function as `actionCreators`, the return value will also be a single
	 * function.
	 */
	
	function bindActionCreators(actionCreators, dispatch) {
	  if (typeof actionCreators === 'function') {
	    return bindActionCreator(actionCreators, dispatch);
	  }
	
	  if (typeof actionCreators !== 'object' || actionCreators === null || actionCreators === undefined) {
	    throw new Error('bindActionCreators expected an object or a function, instead received ' + (actionCreators === null ? 'null' : typeof actionCreators) + '. ' + 'Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?');
	  }
	
	  return _utilsMapValues2['default'](actionCreators, function (actionCreator) {
	    return bindActionCreator(actionCreator, dispatch);
	  });
	}
	
	module.exports = exports['default'];

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	exports['default'] = applyMiddleware;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _compose = __webpack_require__(14);
	
	var _compose2 = _interopRequireDefault(_compose);
	
	/**
	 * Creates a store enhancer that applies middleware to the dispatch method
	 * of the Redux store. This is handy for a variety of tasks, such as expressing
	 * asynchronous actions in a concise manner, or logging every action payload.
	 *
	 * See `redux-thunk` package as an example of the Redux middleware.
	 *
	 * Because middleware is potentially asynchronous, this should be the first
	 * store enhancer in the composition chain.
	 *
	 * Note that each middleware will be given the `dispatch` and `getState` functions
	 * as named arguments.
	 *
	 * @param {...Function} middlewares The middleware chain to be applied.
	 * @returns {Function} A store enhancer applying the middleware.
	 */
	
	function applyMiddleware() {
	  for (var _len = arguments.length, middlewares = Array(_len), _key = 0; _key < _len; _key++) {
	    middlewares[_key] = arguments[_key];
	  }
	
	  return function (next) {
	    return function (reducer, initialState) {
	      var store = next(reducer, initialState);
	      var _dispatch = store.dispatch;
	      var chain = [];
	
	      var middlewareAPI = {
	        getState: store.getState,
	        dispatch: function dispatch(action) {
	          return _dispatch(action);
	        }
	      };
	      chain = middlewares.map(function (middleware) {
	        return middleware(middlewareAPI);
	      });
	      _dispatch = _compose2['default'].apply(undefined, chain)(store.dispatch);
	
	      return _extends({}, store, {
	        dispatch: _dispatch
	      });
	    };
	  };
	}
	
	module.exports = exports['default'];

/***/ },
/* 14 */
/***/ function(module, exports) {

	/**
	 * Composes single-argument functions from right to left.
	 *
	 * @param {...Function} funcs The functions to compose.
	 * @returns {Function} A function obtained by composing functions from right to
	 * left. For example, compose(f, g, h) is identical to arg => f(g(h(arg))).
	 */
	"use strict";
	
	exports.__esModule = true;
	exports["default"] = compose;
	
	function compose() {
	  for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
	    funcs[_key] = arguments[_key];
	  }
	
	  return function () {
	    if (funcs.length === 0) {
	      return arguments[0];
	    }
	
	    var last = funcs[funcs.length - 1];
	    var rest = funcs.slice(0, -1);
	
	    return rest.reduceRight(function (composed, f) {
	      return f(composed);
	    }, last.apply(undefined, arguments));
	  };
	}
	
	module.exports = exports["default"];

/***/ },
/* 15 */
/***/ function(module, exports) {

	"use strict";
	
	module.exports = {
	    "categories": [{
	        "name": "Pizzakenyerek",
	        "id": "pizzakenyerek"
	    }, {
	        "name": "Klasszikus pizzák",
	        "id": "klasszikus-pizzak"
	    }, {
	        "name": "Extra pizzák",
	        "id": "extra-pizzak"
	    }, {
	        "name": "Full a fullban pizzák",
	        "id": "full-a-fullban-pizzak"
	    }, {
	        "name": "Meex specialitás",
	        "id": "meex-specialitas"
	    }, {
	        "name": "Tészták",
	        "id": "tesztak"
	    }, {
	        "name": "Rántott sajtok",
	        "id": "rantott-sajtok"
	    }, {
	        "name": "Frissensültek",
	        "id": "frissensultek"
	    }, {
	        "name": "Hamburgerek",
	        "id": "hamburgerek"
	    }, {
	        "name": "Hamburger menük",
	        "id": "hamburger-menuk"
	    }, {
	        "name": "Fitnesz szendvicsek",
	        "id": "fitnesz-szendvicsek"
	    }, {
	        "name": "Saláták",
	        "id": "salatak"
	    }, {
	        "name": "Édességek",
	        "id": "edessegek"
	    }, {
	        "name": "Üdítők",
	        "id": "uditok"
	    }],
	    "dishes": [{
	        "categoryId": "pizzakenyerek",
	        "id": "pizzakenyer",
	        "category": "Pizzakenyerek",
	        "name": "Pizzakenyér",
	        "description": "TODO",
	        "imageName": "pizzakenyer",
	        "type": "none",
	        "variants": [{
	            "name": "30cm",
	            "price": 500
	        }],
	        "options": []
	    }, {
	        "categoryId": "pizzakenyerek",
	        "id": "sajtos-fokhagymas-pizzakenyer",
	        "category": "Pizzakenyerek",
	        "name": "Sajtos-fokhagymás pizzakenyér",
	        "description": "sajt, fokhagyma, fűszerkeverék",
	        "imageName": "pizzakenyer",
	        "type": "none",
	        "variants": [{
	            "name": "30cm",
	            "price": 600
	        }],
	        "options": []
	    }, {
	        "categoryId": "klasszikus-pizzak",
	        "id": "margarita-pizza",
	        "category": "Klasszikus pizzák",
	        "name": "Margarita pizza",
	        "description": "fűszeres paradicsomszósz, sajt",
	        "imageName": "margarita-pizza",
	        "type": "pizza",
	        "variants": [{
	            "name": "30cm",
	            "price": 850
	        }, {
	            "name": "40cm",
	            "price": 1850
	        }, {
	            "name": "50cm",
	            "price": 2700
	        }],
	        "options": []
	    }, {
	        "categoryId": "klasszikus-pizzak",
	        "id": "sonkas-pizza",
	        "category": "Klasszikus pizzák",
	        "name": "Sonkás pizza",
	        "description": "fűszeres paradicsomszósz, sajt, sonka",
	        "imageName": "sonkas-pizza",
	        "type": "pizza",
	        "variants": [{
	            "name": "30cm",
	            "price": 1070
	        }, {
	            "name": "40cm",
	            "price": 2070
	        }, {
	            "name": "50cm",
	            "price": 2920
	        }],
	        "options": []
	    }, {
	        "categoryId": "klasszikus-pizzak",
	        "id": "szalamis-pizza",
	        "category": "Klasszikus pizzák",
	        "name": "Szalámis pizza",
	        "description": "fűszeres paradicsomszósz, sajt, paprikás szalámi",
	        "imageName": "szalamis-pizza",
	        "type": "pizza",
	        "variants": [{
	            "name": "30cm",
	            "price": 1070
	        }, {
	            "name": "40cm",
	            "price": 2070
	        }, {
	            "name": "50cm",
	            "price": 2920
	        }],
	        "options": []
	    }, {
	        "categoryId": "klasszikus-pizzak",
	        "id": "sonka-ku-pizza",
	        "category": "Klasszikus pizzák",
	        "name": "Sonka-ku pizza",
	        "description": "fűszeres paradicsomszósz, sajt, sonka, kukorica",
	        "imageName": "sonka-ku-pizza",
	        "type": "pizza",
	        "variants": [{
	            "name": "30cm",
	            "price": 1070
	        }, {
	            "name": "40cm",
	            "price": 2070
	        }, {
	            "name": "50cm",
	            "price": 2920
	        }],
	        "options": []
	    }, {
	        "categoryId": "klasszikus-pizzak",
	        "id": "bacon-pizza",
	        "category": "Klasszikus pizzák",
	        "name": "Bacon pizza",
	        "description": "fűszeres paradicsomszósz, sajt, pirított bacon",
	        "imageName": "bacon-pizza",
	        "type": "pizza",
	        "variants": [{
	            "name": "30cm",
	            "price": 1070
	        }, {
	            "name": "40cm",
	            "price": 2070
	        }, {
	            "name": "50cm",
	            "price": 2920
	        }],
	        "options": []
	    }, {
	        "categoryId": "klasszikus-pizzak",
	        "id": "4-sajtos-pizza",
	        "category": "Klasszikus pizzák",
	        "name": "4 Sajtos pizza",
	        "description": "fűszeres paradicsomszósz, sajt, parmezán, gorgonzola, füstölt sajt",
	        "imageName": "4-sajtos-pizza",
	        "type": "pizza",
	        "variants": [{
	            "name": "30cm",
	            "price": 1070
	        }, {
	            "name": "40cm",
	            "price": 2070
	        }, {
	            "name": "50cm",
	            "price": 2920
	        }],
	        "options": []
	    }, {
	        "categoryId": "klasszikus-pizzak",
	        "id": "hawaii-pizza",
	        "category": "Klasszikus pizzák",
	        "name": "Hawaii pizza",
	        "description": "fűszeres paradicsomszósz vagy fűszeres tejfölös szósz, sajt, sonka, ananász, füstölt sajt",
	        "imageName": "hawaii-pizza",
	        "type": "pizza",
	        "variants": [{
	            "name": "30cm",
	            "price": 1070
	        }, {
	            "name": "40cm",
	            "price": 2070
	        }, {
	            "name": "50cm",
	            "price": 2920
	        }],
	        "options": []
	    }, {
	        "categoryId": "extra-pizzak",
	        "id": "zoldseges-pizza",
	        "category": "Extra pizzák",
	        "name": "Zöldséges pizza",
	        "description": "fokhagymás tejfölös alap, sajt, padlizsán karikák, cukkini, répa szeletek, párolt fűszeres csirkemell",
	        "imageName": "zoldseges-pizza",
	        "type": "pizza",
	        "variants": [{
	            "name": "30cm",
	            "price": 1190
	        }],
	        "options": []
	    }, {
	        "categoryId": "extra-pizzak",
	        "id": "tonhalas-pizza",
	        "category": "Extra pizzák",
	        "name": "Tonhalas pizza",
	        "description": "fűszeres paradicsomszósz, sajt, vöröshagyma, citrom, capribogyó, toszkánai tonhalgerezdek",
	        "imageName": "tonhalas-pizza",
	        "type": "pizza",
	        "variants": [{
	            "name": "30cm",
	            "price": 1190
	        }],
	        "options": []
	    }, {
	        "categoryId": "extra-pizzak",
	        "id": "piedone-pizza",
	        "category": "Extra pizzák",
	        "name": "Piedone pizza",
	        "description": "fűszeres paradicsomszósz, sajt, hagyma, fehér és vörös óriásbab, pirított bacon, csípős cseresznyepaprika",
	        "imageName": "piedone-pizza",
	        "type": "pizza",
	        "variants": [{
	            "name": "30cm",
	            "price": 1190
	        }],
	        "options": []
	    }, {
	        "categoryId": "extra-pizzak",
	        "id": "joasszony-pizza",
	        "category": "Extra pizzák",
	        "name": "Jóasszony pizza",
	        "description": "fűszeres paradicsomszósz alap, sajt, paprikás szalámi, csípős cseresznyepaprika, csiperke gomba, hagyma",
	        "imageName": "joasszony-pizza",
	        "type": "pizza",
	        "variants": [{
	            "name": "30cm",
	            "price": 1190
	        }],
	        "options": []
	    }, {
	        "categoryId": "extra-pizzak",
	        "id": "3-kivansag-pizza",
	        "category": "Extra pizzák",
	        "name": "3 Kívánság pizza",
	        "description": "szabadon választott szósz alap, sajt, és pluszban három feltét",
	        "imageName": "3-kivansag-pizza",
	        "type": "pizza-3-free-options",
	        "variants": [{
	            "name": "30cm",
	            "price": 1190
	        }],
	        "options": []
	    }, {
	        "categoryId": "full-a-fullban-pizzak",
	        "id": "victorio-pizza",
	        "category": "Full a fullban pizzák",
	        "name": "Victorio pizza",
	        "description": "fokhagymás tejfölös alap, sajt, póréhagyma, mozzarella golyó, pirított bacon, juhturó",
	        "imageName": "victorio-pizza",
	        "type": "pizza",
	        "variants": [{
	            "name": "30cm",
	            "price": 1450
	        }],
	        "options": []
	    }, {
	        "categoryId": "full-a-fullban-pizzak",
	        "id": "hus-zabalo-pizza",
	        "category": "Full a fullban pizzák",
	        "name": "Hús-zabáló pizza",
	        "description": "fűszeres paradicsomszósz, sajt, csirkemell, sült tarja, sonka, bacon",
	        "imageName": "hus-zabalo-pizza",
	        "type": "pizza",
	        "variants": [{
	            "name": "30cm",
	            "price": 1450
	        }],
	        "options": []
	    }, {
	        "categoryId": "full-a-fullban-pizzak",
	        "id": "master-pizza",
	        "category": "Full a fullban pizzák",
	        "name": "Master pizza",
	        "description": "tejfölös mustáros tárkonyos ízvilág, sajt, sonka, kukorica, pirított bacon, csiperke gomba",
	        "imageName": "master-pizza",
	        "type": "pizza",
	        "variants": [{
	            "name": "30cm",
	            "price": 1450
	        }],
	        "options": []
	    }, {
	        "categoryId": "full-a-fullban-pizzak",
	        "id": "barbeque-pizza",
	        "category": "Full a fullban pizzák",
	        "name": "Barbeque pizza",
	        "description": "bbq alap szósz, sajt, bacon vagy csirkemell, vöröshagyma, pritamin paprika szeletek",
	        "imageName": "barbeque-pizza",
	        "type": "pizza",
	        "variants": [{
	            "name": "30cm",
	            "price": 1450
	        }],
	        "options": []
	    }, {
	        "categoryId": "full-a-fullban-pizzak",
	        "id": "jalapeno-barbeque-pizza",
	        "category": "Full a fullban pizzák",
	        "name": "Jalapeno Barbeque pizza",
	        "description": "fokhagymás bbq szósz, sajt, csirkemell, pirított póréhagyma, paradicsomkarika , jalapeno",
	        "imageName": "jalapeno-barbeque-pizza",
	        "type": "pizza",
	        "variants": [{
	            "name": "30cm",
	            "price": 1450
	        }],
	        "options": []
	    }, {
	        "categoryId": "full-a-fullban-pizzak",
	        "id": "tenger-kincsei-pizza",
	        "category": "Full a fullban pizzák",
	        "name": "Tenger kincsei pizza",
	        "description": "fűszeres paradicsomszósz, sajt, pácban érlelt tenger gyümölcsei, vegyes magozott olíva bogyó",
	        "imageName": "tenger-kincsei-pizza",
	        "type": "pizza",
	        "variants": [{
	            "name": "30cm",
	            "price": 1450
	        }],
	        "options": []
	    }, {
	        "categoryId": "full-a-fullban-pizzak",
	        "id": "dani-pizza",
	        "category": "Full a fullban pizzák",
	        "name": "Dani pizza",
	        "description": "tejfölös fokhagymás alap, sajt, főtt tarja, lila hagyma, bacon, szeletekre vágott jalapeno paprika",
	        "imageName": "dani-pizza",
	        "type": "pizza",
	        "variants": [{
	            "name": "30cm",
	            "price": 1450
	        }],
	        "options": []
	    }, {
	        "categoryId": "full-a-fullban-pizzak",
	        "id": "meex-toltott-pizza",
	        "category": "Full a fullban pizzák",
	        "name": "Meex töltött pizza",
	        "description": "tejfölös alap, paprikás szalámi, ruccola, ízletes cheddar sajt, jalapeno paprika",
	        "imageName": "meex-toltott-pizza",
	        "type": "pizza",
	        "variants": [{
	            "name": "30cm",
	            "price": 1450
	        }],
	        "options": []
	    }, {
	        "categoryId": "full-a-fullban-pizzak",
	        "id": "bossy-pizza",
	        "category": "Full a fullban pizzák",
	        "name": "Bossy pizza",
	        "description": "fűszeres paradicsomszósz, sajt, pármai sonka, frissen vágott ruccola, koktél paradicsom",
	        "imageName": "bossy-pizza",
	        "type": "pizza",
	        "variants": [{
	            "name": "30cm",
	            "price": 1450
	        }],
	        "options": []
	    }, {
	        "categoryId": "meex-specialitas",
	        "id": "akay-torok-pizza",
	        "category": "Meex specialitás",
	        "name": "Akay - török pizza",
	        "description": "fűszeres paradicsomos alap, sajt, sonka",
	        "imageName": "akay-torok-pizza",
	        "type": "none",
	        "variants": [{
	            "name": "",
	            "price": 490
	        }],
	        "options": []
	    }, {
	        "categoryId": "meex-specialitas",
	        "id": "banu-torok-pizza",
	        "category": "Meex specialitás",
	        "name": "Banu - török pizza",
	        "description": "tejfölös alap, sajt, tarja, pirított fokhagyma",
	        "imageName": "banu-torok-pizza",
	        "type": "none",
	        "variants": [{
	            "name": "",
	            "price": 490
	        }],
	        "options": []
	    }, {
	        "categoryId": "meex-specialitas",
	        "id": "cahil-torok-pizza",
	        "category": "Meex specialitás",
	        "name": "Cahil - török pizza",
	        "description": "bbq alap, sajt, ropogós bacon",
	        "imageName": "cahil-torok-pizza",
	        "type": "none",
	        "variants": [{
	            "name": "",
	            "price": 490
	        }],
	        "options": []
	    }, {
	        "categoryId": "tesztak",
	        "id": "carbonara",
	        "category": "Tészták",
	        "name": "Carbonara",
	        "description": "bacon, sonka, tojás, tejszín, parmezán sajt, spagetti",
	        "imageName": "carbonara",
	        "type": "none",
	        "variants": [{
	            "name": "",
	            "price": 1090
	        }],
	        "options": []
	    }, {
	        "categoryId": "tesztak",
	        "id": "milanoi",
	        "category": "Tészták",
	        "name": "Milánói",
	        "description": "paradicsomszósz, sonka, gomba, trappista sajt, spagetti",
	        "imageName": "milanoi",
	        "type": "none",
	        "variants": [{
	            "name": "",
	            "price": 1090
	        }],
	        "options": []
	    }, {
	        "categoryId": "tesztak",
	        "id": "peperoncino",
	        "category": "Tészták",
	        "name": "Peperoncino",
	        "description": "pirított fokhagymás olívaolaj, chili, petrezselyem, csípős, spagetti",
	        "imageName": "peperoncino",
	        "type": "none",
	        "variants": [{
	            "name": "",
	            "price": 1090
	        }],
	        "options": []
	    }, {
	        "categoryId": "tesztak",
	        "id": "meex",
	        "category": "Tészták",
	        "name": "Meex",
	        "description": "csirke, gomba, fokhagyma, fűszeres tejszínes szósz, parmezán, spagetti",
	        "imageName": "meex",
	        "type": "none",
	        "variants": [{
	            "name": "",
	            "price": 1190
	        }],
	        "options": []
	    }, {
	        "categoryId": "rantott-sajtok",
	        "id": "izletes-cheddar-sajtfalatkak",
	        "category": "Rántott sajtok",
	        "name": "Ízletes cheddar sajtfalatkák",
	        "description": "választható szósszal: házi tartármártás, helyben készített gyümölcs szósz, chilis szósz",
	        "imageName": "rantottsajt-cheddar",
	        "type": "none",
	        "variants": [{
	            "name": "",
	            "price": 1390
	        }],
	        "options": [{
	            "name": "Köretek",
	            "list": ["hasábburgonya", "steakburgonya"]
	        }, {
	            "name": "Szószok",
	            "list": ["házi tartármártás", "gyümölcsszósz", "chilis szósz"]
	        }]
	    }, {
	        "categoryId": "rantott-sajtok",
	        "id": "camembert-sajt",
	        "category": "Rántott sajtok",
	        "name": "Camembert sajt",
	        "description": "választható szósszal: házi tartármártás, helyben készített gyümölcs szósz, chilis szósz",
	        "imageName": "rantottsajt-camambert",
	        "type": "none",
	        "variants": [{
	            "name": "",
	            "price": 1290
	        }],
	        "options": [{
	            "name": "Köretek",
	            "list": ["hasábburgonya", "steakburgonya"]
	        }, {
	            "name": "Szószok",
	            "list": ["házi tartármártás", "gyümölcsszósz", "chilis szósz"]
	        }]
	    }, {
	        "categoryId": "rantott-sajtok",
	        "id": "trappista-sajt",
	        "category": "Rántott sajtok",
	        "name": "Trappista sajt",
	        "description": "választható szósszal: házi tartármártás, helyben készített gyümölcs szósz, chilis szósz",
	        "imageName": "rantottsajt-trappista",
	        "type": "none",
	        "variants": [{
	            "name": "",
	            "price": 1190
	        }],
	        "options": [{
	            "name": "Köretek",
	            "list": ["hasábburgonya", "steakburgonya"]
	        }, {
	            "name": "Szószok",
	            "list": ["házi tartármártás", "gyümölcsszósz", "chilis szósz"]
	        }]
	    }, {
	        "categoryId": "frissensultek",
	        "id": "buffalo-csirkeszarnyak",
	        "category": "Frissensültek",
	        "name": "Buffalo csirkeszárnyak",
	        "description": "TODO",
	        "imageName": "buffalo-csirkeszarnyak",
	        "type": "none",
	        "variants": [{
	            "name": "6 darabos",
	            "price": 780
	        }, {
	            "name": "12 darabos",
	            "price": 1090
	        }],
	        "options": []
	    }, {
	        "categoryId": "frissensultek",
	        "id": "buffalo-csirkeszarnyak-menu",
	        "category": "Frissensültek",
	        "name": "Buffalo csirkeszárnyak menü",
	        "description": "választható szósszal: házi tartármártás, helyben készített gyümölcs szósz, chilis szósz",
	        "imageName": "buffalo-csirkeszarnyak",
	        "type": "none",
	        "variants": [{
	            "name": "6 darabos",
	            "price": 1190
	        }, {
	            "name": "12 darabos",
	            "price": 1350
	        }],
	        "options": [{
	            "name": "Köretek",
	            "list": ["hasábburgonya", "steakburgonya"]
	        }, {
	            "name": "Szószok",
	            "list": ["házi tartármártás", "gyümölcsszósz", "chilis szósz"]
	        }]
	    }, {
	        "categoryId": "hamburgerek",
	        "id": "meex-burger",
	        "category": "Hamburgerek",
	        "name": "Meex burger",
	        "description": "friss jégsaláta, paradicsomkarika, uborka, házi húspogácsa",
	        "imageName": "meex-burger",
	        "type": "hamburger",
	        "variants": [{
	            "name": "",
	            "price": 750
	        }],
	        "options": []
	    }, {
	        "categoryId": "hamburgerek",
	        "id": "meex-sajtburger",
	        "category": "Hamburgerek",
	        "name": "Meex sajtburger",
	        "description": "friss jégsaláta, paradicsomkarika, uborka, házi húspogácsa, olvasztott sajt",
	        "imageName": "meex-burger",
	        "type": "hamburger",
	        "variants": [{
	            "name": "",
	            "price": 850
	        }],
	        "options": []
	    }, {
	        "categoryId": "hamburgerek",
	        "id": "dupla-meex-burger",
	        "category": "Hamburgerek",
	        "name": "Dupla Meex burger",
	        "description": "friss jégsaláta, paradicsomkarika, uborka, házi dupla húspogácsa",
	        "imageName": "meex-burger",
	        "type": "hamburger",
	        "variants": [{
	            "name": "",
	            "price": 1250
	        }],
	        "options": []
	    }, {
	        "categoryId": "hamburgerek",
	        "id": "dupla-meex-sajtburger",
	        "category": "Hamburgerek",
	        "name": "Dupla Meex sajtburger",
	        "description": "friss jégsaláta, paradicsomkarika, uborka, házi dupla húspogácsa, dupla adag olvasztott sajt",
	        "imageName": "meex-burger",
	        "type": "hamburger",
	        "variants": [{
	            "name": "",
	            "price": 1450
	        }],
	        "options": []
	    }, {
	        "categoryId": "hamburger-menuk",
	        "id": "meex-burger-menu",
	        "category": "Hamburger menük",
	        "name": "Meex Burger Menü",
	        "description": "friss jégsaláta, paradicsomkarika, uborka, házi húspogácsa + választható szósz: finom házi tartár, csípős szósz, házi hamburgerszósz",
	        "imageName": "meex-burger-menu",
	        "type": "hamburger",
	        "variants": [{
	            "name": "",
	            "price": 990
	        }],
	        "options": [{
	            "name": "Köretek",
	            "list": ["hasábburgonya", "steakburgonya"]
	        }, {
	            "name": "Szószok",
	            "list": ["házi tartármártás", "gyümölcsszósz", "chilis szósz"]
	        }]
	    }, {
	        "categoryId": "hamburger-menuk",
	        "id": "meex-sajtburger-menu",
	        "category": "Hamburger menük",
	        "name": "Meex Sajtburger Menü",
	        "description": "friss jégsaláta, paradicsomkarika, uborka, házi húspogácsa, olvasztott sajt + választható szósz: finom házi tartár, csípős szósz, házi hamburgerszósz",
	        "imageName": "meex-burger-menu",
	        "type": "hamburger",
	        "variants": [{
	            "name": "",
	            "price": 1090
	        }],
	        "options": [{
	            "name": "Köretek",
	            "list": ["hasábburgonya", "steakburgonya"]
	        }, {
	            "name": "Szószok",
	            "list": ["házi tartármártás", "gyümölcsszósz", "chilis szósz"]
	        }]
	    }, {
	        "categoryId": "hamburger-menuk",
	        "id": "dupla-meex-burger-menu",
	        "category": "Hamburger menük",
	        "name": "Dupla Meex Burger Menü",
	        "description": "friss jégsaláta, paradicsomkarika, uborka, házi dupla húspogácsa, + választható szósz: finom házi tartár, csípős szósz, házi hamburgerszósz",
	        "imageName": "meex-burger-menu",
	        "type": "hamburger",
	        "variants": [{
	            "name": "",
	            "price": 1490
	        }],
	        "options": [{
	            "name": "Köretek",
	            "list": ["hasábburgonya", "steakburgonya"]
	        }, {
	            "name": "Szószok",
	            "list": ["házi tartármártás", "gyümölcsszósz", "chilis szósz"]
	        }]
	    }, {
	        "categoryId": "hamburger-menuk",
	        "id": "dupla-meex-sajtburger-menu",
	        "category": "Hamburger menük",
	        "name": "Dupla Meex Sajtburger Menü",
	        "description": "friss jégsaláta, paradicsomkarika, uborka, házi dupla húspogácsa, dupla adag olvasztott sajt + választható szósz: finom házi tartár, csípős szósz, házi hamburgerszósz",
	        "imageName": "meex-burger-menu",
	        "type": "hamburger",
	        "variants": [{
	            "name": "",
	            "price": 1490
	        }],
	        "options": [{
	            "name": "Köretek",
	            "list": ["hasábburgonya", "steakburgonya"]
	        }, {
	            "name": "Szószok",
	            "list": ["házi tartármártás", "gyümölcsszósz", "chilis szósz"]
	        }]
	    }, {
	        "categoryId": "fitnesz-szendvicsek",
	        "id": "purpur",
	        "category": "Fitnesz szendvicsek",
	        "name": "Purpur",
	        "description": "szénhidrátcsökkentett magvas baguette, friss jégsaláta, paradicsom, uborka, fűszeres grillezett csirkemell (16dkg)",
	        "imageName": "purpur",
	        "type": "none",
	        "variants": [{
	            "name": "",
	            "price": 590
	        }],
	        "options": []
	    }, {
	        "categoryId": "salatak",
	        "id": "primor-salata",
	        "category": "Saláták",
	        "name": "Primőr saláta",
	        "description": "friss zsenge jégsaláta, karikára vágott paradicsom, uborka, paprika, ruccola nyakon öntve vinegrettével, pizzakenyér szeletekkel tálalva",
	        "imageName": "primor-salata",
	        "type": "none",
	        "variants": [{
	            "name": "",
	            "price": 650
	        }],
	        "options": []
	    }, {
	        "categoryId": "salatak",
	        "id": "mozarella-salata",
	        "category": "Saláták",
	        "name": "Mozarella saláta",
	        "description": "mozarella golyók, paradicsomkarikák, olívaolajos bazsalikommal és oregánóval, pizzakenyér szeletekkel tálalva",
	        "imageName": "mozarella-salata",
	        "type": "none",
	        "variants": [{
	            "name": "",
	            "price": 800
	        }],
	        "options": []
	    }, {
	        "categoryId": "salatak",
	        "id": "tonhal-salata",
	        "category": "Saláták",
	        "name": "Tonhal saláta",
	        "description": "friss zsenge jégsaláta, karikára vágott paradicsom, uborka, paprika, ruccola, tonhaltörzs, sajtkocka, pizzakenyér szeletekkel tálalva",
	        "imageName": "tonhal-salata",
	        "type": "none",
	        "variants": [{
	            "name": "",
	            "price": 1080
	        }],
	        "options": []
	    }, {
	        "categoryId": "salatak",
	        "id": "cezar-salata",
	        "category": "Saláták",
	        "name": "Cézár saláta",
	        "description": "friss zsenge jégsaláta, karikára vágott paradicsom, uborka, paprika, ruccola, grillezett fűszeres csirkemell, parmezán, pizzakenyér szeletekkel tálalva",
	        "imageName": "cezar-salata",
	        "type": "none",
	        "variants": [{
	            "name": "",
	            "price": 1080
	        }],
	        "options": []
	    }, {
	        "categoryId": "edessegek",
	        "id": "profiterol",
	        "category": "Édességek",
	        "name": "Profiterol",
	        "description": "Profiterol golyók fehér- és tejcsokoládé bevonattal, tejszínhab koronával",
	        "imageName": "profiterol",
	        "type": "none",
	        "variants": [{
	            "name": "",
	            "price": 600
	        }],
	        "options": []
	    }, {
	        "categoryId": "uditok",
	        "id": "pepsi",
	        "category": "Üdítők",
	        "name": "Pepsi",
	        "description": "",
	        "imageName": "pepsi",
	        "type": "none",
	        "variants": [{
	            "name": "1,75 literes",
	            "price": 480
	        }, {
	            "name": "1 literes",
	            "price": 350
	        }, {
	            "name": "0,33 literes",
	            "price": 190
	        }],
	        "options": []
	    }, {
	        "categoryId": "uditok",
	        "id": "pepsi-max",
	        "category": "Üdítők",
	        "name": "Pepsi Max",
	        "description": "",
	        "imageName": "pepsi-max",
	        "type": "none",
	        "variants": [{
	            "name": "1,75 literes",
	            "price": 480
	        }, {
	            "name": "1 literes",
	            "price": 350
	        }, {
	            "name": "0,33 literes",
	            "price": 190
	        }],
	        "options": []
	    }, {
	        "categoryId": "uditok",
	        "id": "mirinda",
	        "category": "Üdítők",
	        "name": "Mirinda",
	        "description": "",
	        "imageName": "mirinda",
	        "type": "none",
	        "variants": [{
	            "name": "1,75 literes",
	            "price": 480
	        }, {
	            "name": "1 literes",
	            "price": 350
	        }, {
	            "name": "0,33 literes",
	            "price": 190
	        }],
	        "options": []
	    }, {
	        "categoryId": "uditok",
	        "id": "canada-dry",
	        "category": "Üdítők",
	        "name": "Canada Dry",
	        "description": "",
	        "imageName": "canada-dry",
	        "type": "none",
	        "variants": [{
	            "name": "1,75 literes",
	            "price": 480
	        }, {
	            "name": "1 literes",
	            "price": 350
	        }, {
	            "name": "0,33 literes",
	            "price": 190
	        }],
	        "options": []
	    }, {
	        "categoryId": "uditok",
	        "id": "lipton-ice-tea",
	        "category": "Üdítők",
	        "name": "Lipton Ice Tea",
	        "description": "",
	        "imageName": "lipton-ice-tea",
	        "type": "none",
	        "variants": [{
	            "name": "0,33 literes",
	            "price": 190
	        }],
	        "options": []
	    }],
	    "pizzaExtras": [{
	        "name": "Húsok",
	        "price": 250,
	        "list": ["sonka", "tarja", "bacon", "szalámi", "csirkemell"]
	    }, {
	        "name": "Halféleségek",
	        "price": 300,
	        "list": ["tengergyümölcsei", "tonhal"]
	    }, {
	        "name": "Prémium sonkák",
	        "price": 450,
	        "list": ["pármai", "serrano", "mangalica"]
	    }, {
	        "name": "Tejes készítmények, sajtok",
	        "price": 250,
	        "list": ["tejföl", "juhtúró", "sajt", "füstölt sajt"]
	    }, {
	        "name": "Prémium sajtok",
	        "price": 300,
	        "list": ["gorgonzola sajt", "parmezán sajt", "mozzarella golyó", "feta sajt"]
	    }, {
	        "name": "Zöldségek",
	        "price": 150,
	        "list": ["kukorica", "gomba", "fokhagyma", "hagyma", "póréhagyma", "capribogyó", "fehér és vörös óriásbab", "édes pepperóni", "erős cseresznyepaprika", "jalapeno paprika", "padlizsán", "cukkini", "répa", "pritamin paprika", "magozott zöld és fekete olívabogyó", "ruccola", "paradicsom", "brokkoli"]
	    }, {
	        "name": "Gyümölcsök",
	        "price": 150,
	        "list": ["ananász", "citrom"]
	    }],
	    "hamburgerExtras": [{
	        "name": "Zöldségek",
	        "price": 100,
	        "list": ["jégsaláta", "paradicsom", "uborka"]
	    }, {
	        "name": "Húsok",
	        "price": 300,
	        "list": ["Húspogácsa"]
	    }, {
	        "name": "Sajtok",
	        "price": 150,
	        "list": ["parmezán", "gorgonzola", "cheddar"]
	    }],
	    "deliveryFees": {
	        "Gyöngyös": {
	            "min": 1000
	        },
	        "Karácsondi úti gyártelep": {
	            "min": 2000
	        },
	        "KRF Kollégium": {
	            "min": 2000
	        },
	        "Abasár": {
	            "fix": 800
	        },
	        "Detk": {
	            "fix": 800
	        },
	        "Gyöngyöshalász": {
	            "fix": 800
	        },
	        "Gyöngyössolymos": {
	            "fix": 800
	        },
	        "Gyöngyöstarján": {
	            "fix": 800
	        },
	        "Mátrafüred": {
	            "fix": 800
	        },
	        "Nagyréde": {
	            "fix": 800
	        },
	        "Pálosvörösmart": {
	            "fix": 800
	        },
	        "Visonta": {
	            "fix": 1000
	        }
	    },
	    "version": "95084fb00b4b748ebf3782f89d62d9e8"
	};

/***/ },
/* 16 */
/***/ function(module, exports) {

	"use strict";
	
	module.exports = {
	    "Gyöngyös": {
	        "min": 1000
	    },
	    "Karácsondi úti gyártelep": {
	        "min": 2000
	    },
	    "KRF Kollégium": {
	        "min": 2000
	    },
	    "Abasár": {
	        "fix": 800
	    },
	    "Detk": {
	        "fix": 800
	    },
	    "Gyöngyöshalász": {
	        "fix": 800
	    },
	    "Gyöngyössolymos": {
	        "fix": 800
	    },
	    "Gyöngyöstarján": {
	        "fix": 800
	    },
	    "Mátrafüred": {
	        "fix": 800
	    },
	    "Nagyréde": {
	        "fix": 800
	    },
	    "Pálosvörösmart": {
	        "fix": 800
	    },
	    "Visonta": {
	        "fix": 1000
	    }
	};

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var arrayMap = __webpack_require__(18),
	    baseFlatten = __webpack_require__(19),
	    baseIteratee = __webpack_require__(31);
	
	/**
	 * Creates an array of flattened values by running each element in `array`
	 * through `iteratee` and concating its result to the other mapped values.
	 * The iteratee is invoked with three arguments: (value, index|key, array).
	 *
	 * @static
	 * @memberOf _
	 * @category Array
	 * @param {Array} array The array to iterate over.
	 * @param {Function|Object|string} [iteratee=_.identity] The function invoked per iteration.
	 * @returns {Array} Returns the new array.
	 * @example
	 *
	 * function duplicate(n) {
	 *   return [n, n];
	 * }
	 *
	 * _.flatMap([1, 2], duplicate);
	 * // => [1, 1, 2, 2]
	 */
	function flatMap(array, iteratee) {
	  var length = array ? array.length : 0;
	  return length ? baseFlatten(arrayMap(array, baseIteratee(iteratee, 3))) : [];
	}
	
	module.exports = flatMap;


/***/ },
/* 18 */
/***/ function(module, exports) {

	/**
	 * A specialized version of `_.map` for arrays without support for iteratee
	 * shorthands.
	 *
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array} Returns the new mapped array.
	 */
	function arrayMap(array, iteratee) {
	  var index = -1,
	      length = array.length,
	      result = Array(length);
	
	  while (++index < length) {
	    result[index] = iteratee(array[index], index, array);
	  }
	  return result;
	}
	
	module.exports = arrayMap;


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var arrayPush = __webpack_require__(20),
	    isArguments = __webpack_require__(21),
	    isArray = __webpack_require__(30),
	    isArrayLikeObject = __webpack_require__(22);
	
	/**
	 * The base implementation of `_.flatten` with support for restricting flattening.
	 *
	 * @private
	 * @param {Array} array The array to flatten.
	 * @param {boolean} [isDeep] Specify a deep flatten.
	 * @param {boolean} [isStrict] Restrict flattening to arrays-like objects.
	 * @param {Array} [result=[]] The initial result value.
	 * @returns {Array} Returns the new flattened array.
	 */
	function baseFlatten(array, isDeep, isStrict, result) {
	  result || (result = []);
	
	  var index = -1,
	      length = array.length;
	
	  while (++index < length) {
	    var value = array[index];
	    if (isArrayLikeObject(value) &&
	        (isStrict || isArray(value) || isArguments(value))) {
	      if (isDeep) {
	        // Recursively flatten arrays (susceptible to call stack limits).
	        baseFlatten(value, isDeep, isStrict, result);
	      } else {
	        arrayPush(result, value);
	      }
	    } else if (!isStrict) {
	      result[result.length] = value;
	    }
	  }
	  return result;
	}
	
	module.exports = baseFlatten;


/***/ },
/* 20 */
/***/ function(module, exports) {

	/**
	 * Appends the elements of `values` to `array`.
	 *
	 * @private
	 * @param {Array} array The array to modify.
	 * @param {Array} values The values to append.
	 * @returns {Array} Returns `array`.
	 */
	function arrayPush(array, values) {
	  var index = -1,
	      length = values.length,
	      offset = array.length;
	
	  while (++index < length) {
	    array[offset + index] = values[index];
	  }
	  return array;
	}
	
	module.exports = arrayPush;


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var isArrayLikeObject = __webpack_require__(22);
	
	/** `Object#toString` result references. */
	var argsTag = '[object Arguments]';
	
	/** Used for built-in method references. */
	var objectProto = global.Object.prototype;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/**
	 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objectToString = objectProto.toString;
	
	/** Built-in value references. */
	var propertyIsEnumerable = objectProto.propertyIsEnumerable;
	
	/**
	 * Checks if `value` is likely an `arguments` object.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isArguments(function() { return arguments; }());
	 * // => true
	 *
	 * _.isArguments([1, 2, 3]);
	 * // => false
	 */
	function isArguments(value) {
	  // Safari 8.1 incorrectly makes `arguments.callee` enumerable in strict mode.
	  return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
	    (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
	}
	
	module.exports = isArguments;
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var isArrayLike = __webpack_require__(23),
	    isObjectLike = __webpack_require__(29);
	
	/**
	 * This method is like `_.isArrayLike` except that it also checks if `value`
	 * is an object.
	 *
	 * @static
	 * @memberOf _
	 * @type Function
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an array-like object, else `false`.
	 * @example
	 *
	 * _.isArrayLikeObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isArrayLikeObject(document.body.children);
	 * // => true
	 *
	 * _.isArrayLikeObject('abc');
	 * // => false
	 *
	 * _.isArrayLikeObject(_.noop);
	 * // => false
	 */
	function isArrayLikeObject(value) {
	  return isObjectLike(value) && isArrayLike(value);
	}
	
	module.exports = isArrayLikeObject;


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	var getLength = __webpack_require__(24),
	    isFunction = __webpack_require__(26),
	    isLength = __webpack_require__(28);
	
	/**
	 * Checks if `value` is array-like. A value is considered array-like if it's
	 * not a function and has a `value.length` that's an integer greater than or
	 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
	 *
	 * @static
	 * @memberOf _
	 * @type Function
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
	 * @example
	 *
	 * _.isArrayLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isArrayLike(document.body.children);
	 * // => true
	 *
	 * _.isArrayLike('abc');
	 * // => true
	 *
	 * _.isArrayLike(_.noop);
	 * // => false
	 */
	function isArrayLike(value) {
	  return value != null &&
	    !(typeof value == 'function' && isFunction(value)) && isLength(getLength(value));
	}
	
	module.exports = isArrayLike;


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	var baseProperty = __webpack_require__(25);
	
	/**
	 * Gets the "length" property value of `object`.
	 *
	 * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
	 * that affects Safari on at least iOS 8.1-8.3 ARM64.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {*} Returns the "length" value.
	 */
	var getLength = baseProperty('length');
	
	module.exports = getLength;


/***/ },
/* 25 */
/***/ function(module, exports) {

	/**
	 * The base implementation of `_.property` without support for deep paths.
	 *
	 * @private
	 * @param {string} key The key of the property to get.
	 * @returns {Function} Returns the new function.
	 */
	function baseProperty(key) {
	  return function(object) {
	    return object == null ? undefined : object[key];
	  };
	}
	
	module.exports = baseProperty;


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var isObject = __webpack_require__(27);
	
	/** `Object#toString` result references. */
	var funcTag = '[object Function]',
	    genTag = '[object GeneratorFunction]';
	
	/** Used for built-in method references. */
	var objectProto = global.Object.prototype;
	
	/**
	 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objectToString = objectProto.toString;
	
	/**
	 * Checks if `value` is classified as a `Function` object.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isFunction(_);
	 * // => true
	 *
	 * _.isFunction(/abc/);
	 * // => false
	 */
	function isFunction(value) {
	  // The use of `Object#toString` avoids issues with the `typeof` operator
	  // in Safari 8 which returns 'object' for typed array constructors, and
	  // PhantomJS 1.9 which returns 'function' for `NodeList` instances.
	  var tag = isObject(value) ? objectToString.call(value) : '';
	  return tag == funcTag || tag == genTag;
	}
	
	module.exports = isFunction;
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 27 */
/***/ function(module, exports) {

	/**
	 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
	 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(_.noop);
	 * // => true
	 *
	 * _.isObject(null);
	 * // => false
	 */
	function isObject(value) {
	  // Avoid a V8 JIT bug in Chrome 19-20.
	  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
	  var type = typeof value;
	  return !!value && (type == 'object' || type == 'function');
	}
	
	module.exports = isObject;


/***/ },
/* 28 */
/***/ function(module, exports) {

	/** Used as references for various `Number` constants. */
	var MAX_SAFE_INTEGER = 9007199254740991;
	
	/**
	 * Checks if `value` is a valid array-like length.
	 *
	 * **Note:** This function is loosely based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
	 * @example
	 *
	 * _.isLength(3);
	 * // => true
	 *
	 * _.isLength(Number.MIN_VALUE);
	 * // => false
	 *
	 * _.isLength(Infinity);
	 * // => false
	 *
	 * _.isLength('3');
	 * // => false
	 */
	function isLength(value) {
	  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
	}
	
	module.exports = isLength;


/***/ },
/* 29 */
/***/ function(module, exports) {

	/**
	 * Checks if `value` is object-like. A value is object-like if it's not `null`
	 * and has a `typeof` result of "object".
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 * @example
	 *
	 * _.isObjectLike({});
	 * // => true
	 *
	 * _.isObjectLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isObjectLike(_.noop);
	 * // => false
	 *
	 * _.isObjectLike(null);
	 * // => false
	 */
	function isObjectLike(value) {
	  return !!value && typeof value == 'object';
	}
	
	module.exports = isObjectLike;


/***/ },
/* 30 */
/***/ function(module, exports) {

	/**
	 * Checks if `value` is classified as an `Array` object.
	 *
	 * @static
	 * @memberOf _
	 * @type Function
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isArray([1, 2, 3]);
	 * // => true
	 *
	 * _.isArray(document.body.children);
	 * // => false
	 *
	 * _.isArray('abc');
	 * // => false
	 *
	 * _.isArray(_.noop);
	 * // => false
	 */
	var isArray = Array.isArray;
	
	module.exports = isArray;


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	var baseMatches = __webpack_require__(32),
	    baseMatchesProperty = __webpack_require__(88),
	    identity = __webpack_require__(102),
	    isArray = __webpack_require__(30),
	    property = __webpack_require__(103);
	
	/**
	 * The base implementation of `_.iteratee`.
	 *
	 * @private
	 * @param {*} [value=_.identity] The value to convert to an iteratee.
	 * @returns {Function} Returns the iteratee.
	 */
	function baseIteratee(value) {
	  var type = typeof value;
	  if (type == 'function') {
	    return value;
	  }
	  if (value == null) {
	    return identity;
	  }
	  if (type == 'object') {
	    return isArray(value)
	      ? baseMatchesProperty(value[0], value[1])
	      : baseMatches(value);
	  }
	  return property(value);
	}
	
	module.exports = baseIteratee;


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	var baseIsMatch = __webpack_require__(33),
	    getMatchData = __webpack_require__(84);
	
	/**
	 * The base implementation of `_.matches` which doesn't clone `source`.
	 *
	 * @private
	 * @param {Object} source The object of property values to match.
	 * @returns {Function} Returns the new function.
	 */
	function baseMatches(source) {
	  var matchData = getMatchData(source);
	  if (matchData.length == 1 && matchData[0][2]) {
	    var key = matchData[0][0],
	        value = matchData[0][1];
	
	    return function(object) {
	      if (object == null) {
	        return false;
	      }
	      return object[key] === value &&
	        (value !== undefined || (key in Object(object)));
	    };
	  }
	  return function(object) {
	    return object === source || baseIsMatch(object, source, matchData);
	  };
	}
	
	module.exports = baseMatches;


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	var Stack = __webpack_require__(34),
	    baseIsEqual = __webpack_require__(63);
	
	/** Used to compose bitmasks for comparison styles. */
	var UNORDERED_COMPARE_FLAG = 1,
	    PARTIAL_COMPARE_FLAG = 2;
	
	/**
	 * The base implementation of `_.isMatch` without support for iteratee shorthands.
	 *
	 * @private
	 * @param {Object} object The object to inspect.
	 * @param {Object} source The object of property values to match.
	 * @param {Array} matchData The property names, values, and compare flags to match.
	 * @param {Function} [customizer] The function to customize comparisons.
	 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
	 */
	function baseIsMatch(object, source, matchData, customizer) {
	  var index = matchData.length,
	      length = index,
	      noCustomizer = !customizer;
	
	  if (object == null) {
	    return !length;
	  }
	  object = Object(object);
	  while (index--) {
	    var data = matchData[index];
	    if ((noCustomizer && data[2])
	          ? data[1] !== object[data[0]]
	          : !(data[0] in object)
	        ) {
	      return false;
	    }
	  }
	  while (++index < length) {
	    data = matchData[index];
	    var key = data[0],
	        objValue = object[key],
	        srcValue = data[1];
	
	    if (noCustomizer && data[2]) {
	      if (objValue === undefined && !(key in object)) {
	        return false;
	      }
	    } else {
	      var stack = new Stack,
	          result = customizer ? customizer(objValue, srcValue, key, object, source, stack) : undefined;
	
	      if (!(result === undefined
	            ? baseIsEqual(srcValue, objValue, customizer, UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG, stack)
	            : result
	          )) {
	        return false;
	      }
	    }
	  }
	  return true;
	}
	
	module.exports = baseIsMatch;


/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	var stackClear = __webpack_require__(35),
	    stackDelete = __webpack_require__(36),
	    stackGet = __webpack_require__(40),
	    stackHas = __webpack_require__(42),
	    stackSet = __webpack_require__(44);
	
	/**
	 * Creates a stack cache object to store key-value pairs.
	 *
	 * @private
	 * @param {Array} [values] The values to cache.
	 */
	function Stack(values) {
	  var index = -1,
	      length = values ? values.length : 0;
	
	  this.clear();
	  while (++index < length) {
	    var entry = values[index];
	    this.set(entry[0], entry[1]);
	  }
	}
	
	// Add functions to the `Stack` cache.
	Stack.prototype.clear = stackClear;
	Stack.prototype['delete'] = stackDelete;
	Stack.prototype.get = stackGet;
	Stack.prototype.has = stackHas;
	Stack.prototype.set = stackSet;
	
	module.exports = Stack;


/***/ },
/* 35 */
/***/ function(module, exports) {

	/**
	 * Removes all key-value entries from the stack.
	 *
	 * @private
	 * @name clear
	 * @memberOf Stack
	 */
	function stackClear() {
	  this.__data__ = { 'array': [], 'map': null };
	}
	
	module.exports = stackClear;


/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	var assocDelete = __webpack_require__(37);
	
	/**
	 * Removes `key` and its value from the stack.
	 *
	 * @private
	 * @name delete
	 * @memberOf Stack
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function stackDelete(key) {
	  var data = this.__data__,
	      array = data.array;
	
	  return array ? assocDelete(array, key) : data.map['delete'](key);
	}
	
	module.exports = stackDelete;


/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var assocIndexOf = __webpack_require__(38);
	
	/** Used for built-in method references. */
	var arrayProto = global.Array.prototype;
	
	/** Built-in value references. */
	var splice = arrayProto.splice;
	
	/**
	 * Removes `key` and its value from the associative array.
	 *
	 * @private
	 * @param {Array} array The array to query.
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function assocDelete(array, key) {
	  var index = assocIndexOf(array, key);
	  if (index < 0) {
	    return false;
	  }
	  var lastIndex = array.length - 1;
	  if (index == lastIndex) {
	    array.pop();
	  } else {
	    splice.call(array, index, 1);
	  }
	  return true;
	}
	
	module.exports = assocDelete;
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	var eq = __webpack_require__(39);
	
	/**
	 * Gets the index at which the first occurrence of `key` is found in `array`
	 * of key-value pairs.
	 *
	 * @private
	 * @param {Array} array The array to search.
	 * @param {*} key The key to search for.
	 * @returns {number} Returns the index of the matched value, else `-1`.
	 */
	function assocIndexOf(array, key) {
	  var length = array.length;
	  while (length--) {
	    if (eq(array[length][0], key)) {
	      return length;
	    }
	  }
	  return -1;
	}
	
	module.exports = assocIndexOf;


/***/ },
/* 39 */
/***/ function(module, exports) {

	/**
	 * Performs a [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
	 * comparison between two values to determine if they are equivalent.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to compare.
	 * @param {*} other The other value to compare.
	 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	 * @example
	 *
	 * var object = { 'user': 'fred' };
	 * var other = { 'user': 'fred' };
	 *
	 * _.eq(object, object);
	 * // => true
	 *
	 * _.eq(object, other);
	 * // => false
	 *
	 * _.eq('a', 'a');
	 * // => true
	 *
	 * _.eq('a', Object('a'));
	 * // => false
	 *
	 * _.eq(NaN, NaN);
	 * // => true
	 */
	function eq(value, other) {
	  return value === other || (value !== value && other !== other);
	}
	
	module.exports = eq;


/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	var assocGet = __webpack_require__(41);
	
	/**
	 * Gets the stack value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf Stack
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function stackGet(key) {
	  var data = this.__data__,
	      array = data.array;
	
	  return array ? assocGet(array, key) : data.map.get(key);
	}
	
	module.exports = stackGet;


/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	var assocIndexOf = __webpack_require__(38);
	
	/**
	 * Gets the associative array value for `key`.
	 *
	 * @private
	 * @param {Array} array The array to query.
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function assocGet(array, key) {
	  var index = assocIndexOf(array, key);
	  return index < 0 ? undefined : array[index][1];
	}
	
	module.exports = assocGet;


/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	var assocHas = __webpack_require__(43);
	
	/**
	 * Checks if a stack value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf Stack
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function stackHas(key) {
	  var data = this.__data__,
	      array = data.array;
	
	  return array ? assocHas(array, key) : data.map.has(key);
	}
	
	module.exports = stackHas;


/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	var assocIndexOf = __webpack_require__(38);
	
	/**
	 * Checks if an associative array value for `key` exists.
	 *
	 * @private
	 * @param {Array} array The array to query.
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function assocHas(array, key) {
	  return assocIndexOf(array, key) > -1;
	}
	
	module.exports = assocHas;


/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	var MapCache = __webpack_require__(45),
	    assocSet = __webpack_require__(61);
	
	/** Used as the size to enable large array optimizations. */
	var LARGE_ARRAY_SIZE = 200;
	
	/**
	 * Sets the stack `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf Stack
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the stack cache object.
	 */
	function stackSet(key, value) {
	  var data = this.__data__,
	      array = data.array;
	
	  if (array) {
	    if (array.length < (LARGE_ARRAY_SIZE - 1)) {
	      assocSet(array, key, value);
	    } else {
	      data.array = null;
	      data.map = new MapCache(array);
	    }
	  }
	  var map = data.map;
	  if (map) {
	    map.set(key, value);
	  }
	  return this;
	}
	
	module.exports = stackSet;


/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	var mapClear = __webpack_require__(46),
	    mapDelete = __webpack_require__(53),
	    mapGet = __webpack_require__(57),
	    mapHas = __webpack_require__(59),
	    mapSet = __webpack_require__(60);
	
	/**
	 * Creates a map cache object to store key-value pairs.
	 *
	 * @private
	 * @param {Array} [values] The values to cache.
	 */
	function MapCache(values) {
	  var index = -1,
	      length = values ? values.length : 0;
	
	  this.clear();
	  while (++index < length) {
	    var entry = values[index];
	    this.set(entry[0], entry[1]);
	  }
	}
	
	// Add functions to the `MapCache`.
	MapCache.prototype.clear = mapClear;
	MapCache.prototype['delete'] = mapDelete;
	MapCache.prototype.get = mapGet;
	MapCache.prototype.has = mapHas;
	MapCache.prototype.set = mapSet;
	
	module.exports = MapCache;


/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	var Hash = __webpack_require__(47),
	    Map = __webpack_require__(52);
	
	/**
	 * Removes all key-value entries from the map.
	 *
	 * @private
	 * @name clear
	 * @memberOf MapCache
	 */
	function mapClear() {
	  this.__data__ = { 'hash': new Hash, 'map': Map ? new Map : [], 'string': new Hash };
	}
	
	module.exports = mapClear;


/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var nativeCreate = __webpack_require__(48);
	
	/** Used for built-in method references. */
	var objectProto = global.Object.prototype;
	
	/**
	 * Creates an hash object.
	 *
	 * @private
	 * @returns {Object} Returns the new hash object.
	 */
	function Hash() {}
	
	// Avoid inheriting from `Object.prototype` when possible.
	Hash.prototype = nativeCreate ? nativeCreate(null) : objectProto;
	
	module.exports = Hash;
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	var getNative = __webpack_require__(49);
	
	/* Built-in method references that are verified to be native. */
	var nativeCreate = getNative(Object, 'create');
	
	module.exports = nativeCreate;


/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	var isNative = __webpack_require__(50);
	
	/**
	 * Gets the native function at `key` of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {string} key The key of the method to get.
	 * @returns {*} Returns the function if it's native, else `undefined`.
	 */
	function getNative(object, key) {
	  var value = object == null ? undefined : object[key];
	  return isNative(value) ? value : undefined;
	}
	
	module.exports = getNative;


/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var isFunction = __webpack_require__(26),
	    isHostObject = __webpack_require__(51),
	    isObjectLike = __webpack_require__(29);
	
	/** Used to match `RegExp` [syntax characters](http://ecma-international.org/ecma-262/6.0/#sec-patterns). */
	var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
	
	/** Used to detect host constructors (Safari > 5). */
	var reIsHostCtor = /^\[object .+?Constructor\]$/;
	
	/** Used for built-in method references. */
	var objectProto = global.Object.prototype;
	
	/** Used to resolve the decompiled source of functions. */
	var funcToString = global.Function.prototype.toString;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/** Used to detect if a method is native. */
	var reIsNative = RegExp('^' +
	  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
	  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
	);
	
	/**
	 * Checks if `value` is a native function.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
	 * @example
	 *
	 * _.isNative(Array.prototype.push);
	 * // => true
	 *
	 * _.isNative(_);
	 * // => false
	 */
	function isNative(value) {
	  if (value == null) {
	    return false;
	  }
	  if (isFunction(value)) {
	    return reIsNative.test(funcToString.call(value));
	  }
	  return isObjectLike(value) &&
	    (isHostObject(value) ? reIsNative : reIsHostCtor).test(value);
	}
	
	module.exports = isNative;
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 51 */
/***/ function(module, exports) {

	/**
	 * Checks if `value` is a host object in IE < 9.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
	 */
	function isHostObject(value) {
	  // Many host objects are `Object` objects that can coerce to strings
	  // despite having improperly defined `toString` methods.
	  var result = false;
	  if (value != null && typeof value.toString != 'function') {
	    try {
	      result = !!(value + '');
	    } catch (e) {}
	  }
	  return result;
	}
	
	module.exports = isHostObject;


/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var getNative = __webpack_require__(49);
	
	/* Built-in method references that are verified to be native. */
	var Map = getNative(global, 'Map');
	
	module.exports = Map;
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	var Map = __webpack_require__(52),
	    assocDelete = __webpack_require__(37),
	    hashDelete = __webpack_require__(54),
	    isKeyable = __webpack_require__(56);
	
	/**
	 * Removes `key` and its value from the map.
	 *
	 * @private
	 * @name delete
	 * @memberOf MapCache
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function mapDelete(key) {
	  var data = this.__data__;
	  if (isKeyable(key)) {
	    return hashDelete(typeof key == 'string' ? data.string : data.hash, key);
	  }
	  return Map ? data.map['delete'](key) : assocDelete(data.map, key);
	}
	
	module.exports = mapDelete;


/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	var hashHas = __webpack_require__(55);
	
	/**
	 * Removes `key` and its value from the hash.
	 *
	 * @private
	 * @param {Object} hash The hash to modify.
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function hashDelete(hash, key) {
	  return hashHas(hash, key) && delete hash[key];
	}
	
	module.exports = hashDelete;


/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var nativeCreate = __webpack_require__(48);
	
	/** Used for built-in method references. */
	var objectProto = global.Object.prototype;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/**
	 * Checks if a hash value for `key` exists.
	 *
	 * @private
	 * @param {Object} hash The hash to query.
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function hashHas(hash, key) {
	  return nativeCreate ? hash[key] !== undefined : hasOwnProperty.call(hash, key);
	}
	
	module.exports = hashHas;
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 56 */
/***/ function(module, exports) {

	/**
	 * Checks if `value` is suitable for use as unique object key.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
	 */
	function isKeyable(value) {
	  var type = typeof value;
	  return type == 'number' || type == 'boolean' ||
	    (type == 'string' && value !== '__proto__') || value == null;
	}
	
	module.exports = isKeyable;


/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	var Map = __webpack_require__(52),
	    assocGet = __webpack_require__(41),
	    hashGet = __webpack_require__(58),
	    isKeyable = __webpack_require__(56);
	
	/**
	 * Gets the map value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf MapCache
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function mapGet(key) {
	  var data = this.__data__;
	  if (isKeyable(key)) {
	    return hashGet(typeof key == 'string' ? data.string : data.hash, key);
	  }
	  return Map ? data.map.get(key) : assocGet(data.map, key);
	}
	
	module.exports = mapGet;


/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var nativeCreate = __webpack_require__(48);
	
	/** Used to stand-in for `undefined` hash values. */
	var HASH_UNDEFINED = '__lodash_hash_undefined__';
	
	/** Used for built-in method references. */
	var objectProto = global.Object.prototype;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/**
	 * Gets the hash value for `key`.
	 *
	 * @private
	 * @param {Object} hash The hash to query.
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function hashGet(hash, key) {
	  if (nativeCreate) {
	    var result = hash[key];
	    return result === HASH_UNDEFINED ? undefined : result;
	  }
	  return hasOwnProperty.call(hash, key) ? hash[key] : undefined;
	}
	
	module.exports = hashGet;
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	var Map = __webpack_require__(52),
	    assocHas = __webpack_require__(43),
	    hashHas = __webpack_require__(55),
	    isKeyable = __webpack_require__(56);
	
	/**
	 * Checks if a map value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf MapCache
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function mapHas(key) {
	  var data = this.__data__;
	  if (isKeyable(key)) {
	    return hashHas(typeof key == 'string' ? data.string : data.hash, key);
	  }
	  return Map ? data.map.has(key) : assocHas(data.map, key);
	}
	
	module.exports = mapHas;


/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	var Map = __webpack_require__(52),
	    assocSet = __webpack_require__(61),
	    hashSet = __webpack_require__(62),
	    isKeyable = __webpack_require__(56);
	
	/**
	 * Sets the map `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf MapCache
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the map cache object.
	 */
	function mapSet(key, value) {
	  var data = this.__data__;
	  if (isKeyable(key)) {
	    hashSet(typeof key == 'string' ? data.string : data.hash, key, value);
	  } else if (Map) {
	    data.map.set(key, value);
	  } else {
	    assocSet(data.map, key, value);
	  }
	  return this;
	}
	
	module.exports = mapSet;


/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	var assocIndexOf = __webpack_require__(38);
	
	/**
	 * Sets the associative array `key` to `value`.
	 *
	 * @private
	 * @param {Array} array The array to modify.
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 */
	function assocSet(array, key, value) {
	  var index = assocIndexOf(array, key);
	  if (index < 0) {
	    array.push([key, value]);
	  } else {
	    array[index][1] = value;
	  }
	}
	
	module.exports = assocSet;


/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	var nativeCreate = __webpack_require__(48);
	
	/** Used to stand-in for `undefined` hash values. */
	var HASH_UNDEFINED = '__lodash_hash_undefined__';
	
	/**
	 * Sets the hash `key` to `value`.
	 *
	 * @private
	 * @param {Object} hash The hash to modify.
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 */
	function hashSet(hash, key, value) {
	  hash[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
	}
	
	module.exports = hashSet;


/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	var baseIsEqualDeep = __webpack_require__(64),
	    isObject = __webpack_require__(27),
	    isObjectLike = __webpack_require__(29);
	
	/**
	 * The base implementation of `_.isEqual` which supports partial comparisons
	 * and tracks traversed objects.
	 *
	 * @private
	 * @param {*} value The value to compare.
	 * @param {*} other The other value to compare.
	 * @param {Function} [customizer] The function to customize comparisons.
	 * @param {boolean} [bitmask] The bitmask of comparison flags.
	 *  The bitmask may be composed of the following flags:
	 *     1 - Unordered comparison
	 *     2 - Partial comparison
	 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
	 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	 */
	function baseIsEqual(value, other, customizer, bitmask, stack) {
	  if (value === other) {
	    return true;
	  }
	  if (value == null || other == null || (!isObject(value) && !isObjectLike(other))) {
	    return value !== value && other !== other;
	  }
	  return baseIsEqualDeep(value, other, baseIsEqual, customizer, bitmask, stack);
	}
	
	module.exports = baseIsEqual;


/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var Stack = __webpack_require__(34),
	    equalArrays = __webpack_require__(65),
	    equalByTag = __webpack_require__(67),
	    equalObjects = __webpack_require__(72),
	    getTag = __webpack_require__(81),
	    isArray = __webpack_require__(30),
	    isHostObject = __webpack_require__(51),
	    isTypedArray = __webpack_require__(83);
	
	/** Used to compose bitmasks for comparison styles. */
	var PARTIAL_COMPARE_FLAG = 2;
	
	/** `Object#toString` result references. */
	var argsTag = '[object Arguments]',
	    arrayTag = '[object Array]',
	    objectTag = '[object Object]';
	
	/** Used for built-in method references. */
	var objectProto = global.Object.prototype;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/**
	 * A specialized version of `baseIsEqual` for arrays and objects which performs
	 * deep comparisons and tracks traversed objects enabling objects with circular
	 * references to be compared.
	 *
	 * @private
	 * @param {Object} object The object to compare.
	 * @param {Object} other The other object to compare.
	 * @param {Function} equalFunc The function to determine equivalents of values.
	 * @param {Function} [customizer] The function to customize comparisons.
	 * @param {number} [bitmask] The bitmask of comparison flags. See `baseIsEqual` for more details.
	 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
	 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	 */
	function baseIsEqualDeep(object, other, equalFunc, customizer, bitmask, stack) {
	  var objIsArr = isArray(object),
	      othIsArr = isArray(other),
	      objTag = arrayTag,
	      othTag = arrayTag;
	
	  if (!objIsArr) {
	    objTag = getTag(object);
	    if (objTag == argsTag) {
	      objTag = objectTag;
	    } else if (objTag != objectTag) {
	      objIsArr = isTypedArray(object);
	    }
	  }
	  if (!othIsArr) {
	    othTag = getTag(other);
	    if (othTag == argsTag) {
	      othTag = objectTag;
	    } else if (othTag != objectTag) {
	      othIsArr = isTypedArray(other);
	    }
	  }
	  var objIsObj = objTag == objectTag && !isHostObject(object),
	      othIsObj = othTag == objectTag && !isHostObject(other),
	      isSameTag = objTag == othTag;
	
	  if (isSameTag && !(objIsArr || objIsObj)) {
	    return equalByTag(object, other, objTag, equalFunc, customizer, bitmask);
	  }
	  var isPartial = bitmask & PARTIAL_COMPARE_FLAG;
	  if (!isPartial) {
	    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
	        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');
	
	    if (objIsWrapped || othIsWrapped) {
	      return equalFunc(objIsWrapped ? object.value() : object, othIsWrapped ? other.value() : other, customizer, bitmask, stack);
	    }
	  }
	  if (!isSameTag) {
	    return false;
	  }
	  stack || (stack = new Stack);
	  return (objIsArr ? equalArrays : equalObjects)(object, other, equalFunc, customizer, bitmask, stack);
	}
	
	module.exports = baseIsEqualDeep;
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	var arraySome = __webpack_require__(66);
	
	/** Used to compose bitmasks for comparison styles. */
	var UNORDERED_COMPARE_FLAG = 1,
	    PARTIAL_COMPARE_FLAG = 2;
	
	/**
	 * A specialized version of `baseIsEqualDeep` for arrays with support for
	 * partial deep comparisons.
	 *
	 * @private
	 * @param {Array} array The array to compare.
	 * @param {Array} other The other array to compare.
	 * @param {Function} equalFunc The function to determine equivalents of values.
	 * @param {Function} [customizer] The function to customize comparisons.
	 * @param {number} [bitmask] The bitmask of comparison flags. See `baseIsEqual` for more details.
	 * @param {Object} [stack] Tracks traversed `array` and `other` objects.
	 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
	 */
	function equalArrays(array, other, equalFunc, customizer, bitmask, stack) {
	  var index = -1,
	      isPartial = bitmask & PARTIAL_COMPARE_FLAG,
	      isUnordered = bitmask & UNORDERED_COMPARE_FLAG,
	      arrLength = array.length,
	      othLength = other.length;
	
	  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
	    return false;
	  }
	  // Assume cyclic values are equal.
	  var stacked = stack.get(array);
	  if (stacked) {
	    return stacked == other;
	  }
	  var result = true;
	  stack.set(array, other);
	
	  // Ignore non-index properties.
	  while (++index < arrLength) {
	    var arrValue = array[index],
	        othValue = other[index];
	
	    if (customizer) {
	      var compared = isPartial
	        ? customizer(othValue, arrValue, index, other, array, stack)
	        : customizer(arrValue, othValue, index, array, other, stack);
	    }
	    if (compared !== undefined) {
	      if (compared) {
	        continue;
	      }
	      result = false;
	      break;
	    }
	    // Recursively compare arrays (susceptible to call stack limits).
	    if (isUnordered) {
	      if (!arraySome(other, function(othValue) {
	            return arrValue === othValue || equalFunc(arrValue, othValue, customizer, bitmask, stack);
	          })) {
	        result = false;
	        break;
	      }
	    } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, customizer, bitmask, stack))) {
	      result = false;
	      break;
	    }
	  }
	  stack['delete'](array);
	  return result;
	}
	
	module.exports = equalArrays;


/***/ },
/* 66 */
/***/ function(module, exports) {

	/**
	 * A specialized version of `_.some` for arrays without support for iteratee
	 * shorthands.
	 *
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} predicate The function invoked per iteration.
	 * @returns {boolean} Returns `true` if any element passes the predicate check, else `false`.
	 */
	function arraySome(array, predicate) {
	  var index = -1,
	      length = array.length;
	
	  while (++index < length) {
	    if (predicate(array[index], index, array)) {
	      return true;
	    }
	  }
	  return false;
	}
	
	module.exports = arraySome;


/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	var Symbol = __webpack_require__(68),
	    Uint8Array = __webpack_require__(69),
	    mapToArray = __webpack_require__(70),
	    setToArray = __webpack_require__(71);
	
	/** Used to compose bitmasks for comparison styles. */
	var UNORDERED_COMPARE_FLAG = 1,
	    PARTIAL_COMPARE_FLAG = 2;
	
	/** `Object#toString` result references. */
	var boolTag = '[object Boolean]',
	    dateTag = '[object Date]',
	    errorTag = '[object Error]',
	    mapTag = '[object Map]',
	    numberTag = '[object Number]',
	    regexpTag = '[object RegExp]',
	    setTag = '[object Set]',
	    stringTag = '[object String]',
	    symbolTag = '[object Symbol]';
	
	var arrayBufferTag = '[object ArrayBuffer]';
	
	/** Used to convert symbols to primitives and strings. */
	var symbolProto = Symbol ? Symbol.prototype : undefined,
	    symbolValueOf = Symbol ? symbolProto.valueOf : undefined;
	
	/**
	 * A specialized version of `baseIsEqualDeep` for comparing objects of
	 * the same `toStringTag`.
	 *
	 * **Note:** This function only supports comparing values with tags of
	 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
	 *
	 * @private
	 * @param {Object} object The object to compare.
	 * @param {Object} other The other object to compare.
	 * @param {string} tag The `toStringTag` of the objects to compare.
	 * @param {Function} equalFunc The function to determine equivalents of values.
	 * @param {Function} [customizer] The function to customize comparisons.
	 * @param {number} [bitmask] The bitmask of comparison flags. See `baseIsEqual` for more details.
	 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	 */
	function equalByTag(object, other, tag, equalFunc, customizer, bitmask) {
	  switch (tag) {
	    case arrayBufferTag:
	      if ((object.byteLength != other.byteLength) ||
	          !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
	        return false;
	      }
	      return true;
	
	    case boolTag:
	    case dateTag:
	      // Coerce dates and booleans to numbers, dates to milliseconds and booleans
	      // to `1` or `0` treating invalid dates coerced to `NaN` as not equal.
	      return +object == +other;
	
	    case errorTag:
	      return object.name == other.name && object.message == other.message;
	
	    case numberTag:
	      // Treat `NaN` vs. `NaN` as equal.
	      return (object != +object) ? other != +other : object == +other;
	
	    case regexpTag:
	    case stringTag:
	      // Coerce regexes to strings and treat strings primitives and string
	      // objects as equal. See https://es5.github.io/#x15.10.6.4 for more details.
	      return object == (other + '');
	
	    case mapTag:
	      var convert = mapToArray;
	
	    case setTag:
	      var isPartial = bitmask & PARTIAL_COMPARE_FLAG;
	      convert || (convert = setToArray);
	
	      // Recursively compare objects (susceptible to call stack limits).
	      return (isPartial || object.size == other.size) &&
	        equalFunc(convert(object), convert(other), customizer, bitmask | UNORDERED_COMPARE_FLAG);
	
	    case symbolTag:
	      return !!Symbol && (symbolValueOf.call(object) == symbolValueOf.call(other));
	  }
	  return false;
	}
	
	module.exports = equalByTag;


/***/ },
/* 68 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {/** Built-in value references. */
	var Symbol = global.Symbol;
	
	module.exports = Symbol;
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 69 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {/** Built-in value references. */
	var Uint8Array = global.Uint8Array;
	
	module.exports = Uint8Array;
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 70 */
/***/ function(module, exports) {

	/**
	 * Converts `map` to an array.
	 *
	 * @private
	 * @param {Object} map The map to convert.
	 * @returns {Array} Returns the converted array.
	 */
	function mapToArray(map) {
	  var index = -1,
	      result = Array(map.size);
	
	  map.forEach(function(value, key) {
	    result[++index] = [key, value];
	  });
	  return result;
	}
	
	module.exports = mapToArray;


/***/ },
/* 71 */
/***/ function(module, exports) {

	/**
	 * Converts `set` to an array.
	 *
	 * @private
	 * @param {Object} set The set to convert.
	 * @returns {Array} Returns the converted array.
	 */
	function setToArray(set) {
	  var index = -1,
	      result = Array(set.size);
	
	  set.forEach(function(value) {
	    result[++index] = value;
	  });
	  return result;
	}
	
	module.exports = setToArray;


/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	var baseHas = __webpack_require__(73),
	    keys = __webpack_require__(74);
	
	/** Used to compose bitmasks for comparison styles. */
	var PARTIAL_COMPARE_FLAG = 2;
	
	/**
	 * A specialized version of `baseIsEqualDeep` for objects with support for
	 * partial deep comparisons.
	 *
	 * @private
	 * @param {Object} object The object to compare.
	 * @param {Object} other The other object to compare.
	 * @param {Function} equalFunc The function to determine equivalents of values.
	 * @param {Function} [customizer] The function to customize comparisons.
	 * @param {number} [bitmask] The bitmask of comparison flags. See `baseIsEqual` for more details.
	 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
	 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	 */
	function equalObjects(object, other, equalFunc, customizer, bitmask, stack) {
	  var isPartial = bitmask & PARTIAL_COMPARE_FLAG,
	      objProps = keys(object),
	      objLength = objProps.length,
	      othProps = keys(other),
	      othLength = othProps.length;
	
	  if (objLength != othLength && !isPartial) {
	    return false;
	  }
	  var index = objLength;
	  while (index--) {
	    var key = objProps[index];
	    if (!(isPartial ? key in other : baseHas(other, key))) {
	      return false;
	    }
	  }
	  // Assume cyclic values are equal.
	  var stacked = stack.get(object);
	  if (stacked) {
	    return stacked == other;
	  }
	  var result = true;
	  stack.set(object, other);
	
	  var skipCtor = isPartial;
	  while (++index < objLength) {
	    key = objProps[index];
	    var objValue = object[key],
	        othValue = other[key];
	
	    if (customizer) {
	      var compared = isPartial
	        ? customizer(othValue, objValue, key, other, object, stack)
	        : customizer(objValue, othValue, key, object, other, stack);
	    }
	    // Recursively compare objects (susceptible to call stack limits).
	    if (!(compared === undefined
	          ? (objValue === othValue || equalFunc(objValue, othValue, customizer, bitmask, stack))
	          : compared
	        )) {
	      result = false;
	      break;
	    }
	    skipCtor || (skipCtor = key == 'constructor');
	  }
	  if (result && !skipCtor) {
	    var objCtor = object.constructor,
	        othCtor = other.constructor;
	
	    // Non `Object` object instances with different constructors are not equal.
	    if (objCtor != othCtor &&
	        ('constructor' in object && 'constructor' in other) &&
	        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
	          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
	      result = false;
	    }
	  }
	  stack['delete'](object);
	  return result;
	}
	
	module.exports = equalObjects;


/***/ },
/* 73 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {/** Used for built-in method references. */
	var objectProto = global.Object.prototype;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/** Built-in value references. */
	var getPrototypeOf = Object.getPrototypeOf;
	
	/**
	 * The base implementation of `_.has` without support for deep paths.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {Array|string} key The key to check.
	 * @returns {boolean} Returns `true` if `key` exists, else `false`.
	 */
	function baseHas(object, key) {
	  // Avoid a bug in IE 10-11 where objects with a [[Prototype]] of `null`,
	  // that are composed entirely of index properties, return `false` for
	  // `hasOwnProperty` checks of them.
	  return hasOwnProperty.call(object, key) ||
	    (typeof object == 'object' && key in object && getPrototypeOf(object) === null);
	}
	
	module.exports = baseHas;
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	var baseHas = __webpack_require__(73),
	    baseKeys = __webpack_require__(75),
	    indexKeys = __webpack_require__(76),
	    isArrayLike = __webpack_require__(23),
	    isIndex = __webpack_require__(79),
	    isPrototype = __webpack_require__(80);
	
	/**
	 * Creates an array of the own enumerable property names of `object`.
	 *
	 * **Note:** Non-object values are coerced to objects. See the
	 * [ES spec](http://ecma-international.org/ecma-262/6.0/#sec-object.keys)
	 * for more details.
	 *
	 * @static
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.keys(new Foo);
	 * // => ['a', 'b'] (iteration order is not guaranteed)
	 *
	 * _.keys('hi');
	 * // => ['0', '1']
	 */
	function keys(object) {
	  var isProto = isPrototype(object);
	  if (!(isProto || isArrayLike(object))) {
	    return baseKeys(object);
	  }
	  var indexes = indexKeys(object),
	      skipIndexes = !!indexes,
	      result = indexes || [],
	      length = result.length;
	
	  for (var key in object) {
	    if (baseHas(object, key) &&
	        !(skipIndexes && (key == 'length' || isIndex(key, length))) &&
	        !(isProto && key == 'constructor')) {
	      result.push(key);
	    }
	  }
	  return result;
	}
	
	module.exports = keys;


/***/ },
/* 75 */
/***/ function(module, exports) {

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeKeys = Object.keys;
	
	/**
	 * The base implementation of `_.keys` which doesn't skip the constructor
	 * property of prototypes or treat sparse arrays as dense.
	 *
	 * @private
	 * @type Function
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 */
	function baseKeys(object) {
	  return nativeKeys(Object(object));
	}
	
	module.exports = baseKeys;


/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	var baseTimes = __webpack_require__(77),
	    isArguments = __webpack_require__(21),
	    isArray = __webpack_require__(30),
	    isLength = __webpack_require__(28),
	    isString = __webpack_require__(78);
	
	/**
	 * Creates an array of index keys for `object` values of arrays,
	 * `arguments` objects, and strings, otherwise `null` is returned.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array|null} Returns index keys, else `null`.
	 */
	function indexKeys(object) {
	  var length = object ? object.length : undefined;
	  return (isLength(length) && (isArray(object) || isString(object) || isArguments(object)))
	    ? baseTimes(length, String)
	    : null;
	}
	
	module.exports = indexKeys;


/***/ },
/* 77 */
/***/ function(module, exports) {

	/**
	 * The base implementation of `_.times` without support for iteratee shorthands
	 * or max array length checks.
	 *
	 * @private
	 * @param {number} n The number of times to invoke `iteratee`.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array} Returns the array of results.
	 */
	function baseTimes(n, iteratee) {
	  var index = -1,
	      result = Array(n);
	
	  while (++index < n) {
	    result[index] = iteratee(index);
	  }
	  return result;
	}
	
	module.exports = baseTimes;


/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var isArray = __webpack_require__(30),
	    isObjectLike = __webpack_require__(29);
	
	/** `Object#toString` result references. */
	var stringTag = '[object String]';
	
	/** Used for built-in method references. */
	var objectProto = global.Object.prototype;
	
	/**
	 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objectToString = objectProto.toString;
	
	/**
	 * Checks if `value` is classified as a `String` primitive or object.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isString('abc');
	 * // => true
	 *
	 * _.isString(1);
	 * // => false
	 */
	function isString(value) {
	  return typeof value == 'string' ||
	    (!isArray(value) && isObjectLike(value) && objectToString.call(value) == stringTag);
	}
	
	module.exports = isString;
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 79 */
/***/ function(module, exports) {

	/** Used as references for various `Number` constants. */
	var MAX_SAFE_INTEGER = 9007199254740991;
	
	/** Used to detect unsigned integer values. */
	var reIsUint = /^(?:0|[1-9]\d*)$/;
	
	/**
	 * Checks if `value` is a valid array-like index.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
	 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
	 */
	function isIndex(value, length) {
	  value = (typeof value == 'number' || reIsUint.test(value)) ? +value : -1;
	  length = length == null ? MAX_SAFE_INTEGER : length;
	  return value > -1 && value % 1 == 0 && value < length;
	}
	
	module.exports = isIndex;


/***/ },
/* 80 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {/** Used for built-in method references. */
	var objectProto = global.Object.prototype;
	
	/**
	 * Checks if `value` is likely a prototype object.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
	 */
	function isPrototype(value) {
	  var Ctor = value && value.constructor,
	      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;
	
	  return value === proto;
	}
	
	module.exports = isPrototype;
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var Map = __webpack_require__(52),
	    Set = __webpack_require__(82);
	
	/** `Object#toString` result references. */
	var mapTag = '[object Map]',
	    objectTag = '[object Object]',
	    setTag = '[object Set]';
	
	/** Used for built-in method references. */
	var objectProto = global.Object.prototype;
	
	/** Used to resolve the decompiled source of functions. */
	var funcToString = global.Function.prototype.toString;
	
	/**
	 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objectToString = objectProto.toString;
	
	/** Used to detect maps and sets. */
	var mapCtorString = Map ? funcToString.call(Map) : '',
	    setCtorString = Set ? funcToString.call(Set) : '';
	
	/**
	 * Gets the `toStringTag` of `value`.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {string} Returns the `toStringTag`.
	 */
	function getTag(value) {
	  return objectToString.call(value);
	}
	
	// Fallback for IE 11 providing `toStringTag` values for maps and sets.
	if ((Map && getTag(new Map) != mapTag) || (Set && getTag(new Set) != setTag)) {
	  getTag = function(value) {
	    var result = objectToString.call(value),
	        Ctor = result == objectTag ? value.constructor : null,
	        ctorString = typeof Ctor == 'function' ? funcToString.call(Ctor) : '';
	
	    if (ctorString) {
	      if (ctorString == mapCtorString) {
	        return mapTag;
	      }
	      if (ctorString == setCtorString) {
	        return setTag;
	      }
	    }
	    return result;
	  };
	}
	
	module.exports = getTag;
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var getNative = __webpack_require__(49);
	
	/* Built-in method references that are verified to be native. */
	var Set = getNative(global, 'Set');
	
	module.exports = Set;
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var isLength = __webpack_require__(28),
	    isObjectLike = __webpack_require__(29);
	
	/** `Object#toString` result references. */
	var argsTag = '[object Arguments]',
	    arrayTag = '[object Array]',
	    boolTag = '[object Boolean]',
	    dateTag = '[object Date]',
	    errorTag = '[object Error]',
	    funcTag = '[object Function]',
	    mapTag = '[object Map]',
	    numberTag = '[object Number]',
	    objectTag = '[object Object]',
	    regexpTag = '[object RegExp]',
	    setTag = '[object Set]',
	    stringTag = '[object String]',
	    weakMapTag = '[object WeakMap]';
	
	var arrayBufferTag = '[object ArrayBuffer]',
	    float32Tag = '[object Float32Array]',
	    float64Tag = '[object Float64Array]',
	    int8Tag = '[object Int8Array]',
	    int16Tag = '[object Int16Array]',
	    int32Tag = '[object Int32Array]',
	    uint8Tag = '[object Uint8Array]',
	    uint8ClampedTag = '[object Uint8ClampedArray]',
	    uint16Tag = '[object Uint16Array]',
	    uint32Tag = '[object Uint32Array]';
	
	/** Used to identify `toStringTag` values of typed arrays. */
	var typedArrayTags = {};
	typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
	typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
	typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
	typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
	typedArrayTags[uint32Tag] = true;
	typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
	typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
	typedArrayTags[dateTag] = typedArrayTags[errorTag] =
	typedArrayTags[funcTag] = typedArrayTags[mapTag] =
	typedArrayTags[numberTag] = typedArrayTags[objectTag] =
	typedArrayTags[regexpTag] = typedArrayTags[setTag] =
	typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
	
	/** Used for built-in method references. */
	var objectProto = global.Object.prototype;
	
	/**
	 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objectToString = objectProto.toString;
	
	/**
	 * Checks if `value` is classified as a typed array.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isTypedArray(new Uint8Array);
	 * // => true
	 *
	 * _.isTypedArray([]);
	 * // => false
	 */
	function isTypedArray(value) {
	  return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[objectToString.call(value)];
	}
	
	module.exports = isTypedArray;
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	var isStrictComparable = __webpack_require__(85),
	    toPairs = __webpack_require__(86);
	
	/**
	 * Gets the property names, values, and compare flags of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the match data of `object`.
	 */
	function getMatchData(object) {
	  var result = toPairs(object),
	      length = result.length;
	
	  while (length--) {
	    result[length][2] = isStrictComparable(result[length][1]);
	  }
	  return result;
	}
	
	module.exports = getMatchData;


/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(27);
	
	/**
	 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` if suitable for strict
	 *  equality comparisons, else `false`.
	 */
	function isStrictComparable(value) {
	  return value === value && !isObject(value);
	}
	
	module.exports = isStrictComparable;


/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	var baseToPairs = __webpack_require__(87),
	    keys = __webpack_require__(74);
	
	/**
	 * Creates an array of own enumerable key-value pairs for `object`.
	 *
	 * @static
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the new array of key-value pairs.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.toPairs(new Foo);
	 * // => [['a', 1], ['b', 2]] (iteration order is not guaranteed)
	 */
	function toPairs(object) {
	  return baseToPairs(object, keys(object));
	}
	
	module.exports = toPairs;


/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	var arrayMap = __webpack_require__(18);
	
	/**
	 * The base implementation of `_.toPairs` and `_.toPairsIn` which creates an array
	 * of key-value pairs for `object` corresponding to the property names of `props`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {Array} props The property names to get values for.
	 * @returns {Object} Returns the new array of key-value pairs.
	 */
	function baseToPairs(object, props) {
	  return arrayMap(props, function(key) {
	    return [key, object[key]];
	  });
	}
	
	module.exports = baseToPairs;


/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	var baseIsEqual = __webpack_require__(63),
	    get = __webpack_require__(89),
	    hasIn = __webpack_require__(96);
	
	/** Used to compose bitmasks for comparison styles. */
	var UNORDERED_COMPARE_FLAG = 1,
	    PARTIAL_COMPARE_FLAG = 2;
	
	/**
	 * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
	 *
	 * @private
	 * @param {string} path The path of the property to get.
	 * @param {*} srcValue The value to match.
	 * @returns {Function} Returns the new function.
	 */
	function baseMatchesProperty(path, srcValue) {
	  return function(object) {
	    var objValue = get(object, path);
	    return (objValue === undefined && objValue === srcValue)
	      ? hasIn(object, path)
	      : baseIsEqual(srcValue, objValue, undefined, UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG);
	  };
	}
	
	module.exports = baseMatchesProperty;


/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	var baseGet = __webpack_require__(90);
	
	/**
	 * Gets the value at `path` of `object`. If the resolved value is
	 * `undefined` the `defaultValue` is used in its place.
	 *
	 * @static
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The object to query.
	 * @param {Array|string} path The path of the property to get.
	 * @param {*} [defaultValue] The value returned if the resolved value is `undefined`.
	 * @returns {*} Returns the resolved value.
	 * @example
	 *
	 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
	 *
	 * _.get(object, 'a[0].b.c');
	 * // => 3
	 *
	 * _.get(object, ['a', '0', 'b', 'c']);
	 * // => 3
	 *
	 * _.get(object, 'a.b.c', 'default');
	 * // => 'default'
	 */
	function get(object, path, defaultValue) {
	  var result = object == null ? undefined : baseGet(object, path);
	  return result === undefined ? defaultValue : result;
	}
	
	module.exports = get;


/***/ },
/* 90 */
/***/ function(module, exports, __webpack_require__) {

	var baseToPath = __webpack_require__(91),
	    isKey = __webpack_require__(95);
	
	/**
	 * The base implementation of `_.get` without support for default values.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {Array|string} path The path of the property to get.
	 * @returns {*} Returns the resolved value.
	 */
	function baseGet(object, path) {
	  path = isKey(path, object) ? [path + ''] : baseToPath(path);
	
	  var index = 0,
	      length = path.length;
	
	  while (object != null && index < length) {
	    object = object[path[index++]];
	  }
	  return (index && index == length) ? object : undefined;
	}
	
	module.exports = baseGet;


/***/ },
/* 91 */
/***/ function(module, exports, __webpack_require__) {

	var isArray = __webpack_require__(30),
	    stringToPath = __webpack_require__(92);
	
	/**
	 * The base implementation of `_.toPath` which only converts `value` to a
	 * path if it's not one.
	 *
	 * @private
	 * @param {*} value The value to process.
	 * @returns {Array} Returns the property path array.
	 */
	function baseToPath(value) {
	  return isArray(value) ? value : stringToPath(value);
	}
	
	module.exports = baseToPath;


/***/ },
/* 92 */
/***/ function(module, exports, __webpack_require__) {

	var toString = __webpack_require__(93);
	
	/** Used to match property names within property paths. */
	var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]/g;
	
	/** Used to match backslashes in property paths. */
	var reEscapeChar = /\\(\\)?/g;
	
	/**
	 * Converts `string` to a property path array.
	 *
	 * @private
	 * @param {string} string The string to convert.
	 * @returns {Array} Returns the property path array.
	 */
	function stringToPath(string) {
	  var result = [];
	  toString(string).replace(rePropName, function(match, number, quote, string) {
	    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
	  });
	  return result;
	}
	
	module.exports = stringToPath;


/***/ },
/* 93 */
/***/ function(module, exports, __webpack_require__) {

	var Symbol = __webpack_require__(68),
	    isSymbol = __webpack_require__(94);
	
	/** Used as references for various `Number` constants. */
	var INFINITY = 1 / 0;
	
	/** Used to convert symbols to primitives and strings. */
	var symbolProto = Symbol ? Symbol.prototype : undefined,
	    symbolToString = Symbol ? symbolProto.toString : undefined;
	
	/**
	 * Converts `value` to a string if it's not one. An empty string is returned
	 * for `null` and `undefined` values. The sign of `-0` is preserved.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to process.
	 * @returns {string} Returns the string.
	 * @example
	 *
	 * _.toString(null);
	 * // => ''
	 *
	 * _.toString(-0);
	 * // => '-0'
	 *
	 * _.toString([1, 2, 3]);
	 * // => '1,2,3'
	 */
	function toString(value) {
	  // Exit early for strings to avoid a performance hit in some environments.
	  if (typeof value == 'string') {
	    return value;
	  }
	  if (value == null) {
	    return '';
	  }
	  if (isSymbol(value)) {
	    return Symbol ? symbolToString.call(value) : '';
	  }
	  var result = (value + '');
	  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
	}
	
	module.exports = toString;


/***/ },
/* 94 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var isObjectLike = __webpack_require__(29);
	
	/** `Object#toString` result references. */
	var symbolTag = '[object Symbol]';
	
	/** Used for built-in method references. */
	var objectProto = global.Object.prototype;
	
	/**
	 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objectToString = objectProto.toString;
	
	/**
	 * Checks if `value` is classified as a `Symbol` primitive or object.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isSymbol(Symbol.iterator);
	 * // => true
	 *
	 * _.isSymbol('abc');
	 * // => false
	 */
	function isSymbol(value) {
	  return typeof value == 'symbol' ||
	    (isObjectLike(value) && objectToString.call(value) == symbolTag);
	}
	
	module.exports = isSymbol;
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

	var isArray = __webpack_require__(30);
	
	/** Used to match property names within property paths. */
	var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
	    reIsPlainProp = /^\w*$/;
	
	/**
	 * Checks if `value` is a property name and not a property path.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @param {Object} [object] The object to query keys on.
	 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
	 */
	function isKey(value, object) {
	  if (typeof value == 'number') {
	    return true;
	  }
	  return !isArray(value) &&
	    (reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
	      (object != null && value in Object(object)));
	}
	
	module.exports = isKey;


/***/ },
/* 96 */
/***/ function(module, exports, __webpack_require__) {

	var baseHasIn = __webpack_require__(97),
	    hasPath = __webpack_require__(98);
	
	/**
	 * Checks if `path` is a direct or inherited property of `object`.
	 *
	 * @static
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The object to query.
	 * @param {Array|string} path The path to check.
	 * @returns {boolean} Returns `true` if `path` exists, else `false`.
	 * @example
	 *
	 * var object = _.create({ 'a': _.create({ 'b': _.create({ 'c': 3 }) }) });
	 *
	 * _.hasIn(object, 'a');
	 * // => true
	 *
	 * _.hasIn(object, 'a.b.c');
	 * // => true
	 *
	 * _.hasIn(object, ['a', 'b', 'c']);
	 * // => true
	 *
	 * _.hasIn(object, 'b');
	 * // => false
	 */
	function hasIn(object, path) {
	  return hasPath(object, path, baseHasIn);
	}
	
	module.exports = hasIn;


/***/ },
/* 97 */
/***/ function(module, exports) {

	/**
	 * The base implementation of `_.hasIn` without support for deep paths.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {Array|string} key The key to check.
	 * @returns {boolean} Returns `true` if `key` exists, else `false`.
	 */
	function baseHasIn(object, key) {
	  return key in Object(object);
	}
	
	module.exports = baseHasIn;


/***/ },
/* 98 */
/***/ function(module, exports, __webpack_require__) {

	var baseToPath = __webpack_require__(91),
	    isArguments = __webpack_require__(21),
	    isArray = __webpack_require__(30),
	    isIndex = __webpack_require__(79),
	    isKey = __webpack_require__(95),
	    isLength = __webpack_require__(28),
	    isString = __webpack_require__(78),
	    last = __webpack_require__(99),
	    parent = __webpack_require__(100);
	
	/**
	 * Checks if `path` exists on `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {Array|string} path The path to check.
	 * @param {Function} hasFunc The function to check properties.
	 * @returns {boolean} Returns `true` if `path` exists, else `false`.
	 */
	function hasPath(object, path, hasFunc) {
	  if (object == null) {
	    return false;
	  }
	  var result = hasFunc(object, path);
	  if (!result && !isKey(path)) {
	    path = baseToPath(path);
	    object = parent(object, path);
	    if (object != null) {
	      path = last(path);
	      result = hasFunc(object, path);
	    }
	  }
	  return result || (isLength(object && object.length) && isIndex(path, object.length) &&
	    (isArray(object) || isString(object) || isArguments(object)));
	}
	
	module.exports = hasPath;


/***/ },
/* 99 */
/***/ function(module, exports) {

	/**
	 * Gets the last element of `array`.
	 *
	 * @static
	 * @memberOf _
	 * @category Array
	 * @param {Array} array The array to query.
	 * @returns {*} Returns the last element of `array`.
	 * @example
	 *
	 * _.last([1, 2, 3]);
	 * // => 3
	 */
	function last(array) {
	  var length = array ? array.length : 0;
	  return length ? array[length - 1] : undefined;
	}
	
	module.exports = last;


/***/ },
/* 100 */
/***/ function(module, exports, __webpack_require__) {

	var baseSlice = __webpack_require__(101),
	    get = __webpack_require__(89);
	
	/**
	 * Gets the parent value at `path` of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {Array} path The path to get the parent value of.
	 * @returns {*} Returns the parent value.
	 */
	function parent(object, path) {
	  return path.length == 1 ? object : get(object, baseSlice(path, 0, -1));
	}
	
	module.exports = parent;


/***/ },
/* 101 */
/***/ function(module, exports) {

	/**
	 * The base implementation of `_.slice` without an iteratee call guard.
	 *
	 * @private
	 * @param {Array} array The array to slice.
	 * @param {number} [start=0] The start position.
	 * @param {number} [end=array.length] The end position.
	 * @returns {Array} Returns the slice of `array`.
	 */
	function baseSlice(array, start, end) {
	  var index = -1,
	      length = array.length;
	
	  if (start < 0) {
	    start = -start > length ? 0 : (length + start);
	  }
	  end = end > length ? length : end;
	  if (end < 0) {
	    end += length;
	  }
	  length = start > end ? 0 : ((end - start) >>> 0);
	  start >>>= 0;
	
	  var result = Array(length);
	  while (++index < length) {
	    result[index] = array[index + start];
	  }
	  return result;
	}
	
	module.exports = baseSlice;


/***/ },
/* 102 */
/***/ function(module, exports) {

	/**
	 * This method returns the first argument provided to it.
	 *
	 * @static
	 * @memberOf _
	 * @category Util
	 * @param {*} value Any value.
	 * @returns {*} Returns `value`.
	 * @example
	 *
	 * var object = { 'user': 'fred' };
	 *
	 * _.identity(object) === object;
	 * // => true
	 */
	function identity(value) {
	  return value;
	}
	
	module.exports = identity;


/***/ },
/* 103 */
/***/ function(module, exports, __webpack_require__) {

	var baseProperty = __webpack_require__(25),
	    basePropertyDeep = __webpack_require__(104),
	    isKey = __webpack_require__(95);
	
	/**
	 * Creates a function that returns the value at `path` of a given object.
	 *
	 * @static
	 * @memberOf _
	 * @category Util
	 * @param {Array|string} path The path of the property to get.
	 * @returns {Function} Returns the new function.
	 * @example
	 *
	 * var objects = [
	 *   { 'a': { 'b': { 'c': 2 } } },
	 *   { 'a': { 'b': { 'c': 1 } } }
	 * ];
	 *
	 * _.map(objects, _.property('a.b.c'));
	 * // => [2, 1]
	 *
	 * _.map(_.sortBy(objects, _.property(['a', 'b', 'c'])), 'a.b.c');
	 * // => [1, 2]
	 */
	function property(path) {
	  return isKey(path) ? baseProperty(path) : basePropertyDeep(path);
	}
	
	module.exports = property;


/***/ },
/* 104 */
/***/ function(module, exports, __webpack_require__) {

	var baseGet = __webpack_require__(90);
	
	/**
	 * A specialized version of `baseProperty` which supports deep paths.
	 *
	 * @private
	 * @param {Array|string} path The path of the property to get.
	 * @returns {Function} Returns the new function.
	 */
	function basePropertyDeep(path) {
	  return function(object) {
	    return baseGet(object, path);
	  };
	}
	
	module.exports = basePropertyDeep;


/***/ },
/* 105 */
/***/ function(module, exports, __webpack_require__) {

	var baseEach = __webpack_require__(106),
	    baseFind = __webpack_require__(111),
	    baseFindIndex = __webpack_require__(112),
	    baseIteratee = __webpack_require__(31),
	    isArray = __webpack_require__(30);
	
	/**
	 * Iterates over elements of `collection`, returning the first element
	 * `predicate` returns truthy for. The predicate is invoked with three arguments:
	 * (value, index|key, collection).
	 *
	 * @static
	 * @memberOf _
	 * @category Collection
	 * @param {Array|Object} collection The collection to search.
	 * @param {Function|Object|string} [predicate=_.identity] The function invoked per iteration.
	 * @returns {*} Returns the matched element, else `undefined`.
	 * @example
	 *
	 * var users = [
	 *   { 'user': 'barney',  'age': 36, 'active': true },
	 *   { 'user': 'fred',    'age': 40, 'active': false },
	 *   { 'user': 'pebbles', 'age': 1,  'active': true }
	 * ];
	 *
	 * _.find(users, function(o) { return o.age < 40; });
	 * // => object for 'barney'
	 *
	 * // using the `_.matches` iteratee shorthand
	 * _.find(users, { 'age': 1, 'active': true });
	 * // => object for 'pebbles'
	 *
	 * // using the `_.matchesProperty` iteratee shorthand
	 * _.find(users, ['active', false]);
	 * // => object for 'fred'
	 *
	 * // using the `_.property` iteratee shorthand
	 * _.find(users, 'active');
	 * // => object for 'barney'
	 */
	function find(collection, predicate) {
	  predicate = baseIteratee(predicate, 3);
	  if (isArray(collection)) {
	    var index = baseFindIndex(collection, predicate);
	    return index > -1 ? collection[index] : undefined;
	  }
	  return baseFind(collection, predicate, baseEach);
	}
	
	module.exports = find;


/***/ },
/* 106 */
/***/ function(module, exports, __webpack_require__) {

	var baseForOwn = __webpack_require__(107),
	    createBaseEach = __webpack_require__(110);
	
	/**
	 * The base implementation of `_.forEach` without support for iteratee shorthands.
	 *
	 * @private
	 * @param {Array|Object} collection The collection to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array|Object} Returns `collection`.
	 */
	var baseEach = createBaseEach(baseForOwn);
	
	module.exports = baseEach;


/***/ },
/* 107 */
/***/ function(module, exports, __webpack_require__) {

	var baseFor = __webpack_require__(108),
	    keys = __webpack_require__(74);
	
	/**
	 * The base implementation of `_.forOwn` without support for iteratee shorthands.
	 *
	 * @private
	 * @param {Object} object The object to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Object} Returns `object`.
	 */
	function baseForOwn(object, iteratee) {
	  return object && baseFor(object, iteratee, keys);
	}
	
	module.exports = baseForOwn;


/***/ },
/* 108 */
/***/ function(module, exports, __webpack_require__) {

	var createBaseFor = __webpack_require__(109);
	
	/**
	 * The base implementation of `baseForIn` and `baseForOwn` which iterates
	 * over `object` properties returned by `keysFunc` invoking `iteratee` for
	 * each property. Iteratee functions may exit iteration early by explicitly
	 * returning `false`.
	 *
	 * @private
	 * @param {Object} object The object to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @param {Function} keysFunc The function to get the keys of `object`.
	 * @returns {Object} Returns `object`.
	 */
	var baseFor = createBaseFor();
	
	module.exports = baseFor;


/***/ },
/* 109 */
/***/ function(module, exports) {

	/**
	 * Creates a base function for methods like `_.forIn`.
	 *
	 * @private
	 * @param {boolean} [fromRight] Specify iterating from right to left.
	 * @returns {Function} Returns the new base function.
	 */
	function createBaseFor(fromRight) {
	  return function(object, iteratee, keysFunc) {
	    var index = -1,
	        iterable = Object(object),
	        props = keysFunc(object),
	        length = props.length;
	
	    while (length--) {
	      var key = props[fromRight ? length : ++index];
	      if (iteratee(iterable[key], key, iterable) === false) {
	        break;
	      }
	    }
	    return object;
	  };
	}
	
	module.exports = createBaseFor;


/***/ },
/* 110 */
/***/ function(module, exports, __webpack_require__) {

	var isArrayLike = __webpack_require__(23);
	
	/**
	 * Creates a `baseEach` or `baseEachRight` function.
	 *
	 * @private
	 * @param {Function} eachFunc The function to iterate over a collection.
	 * @param {boolean} [fromRight] Specify iterating from right to left.
	 * @returns {Function} Returns the new base function.
	 */
	function createBaseEach(eachFunc, fromRight) {
	  return function(collection, iteratee) {
	    if (collection == null) {
	      return collection;
	    }
	    if (!isArrayLike(collection)) {
	      return eachFunc(collection, iteratee);
	    }
	    var length = collection.length,
	        index = fromRight ? length : -1,
	        iterable = Object(collection);
	
	    while ((fromRight ? index-- : ++index < length)) {
	      if (iteratee(iterable[index], index, iterable) === false) {
	        break;
	      }
	    }
	    return collection;
	  };
	}
	
	module.exports = createBaseEach;


/***/ },
/* 111 */
/***/ function(module, exports) {

	/**
	 * The base implementation of methods like `_.find` and `_.findKey`, without
	 * support for iteratee shorthands, which iterates over `collection` using
	 * `eachFunc`.
	 *
	 * @private
	 * @param {Array|Object} collection The collection to search.
	 * @param {Function} predicate The function invoked per iteration.
	 * @param {Function} eachFunc The function to iterate over `collection`.
	 * @param {boolean} [retKey] Specify returning the key of the found element instead of the element itself.
	 * @returns {*} Returns the found element or its key, else `undefined`.
	 */
	function baseFind(collection, predicate, eachFunc, retKey) {
	  var result;
	  eachFunc(collection, function(value, key, collection) {
	    if (predicate(value, key, collection)) {
	      result = retKey ? key : value;
	      return false;
	    }
	  });
	  return result;
	}
	
	module.exports = baseFind;


/***/ },
/* 112 */
/***/ function(module, exports) {

	/**
	 * The base implementation of `_.findIndex` and `_.findLastIndex` without
	 * support for iteratee shorthands.
	 *
	 * @private
	 * @param {Array} array The array to search.
	 * @param {Function} predicate The function invoked per iteration.
	 * @param {boolean} [fromRight] Specify iterating from right to left.
	 * @returns {number} Returns the index of the matched value, else `-1`.
	 */
	function baseFindIndex(array, predicate, fromRight) {
	  var length = array.length,
	      index = fromRight ? length : -1;
	
	  while ((fromRight ? index-- : ++index < length)) {
	    if (predicate(array[index], index, array)) {
	      return index;
	    }
	  }
	  return -1;
	}
	
	module.exports = baseFindIndex;


/***/ },
/* 113 */
/***/ function(module, exports, __webpack_require__) {

	var require;var require;var nanoModal;!function a(b,c,d){function e(g,h){if(!c[g]){if(!b[g]){var i="function"==typeof require&&require;if(!h&&i)return require(g,!0);if(f)return f(g,!0);throw new Error("Cannot find module '"+g+"'")}var j=c[g]={exports:{}};b[g][0].call(j.exports,function(a){var c=b[g][1][a];return e(c?c:a)},j,j.exports,a,b,c,d)}return c[g].exports}for(var f="function"==typeof require&&require,g=0;g<d.length;g++)e(d[g]);return e}({1:[function(a,b,c){function d(a,b){var c=document,d=a.nodeType||a===window?a:c.createElement(a),f=[];b&&(d.className=b);var g=e(),h=e(),i=function(a,b){d.addEventListener?d.addEventListener(a,b,!1):d.attachEvent("on"+a,b),f.push({event:a,handler:b})},j=function(a,b){d.removeEventListener?d.removeEventListener(a,b):d.detachEvent("on"+a,b);for(var c,e=f.length;e-->0;)if(c=f[e],c.event===a&&c.handler===b){f.splice(e,1);break}},k=function(a){var b=!1,c=function(c){b||(b=!0,setTimeout(function(){b=!1},100),a(c))};i("touchstart",c),i("mousedown",c)},l=function(a){d&&(d.style.display="block",g.fire(a))},m=function(a){d&&(d.style.display="none",h.fire(a))},n=function(){return d.style&&"block"===d.style.display},o=function(a){d&&(d.innerHTML=a)},p=function(a){d&&(o(""),d.appendChild(c.createTextNode(a)))},q=function(){if(d.parentNode){for(var a,b=f.length;b-->0;)a=f[b],j(a.event,a.handler);d.parentNode.removeChild(d),g.removeAllListeners(),h.removeAllListeners()}},r=function(a){var b=a.el||a;d.appendChild(b)};return{el:d,addListener:i,addClickListener:k,onShowEvent:g,onHideEvent:h,show:l,hide:m,isShowing:n,html:o,text:p,remove:q,add:r}}var e=a("./ModalEvent");b.exports=d},{"./ModalEvent":3}],2:[function(a,b,c){function d(a,b,c,f,g){if(void 0!==a){b=b||{};var h,i=e("div","nanoModal nanoModalOverride "+(b.classes||"")),j=e("div","nanoModalContent"),k=e("div","nanoModalButtons");i.add(j),i.add(k),i.el.style.display="none";var l,m=[];b.buttons=b.buttons||[{text:"Close",handler:"hide",primary:!0}];var n=function(){for(var a=m.length;a-->0;){var b=m[a];b.remove()}m=[]},o=function(){i.el.style.marginLeft=-i.el.clientWidth/2+"px"},p=function(){for(var a=document.querySelectorAll(".nanoModal"),b=a.length;b-->0;)if("none"!==a[b].style.display)return!0;return!1},q=function(){i.isShowing()||(d.resizeOverlay(),c.show(c),i.show(l),o())},r=function(){i.isShowing()&&(i.hide(l),p()||c.hide(c),b.autoRemove&&l.remove())},s=function(a){var b={};for(var c in a)a.hasOwnProperty(c)&&(b[c]=a[c]);return b};return l={modal:i,overlay:c,show:function(){return f?f(q,l):q(),l},hide:function(){return g?g(r,l):r(),l},onShow:function(a){return i.onShowEvent.addListener(function(){a(l)}),l},onHide:function(a){return i.onHideEvent.addListener(function(){a(l)}),l},remove:function(){c.onRequestHide.removeListener(h),h=null,n(),i.remove()},setButtons:function(a){var b,c,d,f=a.length,g=function(a,b){var c=s(l);a.addClickListener(function(a){c.event=a||window.event,b.handler(c)})};if(n(),0===f)k.hide();else for(k.show();f-->0;)b=a[f],d="nanoModalBtn",b.primary&&(d+=" nanoModalBtnPrimary"),d+=b.classes?" "+b.classes:"",c=e("button",d),"hide"===b.handler?c.addClickListener(l.hide):b.handler&&g(c,b),c.text(b.text),k.add(c),m.push(c);return o(),l},setContent:function(b){return b.nodeType?(j.html(""),j.add(b)):j.html(b),o(),a=b,l},getContent:function(){return a}},h=c.onRequestHide.addListener(function(){b.overlayClose!==!1&&i.isShowing()&&l.hide()}),l.setContent(a).setButtons(b.buttons),document.body.appendChild(i.el),l}}var e=a("./El"),f=document,g=function(a){var b=f.documentElement,c="scroll"+a,d="offset"+a;return Math.max(f.body[c],b[c],f.body[d],b[d],b["client"+a])};d.resizeOverlay=function(){var a=f.getElementById("nanoModalOverlay");a.style.width=g("Width")+"px",a.style.height=g("Height")+"px"},b.exports=d},{"./El":1}],3:[function(a,b,c){function d(){var a={},b=0,c=function(c){return a[b]=c,b++},d=function(b){b&&delete a[b]},e=function(){a={}},f=function(){for(var c=0,d=b;d>c;++c)a[c]&&a[c].apply(null,arguments)};return{addListener:c,removeListener:d,removeAllListeners:e,fire:f}}b.exports=d},{}],4:[function(a,b,c){var d=a("./ModalEvent"),e=function(){function b(){if(!g.querySelector("#nanoModalOverlay")){var a=e("style"),b=a.el,h=g.querySelectorAll("head")[0].childNodes[0];h.parentNode.insertBefore(b,h);var i=".nanoModal{position:absolute;top:100px;left:50%;display:none;z-index:9999;min-width:300px;padding:15px 20px 10px;-webkit-border-radius:10px;-moz-border-radius:10px;border-radius:10px;background:#fff;background:-moz-linear-gradient(top,#fff 0,#ddd 100%);background:-webkit-gradient(linear,left top,left bottom,color-stop(0%,#fff),color-stop(100%,#ddd));background:-webkit-linear-gradient(top,#fff 0,#ddd 100%);background:-o-linear-gradient(top,#fff 0,#ddd 100%);background:-ms-linear-gradient(top,#fff 0,#ddd 100%);background:linear-gradient(to bottom,#fff 0,#ddd 100%);filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#ffffff', endColorstr='#dddddd', GradientType=0)}.nanoModalOverlay{position:absolute;top:0;left:0;width:100%;height:100%;z-index:9998;background:#000;display:none;-ms-filter:\"alpha(Opacity=50)\";-moz-opacity:.5;-khtml-opacity:.5;opacity:.5}.nanoModalButtons{border-top:1px solid #ddd;margin-top:15px;text-align:right}.nanoModalBtn{color:#333;background-color:#fff;display:inline-block;padding:6px 12px;margin:8px 4px 0;font-size:14px;text-align:center;white-space:nowrap;vertical-align:middle;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;border:1px solid transparent;-webkit-border-radius:4px;-moz-border-radius:4px;border-radius:4px}.nanoModalBtn:active,.nanoModalBtn:focus,.nanoModalBtn:hover{color:#333;background-color:#e6e6e6;border-color:#adadad}.nanoModalBtn.nanoModalBtnPrimary{color:#fff;background-color:#428bca;border-color:#357ebd}.nanoModalBtn.nanoModalBtnPrimary:active,.nanoModalBtn.nanoModalBtnPrimary:focus,.nanoModalBtn.nanoModalBtnPrimary:hover{color:#fff;background-color:#3071a9;border-color:#285e8e}";b.styleSheet?b.styleSheet.cssText=i:a.text(i),c=e("div","nanoModalOverlay nanoModalOverride"),c.el.id="nanoModalOverlay",g.body.appendChild(c.el),c.onRequestHide=d();var j=function(){c.onRequestHide.fire()};c.addClickListener(j),e(g).addListener("keydown",function(a){var b=a.which||a.keyCode;27===b&&j()});var k,l=e(window);l.addListener("resize",function(){k&&clearTimeout(k),k=setTimeout(f.resizeOverlay,100)}),l.addListener("orientationchange",function(){for(var a=0;3>a;++a)setTimeout(f.resizeOverlay,1e3*a+200)})}}var c,e=a("./El"),f=a("./Modal"),g=document;document.body&&b();var h=function(a,d){return b(),f(a,d,c,h.customShow,h.customHide)};return h.resizeOverlay=f.resizeOverlay,h}();nanoModal=e},{"./El":1,"./Modal":2,"./ModalEvent":3}]},{},[1,2,3,4]),"undefined"!=typeof window&&("function"==typeof window.define&&window.define.amd&&window.define(function(){return nanoModal}),window.nanoModal=nanoModal),"undefined"!=typeof module&&(module.exports=nanoModal);

/***/ },
/* 114 */
/***/ function(module, exports, __webpack_require__) {

	var H = __webpack_require__(115);
	module.exports = function() { var T = new H.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");if(t.s(t.f("isEmpty",c,p,1),c,p,0,12,132,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("<p class=\"default-content\">A kosár még üres. Az ételeket a \"Kosárba\" gomb megnyomásával adhatod hozzá a rendeléshez.</p>");});c.pop();}t.b(" ");if(t.s(t.f("lines",c,p,1),c,p,0,155,496,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("<div class=\"line\"><div class=\"name\">");t.b(t.v(t.f("name",c,p,0)));t.b("</div><div class=\"price\">");t.b(t.v(t.f("price",c,p,0)));t.b(" Ft</div><div class=\"actions\"><button data-duplicate-order-item=\"");t.b(t.v(t.f("id",c,p,0)));t.b("\"><svg><use xlink:href=\"#icon-plus\"></use></svg> Még</button> <button data-remove-order-item=\"");t.b(t.v(t.f("id",c,p,0)));t.b("\"><svg><use xlink:href=\"#icon-minus\"></use></svg> Ki a kosárból</button></div></div>");});c.pop();}t.b(" ");if(t.s(t.f("deliveryFee",c,p,1),c,p,0,523,613,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("<div class=\"delivery-fee\"><div>Kiszállítási díj</div><div>");t.b(t.v(t.f("deliveryFee",c,p,0)));t.b(" Ft</div></div>");});c.pop();}t.b(" ");if(t.s(t.f("total",c,p,1),c,p,0,640,685,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("<div>Végösszeg</div><div>");t.b(t.v(t.f("total",c,p,0)));t.b(" Ft</div>");});c.pop();}t.b(" ");if(t.s(t.f("showMinForFreeDeliveryMessage",c,p,1),c,p,0,730,812,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("<p>A minimális ");t.b(t.v(t.f("minForFreeDelivery",c,p,0)));t.b(" Ft rendelési értéket még nem érted el.</p>");});c.pop();}return t.fl(); },partials: {}, subs: {  }}, "{{#isEmpty}}<p class=\"default-content\">A kosár még üres. Az ételeket a \"Kosárba\" gomb megnyomásával adhatod hozzá a rendeléshez.</p>{{/isEmpty}} {{#lines}}<div class=\"line\"><div class=\"name\">{{ name }}</div><div class=\"price\">{{ price }} Ft</div><div class=\"actions\"><button data-duplicate-order-item=\"{{ id }}\"><svg><use xlink:href=\"#icon-plus\"></use></svg> Még</button> <button data-remove-order-item=\"{{ id }}\"><svg><use xlink:href=\"#icon-minus\"></use></svg> Ki a kosárból</button></div></div>{{/lines}} {{#deliveryFee}}<div class=\"delivery-fee\"><div>Kiszállítási díj</div><div>{{ deliveryFee }} Ft</div></div>{{/deliveryFee}} {{#total}}<div>Végösszeg</div><div>{{ total }} Ft</div>{{/total}} {{#showMinForFreeDeliveryMessage}}<p>A minimális {{ minForFreeDelivery }} Ft rendelési értéket még nem érted el.</p>{{/showMinForFreeDeliveryMessage}}", H);return T.render.apply(T, arguments); };

/***/ },
/* 115 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 *  Copyright 2011 Twitter, Inc.
	 *  Licensed under the Apache License, Version 2.0 (the "License");
	 *  you may not use this file except in compliance with the License.
	 *  You may obtain a copy of the License at
	 *
	 *  http://www.apache.org/licenses/LICENSE-2.0
	 *
	 *  Unless required by applicable law or agreed to in writing, software
	 *  distributed under the License is distributed on an "AS IS" BASIS,
	 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 *  See the License for the specific language governing permissions and
	 *  limitations under the License.
	 */
	
	// This file is for use with Node.js. See dist/ for browser files.
	
	var Hogan = __webpack_require__(116);
	Hogan.Template = __webpack_require__(117).Template;
	Hogan.template = Hogan.Template;
	module.exports = Hogan;


/***/ },
/* 116 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 *  Copyright 2011 Twitter, Inc.
	 *  Licensed under the Apache License, Version 2.0 (the "License");
	 *  you may not use this file except in compliance with the License.
	 *  You may obtain a copy of the License at
	 *
	 *  http://www.apache.org/licenses/LICENSE-2.0
	 *
	 *  Unless required by applicable law or agreed to in writing, software
	 *  distributed under the License is distributed on an "AS IS" BASIS,
	 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 *  See the License for the specific language governing permissions and
	 *  limitations under the License.
	 */
	
	(function (Hogan) {
	  // Setup regex  assignments
	  // remove whitespace according to Mustache spec
	  var rIsWhitespace = /\S/,
	      rQuot = /\"/g,
	      rNewline =  /\n/g,
	      rCr = /\r/g,
	      rSlash = /\\/g,
	      rLineSep = /\u2028/,
	      rParagraphSep = /\u2029/;
	
	  Hogan.tags = {
	    '#': 1, '^': 2, '<': 3, '$': 4,
	    '/': 5, '!': 6, '>': 7, '=': 8, '_v': 9,
	    '{': 10, '&': 11, '_t': 12
	  };
	
	  Hogan.scan = function scan(text, delimiters) {
	    var len = text.length,
	        IN_TEXT = 0,
	        IN_TAG_TYPE = 1,
	        IN_TAG = 2,
	        state = IN_TEXT,
	        tagType = null,
	        tag = null,
	        buf = '',
	        tokens = [],
	        seenTag = false,
	        i = 0,
	        lineStart = 0,
	        otag = '{{',
	        ctag = '}}';
	
	    function addBuf() {
	      if (buf.length > 0) {
	        tokens.push({tag: '_t', text: new String(buf)});
	        buf = '';
	      }
	    }
	
	    function lineIsWhitespace() {
	      var isAllWhitespace = true;
	      for (var j = lineStart; j < tokens.length; j++) {
	        isAllWhitespace =
	          (Hogan.tags[tokens[j].tag] < Hogan.tags['_v']) ||
	          (tokens[j].tag == '_t' && tokens[j].text.match(rIsWhitespace) === null);
	        if (!isAllWhitespace) {
	          return false;
	        }
	      }
	
	      return isAllWhitespace;
	    }
	
	    function filterLine(haveSeenTag, noNewLine) {
	      addBuf();
	
	      if (haveSeenTag && lineIsWhitespace()) {
	        for (var j = lineStart, next; j < tokens.length; j++) {
	          if (tokens[j].text) {
	            if ((next = tokens[j+1]) && next.tag == '>') {
	              // set indent to token value
	              next.indent = tokens[j].text.toString()
	            }
	            tokens.splice(j, 1);
	          }
	        }
	      } else if (!noNewLine) {
	        tokens.push({tag:'\n'});
	      }
	
	      seenTag = false;
	      lineStart = tokens.length;
	    }
	
	    function changeDelimiters(text, index) {
	      var close = '=' + ctag,
	          closeIndex = text.indexOf(close, index),
	          delimiters = trim(
	            text.substring(text.indexOf('=', index) + 1, closeIndex)
	          ).split(' ');
	
	      otag = delimiters[0];
	      ctag = delimiters[delimiters.length - 1];
	
	      return closeIndex + close.length - 1;
	    }
	
	    if (delimiters) {
	      delimiters = delimiters.split(' ');
	      otag = delimiters[0];
	      ctag = delimiters[1];
	    }
	
	    for (i = 0; i < len; i++) {
	      if (state == IN_TEXT) {
	        if (tagChange(otag, text, i)) {
	          --i;
	          addBuf();
	          state = IN_TAG_TYPE;
	        } else {
	          if (text.charAt(i) == '\n') {
	            filterLine(seenTag);
	          } else {
	            buf += text.charAt(i);
	          }
	        }
	      } else if (state == IN_TAG_TYPE) {
	        i += otag.length - 1;
	        tag = Hogan.tags[text.charAt(i + 1)];
	        tagType = tag ? text.charAt(i + 1) : '_v';
	        if (tagType == '=') {
	          i = changeDelimiters(text, i);
	          state = IN_TEXT;
	        } else {
	          if (tag) {
	            i++;
	          }
	          state = IN_TAG;
	        }
	        seenTag = i;
	      } else {
	        if (tagChange(ctag, text, i)) {
	          tokens.push({tag: tagType, n: trim(buf), otag: otag, ctag: ctag,
	                       i: (tagType == '/') ? seenTag - otag.length : i + ctag.length});
	          buf = '';
	          i += ctag.length - 1;
	          state = IN_TEXT;
	          if (tagType == '{') {
	            if (ctag == '}}') {
	              i++;
	            } else {
	              cleanTripleStache(tokens[tokens.length - 1]);
	            }
	          }
	        } else {
	          buf += text.charAt(i);
	        }
	      }
	    }
	
	    filterLine(seenTag, true);
	
	    return tokens;
	  }
	
	  function cleanTripleStache(token) {
	    if (token.n.substr(token.n.length - 1) === '}') {
	      token.n = token.n.substring(0, token.n.length - 1);
	    }
	  }
	
	  function trim(s) {
	    if (s.trim) {
	      return s.trim();
	    }
	
	    return s.replace(/^\s*|\s*$/g, '');
	  }
	
	  function tagChange(tag, text, index) {
	    if (text.charAt(index) != tag.charAt(0)) {
	      return false;
	    }
	
	    for (var i = 1, l = tag.length; i < l; i++) {
	      if (text.charAt(index + i) != tag.charAt(i)) {
	        return false;
	      }
	    }
	
	    return true;
	  }
	
	  // the tags allowed inside super templates
	  var allowedInSuper = {'_t': true, '\n': true, '$': true, '/': true};
	
	  function buildTree(tokens, kind, stack, customTags) {
	    var instructions = [],
	        opener = null,
	        tail = null,
	        token = null;
	
	    tail = stack[stack.length - 1];
	
	    while (tokens.length > 0) {
	      token = tokens.shift();
	
	      if (tail && tail.tag == '<' && !(token.tag in allowedInSuper)) {
	        throw new Error('Illegal content in < super tag.');
	      }
	
	      if (Hogan.tags[token.tag] <= Hogan.tags['$'] || isOpener(token, customTags)) {
	        stack.push(token);
	        token.nodes = buildTree(tokens, token.tag, stack, customTags);
	      } else if (token.tag == '/') {
	        if (stack.length === 0) {
	          throw new Error('Closing tag without opener: /' + token.n);
	        }
	        opener = stack.pop();
	        if (token.n != opener.n && !isCloser(token.n, opener.n, customTags)) {
	          throw new Error('Nesting error: ' + opener.n + ' vs. ' + token.n);
	        }
	        opener.end = token.i;
	        return instructions;
	      } else if (token.tag == '\n') {
	        token.last = (tokens.length == 0) || (tokens[0].tag == '\n');
	      }
	
	      instructions.push(token);
	    }
	
	    if (stack.length > 0) {
	      throw new Error('missing closing tag: ' + stack.pop().n);
	    }
	
	    return instructions;
	  }
	
	  function isOpener(token, tags) {
	    for (var i = 0, l = tags.length; i < l; i++) {
	      if (tags[i].o == token.n) {
	        token.tag = '#';
	        return true;
	      }
	    }
	  }
	
	  function isCloser(close, open, tags) {
	    for (var i = 0, l = tags.length; i < l; i++) {
	      if (tags[i].c == close && tags[i].o == open) {
	        return true;
	      }
	    }
	  }
	
	  function stringifySubstitutions(obj) {
	    var items = [];
	    for (var key in obj) {
	      items.push('"' + esc(key) + '": function(c,p,t,i) {' + obj[key] + '}');
	    }
	    return "{ " + items.join(",") + " }";
	  }
	
	  function stringifyPartials(codeObj) {
	    var partials = [];
	    for (var key in codeObj.partials) {
	      partials.push('"' + esc(key) + '":{name:"' + esc(codeObj.partials[key].name) + '", ' + stringifyPartials(codeObj.partials[key]) + "}");
	    }
	    return "partials: {" + partials.join(",") + "}, subs: " + stringifySubstitutions(codeObj.subs);
	  }
	
	  Hogan.stringify = function(codeObj, text, options) {
	    return "{code: function (c,p,i) { " + Hogan.wrapMain(codeObj.code) + " }," + stringifyPartials(codeObj) +  "}";
	  }
	
	  var serialNo = 0;
	  Hogan.generate = function(tree, text, options) {
	    serialNo = 0;
	    var context = { code: '', subs: {}, partials: {} };
	    Hogan.walk(tree, context);
	
	    if (options.asString) {
	      return this.stringify(context, text, options);
	    }
	
	    return this.makeTemplate(context, text, options);
	  }
	
	  Hogan.wrapMain = function(code) {
	    return 'var t=this;t.b(i=i||"");' + code + 'return t.fl();';
	  }
	
	  Hogan.template = Hogan.Template;
	
	  Hogan.makeTemplate = function(codeObj, text, options) {
	    var template = this.makePartials(codeObj);
	    template.code = new Function('c', 'p', 'i', this.wrapMain(codeObj.code));
	    return new this.template(template, text, this, options);
	  }
	
	  Hogan.makePartials = function(codeObj) {
	    var key, template = {subs: {}, partials: codeObj.partials, name: codeObj.name};
	    for (key in template.partials) {
	      template.partials[key] = this.makePartials(template.partials[key]);
	    }
	    for (key in codeObj.subs) {
	      template.subs[key] = new Function('c', 'p', 't', 'i', codeObj.subs[key]);
	    }
	    return template;
	  }
	
	  function esc(s) {
	    return s.replace(rSlash, '\\\\')
	            .replace(rQuot, '\\\"')
	            .replace(rNewline, '\\n')
	            .replace(rCr, '\\r')
	            .replace(rLineSep, '\\u2028')
	            .replace(rParagraphSep, '\\u2029');
	  }
	
	  function chooseMethod(s) {
	    return (~s.indexOf('.')) ? 'd' : 'f';
	  }
	
	  function createPartial(node, context) {
	    var prefix = "<" + (context.prefix || "");
	    var sym = prefix + node.n + serialNo++;
	    context.partials[sym] = {name: node.n, partials: {}};
	    context.code += 't.b(t.rp("' +  esc(sym) + '",c,p,"' + (node.indent || '') + '"));';
	    return sym;
	  }
	
	  Hogan.codegen = {
	    '#': function(node, context) {
	      context.code += 'if(t.s(t.' + chooseMethod(node.n) + '("' + esc(node.n) + '",c,p,1),' +
	                      'c,p,0,' + node.i + ',' + node.end + ',"' + node.otag + " " + node.ctag + '")){' +
	                      't.rs(c,p,' + 'function(c,p,t){';
	      Hogan.walk(node.nodes, context);
	      context.code += '});c.pop();}';
	    },
	
	    '^': function(node, context) {
	      context.code += 'if(!t.s(t.' + chooseMethod(node.n) + '("' + esc(node.n) + '",c,p,1),c,p,1,0,0,"")){';
	      Hogan.walk(node.nodes, context);
	      context.code += '};';
	    },
	
	    '>': createPartial,
	    '<': function(node, context) {
	      var ctx = {partials: {}, code: '', subs: {}, inPartial: true};
	      Hogan.walk(node.nodes, ctx);
	      var template = context.partials[createPartial(node, context)];
	      template.subs = ctx.subs;
	      template.partials = ctx.partials;
	    },
	
	    '$': function(node, context) {
	      var ctx = {subs: {}, code: '', partials: context.partials, prefix: node.n};
	      Hogan.walk(node.nodes, ctx);
	      context.subs[node.n] = ctx.code;
	      if (!context.inPartial) {
	        context.code += 't.sub("' + esc(node.n) + '",c,p,i);';
	      }
	    },
	
	    '\n': function(node, context) {
	      context.code += write('"\\n"' + (node.last ? '' : ' + i'));
	    },
	
	    '_v': function(node, context) {
	      context.code += 't.b(t.v(t.' + chooseMethod(node.n) + '("' + esc(node.n) + '",c,p,0)));';
	    },
	
	    '_t': function(node, context) {
	      context.code += write('"' + esc(node.text) + '"');
	    },
	
	    '{': tripleStache,
	
	    '&': tripleStache
	  }
	
	  function tripleStache(node, context) {
	    context.code += 't.b(t.t(t.' + chooseMethod(node.n) + '("' + esc(node.n) + '",c,p,0)));';
	  }
	
	  function write(s) {
	    return 't.b(' + s + ');';
	  }
	
	  Hogan.walk = function(nodelist, context) {
	    var func;
	    for (var i = 0, l = nodelist.length; i < l; i++) {
	      func = Hogan.codegen[nodelist[i].tag];
	      func && func(nodelist[i], context);
	    }
	    return context;
	  }
	
	  Hogan.parse = function(tokens, text, options) {
	    options = options || {};
	    return buildTree(tokens, '', [], options.sectionTags || []);
	  }
	
	  Hogan.cache = {};
	
	  Hogan.cacheKey = function(text, options) {
	    return [text, !!options.asString, !!options.disableLambda, options.delimiters, !!options.modelGet].join('||');
	  }
	
	  Hogan.compile = function(text, options) {
	    options = options || {};
	    var key = Hogan.cacheKey(text, options);
	    var template = this.cache[key];
	
	    if (template) {
	      var partials = template.partials;
	      for (var name in partials) {
	        delete partials[name].instance;
	      }
	      return template;
	    }
	
	    template = this.generate(this.parse(this.scan(text, options.delimiters), text, options), text, options);
	    return this.cache[key] = template;
	  }
	})( true ? exports : Hogan);


/***/ },
/* 117 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 *  Copyright 2011 Twitter, Inc.
	 *  Licensed under the Apache License, Version 2.0 (the "License");
	 *  you may not use this file except in compliance with the License.
	 *  You may obtain a copy of the License at
	 *
	 *  http://www.apache.org/licenses/LICENSE-2.0
	 *
	 *  Unless required by applicable law or agreed to in writing, software
	 *  distributed under the License is distributed on an "AS IS" BASIS,
	 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 *  See the License for the specific language governing permissions and
	 *  limitations under the License.
	 */
	
	var Hogan = {};
	
	(function (Hogan) {
	  Hogan.Template = function (codeObj, text, compiler, options) {
	    codeObj = codeObj || {};
	    this.r = codeObj.code || this.r;
	    this.c = compiler;
	    this.options = options || {};
	    this.text = text || '';
	    this.partials = codeObj.partials || {};
	    this.subs = codeObj.subs || {};
	    this.buf = '';
	  }
	
	  Hogan.Template.prototype = {
	    // render: replaced by generated code.
	    r: function (context, partials, indent) { return ''; },
	
	    // variable escaping
	    v: hoganEscape,
	
	    // triple stache
	    t: coerceToString,
	
	    render: function render(context, partials, indent) {
	      return this.ri([context], partials || {}, indent);
	    },
	
	    // render internal -- a hook for overrides that catches partials too
	    ri: function (context, partials, indent) {
	      return this.r(context, partials, indent);
	    },
	
	    // ensurePartial
	    ep: function(symbol, partials) {
	      var partial = this.partials[symbol];
	
	      // check to see that if we've instantiated this partial before
	      var template = partials[partial.name];
	      if (partial.instance && partial.base == template) {
	        return partial.instance;
	      }
	
	      if (typeof template == 'string') {
	        if (!this.c) {
	          throw new Error("No compiler available.");
	        }
	        template = this.c.compile(template, this.options);
	      }
	
	      if (!template) {
	        return null;
	      }
	
	      // We use this to check whether the partials dictionary has changed
	      this.partials[symbol].base = template;
	
	      if (partial.subs) {
	        // Make sure we consider parent template now
	        if (!partials.stackText) partials.stackText = {};
	        for (key in partial.subs) {
	          if (!partials.stackText[key]) {
	            partials.stackText[key] = (this.activeSub !== undefined && partials.stackText[this.activeSub]) ? partials.stackText[this.activeSub] : this.text;
	          }
	        }
	        template = createSpecializedPartial(template, partial.subs, partial.partials,
	          this.stackSubs, this.stackPartials, partials.stackText);
	      }
	      this.partials[symbol].instance = template;
	
	      return template;
	    },
	
	    // tries to find a partial in the current scope and render it
	    rp: function(symbol, context, partials, indent) {
	      var partial = this.ep(symbol, partials);
	      if (!partial) {
	        return '';
	      }
	
	      return partial.ri(context, partials, indent);
	    },
	
	    // render a section
	    rs: function(context, partials, section) {
	      var tail = context[context.length - 1];
	
	      if (!isArray(tail)) {
	        section(context, partials, this);
	        return;
	      }
	
	      for (var i = 0; i < tail.length; i++) {
	        context.push(tail[i]);
	        section(context, partials, this);
	        context.pop();
	      }
	    },
	
	    // maybe start a section
	    s: function(val, ctx, partials, inverted, start, end, tags) {
	      var pass;
	
	      if (isArray(val) && val.length === 0) {
	        return false;
	      }
	
	      if (typeof val == 'function') {
	        val = this.ms(val, ctx, partials, inverted, start, end, tags);
	      }
	
	      pass = !!val;
	
	      if (!inverted && pass && ctx) {
	        ctx.push((typeof val == 'object') ? val : ctx[ctx.length - 1]);
	      }
	
	      return pass;
	    },
	
	    // find values with dotted names
	    d: function(key, ctx, partials, returnFound) {
	      var found,
	          names = key.split('.'),
	          val = this.f(names[0], ctx, partials, returnFound),
	          doModelGet = this.options.modelGet,
	          cx = null;
	
	      if (key === '.' && isArray(ctx[ctx.length - 2])) {
	        val = ctx[ctx.length - 1];
	      } else {
	        for (var i = 1; i < names.length; i++) {
	          found = findInScope(names[i], val, doModelGet);
	          if (found !== undefined) {
	            cx = val;
	            val = found;
	          } else {
	            val = '';
	          }
	        }
	      }
	
	      if (returnFound && !val) {
	        return false;
	      }
	
	      if (!returnFound && typeof val == 'function') {
	        ctx.push(cx);
	        val = this.mv(val, ctx, partials);
	        ctx.pop();
	      }
	
	      return val;
	    },
	
	    // find values with normal names
	    f: function(key, ctx, partials, returnFound) {
	      var val = false,
	          v = null,
	          found = false,
	          doModelGet = this.options.modelGet;
	
	      for (var i = ctx.length - 1; i >= 0; i--) {
	        v = ctx[i];
	        val = findInScope(key, v, doModelGet);
	        if (val !== undefined) {
	          found = true;
	          break;
	        }
	      }
	
	      if (!found) {
	        return (returnFound) ? false : "";
	      }
	
	      if (!returnFound && typeof val == 'function') {
	        val = this.mv(val, ctx, partials);
	      }
	
	      return val;
	    },
	
	    // higher order templates
	    ls: function(func, cx, partials, text, tags) {
	      var oldTags = this.options.delimiters;
	
	      this.options.delimiters = tags;
	      this.b(this.ct(coerceToString(func.call(cx, text)), cx, partials));
	      this.options.delimiters = oldTags;
	
	      return false;
	    },
	
	    // compile text
	    ct: function(text, cx, partials) {
	      if (this.options.disableLambda) {
	        throw new Error('Lambda features disabled.');
	      }
	      return this.c.compile(text, this.options).render(cx, partials);
	    },
	
	    // template result buffering
	    b: function(s) { this.buf += s; },
	
	    fl: function() { var r = this.buf; this.buf = ''; return r; },
	
	    // method replace section
	    ms: function(func, ctx, partials, inverted, start, end, tags) {
	      var textSource,
	          cx = ctx[ctx.length - 1],
	          result = func.call(cx);
	
	      if (typeof result == 'function') {
	        if (inverted) {
	          return true;
	        } else {
	          textSource = (this.activeSub && this.subsText && this.subsText[this.activeSub]) ? this.subsText[this.activeSub] : this.text;
	          return this.ls(result, cx, partials, textSource.substring(start, end), tags);
	        }
	      }
	
	      return result;
	    },
	
	    // method replace variable
	    mv: function(func, ctx, partials) {
	      var cx = ctx[ctx.length - 1];
	      var result = func.call(cx);
	
	      if (typeof result == 'function') {
	        return this.ct(coerceToString(result.call(cx)), cx, partials);
	      }
	
	      return result;
	    },
	
	    sub: function(name, context, partials, indent) {
	      var f = this.subs[name];
	      if (f) {
	        this.activeSub = name;
	        f(context, partials, this, indent);
	        this.activeSub = false;
	      }
	    }
	
	  };
	
	  //Find a key in an object
	  function findInScope(key, scope, doModelGet) {
	    var val;
	
	    if (scope && typeof scope == 'object') {
	
	      if (scope[key] !== undefined) {
	        val = scope[key];
	
	      // try lookup with get for backbone or similar model data
	      } else if (doModelGet && scope.get && typeof scope.get == 'function') {
	        val = scope.get(key);
	      }
	    }
	
	    return val;
	  }
	
	  function createSpecializedPartial(instance, subs, partials, stackSubs, stackPartials, stackText) {
	    function PartialTemplate() {};
	    PartialTemplate.prototype = instance;
	    function Substitutions() {};
	    Substitutions.prototype = instance.subs;
	    var key;
	    var partial = new PartialTemplate();
	    partial.subs = new Substitutions();
	    partial.subsText = {};  //hehe. substext.
	    partial.buf = '';
	
	    stackSubs = stackSubs || {};
	    partial.stackSubs = stackSubs;
	    partial.subsText = stackText;
	    for (key in subs) {
	      if (!stackSubs[key]) stackSubs[key] = subs[key];
	    }
	    for (key in stackSubs) {
	      partial.subs[key] = stackSubs[key];
	    }
	
	    stackPartials = stackPartials || {};
	    partial.stackPartials = stackPartials;
	    for (key in partials) {
	      if (!stackPartials[key]) stackPartials[key] = partials[key];
	    }
	    for (key in stackPartials) {
	      partial.partials[key] = stackPartials[key];
	    }
	
	    return partial;
	  }
	
	  var rAmp = /&/g,
	      rLt = /</g,
	      rGt = />/g,
	      rApos = /\'/g,
	      rQuot = /\"/g,
	      hChars = /[&<>\"\']/;
	
	  function coerceToString(val) {
	    return String((val === null || val === undefined) ? '' : val);
	  }
	
	  function hoganEscape(str) {
	    str = coerceToString(str);
	    return hChars.test(str) ?
	      str
	        .replace(rAmp, '&amp;')
	        .replace(rLt, '&lt;')
	        .replace(rGt, '&gt;')
	        .replace(rApos, '&#39;')
	        .replace(rQuot, '&quot;') :
	      str;
	  }
	
	  var isArray = Array.isArray || function(a) {
	    return Object.prototype.toString.call(a) === '[object Array]';
	  };
	
	})( true ? exports : Hogan);


/***/ }
/******/ ]);
//# sourceMappingURL=main.js.map