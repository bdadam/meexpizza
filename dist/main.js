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
	
	__webpack_require__(1).polyfill();
	__webpack_require__(2);
	
	__webpack_require__(3).init();
	
	var redux = __webpack_require__(5);
	// const menucard = require('../../menu');
	
	var defaultState = {
	    inCart: [],
	    address: {
	        name: '',
	        street: '',
	        city: ''
	    }
	};
	
	var flatMap = __webpack_require__(14);
	
	var shoppingCart = redux.createStore(function () {
	    var state = arguments.length <= 0 || arguments[0] === undefined ? defaultState : arguments[0];
	    var action = arguments[1];
	
	    var newState;
	    switch (action.type) {
	        case 'ADD':
	            return Object.assign({}, state, { inCart: [].concat(_toConsumableArray(state.inCart), [{ dish: action.dish, timestamp: action.timestamp }]) });
	        case 'REMOVE':
	            return Object.assign({}, state, { inCart: state.inCart.filter(function (x) {
	                    return x.timestamp !== action.timestamp;
	                }) });
	        case 'DUPLICATE':
	            return Object.assign({}, state, {
	                inCart: flatMap(state.inCart, function (item) {
	                    return item.timestamp !== action.timestamp ? item : [item, Object.assign({}, item, { timestamp: +new Date() })];
	                })
	            });
	        case 'RESTORE':
	            return Object.assign({}, state, action.state);
	    }
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
	
	var $ = __webpack_require__(4);
	var nanoModal = __webpack_require__(102);
	
	shoppingCart.subscribe(function () {
	    var state = shoppingCart.getState();
	    var ids = {};
	    state.inCart.forEach(function (obj) {
	        ids[obj.dish.id] = (ids[obj.dish.id] || 0) + 1;
	    });
	
	    $('[data-dish-id] .in-cart-count').text('');
	
	    Object.keys(ids).forEach(function (id) {
	        var count = ids[id];
	        $('[data-dish-id=' + id + '] .in-cart-count').text(count + ' db');
	    });
	});
	
	shoppingCart.subscribe(function () {
	    var state = shoppingCart.getState();
	    $('[data-shopping-cart-count]').text(state.inCart.length + ' × ');
	});
	
	shoppingCart.subscribe(function () {
	    var state = shoppingCart.getState();
	    var count = state.inCart.length;
	    if (count === 0) {
	        $('#side-cart .default-content').show();
	        $('#side-cart button.order').attr('disabled', true);
	    } else {
	        $('#side-cart .default-content').hide();
	        $('#side-cart button.order').attr('disabled', false);
	    }
	
	    var itemsContainer = $('#side-cart .items');
	    itemsContainer.empty();
	
	    state.inCart.forEach(function (item) {
	        var cat = window.menucard.menu.filter(function (category) {
	            return category.id === item.dish.categoryId;
	        })[0];
	        var x = cat.items.filter(function (dish) {
	            return dish.id === item.dish.id;
	        })[0];
	        itemsContainer.append('<tr><td>' + x.name + '<div><button data-duplicate-order-item="' + item.timestamp + '">Még ebből!</button> <button data-remove-order-item="' + item.timestamp + '">Eltávolítás</button></div></td><td>' + x.variants[item.dish.variant] + ' Ft</td></tr>');
	    });
	
	    if (state.inCart.length > 0) {
	        var sum = state.inCart.reduce(function (prev, item) {
	            var cat = window.menucard.menu.filter(function (category) {
	                return category.id === item.dish.categoryId;
	            })[0];
	            var x = cat.items.filter(function (dish) {
	                return dish.id === item.dish.id;
	            })[0];
	            return prev + x.variants[item.dish.variant];
	        }, 0);
	
	        itemsContainer.append('<tfoot><tr><td>Végösszeg</td><td>' + sum + ' Ft</td></tr></tfoot>');
	    }
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
	    var item = $(e.target).parents('[data-dish-id]');
	
	    var categoryId = item.data('dishCategoryId');
	    var id = item.data('dishId');
	    var variant = item.find('[name=variant]').val() || item.find('[data-variant]').text();
	
	    shoppingCart.dispatch({ type: 'ADD', dish: { id: id, variant: variant, categoryId: categoryId }, timestamp: +new Date() });
	
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
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var $ = __webpack_require__(4);
	
	module.exports = {
	    init: function init() {
	        var menuToggle = $('.menu-toggle').click(function () {
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

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = jQuery;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _createStore = __webpack_require__(6);
	
	var _createStore2 = _interopRequireDefault(_createStore);
	
	var _combineReducers = __webpack_require__(8);
	
	var _combineReducers2 = _interopRequireDefault(_combineReducers);
	
	var _bindActionCreators = __webpack_require__(11);
	
	var _bindActionCreators2 = _interopRequireDefault(_bindActionCreators);
	
	var _applyMiddleware = __webpack_require__(12);
	
	var _applyMiddleware2 = _interopRequireDefault(_applyMiddleware);
	
	var _compose = __webpack_require__(13);
	
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
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = createStore;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _utilsIsPlainObject = __webpack_require__(7);
	
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
/* 7 */
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
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = combineReducers;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _createStore = __webpack_require__(6);
	
	var _utilsIsPlainObject = __webpack_require__(7);
	
	var _utilsIsPlainObject2 = _interopRequireDefault(_utilsIsPlainObject);
	
	var _utilsMapValues = __webpack_require__(9);
	
	var _utilsMapValues2 = _interopRequireDefault(_utilsMapValues);
	
	var _utilsPick = __webpack_require__(10);
	
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
/* 9 */
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
/* 10 */
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
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = bindActionCreators;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _utilsMapValues = __webpack_require__(9);
	
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
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	exports['default'] = applyMiddleware;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _compose = __webpack_require__(13);
	
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
/* 13 */
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
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var arrayMap = __webpack_require__(15),
	    baseFlatten = __webpack_require__(16),
	    baseIteratee = __webpack_require__(28);
	
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
/* 15 */
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
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var arrayPush = __webpack_require__(17),
	    isArguments = __webpack_require__(18),
	    isArray = __webpack_require__(27),
	    isArrayLikeObject = __webpack_require__(19);
	
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
/* 17 */
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
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var isArrayLikeObject = __webpack_require__(19);
	
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
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var isArrayLike = __webpack_require__(20),
	    isObjectLike = __webpack_require__(26);
	
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
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var getLength = __webpack_require__(21),
	    isFunction = __webpack_require__(23),
	    isLength = __webpack_require__(25);
	
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
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var baseProperty = __webpack_require__(22);
	
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
/* 22 */
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
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var isObject = __webpack_require__(24);
	
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
/* 24 */
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
/* 25 */
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
/* 26 */
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
/* 27 */
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
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	var baseMatches = __webpack_require__(29),
	    baseMatchesProperty = __webpack_require__(85),
	    identity = __webpack_require__(99),
	    isArray = __webpack_require__(27),
	    property = __webpack_require__(100);
	
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
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	var baseIsMatch = __webpack_require__(30),
	    getMatchData = __webpack_require__(81);
	
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
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	var Stack = __webpack_require__(31),
	    baseIsEqual = __webpack_require__(60);
	
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
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	var stackClear = __webpack_require__(32),
	    stackDelete = __webpack_require__(33),
	    stackGet = __webpack_require__(37),
	    stackHas = __webpack_require__(39),
	    stackSet = __webpack_require__(41);
	
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
/* 32 */
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
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	var assocDelete = __webpack_require__(34);
	
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
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var assocIndexOf = __webpack_require__(35);
	
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
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	var eq = __webpack_require__(36);
	
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
/* 36 */
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
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	var assocGet = __webpack_require__(38);
	
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
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	var assocIndexOf = __webpack_require__(35);
	
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
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	var assocHas = __webpack_require__(40);
	
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
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	var assocIndexOf = __webpack_require__(35);
	
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
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	var MapCache = __webpack_require__(42),
	    assocSet = __webpack_require__(58);
	
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
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	var mapClear = __webpack_require__(43),
	    mapDelete = __webpack_require__(50),
	    mapGet = __webpack_require__(54),
	    mapHas = __webpack_require__(56),
	    mapSet = __webpack_require__(57);
	
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
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	var Hash = __webpack_require__(44),
	    Map = __webpack_require__(49);
	
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
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var nativeCreate = __webpack_require__(45);
	
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
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	var getNative = __webpack_require__(46);
	
	/* Built-in method references that are verified to be native. */
	var nativeCreate = getNative(Object, 'create');
	
	module.exports = nativeCreate;


/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	var isNative = __webpack_require__(47);
	
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
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var isFunction = __webpack_require__(23),
	    isHostObject = __webpack_require__(48),
	    isObjectLike = __webpack_require__(26);
	
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
/* 48 */
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
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var getNative = __webpack_require__(46);
	
	/* Built-in method references that are verified to be native. */
	var Map = getNative(global, 'Map');
	
	module.exports = Map;
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	var Map = __webpack_require__(49),
	    assocDelete = __webpack_require__(34),
	    hashDelete = __webpack_require__(51),
	    isKeyable = __webpack_require__(53);
	
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
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	var hashHas = __webpack_require__(52);
	
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
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var nativeCreate = __webpack_require__(45);
	
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
/* 53 */
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
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	var Map = __webpack_require__(49),
	    assocGet = __webpack_require__(38),
	    hashGet = __webpack_require__(55),
	    isKeyable = __webpack_require__(53);
	
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
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var nativeCreate = __webpack_require__(45);
	
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
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	var Map = __webpack_require__(49),
	    assocHas = __webpack_require__(40),
	    hashHas = __webpack_require__(52),
	    isKeyable = __webpack_require__(53);
	
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
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	var Map = __webpack_require__(49),
	    assocSet = __webpack_require__(58),
	    hashSet = __webpack_require__(59),
	    isKeyable = __webpack_require__(53);
	
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
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	var assocIndexOf = __webpack_require__(35);
	
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
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	var nativeCreate = __webpack_require__(45);
	
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
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	var baseIsEqualDeep = __webpack_require__(61),
	    isObject = __webpack_require__(24),
	    isObjectLike = __webpack_require__(26);
	
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
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var Stack = __webpack_require__(31),
	    equalArrays = __webpack_require__(62),
	    equalByTag = __webpack_require__(64),
	    equalObjects = __webpack_require__(69),
	    getTag = __webpack_require__(78),
	    isArray = __webpack_require__(27),
	    isHostObject = __webpack_require__(48),
	    isTypedArray = __webpack_require__(80);
	
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
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	var arraySome = __webpack_require__(63);
	
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
/* 63 */
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
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	var Symbol = __webpack_require__(65),
	    Uint8Array = __webpack_require__(66),
	    mapToArray = __webpack_require__(67),
	    setToArray = __webpack_require__(68);
	
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
/* 65 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {/** Built-in value references. */
	var Symbol = global.Symbol;
	
	module.exports = Symbol;
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 66 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {/** Built-in value references. */
	var Uint8Array = global.Uint8Array;
	
	module.exports = Uint8Array;
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 67 */
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
/* 68 */
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
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	var baseHas = __webpack_require__(70),
	    keys = __webpack_require__(71);
	
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
/* 70 */
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
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	var baseHas = __webpack_require__(70),
	    baseKeys = __webpack_require__(72),
	    indexKeys = __webpack_require__(73),
	    isArrayLike = __webpack_require__(20),
	    isIndex = __webpack_require__(76),
	    isPrototype = __webpack_require__(77);
	
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
/* 72 */
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
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	var baseTimes = __webpack_require__(74),
	    isArguments = __webpack_require__(18),
	    isArray = __webpack_require__(27),
	    isLength = __webpack_require__(25),
	    isString = __webpack_require__(75);
	
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
/* 74 */
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
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var isArray = __webpack_require__(27),
	    isObjectLike = __webpack_require__(26);
	
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
/* 76 */
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
/* 77 */
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
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var Map = __webpack_require__(49),
	    Set = __webpack_require__(79);
	
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
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var getNative = __webpack_require__(46);
	
	/* Built-in method references that are verified to be native. */
	var Set = getNative(global, 'Set');
	
	module.exports = Set;
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var isLength = __webpack_require__(25),
	    isObjectLike = __webpack_require__(26);
	
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
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	var isStrictComparable = __webpack_require__(82),
	    toPairs = __webpack_require__(83);
	
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
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(24);
	
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
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	var baseToPairs = __webpack_require__(84),
	    keys = __webpack_require__(71);
	
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
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	var arrayMap = __webpack_require__(15);
	
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
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	var baseIsEqual = __webpack_require__(60),
	    get = __webpack_require__(86),
	    hasIn = __webpack_require__(93);
	
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
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	var baseGet = __webpack_require__(87);
	
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
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	var baseToPath = __webpack_require__(88),
	    isKey = __webpack_require__(92);
	
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
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	var isArray = __webpack_require__(27),
	    stringToPath = __webpack_require__(89);
	
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
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	var toString = __webpack_require__(90);
	
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
/* 90 */
/***/ function(module, exports, __webpack_require__) {

	var Symbol = __webpack_require__(65),
	    isSymbol = __webpack_require__(91);
	
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
/* 91 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var isObjectLike = __webpack_require__(26);
	
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
/* 92 */
/***/ function(module, exports, __webpack_require__) {

	var isArray = __webpack_require__(27);
	
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
/* 93 */
/***/ function(module, exports, __webpack_require__) {

	var baseHasIn = __webpack_require__(94),
	    hasPath = __webpack_require__(95);
	
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
/* 94 */
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
/* 95 */
/***/ function(module, exports, __webpack_require__) {

	var baseToPath = __webpack_require__(88),
	    isArguments = __webpack_require__(18),
	    isArray = __webpack_require__(27),
	    isIndex = __webpack_require__(76),
	    isKey = __webpack_require__(92),
	    isLength = __webpack_require__(25),
	    isString = __webpack_require__(75),
	    last = __webpack_require__(96),
	    parent = __webpack_require__(97);
	
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
/* 96 */
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
/* 97 */
/***/ function(module, exports, __webpack_require__) {

	var baseSlice = __webpack_require__(98),
	    get = __webpack_require__(86);
	
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
/* 98 */
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
/* 99 */
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
/* 100 */
/***/ function(module, exports, __webpack_require__) {

	var baseProperty = __webpack_require__(22),
	    basePropertyDeep = __webpack_require__(101),
	    isKey = __webpack_require__(92);
	
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
/* 101 */
/***/ function(module, exports, __webpack_require__) {

	var baseGet = __webpack_require__(87);
	
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
/* 102 */
/***/ function(module, exports, __webpack_require__) {

	var require;var require;var nanoModal;!function a(b,c,d){function e(g,h){if(!c[g]){if(!b[g]){var i="function"==typeof require&&require;if(!h&&i)return require(g,!0);if(f)return f(g,!0);throw new Error("Cannot find module '"+g+"'")}var j=c[g]={exports:{}};b[g][0].call(j.exports,function(a){var c=b[g][1][a];return e(c?c:a)},j,j.exports,a,b,c,d)}return c[g].exports}for(var f="function"==typeof require&&require,g=0;g<d.length;g++)e(d[g]);return e}({1:[function(a,b,c){function d(a,b){var c=document,d=a.nodeType||a===window?a:c.createElement(a),f=[];b&&(d.className=b);var g=e(),h=e(),i=function(a,b){d.addEventListener?d.addEventListener(a,b,!1):d.attachEvent("on"+a,b),f.push({event:a,handler:b})},j=function(a,b){d.removeEventListener?d.removeEventListener(a,b):d.detachEvent("on"+a,b);for(var c,e=f.length;e-->0;)if(c=f[e],c.event===a&&c.handler===b){f.splice(e,1);break}},k=function(a){var b=!1,c=function(c){b||(b=!0,setTimeout(function(){b=!1},100),a(c))};i("touchstart",c),i("mousedown",c)},l=function(a){d&&(d.style.display="block",g.fire(a))},m=function(a){d&&(d.style.display="none",h.fire(a))},n=function(){return d.style&&"block"===d.style.display},o=function(a){d&&(d.innerHTML=a)},p=function(a){d&&(o(""),d.appendChild(c.createTextNode(a)))},q=function(){if(d.parentNode){for(var a,b=f.length;b-->0;)a=f[b],j(a.event,a.handler);d.parentNode.removeChild(d),g.removeAllListeners(),h.removeAllListeners()}},r=function(a){var b=a.el||a;d.appendChild(b)};return{el:d,addListener:i,addClickListener:k,onShowEvent:g,onHideEvent:h,show:l,hide:m,isShowing:n,html:o,text:p,remove:q,add:r}}var e=a("./ModalEvent");b.exports=d},{"./ModalEvent":3}],2:[function(a,b,c){function d(a,b,c,f,g){if(void 0!==a){b=b||{};var h,i=e("div","nanoModal nanoModalOverride "+(b.classes||"")),j=e("div","nanoModalContent"),k=e("div","nanoModalButtons");i.add(j),i.add(k),i.el.style.display="none";var l,m=[];b.buttons=b.buttons||[{text:"Close",handler:"hide",primary:!0}];var n=function(){for(var a=m.length;a-->0;){var b=m[a];b.remove()}m=[]},o=function(){i.el.style.marginLeft=-i.el.clientWidth/2+"px"},p=function(){for(var a=document.querySelectorAll(".nanoModal"),b=a.length;b-->0;)if("none"!==a[b].style.display)return!0;return!1},q=function(){i.isShowing()||(d.resizeOverlay(),c.show(c),i.show(l),o())},r=function(){i.isShowing()&&(i.hide(l),p()||c.hide(c),b.autoRemove&&l.remove())},s=function(a){var b={};for(var c in a)a.hasOwnProperty(c)&&(b[c]=a[c]);return b};return l={modal:i,overlay:c,show:function(){return f?f(q,l):q(),l},hide:function(){return g?g(r,l):r(),l},onShow:function(a){return i.onShowEvent.addListener(function(){a(l)}),l},onHide:function(a){return i.onHideEvent.addListener(function(){a(l)}),l},remove:function(){c.onRequestHide.removeListener(h),h=null,n(),i.remove()},setButtons:function(a){var b,c,d,f=a.length,g=function(a,b){var c=s(l);a.addClickListener(function(a){c.event=a||window.event,b.handler(c)})};if(n(),0===f)k.hide();else for(k.show();f-->0;)b=a[f],d="nanoModalBtn",b.primary&&(d+=" nanoModalBtnPrimary"),d+=b.classes?" "+b.classes:"",c=e("button",d),"hide"===b.handler?c.addClickListener(l.hide):b.handler&&g(c,b),c.text(b.text),k.add(c),m.push(c);return o(),l},setContent:function(b){return b.nodeType?(j.html(""),j.add(b)):j.html(b),o(),a=b,l},getContent:function(){return a}},h=c.onRequestHide.addListener(function(){b.overlayClose!==!1&&i.isShowing()&&l.hide()}),l.setContent(a).setButtons(b.buttons),document.body.appendChild(i.el),l}}var e=a("./El"),f=document,g=function(a){var b=f.documentElement,c="scroll"+a,d="offset"+a;return Math.max(f.body[c],b[c],f.body[d],b[d],b["client"+a])};d.resizeOverlay=function(){var a=f.getElementById("nanoModalOverlay");a.style.width=g("Width")+"px",a.style.height=g("Height")+"px"},b.exports=d},{"./El":1}],3:[function(a,b,c){function d(){var a={},b=0,c=function(c){return a[b]=c,b++},d=function(b){b&&delete a[b]},e=function(){a={}},f=function(){for(var c=0,d=b;d>c;++c)a[c]&&a[c].apply(null,arguments)};return{addListener:c,removeListener:d,removeAllListeners:e,fire:f}}b.exports=d},{}],4:[function(a,b,c){var d=a("./ModalEvent"),e=function(){function b(){if(!g.querySelector("#nanoModalOverlay")){var a=e("style"),b=a.el,h=g.querySelectorAll("head")[0].childNodes[0];h.parentNode.insertBefore(b,h);var i=".nanoModal{position:absolute;top:100px;left:50%;display:none;z-index:9999;min-width:300px;padding:15px 20px 10px;-webkit-border-radius:10px;-moz-border-radius:10px;border-radius:10px;background:#fff;background:-moz-linear-gradient(top,#fff 0,#ddd 100%);background:-webkit-gradient(linear,left top,left bottom,color-stop(0%,#fff),color-stop(100%,#ddd));background:-webkit-linear-gradient(top,#fff 0,#ddd 100%);background:-o-linear-gradient(top,#fff 0,#ddd 100%);background:-ms-linear-gradient(top,#fff 0,#ddd 100%);background:linear-gradient(to bottom,#fff 0,#ddd 100%);filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#ffffff', endColorstr='#dddddd', GradientType=0)}.nanoModalOverlay{position:absolute;top:0;left:0;width:100%;height:100%;z-index:9998;background:#000;display:none;-ms-filter:\"alpha(Opacity=50)\";-moz-opacity:.5;-khtml-opacity:.5;opacity:.5}.nanoModalButtons{border-top:1px solid #ddd;margin-top:15px;text-align:right}.nanoModalBtn{color:#333;background-color:#fff;display:inline-block;padding:6px 12px;margin:8px 4px 0;font-size:14px;text-align:center;white-space:nowrap;vertical-align:middle;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;border:1px solid transparent;-webkit-border-radius:4px;-moz-border-radius:4px;border-radius:4px}.nanoModalBtn:active,.nanoModalBtn:focus,.nanoModalBtn:hover{color:#333;background-color:#e6e6e6;border-color:#adadad}.nanoModalBtn.nanoModalBtnPrimary{color:#fff;background-color:#428bca;border-color:#357ebd}.nanoModalBtn.nanoModalBtnPrimary:active,.nanoModalBtn.nanoModalBtnPrimary:focus,.nanoModalBtn.nanoModalBtnPrimary:hover{color:#fff;background-color:#3071a9;border-color:#285e8e}";b.styleSheet?b.styleSheet.cssText=i:a.text(i),c=e("div","nanoModalOverlay nanoModalOverride"),c.el.id="nanoModalOverlay",g.body.appendChild(c.el),c.onRequestHide=d();var j=function(){c.onRequestHide.fire()};c.addClickListener(j),e(g).addListener("keydown",function(a){var b=a.which||a.keyCode;27===b&&j()});var k,l=e(window);l.addListener("resize",function(){k&&clearTimeout(k),k=setTimeout(f.resizeOverlay,100)}),l.addListener("orientationchange",function(){for(var a=0;3>a;++a)setTimeout(f.resizeOverlay,1e3*a+200)})}}var c,e=a("./El"),f=a("./Modal"),g=document;document.body&&b();var h=function(a,d){return b(),f(a,d,c,h.customShow,h.customHide)};return h.resizeOverlay=f.resizeOverlay,h}();nanoModal=e},{"./El":1,"./Modal":2,"./ModalEvent":3}]},{},[1,2,3,4]),"undefined"!=typeof window&&("function"==typeof window.define&&window.define.amd&&window.define(function(){return nanoModal}),window.nanoModal=nanoModal),"undefined"!=typeof module&&(module.exports=nanoModal);

/***/ }
/******/ ]);
//# sourceMappingURL=main.js.map