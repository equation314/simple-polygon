!function(e){function n(n){for(var t,o,u=n[0],i=n[1],a=0,c=[];a<u.length;a++)o=u[a],Object.prototype.hasOwnProperty.call(r,o)&&r[o]&&c.push(r[o][0]),r[o]=0;for(t in i)Object.prototype.hasOwnProperty.call(i,t)&&(e[t]=i[t]);for(f&&f(n);c.length;)c.shift()()}var t={},r={0:0};var o={};var u={95:function(){return{"./simple_polygon_wasm_bg.js":{__wbg_alert_9612d1a3783295fb:function(e,n){return t[2].exports.a(e,n)},__wbindgen_json_serialize:function(e,n){return t[2].exports.r(e,n)},__wbindgen_json_parse:function(e,n){return t[2].exports.q(e,n)},__wbg_self_86b4b13392c7af56:function(){return t[2].exports.l()},__wbindgen_object_drop_ref:function(e){return t[2].exports.t(e)},__wbg_static_accessor_MODULE_452b4680e8614c81:function(){return t[2].exports.n()},__wbg_require_f5521a5b85ad2542:function(e,n,r){return t[2].exports.k(e,n,r)},__wbg_crypto_b8c92eaac23d0d80:function(e){return t[2].exports.c(e)},__wbg_msCrypto_9ad6677321a08dd8:function(e){return t[2].exports.g(e)},__wbindgen_is_undefined:function(e){return t[2].exports.p(e)},__wbg_getRandomValues_dd27e6b0652b3236:function(e){return t[2].exports.d(e)},__wbg_getRandomValues_e57c9b75ddead065:function(e,n){return t[2].exports.e(e,n)},__wbg_randomFillSync_d2ba53160aec6aba:function(e,n,r){return t[2].exports.j(e,n,r)},__wbg_buffer_ebc6c8e75510eae3:function(e){return t[2].exports.b(e)},__wbg_length_317f0dd77f7a6673:function(e){return t[2].exports.f(e)},__wbg_new_135e963dedf67b22:function(e){return t[2].exports.h(e)},__wbg_set_4a5072a31008e0cb:function(e,n,r){return t[2].exports.m(e,n,r)},__wbg_newwithlength_78dc302d31527318:function(e){return t[2].exports.i(e)},__wbg_subarray_34c228a45c72d146:function(e,n,r){return t[2].exports.o(e,n,r)},__wbindgen_throw:function(e,n){return t[2].exports.u(e,n)},__wbindgen_memory:function(){return t[2].exports.s()}}}}};function i(n){if(t[n])return t[n].exports;var r=t[n]={i:n,l:!1,exports:{}};return e[n].call(r.exports,r,r.exports,i),r.l=!0,r.exports}i.e=function(e){var n=[],t=r[e];if(0!==t)if(t)n.push(t[2]);else{var a=new Promise((function(n,o){t=r[e]=[n,o]}));n.push(t[2]=a);var c,s=document.createElement("script");s.charset="utf-8",s.timeout=120,i.nc&&s.setAttribute("nonce",i.nc),s.src=function(e){return i.p+""+e+".bundle.js"}(e);var f=new Error;c=function(n){s.onerror=s.onload=null,clearTimeout(_);var t=r[e];if(0!==t){if(t){var o=n&&("load"===n.type?"missing":n.type),u=n&&n.target&&n.target.src;f.message="Loading chunk "+e+" failed.\n("+o+": "+u+")",f.name="ChunkLoadError",f.type=o,f.request=u,t[1](f)}r[e]=void 0}};var _=setTimeout((function(){c({type:"timeout",target:s})}),12e4);s.onerror=s.onload=c,document.head.appendChild(s)}return({1:[95]}[e]||[]).forEach((function(e){var t=o[e];if(t)n.push(t);else{var r,a=u[e](),c=fetch(i.p+""+{95:"f2084f608ddc500952af"}[e]+".module.wasm");if(a instanceof Promise&&"function"==typeof WebAssembly.compileStreaming)r=Promise.all([WebAssembly.compileStreaming(c),a]).then((function(e){return WebAssembly.instantiate(e[0],e[1])}));else if("function"==typeof WebAssembly.instantiateStreaming)r=WebAssembly.instantiateStreaming(c,a);else{r=c.then((function(e){return e.arrayBuffer()})).then((function(e){return WebAssembly.instantiate(e,a)}))}n.push(o[e]=r.then((function(n){return i.w[e]=(n.instance||n).exports})))}})),Promise.all(n)},i.m=e,i.c=t,i.d=function(e,n,t){i.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:t})},i.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,n){if(1&n&&(e=i(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var t=Object.create(null);if(i.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var r in e)i.d(t,r,function(n){return e[n]}.bind(null,r));return t},i.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return i.d(n,"a",n),n},i.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},i.p="",i.oe=function(e){throw console.error(e),e},i.w={};var a=window.webpackJsonp=window.webpackJsonp||[],c=a.push.bind(a);a.push=n,a=a.slice();for(var s=0;s<a.length;s++)n(a[s]);var f=c;i(i.s=0)}([function(e,n,t){Promise.all([t.e(2),t.e(1)]).then(t.bind(null,1)).catch(console.error)}]);