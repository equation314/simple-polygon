(window.webpackJsonp=window.webpackJsonp||[]).push([[1],{1:function(t,e,n){"use strict";n.r(e);var r=n(10),o=n(20),a=n.n(o),s=n(96);function i(){let t,e,n;for(;t=Math.floor(256*Math.random()),e=Math.floor(256*Math.random()),n=Math.floor(256*Math.random()),!(t+e+n<672););return`rgba(${t},${e},${n},0.5)`}var l=new class{constructor(){let t,e=s.g("body").append("svg"),n=a()("svg").width(),r=a()("svg").height(),o=e.append("g"),i=e.append("g").attr("class","canvas"),l=e.append("g"),c=e.append("g"),h=n/50,d=r/50,u=s.f().domain([0,n]).range([0,n]).nice(),p=s.f().domain([0,r]).range([r,0]).nice(),g=(t,e)=>t.attr("transform",`translate(0,${r})`).call(s.b(e).ticks(h)).call(t=>t.select(".domain").attr("display","none")),f=(t,e)=>t.attr("transform","translate(0,0)").call(s.a(e).ticks(d)).call(t=>t.select(".domain").attr("display","none")),y=(t,e,o)=>t.attr("stroke","currentColor").attr("stroke-opacity",.1).call(t=>t.selectAll(".x").data(e.ticks(h)).join(t=>t.append("line").attr("class","x").attr("y2",r),t=>t,t=>t.remove()).attr("x1",t=>e(t)).attr("x2",t=>e(t))).call(t=>t.selectAll(".y").data(o.ticks(d)).join(t=>t.append("line").attr("class","y").attr("x2",n),t=>t,t=>t.remove()).attr("y1",t=>o(t)).attr("y2",t=>o(t))),v=!1,w=(t,e)=>{if(this.drawing)return;v=!0;let n=this.invertTransX(),r=this.invertTransY(),o=[n(e.x),r(e.y)];s.g(t).data([o]);let a=s.g(t.parentNode);if(a.classed("polygon")){let t=a.selectAll(".polygon > circle").data();a.select("polyline").data([t.concat([t[0]])]),this.currentPolygon=t,this.removeShape("tri-lines"),this.removeShape("path-lines")}else if(a.classed("endpoint")){let t=this.canvas.selectAll(".endpoint > circle").data();this.currentEndpoints=t,this.removeShape("path-lines")}this.applyTransform()};this.zoom=s.h().scaleExtent([.2,50]).on("start",t=>{t.sourceEvent&&"wheel"!=t.sourceEvent.type&&e.attr("cursor","grab")}).on("zoom",({transform:t})=>{this.currentTransform=t,this.applyTransform();let e=this.transX(),n=this.transY();l.call(g,e),c.call(f,n),o.call(y,e,n)}).on("end",()=>e.attr("cursor","default")).filter(t=>"move"==this.mode||(!("draw-polygon"!=this.mode||!this.currentPolygon.length)||(!("draw-points"!=this.mode||!this.currentEndpoints.length)||"mouseup"!=t.type&&"mousedown"!=t.type))),this.pointDragger=s.c().on("drag",(function(t){w(this,t)})).on("end",()=>v=!1),e.on("mouseup",e=>{if(v)return;switch(this.mode){case"draw-polygon":if(this.currentPolygon.length)return;break;case"draw-points":if(this.currentEndpoints.length)return;break;default:return}this.drawing=!0;let n=this.invertTransX(),r=this.invertTransY(),o=s.e(e),i=[n(o[0]),r(o[1])];if("draw-polygon"==this.mode)if(t=i,e.target.hasAttribute("is-handle")){if(this.currentDrawPoints.length<=2)return;this.canvas.select("g.drawing").remove();let t=a()("#pick-color").val()+"77";this.drawPolygon(this.currentDrawPoints,{color:t,vertexColor:"#FDBC07",fixed:!1}),this.currentDrawPoints=[],this.drawing=!1}else this.currentDrawPoints.push(i),this.canvas.select("g.drawing").remove(),this.drawPolygon(this.currentDrawPoints,{vertexColor:"yellow",close:!1},"drawing");else"draw-points"==this.mode&&(this.currentDrawPoints.push(i),this.drawPoints([i]),2==this.currentDrawPoints.length&&(this.currentEndpoints=this.currentDrawPoints,this.onEndpointsDrawnCallback(this.currentEndpoints),this.currentDrawPoints=[],this.drawing=!1,this.mode="move"))}),e.on("mousemove",e=>{if(!this.drawing||"draw-polygon"!=this.mode)return;let n=this.invertTransX(),r=this.invertTransY(),o=s.e(e),a=[n(o[0]),r(o[1])],i=this.canvas.select("g.drawing");i.select("line").remove(),i.insert("line",":first-child").data([[t,a]]).attr("stroke","#53DBF3").attr("stroke-width",1),this.applyTransform()}),e.call(this.zoom),this.drawing=!1,this.currentDrawPoints=[],this.currentPolygon=[],this.currentEndpoints=[],this.polygonDrawnCallback=this.polygonDestroyedCallback=this.onEndpointsDrawnCallback=()=>{},this.mode="move",this.width=n,this.height=r,this.svg=e,this.canvas=i,this.currentTransform=s.i,this.xScale=u,this.yScale=p,this.autoScale([])}onPolygonDrawn(t){this.polygonDrawnCallback=t}onPolygonDestroyed(t){this.polygonDestroyedCallback=t}onEndpointsDrawn(t){this.onEndpointsDrawnCallback=t}clearCanvas(){this.drawing=!1,this.removeShape("polygon"),this.removeShape("endpoint"),this.removeShape("drawing"),this.polygonDestroyedCallback(this.currentPolygon),this.currentDrawPoints=[],this.currentPolygon=[],this.currentEndpoints=[]}setMode(t){["move","draw-polygon","draw-points"].includes(t)&&(this.mode=t)}transX(){return this.currentTransform.rescaleX(this.xScale)}transY(){return this.currentTransform.rescaleY(this.yScale)}invertTransX(){return this.currentTransform.rescaleX(this.xScale).invert}invertTransY(){return this.currentTransform.rescaleY(this.yScale).invert}applyTransform(){let t=this.transX(),e=this.transY();this.canvas.selectAll("circle").attr("cx",e=>t(e[0])).attr("cy",t=>e(t[1])),this.canvas.selectAll("line").attr("x1",e=>t(e[0][0])).attr("y1",t=>e(t[0][1])).attr("x2",e=>t(e[1][0])).attr("y2",t=>e(t[1][1])),this.canvas.selectAll("polygon").attr("points",n=>n.map(n=>[t(n[0]),e(n[1])])),this.canvas.selectAll("polyline").attr("points",n=>n.map(n=>[t(n[0]),e(n[1])]))}autoScale(t){let[e,n]=s.d(t,t=>t[0]),[r,o]=s.d(t,t=>t[1]);t.length||(e=n=r=o=0);let a=.8*Math.min(Math.abs(this.width/(this.xScale(n-e+1)-this.xScale(0))),Math.abs(this.height/(this.yScale(o-r+1)-this.yScale(0))));a=Math.min(Math.max(a,.2),50);let i=(this.width-(this.xScale(e)+this.xScale(n))*a)/2,l=(this.height-(this.yScale(o)+this.yScale(r))*a)/2;this.currentTransform=s.i.translate(i,l).scale(a),this.svg.call(this.zoom.transform,this.currentTransform)}hasShape(t){return!this.canvas.selectAll("g."+t).empty()}removeShape(t){this.canvas.selectAll("g."+t).remove()}toggleShape(t){let e=this.canvas.selectAll("g."+t);e.attr("opacity",1-e.attr("opacity"))}drawPolygon(t,e,n=""){let r={...{color:"red",vertexColor:"#FDBC07",vertexSize:5,close:!0,fixed:!0},...e};r.close&&r.fixed&&(n+=" fixed-polygon");let o=this.canvas.append("g").attr("class","polygon "+n);r.close?(o.append("polyline").data([t.concat([t[0]])]).style("fill",r.color).attr("stroke","#ccc"),this.currentPolygon=t):o.append("polyline").data([t]).style("fill","none").attr("stroke","#000");let a=o.selectAll("circle").data(t).join("circle").attr("r",r.vertexSize).attr("fill",r.vertexColor).attr("stroke","#000");r.close&&!r.fixed?a.style("cursor","move").call(this.pointDragger):r.close||a.attr("is-handle",!0).style("cursor","pointer"),this.applyTransform(),r.close&&this.polygonDrawnCallback(t)}drawLines(t,e="#FDBC07",n="lines"){this.removeShape(n);let r=this.canvas.select(".polygon"),o=r.selectChild(".path-lines").empty()?"circle":".path-lines";r.insert("g",o).attr("opacity",1).attr("class",n).selectAll("line").data(t).join("line").attr("x1",t=>t[0][0]).attr("y1",t=>t[0][1]).attr("x2",t=>t[1][0]).attr("y2",t=>t[1][1]).attr("stroke",e).attr("stroke-width",1),this.applyTransform()}drawPoints(t,e,n="endpoint"){let r={...{color:"#996f6e",size:5,fixed:!1},...e},o=this.canvas.append("g").attr("class",n).selectAll("circle").data(t).join("circle").attr("r",r.size).attr("fill",r.color).attr("stroke","#000");r.fixed||o.style("cursor","move").call(this.pointDragger),this.applyTransform()}getCurrentPolygon(){return this.currentPolygon}getCurrentEndpoints(){return this.currentEndpoints}};function c(t){let e=a()("#alert");e.text(t),e.slideDown("slow",()=>setTimeout(()=>e.slideUp("slow"),1e3))}function h(t,e){let n=l.getCurrentPolygon();if(!r.g(n))return void c("Not a simple polygon!");r.f(n)||n.reverse();let o=r.d(n,t,e,"mono_partition");if(null==o)return void c("Unreachable!");let a=Array.prototype.concat([t],o.map(t=>n[t]),[e]),s=[];for(let t=0;t<a.length-1;t++)s.push([a[t],a[t+1]]);l.drawLines(s,"#2c507b","path-lines")}l.onPolygonDrawn(t=>{console.log(t),a()("#tri-btn").removeClass("disabled"),a()("#path-btn").removeClass("disabled")}),l.onPolygonDestroyed(()=>{a()("#tri-btn").addClass("disabled"),a()("#path-btn").addClass("disabled")}),l.onEndpointsDrawn(t=>h(t[0],t[1])),a()(()=>{a()("#polygon-btn").on("change",()=>{switch(a()("#polygon-btn").val()){case"draw":a()("#draw-opts").show(),a()("#gen-opts").hide(),l.setMode("draw-polygon"),l.clearCanvas();break;case"random":a()("#draw-opts").hide(),a()("#gen-opts").show(),l.setMode("move"),l.clearCanvas();break;case"load":a()("#draw-opts").hide(),a()("#gen-opts").hide(),l.setMode("move"),function(){document.getElementById("file-opt").click();var t=a()("#file-opt")[0].files,e=new FileReader;e.readAsText(t[0],"UTF-8"),e.onload=function(t){var e=t.target.result;console.log("file content is",e)}}()}}),a()("#tri-btn").on("click",()=>{l.hasShape("tri-lines")?l.toggleShape("tri-lines"):function(){let t=l.getCurrentPolygon();if(!r.g(t))return void c("Not a simple polygon!");r.f(t)||t.reverse();let e=r.h(t,"mono_partition").map(e=>[t[e[0]],t[e[1]]]);l.drawLines(e,"#9c3829","tri-lines")}()}),a()("#path-btn").on("click",()=>{l.hasShape("path-lines")?l.toggleShape("path-lines"):l.currentEndpoints.length?h(l.currentEndpoints[0],l.currentEndpoints[1]):l.setMode("draw-points")}),a()("#algo-btn").next().children().on("click",(function(t){let e=a()(t.target);a()("#algo-btn").val(e.val()).text(e.text())})),a()("#polygon-btn").next().children().on("click",(function(t){let e=a()(t.target);e.val()!=a()("#polygon-btn").val()&&a()("#polygon-btn").val(e.val()).text(e.text()).trigger("change")})),a()("#clear-btn").on("click",()=>{l.clearCanvas(),l.setMode("draw-polygon")}),a()("#gen-btn").on("click",()=>{!function(t,e){let n=r.e(t,e);console.log(t,e,n),console.log(r.f(n)),console.log(r.g(n)),l.clearCanvas(),l.drawPolygon(n,{color:i(),vertexSize:3}),l.autoScale(n)}(a()("#pick-size").val(),a()("#algo-btn").val())})})},10:function(t,e,n){"use strict";(function(t){n.d(e,"e",(function(){return m})),n.d(e,"f",(function(){return k})),n.d(e,"g",(function(){return D})),n.d(e,"h",(function(){return S})),n.d(e,"d",(function(){return C})),n.d(e,"a",(function(){return P})),n.d(e,"c",(function(){return T})),n.d(e,"b",(function(){return E}));var r=n(95);const o=new Array(32).fill(void 0);function a(t){return o[t]}o.push(void 0,null,!0,!1);let s=0,i=null;function l(){return null!==i&&i.buffer===r.h.buffer||(i=new Uint8Array(r.h.buffer)),i}let c=new("undefined"==typeof TextEncoder?(0,t.require)("util").TextEncoder:TextEncoder)("utf-8");const h="function"==typeof c.encodeInto?function(t,e){return c.encodeInto(t,e)}:function(t,e){const n=c.encode(t);return e.set(n),{read:t.length,written:n.length}};function d(t,e,n){if(void 0===n){const n=c.encode(t),r=e(n.length);return l().subarray(r,r+n.length).set(n),s=n.length,r}let r=t.length,o=e(r);const a=l();let i=0;for(;i<r;i++){const e=t.charCodeAt(i);if(e>127)break;a[o+i]=e}if(i!==r){0!==i&&(t=t.slice(i)),o=n(o,r,r=i+3*t.length);const e=l().subarray(o+i,o+r);i+=h(t,e).written}return s=i,o}let u=null;function p(){return null!==u&&u.buffer===r.h.buffer||(u=new Int32Array(r.h.buffer)),u}let g=new("undefined"==typeof TextDecoder?(0,t.require)("util").TextDecoder:TextDecoder)("utf-8",{ignoreBOM:!0,fatal:!0});function f(t,e){return g.decode(l().subarray(t,t+e))}g.decode();let y=o.length;function v(t){return null==t}function w(t){const e=a(t);return function(t){t<36||(o[t]=y,y=t)}(t),e}function m(t,e){var n=v(e)?0:d(e,r.a,r.b),o=s;return w(r.d(t,n,o))}let b=32;function x(t){if(1==b)throw new Error("out of js stack");return o[--b]=t,b}function k(t){try{return 0!==r.f(x(t))}finally{o[b++]=void 0}}function D(t){try{return 0!==r.g(x(t))}finally{o[b++]=void 0}}function S(t,e){try{var n=v(e)?0:d(e,r.a,r.b),a=s;return w(r.i(x(t),n,a))}finally{o[b++]=void 0}}function C(t,e,n,a){try{var i=v(a)?0:d(a,r.a,r.b),l=s;return w(r.c(x(t),x(e),x(n),i,l))}finally{o[b++]=void 0,o[b++]=void 0,o[b++]=void 0}}const P=function(t,e){alert(f(t,e))},T=function(t,e){const n=a(e);var o=d(JSON.stringify(void 0===n?null:n),r.a,r.b),i=s;p()[t/4+1]=i,p()[t/4+0]=o},E=function(t,e){return function(t){y===o.length&&o.push(o.length+1);const e=y;return y=o[e],o[e]=t,e}(JSON.parse(f(t,e)))}}).call(this,n(94)(t))},95:function(t,e,n){"use strict";var r=n.w[t.i];t.exports=r;n(10);r.j()}}]);