!function(e){function t(r){if(n[r])return n[r].exports;var o=n[r]={exports:{},id:r,loaded:!1};return e[r].call(o.exports,o,o.exports,t),o.loaded=!0,o.exports}var n={};return t.m=e,t.c=n,t.p="",t(0)}([function(e,t,n){"use strict";function r(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return Array.from(e)}n(8).polyfill(),n(9),n(7).init();var o=n(14),i={inCart:[],address:{name:"",street:"",city:""}},a=o.createStore(function(){var e=arguments.length<=0||void 0===arguments[0]?i:arguments[0],t=arguments[1];switch(t.type){case"ADD":return Object.assign({},e,{inCart:[].concat(r(e.inCart),[{dish:t.dish,timestamp:t.timestamp}])});case"REMOVE":return Object.assign({},e,{inCart:e.inCart.filter(function(e){return e.timestamp!==t.timestamp})});case"RESTORE":return Object.assign({},e,t.state)}}),d=n(5);n(10);a.subscribe(function(){var e=a.getState(),t={};e.inCart.forEach(function(e){t[e.dish.id]=(t[e.dish.id]||0)+1}),d("[data-dish-id] .in-cart-count").text(""),Object.keys(t).forEach(function(e){var n=t[e];d("[data-dish-id="+e+"] .in-cart-count").text(n+" db")})}),a.subscribe(function(){var e=a.getState();d("[data-shopping-cart-count]").text(e.inCart.length+" × ")}),a.subscribe(function(){var e=a.getState(),t=e.inCart.length;0===t?(d("#side-cart .default-content").show(),d("#side-cart button.order").attr("disabled",!0)):(d("#side-cart .default-content").hide(),d("#side-cart button.order").attr("disabled",!1));var n=d("#side-cart .items");n.empty(),e.inCart.forEach(function(e){var t=window.menucard.menu.filter(function(t){return t.id=e.dish.categoryId})[0],r=t.items.filter(function(t){return t.id===e.dish.id})[0];n.append("<p>"+r.name+" - "+r.variants[e.dish.variant]+' Ft <button data-duplicate-order-item="'+e.timestamp+'">Még ebből!</button> <button data-remove-order-item="'+e.timestamp+'">Eltávolítás</button></p>')})}),d(document).on("click","button[data-remove-order-item]",function(e){var t=d(this).data("removeOrderItem");a.dispatch({type:"REMOVE",timestamp:t})}),d(document).on("click","button[data-add-to-cart]",function(e){var t=d(e.target).parents("[data-dish-id]"),n=t.data("dishCategoryId"),r=t.data("dishId"),o=t.find("[name=variant]").val()||t.find("[data-variant]").text();a.dispatch({type:"ADD",dish:{id:r,variant:o,categoryId:n},timestamp:+new Date})}),a.subscribe(function(){try{localStorage.shoppingCart=JSON.stringify(a.getState())}catch(e){}});try{var s=JSON.parse(localStorage.shoppingCart);a.dispatch({type:"RESTORE",state:s})}catch(u){}},function(e,t){"use strict";function n(){for(var e=arguments.length,t=Array(e),n=0;e>n;n++)t[n]=arguments[n];return function(){if(0===t.length)return arguments[0];var e=t[t.length-1],n=t.slice(0,-1);return n.reduceRight(function(e,t){return t(e)},e.apply(void 0,arguments))}}t.__esModule=!0,t["default"]=n,e.exports=t["default"]},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{"default":e}}function o(e,t){function n(){return u}function r(e){c.push(e);var t=!0;return function(){if(t){t=!1;var n=c.indexOf(e);c.splice(n,1)}}}function o(e){if(!a["default"](e))throw new Error("Actions must be plain objects. Use custom middleware for async actions.");if("undefined"==typeof e.type)throw new Error('Actions may not have an undefined "type" property. Have you misspelled a constant?');if(l)throw new Error("Reducers may not dispatch actions.");try{l=!0,u=s(u,e)}finally{l=!1}return c.slice().forEach(function(e){return e()}),e}function i(e){s=e,o({type:d.INIT})}if("function"!=typeof e)throw new Error("Expected the reducer to be a function.");var s=e,u=t,c=[],l=!1;return o({type:d.INIT}),{dispatch:o,subscribe:r,getState:n,replaceReducer:i}}t.__esModule=!0,t["default"]=o;var i=n(3),a=r(i),d={INIT:"@@redux/INIT"};t.ActionTypes=d},function(e,t){"use strict";function n(e){if(!e||"object"!=typeof e)return!1;var t="function"==typeof e.constructor?Object.getPrototypeOf(e):Object.prototype;if(null===t)return!0;var n=t.constructor;return"function"==typeof n&&n instanceof n&&r(n)===o}t.__esModule=!0,t["default"]=n;var r=function(e){return Function.prototype.toString.call(e)},o=r(Object);e.exports=t["default"]},function(e,t){"use strict";function n(e,t){return Object.keys(e).reduce(function(n,r){return n[r]=t(e[r],r),n},{})}t.__esModule=!0,t["default"]=n,e.exports=t["default"]},function(e,t){e.exports=jQuery},,function(e,t,n){"use strict";var r=n(5);e.exports={init:function(){var e=r(".menu-toggle").click(function(){e.toggleClass("active"),r("#site-navigation").toggleClass("open")})}}},function(e,t){"use strict";function n(e,t){if(void 0===e||null===e)throw new TypeError("Cannot convert first argument to object");for(var n=Object(e),r=1;r<arguments.length;r++){var o=arguments[r];if(void 0!==o&&null!==o)for(var i=Object.keys(Object(o)),a=0,d=i.length;d>a;a++){var s=i[a],u=Object.getOwnPropertyDescriptor(o,s);void 0!==u&&u.enumerable&&(n[s]=o[s])}}return n}function r(){Object.assign||Object.defineProperty(Object,"assign",{enumerable:!1,configurable:!0,writable:!0,value:n})}e.exports={assign:n,polyfill:r}},function(e,t,n){var r,o;!function(i,a){var d=a(i,i.document);i.lazySizes=d,"object"==typeof e&&e.exports?e.exports=d:(r=d,o="function"==typeof r?r.call(t,n,t,e):r,!(void 0!==o&&(e.exports=o)))}(window,function(e,t){"use strict";if(t.getElementsByClassName){var n,r=t.documentElement,o=e.HTMLPictureElement&&"sizes"in t.createElement("img"),i="addEventListener",a="getAttribute",d=e[i],s=e.setTimeout,u=e.requestAnimationFrame||s,c=/^picture$/i,l=["load","error","lazyincluded","_lazyloaded"],f={},p=Array.prototype.forEach,v=function(e,t){return f[t]||(f[t]=new RegExp("(\\s|^)"+t+"(\\s|$)")),f[t].test(e[a]("class")||"")&&f[t]},m=function(e,t){v(e,t)||e.setAttribute("class",(e[a]("class")||"").trim()+" "+t)},h=function(e,t){var n;(n=v(e,t))&&e.setAttribute("class",(e[a]("class")||"").replace(n," "))},y=function(e,t,n){var r=n?i:"removeEventListener";n&&y(e,t),l.forEach(function(n){e[r](n,t)})},g=function(e,n,r,o,i){var a=t.createEvent("CustomEvent");return a.initCustomEvent(n,!o,!i,r||{}),e.dispatchEvent(a),a},b=function(t,r){var i;!o&&(i=e.picturefill||n.pf)?i({reevaluate:!0,elements:[t]}):r&&r.src&&(t.src=r.src)},w=function(e,t){return(getComputedStyle(e,null)||{})[t]},x=function(e,t,r){for(r=r||e.offsetWidth;r<n.minSize&&t&&!e._lazysizesWidth;)r=t.offsetWidth,t=t.parentNode;return r},C=function(t){var n,r=0,o=e.Date,i=function(){n=!1,r=o.now(),t()},a=function(){s(i)},d=function(){u(a)};return function(){if(!n){var e=125-(o.now()-r);n=!0,6>e&&(e=6),s(d,e)}}},E=function(){var o,l,f,x,E,z,O,A,_,k,S,N,T,B,L,j=/^img$/i,R=/^iframe$/i,I="onscroll"in e&&!/glebot/.test(navigator.userAgent),P=0,D=0,H=0,W=0,q=function(e){H--,e&&e.target&&y(e.target,q),(!e||0>H||!e.target)&&(H=0)},F=function(e,n){var o,i=e,a="hidden"==w(t.body,"visibility")||"hidden"!=w(e,"visibility");for(_-=n,N+=n,k-=n,S+=n;a&&(i=i.offsetParent)&&i!=t.body&&i!=r;)a=(w(i,"opacity")||1)>0,a&&"visible"!=w(i,"overflow")&&(o=i.getBoundingClientRect(),a=S>o.left&&k<o.right&&N>o.top-1&&_<o.bottom+1);return a},$=function(){var e,t,i,d,s,u,c,p,v;if((E=n.loadMode)&&8>H&&(e=o.length)){t=0,W++,null==B&&("expand"in n||(n.expand=r.clientHeight>600?r.clientWidth>860?500:410:359),T=n.expand,B=T*n.expFactor),B>D&&1>H&&W>3&&E>2?(D=B,W=0):D=E>1&&W>2&&6>H?T:P;for(;e>t;t++)if(o[t]&&!o[t]._lazyRace)if(I)if((p=o[t][a]("data-expand"))&&(u=1*p)||(u=D),v!==u&&(O=innerWidth+u*L,A=innerHeight+u,c=-1*u,v=u),i=o[t].getBoundingClientRect(),(N=i.bottom)>=c&&(_=i.top)<=A&&(S=i.right)>=c*L&&(k=i.left)<=O&&(N||S||k||_)&&(f&&3>H&&!p&&(3>E||4>W)||F(o[t],u))){if(Q(o[t]),s=!0,H>9)break}else!s&&f&&!d&&4>H&&4>W&&E>2&&(l[0]||n.preloadAfterLoad)&&(l[0]||!p&&(N||S||k||_||"auto"!=o[t][a](n.sizesAttr)))&&(d=l[0]||o[t]);else Q(o[t]);d&&!s&&Q(d)}},J=C($),U=function(e){m(e.target,n.loadedClass),h(e.target,n.loadingClass),y(e.target,U)},V=function(e,t){try{e.contentWindow.location.replace(t)}catch(n){e.src=t}},G=function(e){var t,r,o=e[a](n.srcsetAttr);(t=n.customMedia[e[a]("data-media")||e[a]("media")])&&e.setAttribute("media",t),o&&e.setAttribute("srcset",o),t&&(r=e.parentNode,r.insertBefore(e.cloneNode(),e),r.removeChild(e))},K=function(){var e,t=[],n=function(){for(;t.length;)t.shift()();e=!1};return function(r){t.push(r),e||(e=!0,u(n))}}(),Q=function(e){var t,r,o,i,d,u,l,w=j.test(e.nodeName),C=w&&(e[a](n.sizesAttr)||e[a]("sizes")),E="auto"==C;(!E&&f||!w||!e.src&&!e.srcset||e.complete||v(e,n.errorClass))&&(E&&(l=e.offsetWidth),e._lazyRace=!0,H++,K(function(){e._lazyRace&&delete e._lazyRace,(d=g(e,"lazybeforeunveil")).defaultPrevented||(C&&(E?(M.updateElem(e,!0,l),m(e,n.autosizesClass)):e.setAttribute("sizes",C)),r=e[a](n.srcsetAttr),t=e[a](n.srcAttr),w&&(o=e.parentNode,i=o&&c.test(o.nodeName||"")),u=d.detail.firesLoad||"src"in e&&(r||t||i),d={target:e},u&&(y(e,q,!0),clearTimeout(x),x=s(q,2500),m(e,n.loadingClass),y(e,U,!0)),i&&p.call(o.getElementsByTagName("source"),G),r?e.setAttribute("srcset",r):t&&!i&&(R.test(e.nodeName)?V(e,t):e.src=t),(r||i)&&b(e,{src:t})),h(e,n.lazyClass),(!u||e.complete)&&(u?q(d):H--,U(d))}))},X=function(){if(!f){if(Date.now()-z<999)return void s(X,999);var e,t=function(){n.loadMode=3,J()};f=!0,n.loadMode=3,H||(W?J():s($)),d("scroll",function(){3==n.loadMode&&(n.loadMode=2),clearTimeout(e),e=s(t,99)},!0)}};return{_:function(){z=Date.now(),o=t.getElementsByClassName(n.lazyClass),l=t.getElementsByClassName(n.lazyClass+" "+n.preloadClass),L=n.hFac,d("scroll",J,!0),d("resize",J,!0),e.MutationObserver?new MutationObserver(J).observe(r,{childList:!0,subtree:!0,attributes:!0}):(r[i]("DOMNodeInserted",J,!0),r[i]("DOMAttrModified",J,!0),setInterval(J,999)),d("hashchange",J,!0),["focus","mouseover","click","load","transitionend","animationend","webkitAnimationEnd"].forEach(function(e){t[i](e,J,!0)}),/d$|^c/.test(t.readyState)?X():(d("load",X),t[i]("DOMContentLoaded",J),s(X,2e4)),J(o.length>0)},checkElems:J,unveil:Q}}(),M=function(){var e,r=function(e,t,n){var r,o,i,a,d=e.parentNode;if(d&&(n=x(e,d,n),a=g(e,"lazybeforesizes",{width:n,dataAttr:!!t}),!a.defaultPrevented&&(n=a.detail.width,n&&n!==e._lazysizesWidth))){if(e._lazysizesWidth=n,n+="px",e.setAttribute("sizes",n),c.test(d.nodeName||""))for(r=d.getElementsByTagName("source"),o=0,i=r.length;i>o;o++)r[o].setAttribute("sizes",n);a.detail.dataAttr||b(e,a.detail)}},o=function(){var t,n=e.length;if(n)for(t=0;n>t;t++)r(e[t])},i=C(o);return{_:function(){e=t.getElementsByClassName(n.autosizesClass),d("resize",i)},checkElems:i,updateElem:r}}(),z=function(){z.i||(z.i=!0,M._(),E._())};return function(){var t,r={lazyClass:"lazyload",loadedClass:"lazyloaded",loadingClass:"lazyloading",preloadClass:"lazypreload",errorClass:"lazyerror",autosizesClass:"lazyautosizes",srcAttr:"data-src",srcsetAttr:"data-srcset",sizesAttr:"data-sizes",minSize:40,customMedia:{},init:!0,expFactor:1.7,hFac:.8,loadMode:2};n=e.lazySizesConfig||e.lazysizesConfig||{};for(t in r)t in n||(n[t]=r[t]);e.lazySizesConfig=n,s(function(){n.init&&z()})}(),{cfg:n,autoSizer:M,loader:E,init:z,uP:b,aC:m,rC:h,hC:v,fire:g,gW:x}}})},function(e,t,n){var r,r,o;!function i(e,t,n){function o(d,s){if(!t[d]){if(!e[d]){var u="function"==typeof r&&r;if(!s&&u)return r(d,!0);if(a)return a(d,!0);throw new Error("Cannot find module '"+d+"'")}var c=t[d]={exports:{}};e[d][0].call(c.exports,function(t){var n=e[d][1][t];return o(n?n:t)},c,c.exports,i,e,t,n)}return t[d].exports}for(var a="function"==typeof r&&r,d=0;d<n.length;d++)o(n[d]);return o}({1:[function(e,t,n){function r(e,t){var n=document,r=e.nodeType||e===window?e:n.createElement(e),i=[];t&&(r.className=t);var a=o(),d=o(),s=function(e,t){r.addEventListener?r.addEventListener(e,t,!1):r.attachEvent("on"+e,t),i.push({event:e,handler:t})},u=function(e,t){r.removeEventListener?r.removeEventListener(e,t):r.detachEvent("on"+e,t);for(var n,o=i.length;o-- >0;)if(n=i[o],n.event===e&&n.handler===t){i.splice(o,1);break}},c=function(e){var t=!1,n=function(n){t||(t=!0,setTimeout(function(){t=!1},100),e(n))};s("touchstart",n),s("mousedown",n)},l=function(e){r&&(r.style.display="block",a.fire(e))},f=function(e){r&&(r.style.display="none",d.fire(e))},p=function(){return r.style&&"block"===r.style.display},v=function(e){r&&(r.innerHTML=e)},m=function(e){r&&(v(""),r.appendChild(n.createTextNode(e)))},h=function(){if(r.parentNode){for(var e,t=i.length;t-- >0;)e=i[t],u(e.event,e.handler);r.parentNode.removeChild(r),a.removeAllListeners(),d.removeAllListeners()}},y=function(e){var t=e.el||e;r.appendChild(t)};return{el:r,addListener:s,addClickListener:c,onShowEvent:a,onHideEvent:d,show:l,hide:f,isShowing:p,html:v,text:m,remove:h,add:y}}var o=e("./ModalEvent");t.exports=r},{"./ModalEvent":3}],2:[function(e,t,n){function r(e,t,n,i,a){if(void 0!==e){t=t||{};var d,s=o("div","nanoModal nanoModalOverride "+(t.classes||"")),u=o("div","nanoModalContent"),c=o("div","nanoModalButtons");s.add(u),s.add(c),s.el.style.display="none";var l,f=[];t.buttons=t.buttons||[{text:"Close",handler:"hide",primary:!0}];var p=function(){for(var e=f.length;e-- >0;){var t=f[e];t.remove()}f=[]},v=function(){s.el.style.marginLeft=-s.el.clientWidth/2+"px"},m=function(){for(var e=document.querySelectorAll(".nanoModal"),t=e.length;t-- >0;)if("none"!==e[t].style.display)return!0;return!1},h=function(){s.isShowing()||(r.resizeOverlay(),n.show(n),s.show(l),v())},y=function(){s.isShowing()&&(s.hide(l),m()||n.hide(n),t.autoRemove&&l.remove())},g=function(e){var t={};for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);return t};return l={modal:s,overlay:n,show:function(){return i?i(h,l):h(),l},hide:function(){return a?a(y,l):y(),l},onShow:function(e){return s.onShowEvent.addListener(function(){e(l)}),l},onHide:function(e){return s.onHideEvent.addListener(function(){e(l)}),l},remove:function(){n.onRequestHide.removeListener(d),d=null,p(),s.remove()},setButtons:function(e){var t,n,r,i=e.length,a=function(e,t){var n=g(l);e.addClickListener(function(e){n.event=e||window.event,t.handler(n)})};if(p(),0===i)c.hide();else for(c.show();i-- >0;)t=e[i],r="nanoModalBtn",t.primary&&(r+=" nanoModalBtnPrimary"),r+=t.classes?" "+t.classes:"",n=o("button",r),"hide"===t.handler?n.addClickListener(l.hide):t.handler&&a(n,t),n.text(t.text),c.add(n),f.push(n);return v(),l},setContent:function(t){return t.nodeType?(u.html(""),u.add(t)):u.html(t),v(),e=t,l},getContent:function(){return e}},d=n.onRequestHide.addListener(function(){t.overlayClose!==!1&&s.isShowing()&&l.hide()}),l.setContent(e).setButtons(t.buttons),document.body.appendChild(s.el),l}}var o=e("./El"),i=document,a=function(e){var t=i.documentElement,n="scroll"+e,r="offset"+e;return Math.max(i.body[n],t[n],i.body[r],t[r],t["client"+e])};r.resizeOverlay=function(){var e=i.getElementById("nanoModalOverlay");e.style.width=a("Width")+"px",e.style.height=a("Height")+"px"},t.exports=r},{"./El":1}],3:[function(e,t,n){function r(){var e={},t=0,n=function(n){return e[t]=n,t++},r=function(t){t&&delete e[t]},o=function(){e={}},i=function(){for(var n=0,r=t;r>n;++n)e[n]&&e[n].apply(null,arguments)};return{addListener:n,removeListener:r,removeAllListeners:o,fire:i}}t.exports=r},{}],4:[function(e,t,n){var r=e("./ModalEvent"),i=function(){function t(){if(!a.querySelector("#nanoModalOverlay")){var e=o("style"),t=e.el,d=a.querySelectorAll("head")[0].childNodes[0];d.parentNode.insertBefore(t,d);var s=".nanoModal{position:absolute;top:100px;left:50%;display:none;z-index:9999;min-width:300px;padding:15px 20px 10px;-webkit-border-radius:10px;-moz-border-radius:10px;border-radius:10px;background:#fff;background:-moz-linear-gradient(top,#fff 0,#ddd 100%);background:-webkit-gradient(linear,left top,left bottom,color-stop(0%,#fff),color-stop(100%,#ddd));background:-webkit-linear-gradient(top,#fff 0,#ddd 100%);background:-o-linear-gradient(top,#fff 0,#ddd 100%);background:-ms-linear-gradient(top,#fff 0,#ddd 100%);background:linear-gradient(to bottom,#fff 0,#ddd 100%);filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#ffffff', endColorstr='#dddddd', GradientType=0)}.nanoModalOverlay{position:absolute;top:0;left:0;width:100%;height:100%;z-index:9998;background:#000;display:none;-ms-filter:\"alpha(Opacity=50)\";-moz-opacity:.5;-khtml-opacity:.5;opacity:.5}.nanoModalButtons{border-top:1px solid #ddd;margin-top:15px;text-align:right}.nanoModalBtn{color:#333;background-color:#fff;display:inline-block;padding:6px 12px;margin:8px 4px 0;font-size:14px;text-align:center;white-space:nowrap;vertical-align:middle;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;border:1px solid transparent;-webkit-border-radius:4px;-moz-border-radius:4px;border-radius:4px}.nanoModalBtn:active,.nanoModalBtn:focus,.nanoModalBtn:hover{color:#333;background-color:#e6e6e6;border-color:#adadad}.nanoModalBtn.nanoModalBtnPrimary{color:#fff;background-color:#428bca;border-color:#357ebd}.nanoModalBtn.nanoModalBtnPrimary:active,.nanoModalBtn.nanoModalBtnPrimary:focus,.nanoModalBtn.nanoModalBtnPrimary:hover{color:#fff;background-color:#3071a9;border-color:#285e8e}";t.styleSheet?t.styleSheet.cssText=s:e.text(s),n=o("div","nanoModalOverlay nanoModalOverride"),n.el.id="nanoModalOverlay",a.body.appendChild(n.el),n.onRequestHide=r();var u=function(){n.onRequestHide.fire()};n.addClickListener(u),o(a).addListener("keydown",function(e){var t=e.which||e.keyCode;27===t&&u()});var c,l=o(window);l.addListener("resize",function(){c&&clearTimeout(c),c=setTimeout(i.resizeOverlay,100)}),l.addListener("orientationchange",function(){for(var e=0;3>e;++e)setTimeout(i.resizeOverlay,1e3*e+200)})}}var n,o=e("./El"),i=e("./Modal"),a=document;document.body&&t();var d=function(e,r){return t(),i(e,r,n,d.customShow,d.customHide)};return d.resizeOverlay=i.resizeOverlay,d}();o=i},{"./El":1,"./Modal":2,"./ModalEvent":3}]},{},[1,2,3,4]),"undefined"!=typeof window&&("function"==typeof window.define&&window.define.amd&&window.define(function(){return o}),window.nanoModal=o),"undefined"!=typeof e&&(e.exports=o)},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{"default":e}}function o(){for(var e=arguments.length,t=Array(e),n=0;e>n;n++)t[n]=arguments[n];return function(e){return function(n,r){var o=e(n,r),a=o.dispatch,s=[],u={getState:o.getState,dispatch:function(e){return a(e)}};return s=t.map(function(e){return e(u)}),a=d["default"].apply(void 0,s)(o.dispatch),i({},o,{dispatch:a})}}}t.__esModule=!0;var i=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e};t["default"]=o;var a=n(1),d=r(a);e.exports=t["default"]},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{"default":e}}function o(e,t){return function(){return t(e.apply(void 0,arguments))}}function i(e,t){if("function"==typeof e)return o(e,t);if("object"!=typeof e||null===e||void 0===e)throw new Error("bindActionCreators expected an object or a function, instead received "+(null===e?"null":typeof e)+'. Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?');return d["default"](e,function(e){return o(e,t)})}t.__esModule=!0,t["default"]=i;var a=n(4),d=r(a);e.exports=t["default"]},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{"default":e}}function o(e,t){var n=t&&t.type,r=n&&'"'+n.toString()+'"'||"an action";return'Reducer "'+e+'" returned undefined handling '+r+". To ignore an action, you must explicitly return the previous state."}function i(e){Object.keys(e).forEach(function(t){var n=e[t],r=n(void 0,{type:d.ActionTypes.INIT});if("undefined"==typeof r)throw new Error('Reducer "'+t+'" returned undefined during initialization. If the state passed to the reducer is undefined, you must explicitly return the initial state. The initial state may not be undefined.');var o="@@redux/PROBE_UNKNOWN_ACTION_"+Math.random().toString(36).substring(7).split("").join(".");if("undefined"==typeof n(void 0,{type:o}))throw new Error('Reducer "'+t+'" returned undefined when probed with a random type. '+("Don't try to handle "+d.ActionTypes.INIT+' or other actions in "redux/*" ')+"namespace. They are considered private. Instead, you must return the current state for any unknown actions, unless it is undefined, in which case you must return the initial state, regardless of the action type. The initial state may not be undefined.")})}function a(e){var t,n=f["default"](e,function(e){return"function"==typeof e});try{i(n)}catch(r){t=r}return function(e,r){if(void 0===e&&(e={}),t)throw t;var i=!1,a=c["default"](n,function(t,n){var a=e[n],d=t(a,r);if("undefined"==typeof d){var s=o(n,r);throw new Error(s)}return i=i||d!==a,d});return i?a:e}}t.__esModule=!0,t["default"]=a;var d=n(2),s=n(3),u=(r(s),n(4)),c=r(u),l=n(15),f=r(l);e.exports=t["default"]},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{"default":e}}function o(){}t.__esModule=!0;var i=n(2),a=r(i),d=n(13),s=r(d),u=n(12),c=r(u),l=n(11),f=r(l),p=n(1),v=r(p);"isCrushed"!==o.name,1,t.createStore=a["default"],t.combineReducers=s["default"],t.bindActionCreators=c["default"],t.applyMiddleware=f["default"],t.compose=v["default"]},function(e,t){"use strict";function n(e,t){return Object.keys(e).reduce(function(n,r){return t(e[r])&&(n[r]=e[r]),n},{})}t.__esModule=!0,t["default"]=n,e.exports=t["default"]}]);
//# sourceMappingURL=main.js.map