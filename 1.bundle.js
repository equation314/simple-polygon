(window.webpackJsonp=window.webpackJsonp||[]).push([[1],{1:function(t,n,e){"use strict";e.r(n);var r=e(2),o=e(20),i=e.n(o),a=e(96);function l(){let t,n,e;for(;t=Math.floor(256*Math.random()),n=Math.floor(256*Math.random()),e=Math.floor(256*Math.random()),!(t+n+e<672););return`rgba(${t},${n},${e},0.5)`}var s=new class{constructor(){let t,n=a.g("body").append("svg"),e=i()("svg").width(),r=i()("svg").height(),o=n.append("g"),l=n.append("g").attr("class","canvas"),s=n.append("g"),c=n.append("g"),u=e/50,d=r/50,h=a.f().domain([0,e]).range([0,e]).nice(),p=a.f().domain([0,r]).range([r,0]).nice(),f=(t,n)=>t.attr("transform",`translate(0,${r})`).call(a.b(n).ticks(u)).call(t=>t.select(".domain").attr("display","none")),g=(t,n)=>t.attr("transform","translate(0,0)").call(a.a(n).ticks(d)).call(t=>t.select(".domain").attr("display","none")),y=(t,n,o)=>t.attr("stroke","currentColor").attr("stroke-opacity",.1).call(t=>t.selectAll(".x").data(n.ticks(u)).join(t=>t.append("line").attr("class","x").attr("y2",r),t=>t,t=>t.remove()).attr("x1",t=>n(t)).attr("x2",t=>n(t))).call(t=>t.selectAll(".y").data(o.ticks(d)).join(t=>t.append("line").attr("class","y").attr("x2",e),t=>t,t=>t.remove()).attr("y1",t=>o(t)).attr("y2",t=>o(t))),v=!1,w=(t,n)=>{if(this.drawing)return;v=!0;let e=this.invertTransX(),r=this.invertTransY(),o=[e(n.x),r(n.y)];a.g(t).data([o]);let i=a.g(t.parentNode);if(i.classed("polygon")){let t=i.selectAll(".polygon > circle").data();i.select("polyline").data([t.concat([t[0]])]),this.currentPolygon=t,this.removeShape("tri-lines"),this.removeShape("path-lines")}else if(i.classed("endpoint")){let t=this.canvas.selectAll(".endpoint > circle").data();this.currentEndpoints=t,this.removeShape("path-lines")}this.applyTransform()};this.zoom=a.h().scaleExtent([.2,50]).on("start",t=>{t.sourceEvent&&"wheel"!=t.sourceEvent.type&&n.attr("cursor","grab")}).on("zoom",({transform:t})=>{this.currentTransform=t,this.applyTransform();let n=this.transX(),e=this.transY();s.call(f,n),c.call(g,e),o.call(y,n,e)}).on("end",()=>n.attr("cursor","default")).filter(t=>"move"==this.mode||(!("draw-polygon"!=this.mode||!this.currentPolygon.length)||(!("draw-points"!=this.mode||!this.currentEndpoints.length)||"mouseup"!=t.type&&"mousedown"!=t.type))),this.pointDragger=a.c().on("drag",(function(t){w(this,t)})).on("end",()=>v=!1),n.on("mouseup",n=>{if(v)return;switch(this.mode){case"draw-polygon":if(this.currentPolygon.length)return;break;case"draw-points":if(this.currentEndpoints.length)return;break;default:return}this.drawing=!0;let e=this.invertTransX(),r=this.invertTransY(),o=a.e(n),l=[e(o[0]),r(o[1])];if("draw-polygon"==this.mode)if(t=l,n.target.hasAttribute("is-handle")){if(this.currentDrawPoints.length<=2)return;this.canvas.select("g.drawing").remove();let t=i()("#pick-color").val()+"77";this.drawPolygon(this.currentDrawPoints,{color:t,vertexColor:"#FDBC07",fixed:!1}),this.currentDrawPoints=[],this.drawing=!1}else this.currentDrawPoints.push(l),this.canvas.select("g.drawing").remove(),this.drawPolygon(this.currentDrawPoints,{vertexColor:"yellow",close:!1},"drawing");else"draw-points"==this.mode&&(this.currentDrawPoints.push(l),this.drawPoints([l]),2==this.currentDrawPoints.length&&(this.currentEndpoints=this.currentDrawPoints,this.onEndpointsDrawnCallback(this.currentEndpoints),this.currentDrawPoints=[],this.drawing=!1,this.mode="move"))}),n.on("mousemove",n=>{if(!this.drawing||"draw-polygon"!=this.mode)return;let e=this.invertTransX(),r=this.invertTransY(),o=a.e(n),i=[e(o[0]),r(o[1])],l=this.canvas.select("g.drawing");l.select("line").remove(),l.insert("line",":first-child").data([[t,i]]).attr("stroke","#53DBF3").attr("stroke-width",1),this.applyTransform()}),n.call(this.zoom),this.drawing=!1,this.currentDrawPoints=[],this.currentPolygon=[],this.currentEndpoints=[],this.polygonDrawnCallback=this.polygonDestroyedCallback=this.onEndpointsDrawnCallback=()=>{},this.mode="move",this.width=e,this.height=r,this.svg=n,this.canvas=l,this.currentTransform=a.i,this.xScale=h,this.yScale=p,this.autoScale([])}onPolygonDrawn(t){this.polygonDrawnCallback=t}onPolygonDestroyed(t){this.polygonDestroyedCallback=t}onEndpointsDrawn(t){this.onEndpointsDrawnCallback=t}clearCanvas(){this.drawing=!1,this.removeShape("polygon"),this.removeShape("endpoint"),this.removeShape("drawing"),this.polygonDestroyedCallback(this.currentPolygon),this.currentDrawPoints=[],this.currentPolygon=[],this.currentEndpoints=[]}setMode(t){["move","draw-polygon","draw-points"].includes(t)&&(this.mode=t)}transX(){return this.currentTransform.rescaleX(this.xScale)}transY(){return this.currentTransform.rescaleY(this.yScale)}invertTransX(){return this.currentTransform.rescaleX(this.xScale).invert}invertTransY(){return this.currentTransform.rescaleY(this.yScale).invert}applyTransform(){let t=this.transX(),n=this.transY();this.canvas.selectAll("circle").attr("cx",n=>t(n[0])).attr("cy",t=>n(t[1])),this.canvas.selectAll("line").attr("x1",n=>t(n[0][0])).attr("y1",t=>n(t[0][1])).attr("x2",n=>t(n[1][0])).attr("y2",t=>n(t[1][1])),this.canvas.selectAll("polygon").attr("points",e=>e.map(e=>[t(e[0]),n(e[1])])),this.canvas.selectAll("polyline").attr("points",e=>e.map(e=>[t(e[0]),n(e[1])]))}autoScale(t){let[n,e]=a.d(t,t=>t[0]),[r,o]=a.d(t,t=>t[1]);t.length||(n=e=r=o=0);let i=.8*Math.min(Math.abs(this.width/(this.xScale(e-n+1)-this.xScale(0))),Math.abs(this.height/(this.yScale(o-r+1)-this.yScale(0))));i=Math.min(Math.max(i,.2),50);let l=(this.width-(this.xScale(n)+this.xScale(e))*i)/2,s=(this.height-(this.yScale(o)+this.yScale(r))*i)/2;this.currentTransform=a.i.translate(l,s).scale(i),this.svg.call(this.zoom.transform,this.currentTransform)}hasShape(t){return!this.canvas.selectAll("g."+t).empty()}removeShape(t){this.canvas.selectAll("g."+t).remove()}toggleShape(t){let n=this.canvas.selectAll("g."+t);n.attr("opacity",1-n.attr("opacity"))}drawPolygon(t,n,e=""){let r={...{color:"red",vertexColor:"#FDBC07",vertexSize:5,close:!0,fixed:!0},...n};r.close&&r.fixed&&(e+=" fixed-polygon");let o=this.canvas.append("g").attr("class","polygon "+e);r.close?(o.append("polyline").data([t.concat([t[0]])]).style("fill",r.color).attr("stroke","#ccc"),this.currentPolygon=t):o.append("polyline").data([t]).style("fill","none").attr("stroke","#000");let i=o.selectAll("circle").data(t).join("circle").attr("r",r.vertexSize).attr("fill",r.vertexColor).attr("stroke","#000");r.close&&!r.fixed?i.style("cursor","move").call(this.pointDragger):r.close||i.attr("is-handle",!0).style("cursor","pointer"),this.applyTransform(),r.close&&this.polygonDrawnCallback(t)}drawLines(t,n="#FDBC07",e="lines"){this.removeShape(e);let r=this.canvas.select(".polygon"),o=r.selectChild(".path-lines").empty()?"circle":".path-lines";r.insert("g",o).attr("opacity",1).attr("class",e).selectAll("line").data(t).join("line").attr("x1",t=>t[0][0]).attr("y1",t=>t[0][1]).attr("x2",t=>t[1][0]).attr("y2",t=>t[1][1]).attr("stroke",n).attr("stroke-width",1),this.applyTransform()}drawPoints(t,n,e="endpoint"){let r={...{color:"#996f6e",size:5,fixed:!1},...n},o=this.canvas.append("g").attr("class",e).selectAll("circle").data(t).join("circle").attr("r",r.size).attr("fill",r.color).attr("stroke","#000");r.fixed||o.style("cursor","move").call(this.pointDragger),this.applyTransform()}getCurrentPolygon(){return this.currentPolygon}getCurrentEndpoints(){return this.currentEndpoints}};function c(t){return{growth:1e3,space:1e3,"2opt":200,permute:10}[t]}function u(){let t=i()("#file-opt")[0],n=new FileReader;n.readAsText(t.files[0]),n.onload=function(t){let n=t.target.result,e=[];for(let t of n.split("\n")){let n=t.trim().split(/\s+/);if(""!=n){if(2!=n.length)return void h("Invalid polygon file format!");{let t=[parseFloat(n[0]),parseFloat(n[1])];if(isNaN(t[0])||isNaN(t[1]))return void h("Invalid polygon file format!");e.push(t)}}}s.clearCanvas(),s.drawPolygon(e,{color:l(),vertexSize:3}),s.autoScale(e)},t.value=null}function d(){let t=s.getCurrentPolygon();r.x(t)||t.reverse();let n=t.map(t=>t.join(" ")).join("\n"),e=document.getElementById("export-link"),o=new Blob([n],{type:"text/plain"});e.href=URL.createObjectURL(o),e.download="polygon.pts",e.click()}function h(t){let n=i()("#alert");n.text(t),n.slideDown("slow",()=>setTimeout(()=>n.slideUp("slow"),1e3))}function p(t,n){let e=s.getCurrentPolygon();if(!r.y(e))return void h("Not a simple polygon!");r.x(e)||e.reverse();let o=r.v(e,t,n,"mono_partition");if(null==o)return void h("Unreachable!");let i=Array.prototype.concat([t],o.map(t=>e[t]),[n]),a=[];for(let t=0;t<i.length-1;t++)a.push([i[t],i[t+1]]);s.drawLines(a,"#2c507b","path-lines")}s.onPolygonDrawn(t=>{i()("#tri-btn").removeClass("disabled"),i()("#path-btn").removeClass("disabled"),i()("#export-btn").removeClass("disabled")}),s.onPolygonDestroyed(()=>{i()("#tri-btn").addClass("disabled"),i()("#path-btn").addClass("disabled"),i()("#export-btn").addClass("disabled")}),s.onEndpointsDrawn(t=>p(t[0],t[1])),i()(()=>{i()("#polygon-btn").on("change",()=>{switch(i()("#polygon-btn").val()){case"draw":i()("#draw-opts").show(),i()("#gen-opts").hide(),s.setMode("draw-polygon"),s.clearCanvas();break;case"random":i()("#draw-opts").hide(),i()("#gen-opts").show(),s.setMode("move"),s.clearCanvas();break;case"load":i()("#draw-opts").hide(),i()("#gen-opts").hide(),s.setMode("move")}}),i()("#tri-btn").on("click",()=>{s.hasShape("tri-lines")?s.toggleShape("tri-lines"):function(){let t=s.getCurrentPolygon();if(!r.y(t))return void h("Not a simple polygon!");r.x(t)||t.reverse();let n=r.z(t,"mono_partition").map(n=>[t[n[0]],t[n[1]]]);s.drawLines(n,"#9c3829","tri-lines")}()}),i()("#path-btn").on("click",()=>{if(s.hasShape("path-lines"))s.toggleShape("path-lines");else if(s.currentEndpoints.length)p(s.currentEndpoints[0],s.currentEndpoints[1]);else{let t=s.getCurrentPolygon();r.y(t)?s.setMode("draw-points"):h("Not a simple polygon!")}}),i()("#load-btn").on("click",()=>document.getElementById("file-opt").click()),i()("#export-btn").on("click",d),i()("#file-opt").on("change",u),i()("#algo-btn").next().children().on("click",(function(t){let n=i()(t.target);i()("#algo-btn").val(n.val()).text(n.text())})),i()("#polygon-btn").next().children().on("click",(function(t){let n=i()(t.target);n.val()!=i()("#polygon-btn").val()&&i()("#polygon-btn").val(n.val()).text(n.text()).trigger("change")})),i()("#clear-btn").on("click",()=>{s.clearCanvas(),s.setMode("draw-polygon")}),i()("#gen-btn").on("click",()=>{!function(t,n){if(t<3)return void h(`Too few vertices for generation: ${t} < 3`);if(t>c(n))return void h(`Too many vertices for the ${i()("#algo-btn").text()} algorithm:             ${t} > ${c(n)}`);let e=r.w(t,100,n);console.log(t,n,e),s.clearCanvas(),s.drawPolygon(e,{color:l(),vertexSize:3}),s.autoScale(e)}(i()("#pick-size").val(),i()("#algo-btn").val())})})},2:function(t,n,e){"use strict";(function(t){e.d(n,"w",(function(){return b})),e.d(n,"x",(function(){return S})),e.d(n,"y",(function(){return C})),e.d(n,"z",(function(){return D})),e.d(n,"v",(function(){return P})),e.d(n,"a",(function(){return T})),e.d(n,"r",(function(){return E})),e.d(n,"q",(function(){return A})),e.d(n,"l",(function(){return M})),e.d(n,"t",(function(){return j})),e.d(n,"n",(function(){return N})),e.d(n,"k",(function(){return X})),e.d(n,"c",(function(){return Y})),e.d(n,"g",(function(){return B})),e.d(n,"p",(function(){return F})),e.d(n,"d",(function(){return $})),e.d(n,"e",(function(){return I})),e.d(n,"j",(function(){return U})),e.d(n,"b",(function(){return L})),e.d(n,"f",(function(){return R})),e.d(n,"h",(function(){return q})),e.d(n,"m",(function(){return J})),e.d(n,"i",(function(){return O})),e.d(n,"o",(function(){return V})),e.d(n,"u",(function(){return _})),e.d(n,"s",(function(){return G}));var r=e(95);const o=new Array(32).fill(void 0);function i(t){return o[t]}o.push(void 0,null,!0,!1);let a=0,l=null;function s(){return null!==l&&l.buffer===r.i.buffer||(l=new Uint8Array(r.i.buffer)),l}let c=new("undefined"==typeof TextEncoder?(0,t.require)("util").TextEncoder:TextEncoder)("utf-8");const u="function"==typeof c.encodeInto?function(t,n){return c.encodeInto(t,n)}:function(t,n){const e=c.encode(t);return n.set(e),{read:t.length,written:e.length}};function d(t,n,e){if(void 0===e){const e=c.encode(t),r=n(e.length);return s().subarray(r,r+e.length).set(e),a=e.length,r}let r=t.length,o=n(r);const i=s();let l=0;for(;l<r;l++){const n=t.charCodeAt(l);if(n>127)break;i[o+l]=n}if(l!==r){0!==l&&(t=t.slice(l)),o=e(o,r,r=l+3*t.length);const n=s().subarray(o+l,o+r);l+=u(t,n).written}return a=l,o}let h=null;function p(){return null!==h&&h.buffer===r.i.buffer||(h=new Int32Array(r.i.buffer)),h}let f=new("undefined"==typeof TextDecoder?(0,t.require)("util").TextDecoder:TextDecoder)("utf-8",{ignoreBOM:!0,fatal:!0});function g(t,n){return f.decode(s().subarray(t,t+n))}f.decode();let y=o.length;function v(t){y===o.length&&o.push(o.length+1);const n=y;return y=o[n],o[n]=t,n}function w(t){const n=i(t);return function(t){t<36||(o[t]=y,y=t)}(t),n}function m(t){return null==t}function b(t,n,e){var o=m(e)?0:d(e,r.b,r.c),i=a;return w(r.e(t,n,o,i))}let x=32;function k(t){if(1==x)throw new Error("out of js stack");return o[--x]=t,x}function S(t){try{return 0!==r.g(k(t))}finally{o[x++]=void 0}}function C(t){try{return 0!==r.h(k(t))}finally{o[x++]=void 0}}function D(t,n){try{var e=m(n)?0:d(n,r.b,r.c),i=a;return w(r.j(k(t),e,i))}finally{o[x++]=void 0}}function P(t,n,e,i){try{var l=m(i)?0:d(i,r.b,r.c),s=a;return w(r.d(k(t),k(n),k(e),l,s))}finally{o[x++]=void 0,o[x++]=void 0,o[x++]=void 0}}const T=function(t,n){alert(g(t,n))},E=function(t,n){const e=i(n);var o=d(JSON.stringify(void 0===e?null:e),r.b,r.c),l=a;p()[t/4+1]=l,p()[t/4+0]=o},A=function(t,n){return v(JSON.parse(g(t,n)))},M=(z=function(){return v(self.self)},function(){try{return z.apply(this,arguments)}catch(t){r.a(v(t))}});var z;const j=function(t){w(t)},N=function(){return v(t)},X=function(t,n,e){return v(i(t).require(g(n,e)))},Y=function(t){return v(i(t).crypto)},B=function(t){return v(i(t).msCrypto)},F=function(t){return void 0===i(t)},$=function(t){return v(i(t).getRandomValues)},I=function(t,n){i(t).getRandomValues(i(n))},U=function(t,n,e){var r,o;i(t).randomFillSync((r=n,o=e,s().subarray(r/1,r/1+o)))},L=function(t){return v(i(t).buffer)},R=function(t){return i(t).length},q=function(t){return v(new Uint8Array(i(t)))},J=function(t,n,e){i(t).set(i(n),e>>>0)},O=function(t){return v(new Uint8Array(t>>>0))},V=function(t,n,e){return v(i(t).subarray(n>>>0,e>>>0))},_=function(t,n){throw new Error(g(t,n))},G=function(){return v(r.i)}}).call(this,e(94)(t))},95:function(t,n,e){"use strict";var r=e.w[t.i];t.exports=r;e(2);r.k()}}]);