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
	
	// require('babel-polyfill');
	
	__webpack_require__(1);
	
	var navi = __webpack_require__(2);
	navi.init();
	
	var redux = __webpack_require__(4);
	
	var cart = redux.createStore(function () {
	    var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	    var action = arguments[1];
	
	    switch (action) {
	        case 'ADD':
	            return state;
	    }
	
	    return state;
	});
	
	function on(elSelector, eventName, selector, fn) {
	    var element = document.querySelector(elSelector);
	
	    element.addEventListener(eventName, function (event) {
	        var possibleTargets = element.querySelectorAll(selector);
	        var target = event.target;
	
	        for (var i = 0, l = possibleTargets.length; i < l; i++) {
	            var el = target;
	            var p = possibleTargets[i];
	
	            while (el && el !== element) {
	                if (el === p) {
	                    return fn.call(p, event);
	                }
	
	                el = el.parentNode;
	            }
	        }
	    });
	}
	
	var menucard = __webpack_require__(13);
	console.log(menucard);
	
	on('body', 'click', 'button[data-add-to-cart]', function (e) {
	    // var name, price;
	    // console.log(e);
	    // console.log(this);
	
	    // cart.dispatch({ type: 'ADD', data: { id: '1', size: '30',  } })
	});
	
	var $ = __webpack_require__(3);
	
	var nanoModal = __webpack_require__(14);
	
	$(document).on('click', 'button[data-add-to-cart]', function () {
	    $('#modal').scroll(function (e) {
	        console.log(e);
	        // e.preventDefault();
	        // e.stopPropagation();
	    });
	
	    var modalWithNoButtons = nanoModal($('#modal')[0], {
	        overlayClose: false,
	        buttons: [{
	            text: "I'm sure!",
	            handler: function handler(modal) {
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

/***/ },
/* 1 */
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
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var $ = __webpack_require__(3);
	
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
/* 3 */
/***/ function(module, exports) {

	module.exports = jQuery;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _createStore = __webpack_require__(5);
	
	var _createStore2 = _interopRequireDefault(_createStore);
	
	var _combineReducers = __webpack_require__(7);
	
	var _combineReducers2 = _interopRequireDefault(_combineReducers);
	
	var _bindActionCreators = __webpack_require__(10);
	
	var _bindActionCreators2 = _interopRequireDefault(_bindActionCreators);
	
	var _applyMiddleware = __webpack_require__(11);
	
	var _applyMiddleware2 = _interopRequireDefault(_applyMiddleware);
	
	var _compose = __webpack_require__(12);
	
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
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = createStore;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _utilsIsPlainObject = __webpack_require__(6);
	
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
/* 6 */
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
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = combineReducers;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _createStore = __webpack_require__(5);
	
	var _utilsIsPlainObject = __webpack_require__(6);
	
	var _utilsIsPlainObject2 = _interopRequireDefault(_utilsIsPlainObject);
	
	var _utilsMapValues = __webpack_require__(8);
	
	var _utilsMapValues2 = _interopRequireDefault(_utilsMapValues);
	
	var _utilsPick = __webpack_require__(9);
	
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
/* 8 */
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
/* 9 */
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
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = bindActionCreators;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _utilsMapValues = __webpack_require__(8);
	
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
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	exports['default'] = applyMiddleware;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _compose = __webpack_require__(12);
	
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
/* 12 */
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
/* 13 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = {
	    classicpizza: {
	        name: 'Klasszikus pizzák',
	        items: [{ name: 'Pizzakenyér', size: '30cm', price: 500, text: '' }, { name: 'Sajtos-fokhagymás pizzakenyér', size: '30cm', price: 600, text: 'sajt, fokhagyma, fűszerkeverék' }, { name: 'Margarita pizza', variants: { '30cm': 850, '40cm': 1850, '50cm': 2700 }, text: 'fűszeres paradicsom szósz, sajt' }]
	    },
	    extrapizza: {
	        name: 'Extra pizzák',
	        items: [{ name: 'Tonhalas pizza', text: 'fűszeres paradicsom szósz, sajt, vöröshagyma, citrom, capribogyó, toszkánai tonhalgerezdek', size: '30cm', price: 1190 }, { name: 'Piedone pizza', text: 'fűszeres paradicsom szósz, sajt, hagyma, fehér és vörös óriásbab, pirított bacon, csípős cseresznyepaprika', size: '30cm', price: 1190 }, { name: 'Jóasszony pizza', text: 'fűszeres paradicsomos alap, sajt, paprikás szalámi, csípős cseresznyepaprika, csiperke gomba, hagyma', size: '30cm', price: 1190 }]
	    },
	    full: {
	        name: 'Full a fullban Pizzák',
	        items: []
	    },
	    pasta: {
	        name: 'Tészták',
	        items: []
	    },
	    meexspecial: {
	        name: 'Meex specialitás',
	        items: []
	    },
	    cheese: {
	        name: 'Rántott sajtok',
	        items: []
	    },
	    fresh: {
	        name: 'Frissensültek',
	        items: []
	    },
	    streetfood: {
	        name: 'Hamburgerek (street food)',
	        items: []
	    },
	    combi: {
	        name: 'Hamburger menük',
	        items: []
	    },
	    sandwich: {
	        name: 'Fitnesz szendvics',
	        items: []
	    },
	    salads: {
	        name: 'Saláták',
	        items: []
	    },
	    sweets: {
	        name: 'Édesség',
	        items: [{ name: 'Profiterol', text: 'Profiterol golyók fehér- és tejcsokoládé bevonattal, tejszínhab koronával', price: 600 }]
	    },
	    drinks: {
	        name: 'Üdítők',
	        items: [{ name: 'Pepsi', variants: { '1,75 liter': 480, '1 liter': 350, '0,33 liter': 190 } }, { name: 'Pepsi Max (light)', variants: { '1,75 liter': 480, '1 liter': 350, '0,33 liter': 190 } }, { name: 'Mirinda', variants: { '1,75 liter': 480, '1 liter': 350, '0,33 liter': 190 } }, { name: 'Canada Dry', variants: { '1,75 liter': 480, '1 liter': 350, '0,33 liter': 190 } }, { name: 'Lipton Ice Tea', variants: { '0,33 liter': 190 } }]
	    }
	};
	
	/*

	var categories = [
	    { id: 11, title: 'Pizzák' },
	    { id: 12, title: 'Extra pizzák' },
	    { id: 13, title: 'Full a fullban Pizzák' },
	    { id: 14, title: 'Tészták' },
	    { id: 15, title: 'Meex specialitás' },
	    { id: 16, title: 'Rántott sajtok' },
	    { id: 17, title: 'Frissensültek' },
	    { id: 18, title: 'Hamburgerek (street food)' },
	    { id: 19, title: 'Hamburger menük' },
	    { id: 20, title: 'Fitnesz szendvics' },
	    { id: 21, title: 'Saláták' },
	    { id: 22, title: 'Édesség' },
	    { id: 23, title: 'Üdítők' }
	];


	var pizza = {
	    name: 'Margarita pizza',
	    text: 'fűszeres paradicsom szósz, sajt',
	    nr: 3,
	    sizes: [30, 40, 50],
	    prices: [850, 1850, 2700]
	};


	var pizzas = {
	    title: "Pizzák",

	};

	var drinks = {
	    title: "Üdítők",
	    list: [
	        { name: "1 literes", price: 350, options: ["Pepsi", "Pepsi Max (light)", "Mirinda", "Canada Dry"] },
	        { name: "1.75 literes", price: 480, options: ["Pepsi", "Pepsi Max (light)", "Mirinda", "Canada Dry"] },
	        { name: "Dobozos üdítők (0,33l)", price: 190, options: ["Pepsi", "Pepsi Max (light)", "Mirinda", "Canada Dry"] },
	    ]
	};
	*/

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var require;var require;var nanoModal;!function a(b,c,d){function e(g,h){if(!c[g]){if(!b[g]){var i="function"==typeof require&&require;if(!h&&i)return require(g,!0);if(f)return f(g,!0);throw new Error("Cannot find module '"+g+"'")}var j=c[g]={exports:{}};b[g][0].call(j.exports,function(a){var c=b[g][1][a];return e(c?c:a)},j,j.exports,a,b,c,d)}return c[g].exports}for(var f="function"==typeof require&&require,g=0;g<d.length;g++)e(d[g]);return e}({1:[function(a,b,c){function d(a,b){var c=document,d=a.nodeType||a===window?a:c.createElement(a),f=[];b&&(d.className=b);var g=e(),h=e(),i=function(a,b){d.addEventListener?d.addEventListener(a,b,!1):d.attachEvent("on"+a,b),f.push({event:a,handler:b})},j=function(a,b){d.removeEventListener?d.removeEventListener(a,b):d.detachEvent("on"+a,b);for(var c,e=f.length;e-->0;)if(c=f[e],c.event===a&&c.handler===b){f.splice(e,1);break}},k=function(a){var b=!1,c=function(c){b||(b=!0,setTimeout(function(){b=!1},100),a(c))};i("touchstart",c),i("mousedown",c)},l=function(a){d&&(d.style.display="block",g.fire(a))},m=function(a){d&&(d.style.display="none",h.fire(a))},n=function(){return d.style&&"block"===d.style.display},o=function(a){d&&(d.innerHTML=a)},p=function(a){d&&(o(""),d.appendChild(c.createTextNode(a)))},q=function(){if(d.parentNode){for(var a,b=f.length;b-->0;)a=f[b],j(a.event,a.handler);d.parentNode.removeChild(d),g.removeAllListeners(),h.removeAllListeners()}},r=function(a){var b=a.el||a;d.appendChild(b)};return{el:d,addListener:i,addClickListener:k,onShowEvent:g,onHideEvent:h,show:l,hide:m,isShowing:n,html:o,text:p,remove:q,add:r}}var e=a("./ModalEvent");b.exports=d},{"./ModalEvent":3}],2:[function(a,b,c){function d(a,b,c,f,g){if(void 0!==a){b=b||{};var h,i=e("div","nanoModal nanoModalOverride "+(b.classes||"")),j=e("div","nanoModalContent"),k=e("div","nanoModalButtons");i.add(j),i.add(k),i.el.style.display="none";var l,m=[];b.buttons=b.buttons||[{text:"Close",handler:"hide",primary:!0}];var n=function(){for(var a=m.length;a-->0;){var b=m[a];b.remove()}m=[]},o=function(){i.el.style.marginLeft=-i.el.clientWidth/2+"px"},p=function(){for(var a=document.querySelectorAll(".nanoModal"),b=a.length;b-->0;)if("none"!==a[b].style.display)return!0;return!1},q=function(){i.isShowing()||(d.resizeOverlay(),c.show(c),i.show(l),o())},r=function(){i.isShowing()&&(i.hide(l),p()||c.hide(c),b.autoRemove&&l.remove())},s=function(a){var b={};for(var c in a)a.hasOwnProperty(c)&&(b[c]=a[c]);return b};return l={modal:i,overlay:c,show:function(){return f?f(q,l):q(),l},hide:function(){return g?g(r,l):r(),l},onShow:function(a){return i.onShowEvent.addListener(function(){a(l)}),l},onHide:function(a){return i.onHideEvent.addListener(function(){a(l)}),l},remove:function(){c.onRequestHide.removeListener(h),h=null,n(),i.remove()},setButtons:function(a){var b,c,d,f=a.length,g=function(a,b){var c=s(l);a.addClickListener(function(a){c.event=a||window.event,b.handler(c)})};if(n(),0===f)k.hide();else for(k.show();f-->0;)b=a[f],d="nanoModalBtn",b.primary&&(d+=" nanoModalBtnPrimary"),d+=b.classes?" "+b.classes:"",c=e("button",d),"hide"===b.handler?c.addClickListener(l.hide):b.handler&&g(c,b),c.text(b.text),k.add(c),m.push(c);return o(),l},setContent:function(b){return b.nodeType?(j.html(""),j.add(b)):j.html(b),o(),a=b,l},getContent:function(){return a}},h=c.onRequestHide.addListener(function(){b.overlayClose!==!1&&i.isShowing()&&l.hide()}),l.setContent(a).setButtons(b.buttons),document.body.appendChild(i.el),l}}var e=a("./El"),f=document,g=function(a){var b=f.documentElement,c="scroll"+a,d="offset"+a;return Math.max(f.body[c],b[c],f.body[d],b[d],b["client"+a])};d.resizeOverlay=function(){var a=f.getElementById("nanoModalOverlay");a.style.width=g("Width")+"px",a.style.height=g("Height")+"px"},b.exports=d},{"./El":1}],3:[function(a,b,c){function d(){var a={},b=0,c=function(c){return a[b]=c,b++},d=function(b){b&&delete a[b]},e=function(){a={}},f=function(){for(var c=0,d=b;d>c;++c)a[c]&&a[c].apply(null,arguments)};return{addListener:c,removeListener:d,removeAllListeners:e,fire:f}}b.exports=d},{}],4:[function(a,b,c){var d=a("./ModalEvent"),e=function(){function b(){if(!g.querySelector("#nanoModalOverlay")){var a=e("style"),b=a.el,h=g.querySelectorAll("head")[0].childNodes[0];h.parentNode.insertBefore(b,h);var i=".nanoModal{position:absolute;top:100px;left:50%;display:none;z-index:9999;min-width:300px;padding:15px 20px 10px;-webkit-border-radius:10px;-moz-border-radius:10px;border-radius:10px;background:#fff;background:-moz-linear-gradient(top,#fff 0,#ddd 100%);background:-webkit-gradient(linear,left top,left bottom,color-stop(0%,#fff),color-stop(100%,#ddd));background:-webkit-linear-gradient(top,#fff 0,#ddd 100%);background:-o-linear-gradient(top,#fff 0,#ddd 100%);background:-ms-linear-gradient(top,#fff 0,#ddd 100%);background:linear-gradient(to bottom,#fff 0,#ddd 100%);filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#ffffff', endColorstr='#dddddd', GradientType=0)}.nanoModalOverlay{position:absolute;top:0;left:0;width:100%;height:100%;z-index:9998;background:#000;display:none;-ms-filter:\"alpha(Opacity=50)\";-moz-opacity:.5;-khtml-opacity:.5;opacity:.5}.nanoModalButtons{border-top:1px solid #ddd;margin-top:15px;text-align:right}.nanoModalBtn{color:#333;background-color:#fff;display:inline-block;padding:6px 12px;margin:8px 4px 0;font-size:14px;text-align:center;white-space:nowrap;vertical-align:middle;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;border:1px solid transparent;-webkit-border-radius:4px;-moz-border-radius:4px;border-radius:4px}.nanoModalBtn:active,.nanoModalBtn:focus,.nanoModalBtn:hover{color:#333;background-color:#e6e6e6;border-color:#adadad}.nanoModalBtn.nanoModalBtnPrimary{color:#fff;background-color:#428bca;border-color:#357ebd}.nanoModalBtn.nanoModalBtnPrimary:active,.nanoModalBtn.nanoModalBtnPrimary:focus,.nanoModalBtn.nanoModalBtnPrimary:hover{color:#fff;background-color:#3071a9;border-color:#285e8e}";b.styleSheet?b.styleSheet.cssText=i:a.text(i),c=e("div","nanoModalOverlay nanoModalOverride"),c.el.id="nanoModalOverlay",g.body.appendChild(c.el),c.onRequestHide=d();var j=function(){c.onRequestHide.fire()};c.addClickListener(j),e(g).addListener("keydown",function(a){var b=a.which||a.keyCode;27===b&&j()});var k,l=e(window);l.addListener("resize",function(){k&&clearTimeout(k),k=setTimeout(f.resizeOverlay,100)}),l.addListener("orientationchange",function(){for(var a=0;3>a;++a)setTimeout(f.resizeOverlay,1e3*a+200)})}}var c,e=a("./El"),f=a("./Modal"),g=document;document.body&&b();var h=function(a,d){return b(),f(a,d,c,h.customShow,h.customHide)};return h.resizeOverlay=f.resizeOverlay,h}();nanoModal=e},{"./El":1,"./Modal":2,"./ModalEvent":3}]},{},[1,2,3,4]),"undefined"!=typeof window&&("function"==typeof window.define&&window.define.amd&&window.define(function(){return nanoModal}),window.nanoModal=nanoModal),"undefined"!=typeof module&&(module.exports=nanoModal);

/***/ }
/******/ ]);
//# sourceMappingURL=main.js.map