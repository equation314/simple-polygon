(window.webpackJsonp=window.webpackJsonp||[]).push([[1],{1:function(t,e,n){"use strict";n.r(e),n.d(e,"draw",(function(){return g})),n.d(e,"showError",(function(){return y})),n.d(e,"checkSimplePolygon",(function(){return v}));var r=n(2),o=n(11),i=n.n(o),a=n(97);var s="shortest",l=null,c=0,p=0,d=!1;function h(t){if("path"==s){0==t?(g.removeShape("stepping"),g.drawLines(l.sleeve_diagonals,{color:"#ce6a5b"},"stepping all-steps"),g.drawLines(l.sleeve_boundary,{color:"#777"},"stepping all-steps")):g.removeShape("one-step");let e=l.steps[t];g.drawPath(e.left_chain,{color:"#000",width:2},"stepping one-step"),g.drawPath(e.right_chain,{color:"#000",width:2},"stepping one-step"),g.drawPath(e.path,{color:"#2c507b",width:2},"stepping one-step"),g.drawPoint(e.cusp,{color:"green"},"stepping one-step"),g.drawPoint(e.current,{color:"red"},"stepping one-step"),null!=e.tangent&&g.drawLines([[e.tangent,e.current]],{color:"#2c507b",dashed:!0,width:2},"stepping one-step")}}function u(){i()("#step-btn").next().find("li > button").on("click",(function(t){(function(t){let e=g.getCurrentPolygon();if(v(e),s=t,"path"==t){let[n,o]=g.getCurrentEndpoints();return null==(l=r.v(e,n,o,"mono_partition",!0))?(y("Unreachable!"),!1):(c=0,p=l.steps.length-1,console.log(t,p,l),g.clearAlgorithmResult(),h(0),!0)}if("tri"==t)return!1})(i()(t.target).val())&&(i()("#polygon-btn").prop("disabled",!0),i()("#tri-btn").prop("disabled",!0),i()("#path-btn").prop("disabled",!0),i()("#color-opts").hide(),i()("#clear-opts").hide(),i()("#gen-opts").hide(),i()("#step-opts").show(),i()("#step-prev-btn").prop("disabled",!0),i()("#step-next-btn").prop("disabled",!1),i()("#step-btn-div").hide(),i()("#stop-btn-div").show(),g.setMode("fixed"))})),i()("#stop-btn").on("click",()=>{switch(d=!1,i()("#polygon-btn").prop("disabled",!1),i()("#tri-btn").prop("disabled",!1),i()("#path-btn").prop("disabled",!1),i()("#step-opts").hide(),i()("#stop-btn-div").hide(),i()("#step-btn-div").show(),i()("#polygon-btn").val()){case"draw":i()("#color-opts").show(),i()("#clear-opts").show();break;case"random":i()("#gen-opts").show();break;case"load":i()("#color-opts").show()}g.removeShape("stepping"),g.setMode("move")}),i()("#step-first-btn").on("click",()=>{h(c=0),i()("#step-prev-btn").prop("disabled",!0),i()("#step-next-btn").prop("disabled",!1)}),i()("#step-last-btn").on("click",()=>{h(c=p),i()("#step-prev-btn").prop("disabled",!1),i()("#step-next-btn").prop("disabled",!0)}),i()("#step-prev-btn").on("click",()=>{0!=c&&(0==--c&&i()("#step-prev-btn").prop("disabled",!0),i()("#step-next-btn").prop("disabled",!1),h(c))}),i()("#step-next-btn").on("click",()=>{c>=p||(++c==p&&i()("#step-next-btn").prop("disabled",!0),i()("#step-prev-btn").prop("disabled",!1),h(c))});let t=()=>{d&&c<p?(i()("#step-next-btn").trigger("click"),setTimeout(t,100)):(d=!1,i()("#step-play-btn").text("Play"))};i()("#step-play-btn").on("click",()=>{d?(d=!1,i()("#step-play-btn").text("Play")):(d=!0,i()("#step-play-btn").text("Pause"),t())})}var f=void 0,g=new class{constructor(){let t,e=a.g("body").append("svg"),n=i()("svg").width(),r=i()("svg").height(),o=e.append("g"),s=e.append("g").attr("class","canvas"),l=e.append("g"),c=e.append("g"),p=n/50,d=r/50,h=a.f().domain([0,n]).range([0,n]).nice(),u=a.f().domain([0,r]).range([r,0]).nice(),f=(t,e)=>t.attr("transform",`translate(0,${r})`).call(a.b(e).ticks(p)).call(t=>t.select(".domain").attr("display","none")),g=(t,e)=>t.attr("transform","translate(0,0)").call(a.a(e).ticks(d)).call(t=>t.select(".domain").attr("display","none")),y=(t,e,o)=>t.attr("stroke","currentColor").attr("stroke-opacity",.1).call(t=>t.selectAll(".x").data(e.ticks(p)).join(t=>t.append("line").attr("class","x").attr("y2",r),t=>t,t=>t.remove()).attr("x1",t=>e(t)).attr("x2",t=>e(t))).call(t=>t.selectAll(".y").data(o.ticks(d)).join(t=>t.append("line").attr("class","y").attr("x2",n),t=>t,t=>t.remove()).attr("y1",t=>o(t)).attr("y2",t=>o(t))),v=!1,b=(t,e)=>{if(this.drawing||"fixed"==this.mode)return;v=!0;let n=this.invertTransX(),r=this.invertTransY(),o=[n(e.x),r(e.y)];a.g(t).data([o]);let i=a.g(t.parentNode);if(i.classed("polygon")){this.removeShape("tri-lines"),this.removeShape("path-lines");let t=i.selectAll(".polygon > circle").data();i.select("polyline").data([t.concat([t[0]])]),this.currentPolygon=t,this.onPolygonUpdatedCallback(t)}else if(i.classed("endpoint")){this.removeShape("path-lines");let t=this.canvas.selectAll(".endpoint > circle").data();this.currentEndpoints=t}this.applyTransform()};this.zoom=a.h().scaleExtent([.2,70]).on("start",t=>{t.sourceEvent&&"wheel"!=t.sourceEvent.type&&e.attr("cursor","grab")}).on("zoom",({transform:t})=>{this.currentTransform=t,this.applyTransform();let e=this.transX(),n=this.transY();l.call(f,e),c.call(g,n),o.call(y,e,n)}).on("end",()=>e.attr("cursor","default")).filter(t=>"move"==this.mode||"fixed"==this.mode||"mouseup"!=t.type&&"mousedown"!=t.type),this.pointDragger=a.c().on("drag",(function(t){b(this,t)})).on("end",()=>v=!1),e.on("mouseup",e=>{if(v)return;switch(this.mode){case"draw-polygon":if(this.currentPolygon.length)return;break;case"draw-points":if(this.currentEndpoints.length)return;break;default:return}this.drawing=!0;let n=this.invertTransX(),r=this.invertTransY(),o=a.e(e),s=[n(o[0]),r(o[1])];if("draw-polygon"==this.mode)if(t=s,e.target.hasAttribute("is-handle")){if(this.currentDrawPoints.length<=2)return;this.removeShape("polygon-drawing");let t=i()("#pick-color").val()+"77";this.drawPolygon(this.currentDrawPoints,{color:t,vertexColor:"#FDBC07",fixed:!1}),this.currentDrawPoints=[],this.drawing=!1,this.mode="move"}else this.currentDrawPoints.push(s),this.removeShape("polygon-drawing"),this.drawPolygon(this.currentDrawPoints,{vertexColor:"yellow",close:!1});else"draw-points"==this.mode&&(this.currentDrawPoints.push(s),this.drawPoint(s,{fixed:!1},"endpoint"),2==this.currentDrawPoints.length&&(this.currentEndpoints=this.currentDrawPoints,this.onEndpointsDrawnCallback(this.currentEndpoints),this.currentDrawPoints=[],this.drawing=!1,this.mode="move"))}),e.on("mousemove",e=>{if(!this.drawing||"draw-polygon"!=this.mode)return;let n=this.invertTransX(),r=this.invertTransY(),o=a.e(e),i=[n(o[0]),r(o[1])],s=this.canvas.select("g.polygon-drawing");s.select("line").remove(),s.insert("line",":first-child").data([[t,i]]).attr("stroke","#53DBF3").attr("stroke-width",1),this.applyTransform()}),e.call(this.zoom),this.drawing=!1,this.currentDrawPoints=[],this.currentPolygon=[],this.currentEndpoints=[],this.polygonDrawnCallback=this.polygonDestroyedCallback=this.onPolygonUpdatedCallback=this.onEndpointsDrawnCallback=()=>{},this.mode="move",this.width=n,this.height=r,this.svg=e,this.canvas=s,this.currentTransform=a.i,this.xScale=h,this.yScale=u,this.autoScale([])}onPolygonDrawn(t){this.polygonDrawnCallback=t}onPolygonDestroyed(t){this.polygonDestroyedCallback=t}onPolygonUpdated(t){this.onPolygonUpdatedCallback=t}onEndpointsDrawn(t){this.onEndpointsDrawnCallback=t}clearCanvas(){this.drawing=!1,this.removeShape("polygon"),this.removeShape("endpoint"),this.polygonDestroyedCallback(this.currentPolygon),this.currentDrawPoints=[],this.currentPolygon=[],this.currentEndpoints=[]}clearAlgorithmResult(){this.removeShape("stepping"),this.removeShape("tri-lines"),this.removeShape("path-lines")}setMode(t){["move","draw-polygon","draw-points","fixed"].includes(t)&&(this.mode=t)}transX(){return this.currentTransform.rescaleX(this.xScale)}transY(){return this.currentTransform.rescaleY(this.yScale)}invertTransX(){return this.currentTransform.rescaleX(this.xScale).invert}invertTransY(){return this.currentTransform.rescaleY(this.yScale).invert}applyTransform(){let t=this.transX(),e=this.transY();this.canvas.selectAll("circle").attr("cx",e=>t(e[0])).attr("cy",t=>e(t[1])),this.canvas.selectAll("line").attr("x1",e=>t(e[0][0])).attr("y1",t=>e(t[0][1])).attr("x2",e=>t(e[1][0])).attr("y2",t=>e(t[1][1])),this.canvas.selectAll("polygon").attr("points",n=>n.map(n=>[t(n[0]),e(n[1])])),this.canvas.selectAll("polyline").attr("points",n=>n.map(n=>[t(n[0]),e(n[1])]))}autoScale(t){let[e,n]=a.d(t,t=>t[0]),[r,o]=a.d(t,t=>t[1]);t.length||(e=n=r=o=0);let i=.8*Math.min(Math.abs(this.width/(this.xScale(n-e+1)-this.xScale(0))),Math.abs(this.height/(this.yScale(o-r+1)-this.yScale(0))));i=Math.min(Math.max(i,.2),50);let s=(this.width-(this.xScale(e)+this.xScale(n))*i)/2,l=(this.height-(this.yScale(o)+this.yScale(r))*i)/2;this.currentTransform=a.i.translate(s,l).scale(i),this.svg.call(this.zoom.transform,this.currentTransform)}hasShape(t){return!this.canvas.selectAll("g."+t).empty()}removeShape(t){this.canvas.selectAll("g."+t).remove()}toggleShape(t){let e=this.canvas.selectAll("g."+t);e.attr("opacity",1-e.attr("opacity"))}setShapeStyle(t,e,n,r){this.canvas.selectAll(`${t}.${e}`).style(n,r)}drawPolygon(t,e,n=""){let r={...{color:"red",vertexColor:"#FDBC07",vertexSize:5,close:!0,fixed:!0},...e};r.close?n+=" polygon-drawn":n+=" polygon-drawing",n+=" polygon";let o=this.canvas.append("g").attr("class",n);if(r.close?(o.append("polyline").data([t.concat([t[0]])]).attr("class",n).style("fill",r.color).attr("stroke","#ccc"),this.currentPolygon=t):o.append("polyline").data([t]).attr("class",n).style("fill","none").attr("stroke","#000"),r.vertexSize>0){let e=o.selectAll("circle").data(t).join("circle").attr("class",n).attr("r",r.vertexSize).attr("fill",r.vertexColor).attr("stroke","#000");r.close&&!r.fixed?e.style("cursor","move").call(this.pointDragger):r.close||e.attr("is-handle",!0).style("cursor","pointer")}this.applyTransform(),r.close&&this.polygonDrawnCallback(t)}drawPath(t,e,n=""){let r={color:"#000",dashed:!1,width:1,...e},o=this.canvas.select(".polygon").insert("g","circle").attr("opacity",1).attr("class",n).append("polyline").data([t]).style("fill","none").attr("class",n).attr("stroke",r.color).attr("stroke-width",r.width);r.dashed&&o.style("stroke-dasharray","5 5"),this.applyTransform()}drawLines(t,e,n=""){let r={color:"#000",dashed:!1,width:1,...e},o=this.canvas.select(".polygon"),i=o.selectChild(".path-lines").empty()?"circle":".path-lines",a=o.insert("g",i).attr("opacity",1).attr("class",n).selectAll("line").data(t).join("line").attr("class",n).attr("stroke",r.color).attr("stroke-width",r.width);r.dashed&&a.style("stroke-dasharray","5 5"),this.applyTransform()}drawPoint(t,e,n=""){let r={...{color:"#996f6e",size:5,fixed:!0},...e},o=this.canvas.append("g").attr("class",n).append("circle").data([t]).attr("class",n).attr("r",r.size).attr("fill",r.color).attr("stroke","#000");r.fixed||o.style("cursor","move").call(this.pointDragger),this.applyTransform()}getCurrentPolygon(){return this.currentPolygon}getCurrentEndpoints(){return this.currentEndpoints}};function y(t){let e=i()("#alert");e.text(t),e.slideDown("slow",()=>setTimeout(()=>e.slideUp("slow"),1e3))}function v(t){if(void 0===f&&!r.y(t))return y("Not a simple polygon!"),f=!1,!1;r.x(t)||t.reverse(),f=!0}function b(){let t,e,n;for(;t=Math.floor(256*Math.random()),e=Math.floor(256*Math.random()),n=Math.floor(256*Math.random()),!(t+e+n<672););return`rgba(${t},${e},${n},0.5)`}function w(){return i()("#pick-color").val()+"77"}function m(t){return{"2opt":2e3,growth:2e3,space:1e4,permute:15}[t]}function x(){let t=i()("#file-opt")[0],e=new FileReader;e.readAsText(t.files[0]),e.onload=function(t){let e=t.target.result,n=[];for(let t of e.split("\n")){let e=t.trim().split(/\s+/);if(""!=e){if(2!=e.length)return void y("Invalid polygon file format!");{let t=[parseFloat(e[0]),parseFloat(e[1])];if(isNaN(t[0])||isNaN(t[1]))return void y("Invalid polygon file format!");n.push(t)}}}g.clearCanvas(),g.drawPolygon(n,{color:w(),vertexSize:n.length>200?0:2}),g.autoScale(n)},t.value=null}function k(){let t=g.getCurrentPolygon();r.x(t)||t.reverse();let e=t.map(t=>t.join(" ")).join("\n"),n=document.getElementById("export-link"),o=new Blob([e],{type:"text/plain"});n.href=URL.createObjectURL(o),n.download="polygon.pts",n.click()}function P(t,e){let n=g.getCurrentPolygon();v(n);let o=r.v(n,t,e,"mono_partition");if(null==o)return void y("Unreachable!");let i=Array.prototype.concat([t],o.map(t=>n[t]),[e]);g.drawPath(i,{color:"#2c507b"},"path-lines")}g.onPolygonDrawn(()=>{i()("#tri-btn").prop("disabled",!1),i()("#path-btn").prop("disabled",!1),i()("#export-btn").prop("disabled",!1),i()("#step-tri-btn").prop("disabled",!1)}),g.onPolygonDestroyed(()=>{f=void 0,i()("#tri-btn").prop("disabled",!0),i()("#path-btn").prop("disabled",!0),i()("#export-btn").prop("disabled",!0),i()("#step-tri-btn").prop("disabled",!0),i()("#step-path-btn").prop("disabled",!0)}),g.onPolygonUpdated(()=>f=void 0),g.onEndpointsDrawn(t=>{P(t[0],t[1]),i()("#step-path-btn").prop("disabled",!1)}),i()(()=>{i()("#polygon-btn").on("change",()=>{switch(i()("#polygon-btn").val()){case"draw":i()("#color-opts").show(),i()("#clear-opts").show(),i()("#gen-opts").hide(),g.setMode("draw-polygon"),g.clearCanvas();break;case"random":i()("#color-opts").hide(),i()("#clear-opts").hide(),i()("#gen-opts").show(),g.setMode("move"),g.clearCanvas();break;case"load":i()("#color-opts").show(),i()("#clear-opts").hide(),i()("#gen-opts").hide(),g.setMode("move")}}),i()("#tri-btn").on("click",()=>{g.hasShape("tri-lines")?g.getCurrentPolygon().length>1e3?g.removeShape("tri-lines"):g.toggleShape("tri-lines"):function(){let t=g.getCurrentPolygon();v(t);let e=r.z(t,"mono_partition").map(e=>[t[e[0]],t[e[1]]]);g.drawLines(e,{color:"#9c3829"},"tri-lines")}()}),i()("#path-btn").on("click",()=>{if(g.hasShape("path-lines"))g.toggleShape("path-lines");else if(g.getCurrentEndpoints().length)P(g.getCurrentEndpoints()[0],g.getCurrentEndpoints()[1]);else{let t=g.getCurrentPolygon();t.length<=1e3&&!r.y(t)?y("Not a simple polygon!"):g.setMode("draw-points")}}),i()("#load-btn").on("click",()=>document.getElementById("file-opt").click()),i()("#export-btn").on("click",k),i()("#file-opt").on("change",x),i()("#algo-btn").next().children().on("click",(function(t){let e=i()(t.target);i()("#algo-btn").val(e.val()).text(e.text()),i()("#pick-size").val()>m(e.val())&&i()("#pick-size").val(m(e.val()))})),i()("#polygon-btn").next().find("li > button.switch-mode").on("click",(function(t){let e=i()(t.target);e.val()!=i()("#polygon-btn").val()&&i()("#polygon-btn").val(e.val()).text(e.text()).trigger("change")})),i()("#pick-color").on("change",()=>{g.setShapeStyle("polyline","polygon-drawn","fill",w())}),i()("#clear-btn").on("click",()=>{g.clearCanvas(),g.setMode("draw-polygon")}),i()("#gen-btn").on("click",()=>{!function(t,e){if(t<3)return void y(`Too few vertices for generation: ${t} < 3`);if(t>m(e))return void y(`Too many vertices for the ${i()("#algo-btn").text()} algorithm:             ${t} > ${m(e)}`);let n=r.w(t,1e3,e);g.clearCanvas(),g.drawPolygon(n,{color:b(),vertexSize:t>200?0:2}),g.autoScale(n)}(i()("#pick-size").val(),i()("#algo-btn").val())}),u()})},2:function(t,e,n){"use strict";(function(t){n.d(e,"w",(function(){return m})),n.d(e,"x",(function(){return P})),n.d(e,"y",(function(){return S})),n.d(e,"z",(function(){return C})),n.d(e,"v",(function(){return D})),n.d(e,"a",(function(){return T})),n.d(e,"r",(function(){return E})),n.d(e,"q",(function(){return A})),n.d(e,"l",(function(){return M})),n.d(e,"t",(function(){return U})),n.d(e,"n",(function(){return j})),n.d(e,"k",(function(){return $})),n.d(e,"c",(function(){return N})),n.d(e,"g",(function(){return X})),n.d(e,"p",(function(){return Y})),n.d(e,"d",(function(){return B})),n.d(e,"e",(function(){return F})),n.d(e,"j",(function(){return I})),n.d(e,"b",(function(){return L})),n.d(e,"f",(function(){return R})),n.d(e,"h",(function(){return _})),n.d(e,"m",(function(){return q})),n.d(e,"i",(function(){return J})),n.d(e,"o",(function(){return O})),n.d(e,"u",(function(){return V})),n.d(e,"s",(function(){return G}));var r=n(96);const o=new Array(32).fill(void 0);function i(t){return o[t]}o.push(void 0,null,!0,!1);let a=0,s=null;function l(){return null!==s&&s.buffer===r.i.buffer||(s=new Uint8Array(r.i.buffer)),s}let c=new("undefined"==typeof TextEncoder?(0,t.require)("util").TextEncoder:TextEncoder)("utf-8");const p="function"==typeof c.encodeInto?function(t,e){return c.encodeInto(t,e)}:function(t,e){const n=c.encode(t);return e.set(n),{read:t.length,written:n.length}};function d(t,e,n){if(void 0===n){const n=c.encode(t),r=e(n.length);return l().subarray(r,r+n.length).set(n),a=n.length,r}let r=t.length,o=e(r);const i=l();let s=0;for(;s<r;s++){const e=t.charCodeAt(s);if(e>127)break;i[o+s]=e}if(s!==r){0!==s&&(t=t.slice(s)),o=n(o,r,r=s+3*t.length);const e=l().subarray(o+s,o+r);s+=p(t,e).written}return a=s,o}let h=null;function u(){return null!==h&&h.buffer===r.i.buffer||(h=new Int32Array(r.i.buffer)),h}let f=new("undefined"==typeof TextDecoder?(0,t.require)("util").TextDecoder:TextDecoder)("utf-8",{ignoreBOM:!0,fatal:!0});function g(t,e){return f.decode(l().subarray(t,t+e))}f.decode();let y=o.length;function v(t){y===o.length&&o.push(o.length+1);const e=y;return y=o[e],o[e]=t,e}function b(t){const e=i(t);return function(t){t<36||(o[t]=y,y=t)}(t),e}function w(t){return null==t}function m(t,e,n){var o=w(n)?0:d(n,r.b,r.c),i=a;return b(r.e(t,e,o,i))}let x=32;function k(t){if(1==x)throw new Error("out of js stack");return o[--x]=t,x}function P(t){try{return 0!==r.g(k(t))}finally{o[x++]=void 0}}function S(t){try{return 0!==r.h(k(t))}finally{o[x++]=void 0}}function C(t,e){try{var n=w(e)?0:d(e,r.b,r.c),i=a;return b(r.j(k(t),n,i))}finally{o[x++]=void 0}}function D(t,e,n,i,s){try{var l=w(i)?0:d(i,r.b,r.c),c=a;return b(r.d(k(t),k(e),k(n),l,c,w(s)?16777215:s?1:0))}finally{o[x++]=void 0,o[x++]=void 0,o[x++]=void 0}}const T=function(t,e){alert(g(t,e))},E=function(t,e){const n=i(e);var o=d(JSON.stringify(void 0===n?null:n),r.b,r.c),s=a;u()[t/4+1]=s,u()[t/4+0]=o},A=function(t,e){return v(JSON.parse(g(t,e)))},M=(z=function(){return v(self.self)},function(){try{return z.apply(this,arguments)}catch(t){r.a(v(t))}});var z;const U=function(t){b(t)},j=function(){return v(t)},$=function(t,e,n){return v(i(t).require(g(e,n)))},N=function(t){return v(i(t).crypto)},X=function(t){return v(i(t).msCrypto)},Y=function(t){return void 0===i(t)},B=function(t){return v(i(t).getRandomValues)},F=function(t,e){i(t).getRandomValues(i(e))},I=function(t,e,n){var r,o;i(t).randomFillSync((r=e,o=n,l().subarray(r/1,r/1+o)))},L=function(t){return v(i(t).buffer)},R=function(t){return i(t).length},_=function(t){return v(new Uint8Array(i(t)))},q=function(t,e,n){i(t).set(i(e),n>>>0)},J=function(t){return v(new Uint8Array(t>>>0))},O=function(t,e,n){return v(i(t).subarray(e>>>0,n>>>0))},V=function(t,e){throw new Error(g(t,e))},G=function(){return v(r.i)}}).call(this,n(95)(t))},96:function(t,e,n){"use strict";var r=n.w[t.i];t.exports=r;n(2);r.k()}}]);