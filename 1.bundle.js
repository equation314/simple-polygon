(window.webpackJsonp=window.webpackJsonp||[]).push([[1],{1:function(t,e,n){"use strict";n.r(e),n.d(e,"gLastRandomPolygonState",(function(){return v})),n.d(e,"draw",(function(){return b})),n.d(e,"showError",(function(){return m})),n.d(e,"checkSimplePolygon",(function(){return x}));var r=n(2),o=n(11),l=n.n(o),i=n(96);var a="shortest",s=null,c=0,p=0,d=!1,h=void 0,u=[];function g(t){if("2opt"==a){let e=s.steps[t-t%2].poly;if(b.removeShape("stepping"),b.drawPolygon(e,{color:h,vertexSize:e.length>200?0:2},"stepping step-polygon"),t%2==1){let e=s.steps[t];b.drawLines([e.e0,e.e1],{color:"#9c3829"},"stepping step-edges"),b.drawLines([[e.e0[0],e.e1[0]],[e.e0[1],e.e1[1]]],{color:"#9c3829",dashed:!0},"stepping step-edges");for(let t=0;t<2;t++)b.drawPoint(e.e0[t],{color:"#FDBC07",size:4},"stepping step-point"),b.drawPoint(e.e1[t],{color:"#FDBC07",size:4},"stepping step-point")}}else if("path"==a){0==t?(b.removeShape("stepping"),b.drawLines(s.sleeve_diagonals,{color:"#ce6a5b"},"stepping all-steps"),b.drawLines(s.sleeve_boundary,{color:"#777"},"stepping all-steps")):b.removeShape("one-step");let e=s.steps[t];b.drawPath(e.left_chain,{color:"#000",width:2},"stepping one-step"),b.drawPath(e.right_chain,{color:"#000",width:2},"stepping one-step"),b.drawPath(e.path,{color:"#2c507b",width:2},"stepping one-step"),b.drawPoint(e.cusp,{color:"green"},"stepping one-step"),b.drawPoint(e.current,{color:"red"},"stepping one-step"),null!=e.tangent&&b.drawLines([[e.tangent,e.current]],{color:"#2c507b",dashed:!0,width:2},"stepping one-step")}}function f(){l()("#step-btn").next().find("li > button").on("click",(function(t){(function(t){if(c=0,a=t,"2opt"==t){let[e,n,o]=v;return null!=(s=r.w(e,n,t,o,!0))&&(p=s.steps.length-1,u=b.getCurrentPolygon(),h=b.getShapeStyle("polyline","polygon","fill"),b.removeShape("polygon"),console.log(t,p,h,s),b.clearAlgorithmResult(),g(0),!0)}if("path"==t){let e=b.getCurrentPolygon();if(!x(e))return;let[n,o]=b.getCurrentEndpoints();return null==(s=r.v(e,n,o,"mono_partition",!0))?(m("Unreachable!"),!1):(p=s.steps.length-1,console.log(t,p,s),b.clearAlgorithmResult(),g(0),!0)}if("tri"==t)return!1})(l()(t.target).val())&&(l()("#polygon-btn").prop("disabled",!0),l()("#tri-btn").prop("disabled",!0),l()("#path-btn").prop("disabled",!0),l()("#color-opts").hide(),l()("#clear-opts").hide(),l()("#gen-opts").hide(),l()("#step-opts").show(),l()("#step-prev-btn").prop("disabled",!0),l()("#step-next-btn").prop("disabled",!1),l()("#step-btn-div").hide(),l()("#stop-btn-div").show(),b.setMode("fixed"))})),l()("#stop-btn").on("click",()=>{switch(d=!1,l()("#polygon-btn").prop("disabled",!1),l()("#tri-btn").prop("disabled",!1),l()("#path-btn").prop("disabled",!1),l()("#step-opts").hide(),l()("#stop-btn-div").hide(),l()("#step-btn-div").show(),l()("#polygon-btn").val()){case"draw":l()("#color-opts").show(),l()("#clear-opts").show();break;case"random":l()("#gen-opts").show();break;case"load":l()("#color-opts").show()}b.removeShape("stepping"),b.setMode("move"),["2opt","space"].includes(a)&&b.drawPolygon(u,{color:h,vertexSize:u.length>200?0:2})}),l()("#step-first-btn").on("click",()=>{g(c=0),l()("#step-prev-btn").prop("disabled",!0),l()("#step-next-btn").prop("disabled",!1)}),l()("#step-last-btn").on("click",()=>{g(c=p),l()("#step-prev-btn").prop("disabled",!1),l()("#step-next-btn").prop("disabled",!0)}),l()("#step-prev-btn").on("click",()=>{0!=c&&(0==--c&&l()("#step-prev-btn").prop("disabled",!0),l()("#step-next-btn").prop("disabled",!1),g(c))}),l()("#step-next-btn").on("click",()=>{c>=p||(++c==p&&l()("#step-next-btn").prop("disabled",!0),l()("#step-prev-btn").prop("disabled",!1),g(c))});let t=()=>{d&&c<p?(l()("#step-next-btn").trigger("click"),setTimeout(t,100)):(d=!1,l()("#step-play-btn").text("Play"))};l()("#step-play-btn").on("click",()=>{d?(d=!1,l()("#step-play-btn").text("Play")):(d=!0,l()("#step-play-btn").text("Pause"),t())})}var y=void 0,v=void 0,b=new class{constructor(){let t,e=i.h("body").append("svg"),n=l()("svg").width(),r=l()("svg").height(),o=e.append("g"),a=e.append("g").attr("class","canvas"),s=e.append("g"),c=e.append("g"),p=n/50,d=r/50,h=i.g().domain([0,n]).range([0,n]).nice(),u=i.g().domain([0,r]).range([r,0]).nice(),g=(t,e)=>t.attr("transform",`translate(0,${r})`).call(i.b(e).ticks(p)).call(t=>t.select(".domain").attr("display","none")),f=(t,e)=>t.attr("transform","translate(0,0)").call(i.a(e).ticks(d)).call(t=>t.select(".domain").attr("display","none")),y=(t,e,o)=>t.attr("stroke","currentColor").attr("stroke-opacity",.1).call(t=>t.selectAll(".x").data(e.ticks(p)).join(t=>t.append("line").attr("class","x").attr("y2",r),t=>t,t=>t.remove()).attr("x1",t=>e(t)).attr("x2",t=>e(t))).call(t=>t.selectAll(".y").data(o.ticks(d)).join(t=>t.append("line").attr("class","y").attr("x2",n),t=>t,t=>t.remove()).attr("y1",t=>o(t)).attr("y2",t=>o(t))),v=!1,b=(t,e)=>{if(this.drawing||"fixed"==this.mode)return;v=!0;let n=this.invertTransX(),r=this.invertTransY(),o=[n(e.x),r(e.y)];i.h(t).data([o]);let l=i.h(t.parentNode);if(l.classed("polygon")){this.removeShape("tri-lines"),this.removeShape("path-lines");let t=l.selectAll(".polygon > circle").data();l.select("polyline").data([t.concat([t[0]])]),this.currentPolygon=t,this.polygonUpdatedCallback(t),this.applyTransform(["circle","polyline"])}else if(l.classed("endpoint")){this.removeShape("path-lines");let t=this.canvas.selectAll(".endpoint > circle").data();this.currentEndpoints=t,this.applyTransform(["circle"])}};this.zoom=i.i().scaleExtent([.1,70]).on("start",t=>{t.sourceEvent&&"wheel"!=t.sourceEvent.type&&e.attr("cursor","grab")}).on("zoom",({transform:t})=>{this.currentTransform=t,this.applyTransform();let e=this.transX(),n=this.transY();s.call(g,e),c.call(f,n),o.call(y,e,n)}).on("end",()=>e.attr("cursor","default")).filter(t=>"move"==this.mode||"fixed"==this.mode||"mouseup"!=t.type&&"mousedown"!=t.type),this.pointDragger=i.c().on("drag",(function(t){b(this,t)})).on("end",()=>v=!1),e.on("mouseup",e=>{if(v)return;switch(this.mode){case"draw-polygon":if(this.currentPolygon.length)return;break;case"draw-points":if(this.currentEndpoints.length)return;break;default:return}this.drawing=!0;let n=this.invertTransX(),r=this.invertTransY(),o=i.f(e),a=[n(o[0]),r(o[1])];if("draw-polygon"==this.mode)if(t=a,e.target.hasAttribute("is-handle")){if(this.currentDrawPoints.length<=2)return;this.removeShape("polygon-drawing");let t=l()("#pick-color").val()+"77";this.drawPolygon(this.currentDrawPoints,{color:t,vertexColor:"#FDBC07",fixed:!1}),this.polygonDrawnCallback(this.currentDrawPoints),this.currentDrawPoints=[],this.drawing=!1,this.mode="move"}else this.currentDrawPoints.push(a),this.removeShape("polygon-drawing"),this.drawPolygon(this.currentDrawPoints,{vertexColor:"yellow",close:!1});else"draw-points"==this.mode&&(this.currentDrawPoints.push(a),this.drawPoint(a,{fixed:!1},"endpoint"),2==this.currentDrawPoints.length&&(this.currentEndpoints=this.currentDrawPoints,this.endpointsDrawnCallback(this.currentEndpoints),this.currentDrawPoints=[],this.drawing=!1,this.mode="move"))}),e.on("mousemove",e=>{if(!this.drawing||"draw-polygon"!=this.mode)return;let n=this.invertTransX(),r=this.invertTransY(),o=i.f(e),l=[n(o[0]),r(o[1])],a=this.canvas.select("g.polygon-drawing");a.select("line").remove(),a.insert("line",":first-child").data([[t,l]]).attr("stroke","#53DBF3").attr("stroke-width",1),this.applyTransform(["line"])}),e.call(this.zoom),this.drawing=!1,this.currentDrawPoints=[],this.currentPolygon=[],this.currentEndpoints=[],this.polygonDrawnCallback=this.polygonClearCallback=this.polygonUpdatedCallback=this.endpointsDrawnCallback=()=>{},this.mode="move",this.width=n,this.height=r,this.svg=e,this.canvas=a,this.currentTransform=i.j,this.xScale=h,this.yScale=u,this.autoScale([])}onPolygonDrawn(t){this.polygonDrawnCallback=t}onPolygonClear(t){this.polygonClearCallback=t}onPolygonUpdated(t){this.polygonUpdatedCallback=t}onEndpointsDrawn(t){this.endpointsDrawnCallback=t}clearCanvas(){this.drawing=!1,this.removeShape("polygon"),this.removeShape("endpoint"),this.polygonClearCallback(this.currentPolygon),this.currentDrawPoints=[],this.currentPolygon=[],this.currentEndpoints=[]}clearAlgorithmResult(){this.removeShape("stepping"),this.removeShape("tri-lines"),this.removeShape("path-lines")}setMode(t){["move","draw-polygon","draw-points","fixed"].includes(t)&&(this.mode=t)}transX(){return this.currentTransform.rescaleX(this.xScale)}transY(){return this.currentTransform.rescaleY(this.yScale)}invertTransX(){return this.currentTransform.rescaleX(this.xScale).invert}invertTransY(){return this.currentTransform.rescaleY(this.yScale).invert}applyTransform(t){let e=this.transX(),n=this.transY();(null==t||t.includes("circle"))&&this.canvas.selectAll("circle").attr("cx",t=>e(t[0])).attr("cy",t=>n(t[1])),(null==t||t.includes("line"))&&this.canvas.selectAll("line").attr("x1",t=>e(t[0][0])).attr("y1",t=>n(t[0][1])).attr("x2",t=>e(t[1][0])).attr("y2",t=>n(t[1][1])),(null==t||t.includes("polygon"))&&this.canvas.selectAll("polygon").attr("points",t=>t.map(t=>[e(t[0]),n(t[1])])),(null==t||t.includes("polyline"))&&this.canvas.selectAll("polyline").attr("points",t=>t.map(t=>[e(t[0]),n(t[1])])),(null==t||t.includes("path"))&&this.canvas.selectAll("path").attr("d",t=>{let r=i.e();for(let[o,l]of t)r.moveTo(e(o[0]),n(o[1])),r.lineTo(e(l[0]),n(l[1]));return r.closePath(),r})}autoScale(t){let[e,n]=i.d(t,t=>t[0]),[r,o]=i.d(t,t=>t[1]);t.length||(e=n=r=o=0);let l=.8*Math.min(Math.abs(this.width/(this.xScale(n-e+1)-this.xScale(0))),Math.abs(this.height/(this.yScale(o-r+1)-this.yScale(0))));l=Math.min(Math.max(l,.1),70);let a=(this.width-(this.xScale(e)+this.xScale(n))*l)/2,s=(this.height-(this.yScale(o)+this.yScale(r))*l)/2;this.currentTransform=i.j.translate(a,s).scale(l),this.svg.call(this.zoom.transform,this.currentTransform)}hasShape(t){return!this.canvas.selectAll("g."+t).empty()}removeShape(t){this.canvas.selectAll("g."+t).remove()}toggleShape(t){let e=this.canvas.selectAll("g."+t);e.attr("opacity",1-e.attr("opacity"))}getShapeStyle(t,e,n){return this.canvas.selectAll(`${t}.${e}`).style(n)}setShapeStyle(t,e,n,r){this.canvas.selectAll(`${t}.${e}`).style(n,r)}drawPolygon(t,e,n=""){let r={...{color:"red",vertexColor:"#FDBC07",vertexSize:5,close:!0,fixed:!0},...e};r.close?n+=" polygon-drawn":n+=" polygon-drawing",n+=" polygon";let o=this.canvas.append("g").attr("opacity",1).attr("class",n);if(r.close?(o.append("polyline").data([t.concat([t[0]])]).attr("class",n).style("fill",r.color).attr("stroke","#ccc"),this.currentPolygon=t):o.append("polyline").data([t]).attr("class",n).style("fill","none").attr("stroke","#000"),r.vertexSize>0){let e=o.selectAll("circle").data(t).join("circle").attr("class",n).attr("r",r.vertexSize).attr("fill",r.vertexColor).attr("stroke","#000");r.close&&!r.fixed?e.style("cursor","move").call(this.pointDragger):r.close||e.attr("is-handle",!0).style("cursor","pointer")}this.applyTransform(["polyline","circle"])}drawPath(t,e,n=""){let r={color:"#000",dashed:!1,width:1,...e},o=this.canvas.select(".polygon").insert("g","circle").attr("opacity",1).attr("class",n).append("polyline").data([t]).style("fill","none").attr("class",n).attr("stroke",r.color).attr("stroke-width",r.width);r.dashed&&o.style("stroke-dasharray","5 5"),this.applyTransform(["polyline"])}drawLines(t,e,n=""){let r={color:"#000",dashed:!1,width:1,...e},o=this.canvas.select(".polygon"),l=o.selectChild(".path-lines").empty()?"circle":".path-lines",i=o.insert("g",l).attr("opacity",1).attr("class",n).append("path").data([t]).attr("class",n).attr("stroke",r.color).attr("stroke-width",r.width);r.dashed&&i.style("stroke-dasharray","5 5"),this.applyTransform(["path"])}drawPoint(t,e,n=""){let r={...{color:"#996f6e",size:5,fixed:!0},...e},o=this.canvas.append("g").attr("class",n).append("circle").data([t]).attr("class",n).attr("r",r.size).attr("fill",r.color).attr("stroke","#000");r.fixed||o.style("cursor","move").call(this.pointDragger),this.applyTransform(["circle"])}getCurrentPolygon(){return this.currentPolygon}getCurrentEndpoints(){return this.currentEndpoints}};function w(){l()("#tri-btn").prop("disabled",!1),l()("#path-btn").prop("disabled",!1),l()("#export-btn").prop("disabled",!1)}function m(t){let e=l()("#alert");e.text(t),e.slideDown("slow",()=>setTimeout(()=>e.slideUp("slow"),1e3))}function x(t){return void 0===y&&(y=t.length>2e3||r.y(t)),!1===y?(m("Not a simple polygon!"),!1):(r.x(t)||t.reverse(),!0)}function k(){let t,e,n;for(;t=Math.floor(256*Math.random()),e=Math.floor(256*Math.random()),n=Math.floor(256*Math.random()),!(t+e+n<672););return`rgba(${t},${e},${n},0.5)`}function S(){return l()("#pick-color").val()+"77"}function P(t){return{"2opt":2e3,growth:2e3,space:5e4,permute:15}[t]}function C(){let t=l()("#file-opt")[0],e=new FileReader;e.readAsText(t.files[0]),e.onload=function(t){let e=t.target.result,n=[];for(let t of e.split("\n")){let e=t.trim().split(/\s+/);if(""!=e){if(2!=e.length)return void m("Invalid polygon file format!");{let t=[parseFloat(e[0]),parseFloat(e[1])];if(isNaN(t[0])||isNaN(t[1]))return void m("Invalid polygon file format!");n.push(t)}}}b.clearCanvas(),b.drawPolygon(n,{color:S(),vertexSize:n.length>200?0:2}),b.autoScale(n),w()},t.value=null}function T(){let t=b.getCurrentPolygon();r.x(t)||t.reverse();let e=t.map(t=>t.join(" ")).join("\n"),n=document.getElementById("export-link"),o=new Blob([e],{type:"text/plain"});n.href=URL.createObjectURL(o),n.download="polygon.pts",n.click()}function D(t,e){let n=b.getCurrentPolygon();if(!x(n))return;let o=r.v(n,t,e,"mono_partition");if(null==o)return void m("Unreachable!");let l=Array.prototype.concat([t],o.map(t=>n[t]),[e]);b.drawPath(l,{color:"#2c507b"},"path-lines")}b.onPolygonDrawn(w),b.onPolygonClear((function(){y=void 0,l()("#tri-btn").prop("disabled",!0),l()("#path-btn").prop("disabled",!0),l()("#export-btn").prop("disabled",!0),l()("#step-tri-btn").prop("disabled",!0),l()("#step-path-btn").prop("disabled",!0)})),b.onPolygonUpdated(()=>y=void 0),b.onEndpointsDrawn(t=>{D(t[0],t[1]),l()("#step-path-btn").prop("disabled",!1)}),l()(()=>{l()("#polygon-btn").on("change",()=>{switch(l()("#polygon-btn").val()){case"draw":l()("#color-opts").show(),l()("#clear-opts").show(),l()("#gen-opts").hide(),l()("#step-gen-btn").prop("disabled",!0),b.setMode("draw-polygon"),b.clearCanvas();break;case"random":l()("#color-opts").hide(),l()("#clear-opts").hide(),l()("#gen-opts").show(),b.setMode("move"),b.clearCanvas();break;case"load":l()("#color-opts").show(),l()("#clear-opts").hide(),l()("#gen-opts").hide(),l()("#step-gen-btn").prop("disabled",!0),b.setMode("move")}}),l()("#tri-btn").on("click",()=>{b.hasShape("tri-lines")?b.getCurrentPolygon().length>2e3?b.removeShape("tri-lines"):b.toggleShape("tri-lines"):function(){let t=b.getCurrentPolygon();if(!x(t))return;let e=r.z(t,"mono_partition").map(e=>[t[e[0]],t[e[1]]]);b.drawLines(e,{color:"#9c3829"},"tri-lines")}()}),l()("#path-btn").on("click",()=>{if(b.hasShape("path-lines"))b.toggleShape("path-lines");else if(b.getCurrentEndpoints().length)D(b.getCurrentEndpoints()[0],b.getCurrentEndpoints()[1]);else{let t=b.getCurrentPolygon();t.length<=2e3&&!r.y(t)?m("Not a simple polygon!"):b.setMode("draw-points")}}),l()("#load-btn").on("click",()=>document.getElementById("file-opt").click()),l()("#export-btn").on("click",T),l()("#file-opt").on("change",C),l()("#algo-btn").next().children().on("click",(function(t){let e=l()(t.target);l()("#algo-btn").val(e.val()).text(e.text()),l()("#pick-size").val()>P(e.val())&&l()("#pick-size").val(P(e.val()))})),l()("#polygon-btn").next().find("li > button.switch-mode").on("click",(function(t){let e=l()(t.target);e.val()!=l()("#polygon-btn").val()&&l()("#polygon-btn").val(e.val()).text(e.text()).trigger("change")})),l()("#pick-color").on("change",()=>{b.setShapeStyle("polyline","polygon-drawn","fill",S())}),l()("#clear-btn").on("click",()=>{b.clearCanvas(),b.setMode("draw-polygon")}),l()("#gen-btn").on("click",()=>{let t=l()("#pick-size").val(),e=l()("#algo-btn").val();!function(t,e){if(t<3)return void m(`Too few vertices for generation: ${t} < 3`);if(t>P(e))return void m(`Too many vertices for the ${l()("#algo-btn").text()} algorithm:             ${t} > ${P(e)}`);let n=Math.floor(4294967295*Math.random()),o=t<=100?100:t<=2e3?1e3:1e4;v=[t,o,n];let i=r.w(t,o,e,n);b.clearCanvas(),b.drawPolygon(i,{color:k(),vertexSize:t>200?0:2}),b.autoScale(i),w()}(t,e);let n=!0;"2opt"==e&&(n=t>500),l()("#step-gen-btn").val(e).text(l()("#algo-btn").text()).prop("disabled",n)}),f()})},2:function(t,e,n){"use strict";(function(t){n.d(e,"w",(function(){return m})),n.d(e,"x",(function(){return S})),n.d(e,"y",(function(){return P})),n.d(e,"z",(function(){return C})),n.d(e,"v",(function(){return T})),n.d(e,"a",(function(){return A})),n.d(e,"r",(function(){return E})),n.d(e,"q",(function(){return M})),n.d(e,"l",(function(){return z})),n.d(e,"t",(function(){return U})),n.d(e,"n",(function(){return $})),n.d(e,"k",(function(){return j})),n.d(e,"c",(function(){return L})),n.d(e,"g",(function(){return B})),n.d(e,"p",(function(){return F})),n.d(e,"d",(function(){return N})),n.d(e,"e",(function(){return R})),n.d(e,"j",(function(){return X})),n.d(e,"b",(function(){return Y})),n.d(e,"f",(function(){return I})),n.d(e,"h",(function(){return _})),n.d(e,"m",(function(){return q})),n.d(e,"i",(function(){return J})),n.d(e,"o",(function(){return O})),n.d(e,"u",(function(){return V})),n.d(e,"s",(function(){return G}));var r=n(95);const o=new Array(32).fill(void 0);function l(t){return o[t]}o.push(void 0,null,!0,!1);let i=0,a=null;function s(){return null!==a&&a.buffer===r.i.buffer||(a=new Uint8Array(r.i.buffer)),a}let c=new("undefined"==typeof TextEncoder?(0,t.require)("util").TextEncoder:TextEncoder)("utf-8");const p="function"==typeof c.encodeInto?function(t,e){return c.encodeInto(t,e)}:function(t,e){const n=c.encode(t);return e.set(n),{read:t.length,written:n.length}};function d(t,e,n){if(void 0===n){const n=c.encode(t),r=e(n.length);return s().subarray(r,r+n.length).set(n),i=n.length,r}let r=t.length,o=e(r);const l=s();let a=0;for(;a<r;a++){const e=t.charCodeAt(a);if(e>127)break;l[o+a]=e}if(a!==r){0!==a&&(t=t.slice(a)),o=n(o,r,r=a+3*t.length);const e=s().subarray(o+a,o+r);a+=p(t,e).written}return i=a,o}let h=null;function u(){return null!==h&&h.buffer===r.i.buffer||(h=new Int32Array(r.i.buffer)),h}let g=new("undefined"==typeof TextDecoder?(0,t.require)("util").TextDecoder:TextDecoder)("utf-8",{ignoreBOM:!0,fatal:!0});function f(t,e){return g.decode(s().subarray(t,t+e))}g.decode();let y=o.length;function v(t){y===o.length&&o.push(o.length+1);const e=y;return y=o[e],o[e]=t,e}function b(t){const e=l(t);return function(t){t<36||(o[t]=y,y=t)}(t),e}function w(t){return null==t}function m(t,e,n,o,l){var a=w(n)?0:d(n,r.b,r.c),s=i;return b(r.e(t,e,a,s,!w(o),w(o)?0:o,w(l)?16777215:l?1:0))}let x=32;function k(t){if(1==x)throw new Error("out of js stack");return o[--x]=t,x}function S(t){try{return 0!==r.g(k(t))}finally{o[x++]=void 0}}function P(t){try{return 0!==r.h(k(t))}finally{o[x++]=void 0}}function C(t,e){try{var n=w(e)?0:d(e,r.b,r.c),l=i;return b(r.j(k(t),n,l))}finally{o[x++]=void 0}}function T(t,e,n,l,a){try{var s=w(l)?0:d(l,r.b,r.c),c=i;return b(r.d(k(t),k(e),k(n),s,c,w(a)?16777215:a?1:0))}finally{o[x++]=void 0,o[x++]=void 0,o[x++]=void 0}}function D(t,e){try{return t.apply(this,e)}catch(t){r.a(v(t))}}function A(t,e){alert(f(t,e))}function E(t,e){const n=l(e);var o=d(JSON.stringify(void 0===n?null:n),r.b,r.c),a=i;u()[t/4+1]=a,u()[t/4+0]=o}function M(t,e){return v(JSON.parse(f(t,e)))}function z(){return D((function(){return v(self.self)}),arguments)}function U(t){b(t)}function $(){return v(t)}function j(t,e,n){return v(l(t).require(f(e,n)))}function L(t){return v(l(t).crypto)}function B(t){return v(l(t).msCrypto)}function F(t){return void 0===l(t)}function N(t){return v(l(t).getRandomValues)}function R(t,e){l(t).getRandomValues(l(e))}function X(t,e,n){var r,o;l(t).randomFillSync((r=e,o=n,s().subarray(r/1,r/1+o)))}function Y(t){return v(l(t).buffer)}function I(t){return l(t).length}function _(t){return v(new Uint8Array(l(t)))}function q(t,e,n){l(t).set(l(e),n>>>0)}function J(t){return v(new Uint8Array(t>>>0))}function O(t,e,n){return v(l(t).subarray(e>>>0,n>>>0))}function V(t,e){throw new Error(f(t,e))}function G(){return v(r.i)}}).call(this,n(94)(t))},95:function(t,e,n){"use strict";var r=n.w[t.i];t.exports=r;n(2);r.k()}}]);