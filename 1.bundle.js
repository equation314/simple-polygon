(window.webpackJsonp=window.webpackJsonp||[]).push([[1],{1:function(t,e,n){"use strict";n.r(e),n.d(e,"draw",(function(){return f})),n.d(e,"showError",(function(){return g}));var r=n(2),o=n(11),s=n.n(o),a=n(97);var i="shortest",l=null,c=0,d=0,p=!1;function h(t){if("path"==i){0==t?(f.removeShape("stepping"),f.drawLines(l.sleeve_diagonals,{color:"#ce6a5b"},"stepping all-steps"),f.drawLines(l.sleeve_boundary,{color:"#777"},"stepping all-steps")):f.removeShape("one-step");let e=l.steps[t];f.drawPath(e.left_chain,{color:"#000",width:2},"stepping one-step"),f.drawPath(e.right_chain,{color:"#000",width:2},"stepping one-step"),f.drawPath(e.path,{color:"#2c507b",width:2},"stepping one-step"),f.drawPoint(e.cusp,{color:"green"},"stepping one-step"),f.drawPoint(e.current,{color:"red"},"stepping one-step"),null!=e.tangent&&f.drawLines([[e.tangent,e.current]],{color:"#2c507b",dashed:!0,width:2},"stepping one-step")}}function u(){s()("#step-btn").next().find("li > button").on("click",(function(t){(function(t){let e=f.getCurrentPolygon();if(!r.y(e))return g("Not a simple polygon!"),!1;if(r.x(e)||e.reverse(),i=t,"path"==t){let[n,o]=f.getCurrentEndpoints();return null==(l=r.v(e,n,o,"mono_partition",!0))?(g("Unreachable!"),!1):(c=0,d=l.steps.length-1,console.log(t,d,l),f.clearAlgorithmResult(),h(0),!0)}return"tri"!=t&&void 0})(s()(t.target).val())&&(s()("#polygon-btn").addClass("disabled"),s()("#tri-btn").addClass("disabled"),s()("#path-btn").addClass("disabled"),s()("#color-opts").hide(),s()("#clear-opts").hide(),s()("#gen-opts").hide(),s()("#step-opts").show(),s()("#step-prev-btn").addClass("disabled"),s()("#step-next-btn").removeClass("disabled"),s()("#step-btn-div").hide(),s()("#stop-btn-div").show(),f.setMode("fixed"))})),s()("#stop-btn").on("click",()=>{switch(p=!1,s()("#polygon-btn").removeClass("disabled"),s()("#tri-btn").removeClass("disabled"),s()("#path-btn").removeClass("disabled"),s()("#step-opts").hide(),s()("#stop-btn-div").hide(),s()("#step-btn-div").show(),s()("#polygon-btn").val()){case"draw":s()("#color-opts").show(),s()("#clear-opts").show();break;case"random":s()("#gen-opts").show();break;case"load":s()("#color-opts").show()}f.removeShape("stepping"),f.setMode("move")}),s()("#step-first-btn").on("click",()=>{h(c=0),s()("#step-prev-btn").addClass("disabled"),s()("#step-next-btn").removeClass("disabled")}),s()("#step-last-btn").on("click",()=>{h(c=d),s()("#step-prev-btn").removeClass("disabled"),s()("#step-next-btn").addClass("disabled")}),s()("#step-prev-btn").on("click",()=>{0!=c&&(0==--c&&s()("#step-prev-btn").addClass("disabled"),s()("#step-next-btn").removeClass("disabled"),h(c))}),s()("#step-next-btn").on("click",()=>{c>=d||(++c==d&&s()("#step-next-btn").addClass("disabled"),s()("#step-prev-btn").removeClass("disabled"),h(c))});let t=()=>{p&&c<d?(s()("#step-next-btn").trigger("click"),setTimeout(t,100)):(p=!1,s()("#step-play-btn").text("Play"))};s()("#step-play-btn").on("click",()=>{p?(p=!1,s()("#step-play-btn").text("Play")):(p=!0,s()("#step-play-btn").text("Pause"),t())})}var f=new class{constructor(){let t,e=a.g("body").append("svg"),n=s()("svg").width(),r=s()("svg").height(),o=e.append("g"),i=e.append("g").attr("class","canvas"),l=e.append("g"),c=e.append("g"),d=n/50,p=r/50,h=a.f().domain([0,n]).range([0,n]).nice(),u=a.f().domain([0,r]).range([r,0]).nice(),f=(t,e)=>t.attr("transform",`translate(0,${r})`).call(a.b(e).ticks(d)).call(t=>t.select(".domain").attr("display","none")),g=(t,e)=>t.attr("transform","translate(0,0)").call(a.a(e).ticks(p)).call(t=>t.select(".domain").attr("display","none")),y=(t,e,o)=>t.attr("stroke","currentColor").attr("stroke-opacity",.1).call(t=>t.selectAll(".x").data(e.ticks(d)).join(t=>t.append("line").attr("class","x").attr("y2",r),t=>t,t=>t.remove()).attr("x1",t=>e(t)).attr("x2",t=>e(t))).call(t=>t.selectAll(".y").data(o.ticks(p)).join(t=>t.append("line").attr("class","y").attr("x2",n),t=>t,t=>t.remove()).attr("y1",t=>o(t)).attr("y2",t=>o(t))),v=!1,b=(t,e)=>{if(this.drawing||"fixed"==this.mode)return;v=!0;let n=this.invertTransX(),r=this.invertTransY(),o=[n(e.x),r(e.y)];a.g(t).data([o]);let s=a.g(t.parentNode);if(s.classed("polygon")){let t=s.selectAll(".polygon > circle").data();s.select("polyline").data([t.concat([t[0]])]),this.currentPolygon=t,this.removeShape("tri-lines"),this.removeShape("path-lines")}else if(s.classed("endpoint")){let t=this.canvas.selectAll(".endpoint > circle").data();this.currentEndpoints=t,this.removeShape("path-lines")}this.applyTransform()};this.zoom=a.h().scaleExtent([.2,50]).on("start",t=>{t.sourceEvent&&"wheel"!=t.sourceEvent.type&&e.attr("cursor","grab")}).on("zoom",({transform:t})=>{this.currentTransform=t,this.applyTransform();let e=this.transX(),n=this.transY();l.call(f,e),c.call(g,n),o.call(y,e,n)}).on("end",()=>e.attr("cursor","default")).filter(t=>"move"==this.mode||"fixed"==this.mode||"mouseup"!=t.type&&"mousedown"!=t.type),this.pointDragger=a.c().on("drag",(function(t){b(this,t)})).on("end",()=>v=!1),e.on("mouseup",e=>{if(v)return;switch(this.mode){case"draw-polygon":if(this.currentPolygon.length)return;break;case"draw-points":if(this.currentEndpoints.length)return;break;default:return}this.drawing=!0;let n=this.invertTransX(),r=this.invertTransY(),o=a.e(e),i=[n(o[0]),r(o[1])];if("draw-polygon"==this.mode)if(t=i,e.target.hasAttribute("is-handle")){if(this.currentDrawPoints.length<=2)return;this.removeShape("polygon-drawing");let t=s()("#pick-color").val()+"77";this.drawPolygon(this.currentDrawPoints,{color:t,vertexColor:"#FDBC07",fixed:!1}),this.currentDrawPoints=[],this.drawing=!1,this.mode="move"}else this.currentDrawPoints.push(i),this.removeShape("polygon-drawing"),this.drawPolygon(this.currentDrawPoints,{vertexColor:"yellow",close:!1});else"draw-points"==this.mode&&(this.currentDrawPoints.push(i),this.drawPoint(i,{fixed:!1},"endpoint"),2==this.currentDrawPoints.length&&(this.currentEndpoints=this.currentDrawPoints,this.onEndpointsDrawnCallback(this.currentEndpoints),this.currentDrawPoints=[],this.drawing=!1,this.mode="move"))}),e.on("mousemove",e=>{if(!this.drawing||"draw-polygon"!=this.mode)return;let n=this.invertTransX(),r=this.invertTransY(),o=a.e(e),s=[n(o[0]),r(o[1])],i=this.canvas.select("g.polygon-drawing");i.select("line").remove(),i.insert("line",":first-child").data([[t,s]]).attr("stroke","#53DBF3").attr("stroke-width",1),this.applyTransform()}),e.call(this.zoom),this.drawing=!1,this.currentDrawPoints=[],this.currentPolygon=[],this.currentEndpoints=[],this.polygonDrawnCallback=this.polygonDestroyedCallback=this.onEndpointsDrawnCallback=()=>{},this.mode="move",this.width=n,this.height=r,this.svg=e,this.canvas=i,this.currentTransform=a.i,this.xScale=h,this.yScale=u,this.autoScale([])}onPolygonDrawn(t){this.polygonDrawnCallback=t}onPolygonDestroyed(t){this.polygonDestroyedCallback=t}onEndpointsDrawn(t){this.onEndpointsDrawnCallback=t}clearCanvas(){this.drawing=!1,this.removeShape("polygon"),this.removeShape("endpoint"),this.polygonDestroyedCallback(this.currentPolygon),this.currentDrawPoints=[],this.currentPolygon=[],this.currentEndpoints=[]}clearAlgorithmResult(){this.removeShape("stepping"),this.removeShape("tri-lines"),this.removeShape("path-lines")}setMode(t){["move","draw-polygon","draw-points","fixed"].includes(t)&&(this.mode=t)}transX(){return this.currentTransform.rescaleX(this.xScale)}transY(){return this.currentTransform.rescaleY(this.yScale)}invertTransX(){return this.currentTransform.rescaleX(this.xScale).invert}invertTransY(){return this.currentTransform.rescaleY(this.yScale).invert}applyTransform(){let t=this.transX(),e=this.transY();this.canvas.selectAll("circle").attr("cx",e=>t(e[0])).attr("cy",t=>e(t[1])),this.canvas.selectAll("line").attr("x1",e=>t(e[0][0])).attr("y1",t=>e(t[0][1])).attr("x2",e=>t(e[1][0])).attr("y2",t=>e(t[1][1])),this.canvas.selectAll("polygon").attr("points",n=>n.map(n=>[t(n[0]),e(n[1])])),this.canvas.selectAll("polyline").attr("points",n=>n.map(n=>[t(n[0]),e(n[1])]))}autoScale(t){let[e,n]=a.d(t,t=>t[0]),[r,o]=a.d(t,t=>t[1]);t.length||(e=n=r=o=0);let s=.8*Math.min(Math.abs(this.width/(this.xScale(n-e+1)-this.xScale(0))),Math.abs(this.height/(this.yScale(o-r+1)-this.yScale(0))));s=Math.min(Math.max(s,.2),50);let i=(this.width-(this.xScale(e)+this.xScale(n))*s)/2,l=(this.height-(this.yScale(o)+this.yScale(r))*s)/2;this.currentTransform=a.i.translate(i,l).scale(s),this.svg.call(this.zoom.transform,this.currentTransform)}hasShape(t){return!this.canvas.selectAll("g."+t).empty()}removeShape(t){this.canvas.selectAll("g."+t).remove()}toggleShape(t){let e=this.canvas.selectAll("g."+t);e.attr("opacity",1-e.attr("opacity"))}setShapeStyle(t,e,n,r){console.log(this.canvas.selectAll("g."+t).selectAll(e)),this.canvas.selectAll("g."+t).selectAll(e).style(n,r)}drawPolygon(t,e,n=""){let r={...{color:"red",vertexColor:"#FDBC07",vertexSize:5,close:!0,fixed:!0},...e};r.close?n+="polygon-drawn":n+="polygon-drawing";let o=this.canvas.append("g").attr("class","polygon "+n);r.close?(o.append("polyline").data([t.concat([t[0]])]).style("fill",r.color).attr("stroke","#ccc"),this.currentPolygon=t):o.append("polyline").data([t]).style("fill","none").attr("stroke","#000");let s=o.selectAll("circle").data(t).join("circle").attr("r",r.vertexSize).attr("fill",r.vertexColor).attr("stroke","#000");r.close&&!r.fixed?s.style("cursor","move").call(this.pointDragger):r.close||s.attr("is-handle",!0).style("cursor","pointer"),this.applyTransform(),r.close&&this.polygonDrawnCallback(t)}drawPath(t,e,n=""){let r={color:"#000",dashed:!1,width:1,...e},o=this.canvas.select(".polygon").insert("g","circle").attr("opacity",1).attr("class",n).append("polyline").data([t]).style("fill","none").attr("stroke",r.color).attr("stroke-width",r.width);r.dashed&&o.style("stroke-dasharray","5 5"),this.applyTransform()}drawLines(t,e,n=""){let r={color:"#000",dashed:!1,width:1,...e},o=this.canvas.select(".polygon"),s=o.selectChild(".path-lines").empty()?"circle":".path-lines",a=o.insert("g",s).attr("opacity",1).attr("class",n).selectAll("line").data(t).join("line").attr("stroke",r.color).attr("stroke-width",r.width);r.dashed&&a.style("stroke-dasharray","5 5"),this.applyTransform()}drawPoint(t,e,n=""){let r={...{color:"#996f6e",size:5,fixed:!0},...e},o=this.canvas.append("g").attr("class",n).append("circle").data([t]).attr("r",r.size).attr("fill",r.color).attr("stroke","#000");r.fixed||o.style("cursor","move").call(this.pointDragger),this.applyTransform()}getCurrentPolygon(){return this.currentPolygon}getCurrentEndpoints(){return this.currentEndpoints}};function g(t){let e=s()("#alert");e.text(t),e.slideDown("slow",()=>setTimeout(()=>e.slideUp("slow"),1e3))}function y(){let t,e,n;for(;t=Math.floor(256*Math.random()),e=Math.floor(256*Math.random()),n=Math.floor(256*Math.random()),!(t+e+n<672););return`rgba(${t},${e},${n},0.5)`}function v(){return s()("#pick-color").val()+"77"}function b(t){return{growth:1e3,space:1e3,"2opt":200,permute:15}[t]}function w(){let t=s()("#file-opt")[0],e=new FileReader;e.readAsText(t.files[0]),e.onload=function(t){let e=t.target.result,n=[];for(let t of e.split("\n")){let e=t.trim().split(/\s+/);if(""!=e){if(2!=e.length)return void g("Invalid polygon file format!");{let t=[parseFloat(e[0]),parseFloat(e[1])];if(isNaN(t[0])||isNaN(t[1]))return void g("Invalid polygon file format!");n.push(t)}}}f.clearCanvas(),f.drawPolygon(n,{color:v(),vertexSize:3}),f.autoScale(n)},t.value=null}function m(){let t=f.getCurrentPolygon();r.x(t)||t.reverse();let e=t.map(t=>t.join(" ")).join("\n"),n=document.getElementById("export-link"),o=new Blob([e],{type:"text/plain"});n.href=URL.createObjectURL(o),n.download="polygon.pts",n.click()}function x(t,e){let n=f.getCurrentPolygon();if(!r.y(n))return void g("Not a simple polygon!");r.x(n)||n.reverse();let o=r.v(n,t,e,"mono_partition");if(null==o)return void g("Unreachable!");let s=Array.prototype.concat([t],o.map(t=>n[t]),[e]);f.drawPath(s,{color:"#2c507b"},"path-lines")}f.onPolygonDrawn(()=>{s()("#tri-btn").removeClass("disabled"),s()("#path-btn").removeClass("disabled"),s()("#export-btn").removeClass("disabled"),s()("#step-tri-btn").removeClass("disabled")}),f.onPolygonDestroyed(()=>{s()("#tri-btn").addClass("disabled"),s()("#path-btn").addClass("disabled"),s()("#export-btn").addClass("disabled"),s()("#step-tri-btn").addClass("disabled"),s()("#step-path-btn").addClass("disabled")}),f.onEndpointsDrawn(t=>{x(t[0],t[1]),s()("#step-path-btn").removeClass("disabled")}),s()(()=>{s()("#polygon-btn").on("change",()=>{switch(s()("#polygon-btn").val()){case"draw":s()("#color-opts").show(),s()("#clear-opts").show(),s()("#gen-opts").hide(),f.setMode("draw-polygon"),f.clearCanvas();break;case"random":s()("#color-opts").hide(),s()("#clear-opts").hide(),s()("#gen-opts").show(),f.setMode("move"),f.clearCanvas();break;case"load":s()("#color-opts").show(),s()("#clear-opts").hide(),s()("#gen-opts").hide(),f.setMode("move")}}),s()("#tri-btn").on("click",()=>{f.hasShape("tri-lines")?f.toggleShape("tri-lines"):function(){let t=f.getCurrentPolygon();if(!r.y(t))return void g("Not a simple polygon!");r.x(t)||t.reverse();let e=r.z(t,"mono_partition").map(e=>[t[e[0]],t[e[1]]]);f.drawLines(e,{color:"#9c3829"},"tri-lines")}()}),s()("#path-btn").on("click",()=>{if(f.hasShape("path-lines"))f.toggleShape("path-lines");else if(f.getCurrentEndpoints().length)x(f.getCurrentEndpoints()[0],f.getCurrentEndpoints()[1]);else{let t=f.getCurrentPolygon();r.y(t)?f.setMode("draw-points"):g("Not a simple polygon!")}}),s()("#load-btn").on("click",()=>document.getElementById("file-opt").click()),s()("#export-btn").on("click",m),s()("#file-opt").on("change",w),s()("#algo-btn").next().children().on("click",(function(t){let e=s()(t.target);s()("#algo-btn").val(e.val()).text(e.text())})),s()("#polygon-btn").next().find("li > button.switch-mode").on("click",(function(t){let e=s()(t.target);e.val()!=s()("#polygon-btn").val()&&s()("#polygon-btn").val(e.val()).text(e.text()).trigger("change")})),s()("#pick-color").on("change",()=>{f.setShapeStyle("polygon-drawn","polyline","fill",v())}),s()("#clear-btn").on("click",()=>{f.clearCanvas(),f.setMode("draw-polygon")}),s()("#gen-btn").on("click",()=>{!function(t,e){if(t<3)return void g(`Too few vertices for generation: ${t} < 3`);if(t>b(e))return void g(`Too many vertices for the ${s()("#algo-btn").text()} algorithm:             ${t} > ${b(e)}`);let n=r.w(t,100,e);console.log(t,e,n),f.clearCanvas(),f.drawPolygon(n,{color:y(),vertexSize:3}),f.autoScale(n)}(s()("#pick-size").val(),s()("#algo-btn").val())}),u()})},2:function(t,e,n){"use strict";(function(t){n.d(e,"w",(function(){return m})),n.d(e,"x",(function(){return C})),n.d(e,"y",(function(){return S})),n.d(e,"z",(function(){return P})),n.d(e,"v",(function(){return D})),n.d(e,"a",(function(){return T})),n.d(e,"r",(function(){return A})),n.d(e,"q",(function(){return E})),n.d(e,"l",(function(){return M})),n.d(e,"t",(function(){return N})),n.d(e,"n",(function(){return j})),n.d(e,"k",(function(){return X})),n.d(e,"c",(function(){return Y})),n.d(e,"g",(function(){return U})),n.d(e,"p",(function(){return $})),n.d(e,"d",(function(){return B})),n.d(e,"e",(function(){return F})),n.d(e,"j",(function(){return I})),n.d(e,"b",(function(){return L})),n.d(e,"f",(function(){return R})),n.d(e,"h",(function(){return _})),n.d(e,"m",(function(){return q})),n.d(e,"i",(function(){return J})),n.d(e,"o",(function(){return O})),n.d(e,"u",(function(){return V})),n.d(e,"s",(function(){return G}));var r=n(96);const o=new Array(32).fill(void 0);function s(t){return o[t]}o.push(void 0,null,!0,!1);let a=0,i=null;function l(){return null!==i&&i.buffer===r.i.buffer||(i=new Uint8Array(r.i.buffer)),i}let c=new("undefined"==typeof TextEncoder?(0,t.require)("util").TextEncoder:TextEncoder)("utf-8");const d="function"==typeof c.encodeInto?function(t,e){return c.encodeInto(t,e)}:function(t,e){const n=c.encode(t);return e.set(n),{read:t.length,written:n.length}};function p(t,e,n){if(void 0===n){const n=c.encode(t),r=e(n.length);return l().subarray(r,r+n.length).set(n),a=n.length,r}let r=t.length,o=e(r);const s=l();let i=0;for(;i<r;i++){const e=t.charCodeAt(i);if(e>127)break;s[o+i]=e}if(i!==r){0!==i&&(t=t.slice(i)),o=n(o,r,r=i+3*t.length);const e=l().subarray(o+i,o+r);i+=d(t,e).written}return a=i,o}let h=null;function u(){return null!==h&&h.buffer===r.i.buffer||(h=new Int32Array(r.i.buffer)),h}let f=new("undefined"==typeof TextDecoder?(0,t.require)("util").TextDecoder:TextDecoder)("utf-8",{ignoreBOM:!0,fatal:!0});function g(t,e){return f.decode(l().subarray(t,t+e))}f.decode();let y=o.length;function v(t){y===o.length&&o.push(o.length+1);const e=y;return y=o[e],o[e]=t,e}function b(t){const e=s(t);return function(t){t<36||(o[t]=y,y=t)}(t),e}function w(t){return null==t}function m(t,e,n){var o=w(n)?0:p(n,r.b,r.c),s=a;return b(r.e(t,e,o,s))}let x=32;function k(t){if(1==x)throw new Error("out of js stack");return o[--x]=t,x}function C(t){try{return 0!==r.g(k(t))}finally{o[x++]=void 0}}function S(t){try{return 0!==r.h(k(t))}finally{o[x++]=void 0}}function P(t,e){try{var n=w(e)?0:p(e,r.b,r.c),s=a;return b(r.j(k(t),n,s))}finally{o[x++]=void 0}}function D(t,e,n,s,i){try{var l=w(s)?0:p(s,r.b,r.c),c=a;return b(r.d(k(t),k(e),k(n),l,c,w(i)?16777215:i?1:0))}finally{o[x++]=void 0,o[x++]=void 0,o[x++]=void 0}}const T=function(t,e){alert(g(t,e))},A=function(t,e){const n=s(e);var o=p(JSON.stringify(void 0===n?null:n),r.b,r.c),i=a;u()[t/4+1]=i,u()[t/4+0]=o},E=function(t,e){return v(JSON.parse(g(t,e)))},M=(z=function(){return v(self.self)},function(){try{return z.apply(this,arguments)}catch(t){r.a(v(t))}});var z;const N=function(t){b(t)},j=function(){return v(t)},X=function(t,e,n){return v(s(t).require(g(e,n)))},Y=function(t){return v(s(t).crypto)},U=function(t){return v(s(t).msCrypto)},$=function(t){return void 0===s(t)},B=function(t){return v(s(t).getRandomValues)},F=function(t,e){s(t).getRandomValues(s(e))},I=function(t,e,n){var r,o;s(t).randomFillSync((r=e,o=n,l().subarray(r/1,r/1+o)))},L=function(t){return v(s(t).buffer)},R=function(t){return s(t).length},_=function(t){return v(new Uint8Array(s(t)))},q=function(t,e,n){s(t).set(s(e),n>>>0)},J=function(t){return v(new Uint8Array(t>>>0))},O=function(t,e,n){return v(s(t).subarray(e>>>0,n>>>0))},V=function(t,e){throw new Error(g(t,e))},G=function(){return v(r.i)}}).call(this,n(95)(t))},96:function(t,e,n){"use strict";var r=n.w[t.i];t.exports=r;n(2);r.k()}}]);