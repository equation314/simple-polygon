(window.webpackJsonp=window.webpackJsonp||[]).push([[1],{1:function(t,e,n){"use strict";n.r(e),n.d(e,"gLastRandomPolygonState",(function(){return w})),n.d(e,"draw",(function(){return b})),n.d(e,"showError",(function(){return k})),n.d(e,"checkSimplePolygon",(function(){return x}));var r=n(2),o=n(11),i=n.n(o),l=n(96);var s="shortest",a=null,p=0,c=0,d=!1,h=void 0,u=[];function g(t){let[e,n]=t,r=n[0]-e[0],o=n[1]-e[1],i=1e5/Math.sqrt(r*r+o*o);return[[e[0]-r*i,e[1]-o*i],[e[0]+r*i,e[1]+o*i]]}function f(t){if("2opt"==s){let e=a.steps[t-t%2].poly;if(b.removeShape("stepping"),b.drawPolygon(e,{color:h,vertexSize:1},"stepping step-polygon"),t%2==1){let e=a.steps[t];b.drawLines([e.e0,e.e1],{color:"#9c3829"},"stepping step-edges"),b.drawLines([[e.e0[0],e.e1[0]],[e.e0[1],e.e1[1]]],{color:"#9c3829",dashed:!0},"stepping step-edges"),b.drawPoints([e.e0[0],e.e0[1],e.e1[0],e.e1[1]],{color:"red",size:3},"stepping step-point")}}else if("space"==s)if(t==c)b.removeShape("stepping"),b.drawPolygon(a.polygon,{color:h,vertexSize:1},"stepping one-step");else{if(b.removeShape("one-step"),b.hasShape("all-steps")||b.drawPoints(a.points,{color:"#000",size:1},"stepping all-steps"),0==t)return;if(1==t){let t=a.steps[0].base_segment;return b.drawLines([g(t)],{color:"green"},"stepping one-step"),void b.drawPoints(t,{color:"green",size:3},"stepping one-step")}let e=a.steps[t-2];b.drawPath(a.polygon.slice(0,e.current_chain_len),{color:"#000",width:.5,opacity:.5},"stepping one-step"),e.is_leaf?b.drawLines([e.base_segment],{color:"#000",width:2},"stepping one-step"):(b.drawLines([e.base_segment],{color:"red",dashed:!0},"stepping one-step"),null!=e.split_line?(b.drawLines([g(e.split_line)],{color:"green"},"stepping one-step"),b.drawPoints(e.left_points,{color:"yellow",size:3},"stepping one-step"),b.drawPoints(e.right_points,{color:"blue",size:3},"stepping one-step")):b.drawPoints(e.left_points,{color:"#ddd",size:3},"stepping one-step")),b.drawPoints(e.base_segment,{color:"red",size:3},"stepping one-step"),null!=e.mid_point&&b.drawPoints([e.mid_point],{color:"green",size:3},"stepping one-step")}else if("path"==s){0==t?(b.removeShape("stepping"),b.drawManyLines(a.sleeve_diagonals,{color:"#ce6a5b",width:.5},"stepping all-steps"),b.drawManyLines(a.sleeve_boundary,{color:"#333",width:.5},"stepping all-steps")):b.removeShape("one-step");let e=a.steps[t];b.drawPath(e.left_chain,{color:"#000",width:2},"stepping one-step"),b.drawPath(e.right_chain,{color:"#000",width:2},"stepping one-step"),b.drawPath(e.path,{color:"#3159E4",width:2},"stepping one-step"),b.drawPoints([e.cusp],{color:"green"},"stepping one-step"),b.drawPoints([e.current],{color:"red"},"stepping one-step"),null!=e.tangent&&b.drawLines([[e.tangent,e.current]],{color:"#3159E4",dashed:!0,width:2},"stepping one-step")}}function y(){i()("#step-btn").next().find("li > button").on("click",(function(t){(function(t){if(p=0,s=t,"2opt"==t){let[e,n,o]=w;return null!=(a=r.w(e,n,t,o,!0))&&(c=a.steps.length-1,u=b.getCurrentPolygon(),h=b.getShapeStyle("polyline","polygon","fill"),b.removeShape("polygon"),b.clearEndpoints(),b.clearAlgorithmResult(),console.log(t,c),f(0),!0)}if("space"==t){let[e,n,o]=w;return null!=(a=r.w(e,n,t,o,!0))&&(c=a.steps.length+2,u=b.getCurrentPolygon(),h=b.getShapeStyle("polyline","polygon","fill"),console.log(t,c),b.removeShape("polygon"),b.clearEndpoints(),b.clearAlgorithmResult(),f(0),!0)}if("path"==t){let e=b.getCurrentPolygon();if(!x(e))return;let[n,o]=b.getCurrentEndpoints();return null==(a=r.v(e,n,o,"mono_partition",!0))?(k("Unreachable!"),!1):(c=a.steps.length-1,b.clearAlgorithmResult(),console.log(t,c),f(0),!0)}if("tri"==t)return!1})(i()(t.target).val())&&(i()("#polygon-btn").prop("disabled",!0),i()("#tri-btn").prop("disabled",!0),i()("#path-btn").prop("disabled",!0),i()("#color-opts").hide(),i()("#clear-opts").hide(),i()("#gen-opts").hide(),i()("#step-opts").show(),i()("#step-prev-btn").prop("disabled",!0),i()("#step-next-btn").prop("disabled",!1),i()("#step-btn-div").hide(),i()("#stop-btn-div").show(),b.setMode("fixed"))})),i()("#stop-btn").on("click",()=>{switch(d=!1,i()("#polygon-btn").prop("disabled",!1),i()("#tri-btn").prop("disabled",!1),i()("#path-btn").prop("disabled",!1),i()("#step-opts").hide(),i()("#stop-btn-div").hide(),i()("#step-btn-div").show(),i()("#polygon-btn").val()){case"draw":i()("#color-opts").show(),i()("#clear-opts").show();break;case"random":i()("#gen-opts").show();break;case"load":i()("#color-opts").show()}b.removeShape("stepping"),b.setMode("move"),["2opt","space"].includes(s)&&b.drawPolygon(u,{color:h,vertexSize:u.length>200?0:2})}),i()("#step-first-btn").on("click",()=>{f(p=0),i()("#step-prev-btn").prop("disabled",!0),i()("#step-next-btn").prop("disabled",!1)}),i()("#step-last-btn").on("click",()=>{f(p=c),i()("#step-prev-btn").prop("disabled",!1),i()("#step-next-btn").prop("disabled",!0)}),i()("#step-prev-btn").on("click",()=>{0!=p&&(0==--p&&i()("#step-prev-btn").prop("disabled",!0),i()("#step-next-btn").prop("disabled",!1),f(p))}),i()("#step-next-btn").on("click",()=>{p>=c||(++p==c&&i()("#step-next-btn").prop("disabled",!0),i()("#step-prev-btn").prop("disabled",!1),f(p))});let t=()=>{d&&p<c?(i()("#step-next-btn").trigger("click"),setTimeout(t,300-i()("#step-play-speed").val())):(d=!1,i()("#step-play-btn img").attr("src","images/Right/Play.png"))};i()("#step-play-btn").on("click",()=>{p!=c&&(d?(d=!1,i()("#step-play-btn img").attr("src","images/Right/Play.png")):(d=!0,i()("#step-play-btn img").attr("src","images/Right/Pause.png"),t()))})}var v=void 0,w=void 0,b=new class{constructor(){let t,e=l.h("body").append("svg"),n=i()("svg").width(),r=i()("svg").height(),o=e.append("g"),s=e.append("g").attr("class","canvas"),a=e.append("g"),p=e.append("g"),c=n/50,d=r/50,h=l.g().domain([0,n]).range([0,n]).nice(),u=l.g().domain([0,r]).range([r,0]).nice(),g=(t,e)=>t.attr("transform",`translate(0,${r})`).call(l.b(e).ticks(c)).call(t=>t.select(".domain").attr("display","none")),f=(t,e)=>t.attr("transform","translate(0,0)").call(l.a(e).ticks(d)).call(t=>t.select(".domain").attr("display","none")),y=(t,e,o)=>t.attr("stroke","currentColor").attr("stroke-opacity",.1).call(t=>t.selectAll(".x").data(e.ticks(c)).join(t=>t.append("line").attr("class","x").attr("y2",r),t=>t,t=>t.remove()).attr("x1",t=>e(t)).attr("x2",t=>e(t))).call(t=>t.selectAll(".y").data(o.ticks(d)).join(t=>t.append("line").attr("class","y").attr("x2",n),t=>t,t=>t.remove()).attr("y1",t=>o(t)).attr("y2",t=>o(t))),v=!1,w=(t,e)=>{if(this.drawing||"fixed"==this.mode)return;v=!0;let n=this.invertTransX(),r=this.invertTransY(),o=[n(e.x),r(e.y)];l.h(t).data([o]);let i=l.h(t.parentNode);if(i.classed("polygon")){this.removeShape("tri-lines"),this.removeShape("path-lines");let t=i.selectAll(".polygon > circle").data();i.select("polyline").data([t.concat([t[0]])]),this.currentPolygon=t,this.polygonUpdatedCallback(t),this.applyTransform(["circle","polyline"])}else if(i.classed("endpoint")){this.removeShape("path-lines");let t=this.canvas.selectAll(".endpoint > circle").data();this.currentEndpoints=t,this.applyTransform(["circle"])}};this.zoom=l.i().scaleExtent([.1,70]).on("start",t=>{t.sourceEvent&&"wheel"!=t.sourceEvent.type&&e.attr("cursor","grab")}).on("zoom",({transform:t})=>{this.currentTransform=t,this.applyTransform();let e=this.transX(),n=this.transY();a.call(g,e),p.call(f,n),o.call(y,e,n)}).on("end",()=>e.attr("cursor","default")).filter(t=>"move"==this.mode||"fixed"==this.mode||"mouseup"!=t.type&&"mousedown"!=t.type),this.pointDragger=l.c().on("drag",(function(t){w(this,t)})).on("end",()=>v=!1),e.on("mouseup",e=>{if(v)return;switch(this.mode){case"draw-polygon":if(this.currentPolygon.length)return;break;case"draw-points":if(this.currentEndpoints.length)return;break;default:return}this.drawing=!0;let n=this.invertTransX(),r=this.invertTransY(),o=l.f(e),s=[n(o[0]),r(o[1])];if("draw-polygon"==this.mode)if(t=s,e.target.hasAttribute("is-handle")){if(this.currentDrawPoints.length<=2)return;this.removeShape("polygon-drawing");let t=i()("#pick-color").val()+"77";this.drawPolygon(this.currentDrawPoints,{color:t,vertexColor:"#FDBC07",fixed:!1}),this.polygonDrawnCallback(this.currentDrawPoints),this.currentDrawPoints=[],this.drawing=!1,this.mode="move"}else this.currentDrawPoints.push(s),this.removeShape("polygon-drawing"),this.drawPolygon(this.currentDrawPoints,{vertexColor:"yellow",close:!1});else"draw-points"==this.mode&&(this.currentDrawPoints.push(s),this.drawPoints([s],{fixed:!1},"endpoint"),2==this.currentDrawPoints.length&&(this.currentEndpoints=this.currentDrawPoints,this.endpointsDrawnCallback(this.currentEndpoints),this.currentDrawPoints=[],this.drawing=!1,this.mode="move"))}),e.on("mousemove",e=>{if(!this.drawing||"draw-polygon"!=this.mode)return;let n=this.invertTransX(),r=this.invertTransY(),o=l.f(e),i=[n(o[0]),r(o[1])],s=this.canvas.select("g.polygon-drawing");s.select("line").remove(),s.insert("line",":first-child").data([[t,i]]).attr("stroke","#53DBF3").attr("stroke-width",1),this.applyTransform(["line"])}),e.call(this.zoom),this.drawing=!1,this.currentDrawPoints=[],this.currentPolygon=[],this.currentEndpoints=[],this.polygonDrawnCallback=this.polygonClearCallback=this.polygonUpdatedCallback=this.endpointsDrawnCallback=this.endpointsClearCallback=()=>{},this.mode="move",this.width=n,this.height=r,this.svg=e,this.canvas=s,this.currentTransform=l.j,this.xScale=h,this.yScale=u,this.autoScale([])}onPolygonDrawn(t){this.polygonDrawnCallback=t}onPolygonClear(t){this.polygonClearCallback=t}onPolygonUpdated(t){this.polygonUpdatedCallback=t}onEndpointsDrawn(t){this.endpointsDrawnCallback=t}onEndpointsClear(t){this.endpointsClearCallback=t}clearCanvas(){this.drawing=!1,this.removeShape("polygon"),this.removeShape("endpoint"),this.polygonClearCallback(this.currentPolygon),this.currentDrawPoints=[],this.currentPolygon=[],this.currentEndpoints=[]}clearEndpoints(){this.removeShape("endpoint"),this.endpointsClearCallback(this.currentEndpoints),this.currentEndpoints=[]}clearAlgorithmResult(){this.removeShape("stepping"),this.removeShape("tri-lines"),this.removeShape("path-lines")}setMode(t){["move","draw-polygon","draw-points","fixed"].includes(t)&&(this.mode=t)}transX(){return this.currentTransform.rescaleX(this.xScale)}transY(){return this.currentTransform.rescaleY(this.yScale)}invertTransX(){return this.currentTransform.rescaleX(this.xScale).invert}invertTransY(){return this.currentTransform.rescaleY(this.yScale).invert}applyTransform(t){let e=this.transX(),n=this.transY();(null==t||t.includes("circle"))&&this.canvas.selectAll("circle").attr("cx",t=>e(t[0])).attr("cy",t=>n(t[1])),(null==t||t.includes("line"))&&this.canvas.selectAll("line").attr("x1",t=>e(t[0][0])).attr("y1",t=>n(t[0][1])).attr("x2",t=>e(t[1][0])).attr("y2",t=>n(t[1][1])),(null==t||t.includes("polygon"))&&this.canvas.selectAll("polygon").attr("points",t=>t.map(t=>[e(t[0]),n(t[1])])),(null==t||t.includes("polyline"))&&this.canvas.selectAll("polyline").attr("points",t=>t.map(t=>[e(t[0]),n(t[1])])),(null==t||t.includes("path"))&&this.canvas.selectAll("path").attr("d",t=>{let r=l.e();for(let[o,i]of t)r.moveTo(e(o[0]),n(o[1])),r.lineTo(e(i[0]),n(i[1]));return r.closePath(),r})}autoScale(t){let[e,n]=l.d(t,t=>t[0]),[r,o]=l.d(t,t=>t[1]);t.length||(e=n=r=o=0);let i=.8*Math.min(Math.abs(this.width/(this.xScale(n-e+1)-this.xScale(0))),Math.abs(this.height/(this.yScale(o-r+1)-this.yScale(0))));i=Math.min(Math.max(i,.1),70);let s=(this.width-(this.xScale(e)+this.xScale(n))*i)/2,a=(this.height-(this.yScale(o)+this.yScale(r))*i)/2;this.currentTransform=l.j.translate(s,a).scale(i),this.svg.call(this.zoom.transform,this.currentTransform)}hasShape(t){return!this.canvas.selectAll("g."+t).empty()}removeShape(t){this.canvas.selectAll("g."+t).remove()}toggleShape(t){let e=this.canvas.selectAll("g."+t);e.attr("opacity",1-e.attr("opacity"))}getShapeStyle(t,e,n){return this.canvas.selectAll(`${t}.${e}`).style(n)}setShapeStyle(t,e,n,r){this.canvas.selectAll(`${t}.${e}`).style(n,r)}drawPolygon(t,e,n=""){let r={...{color:"red",vertexColor:"#FDBC07",vertexSize:5,close:!0,fixed:!0},...e};r.close?n+=" polygon-drawn":n+=" polygon-drawing",n+=" polygon";let o=this.canvas.append("g").attr("opacity",1).attr("class",n);if(r.close?(o.append("polyline").data([t.concat([t[0]])]).attr("class",n).style("fill",r.color).attr("stroke","#000").attr("stroke-width",.5).attr("stroke-opacity",.5),this.currentPolygon=t):o.append("polyline").data([t]).attr("class",n).style("fill","none").attr("stroke","#000"),r.vertexSize>0){let e=o.selectAll("circle").data(t).join("circle").attr("class",n).attr("r",r.vertexSize).attr("fill",r.vertexColor).attr("stroke-width",.5).attr("stroke","#000");r.close&&!r.fixed?e.style("cursor","move").call(this.pointDragger):r.close||e.attr("is-handle",!0).style("cursor","pointer")}this.applyTransform(["polyline","circle"])}drawPath(t,e,n=""){if(t.length<=1)return;let r={color:"#000",dashed:!1,opacity:1,width:1,...e},o=this.canvas.select(".polygon"),i=null;o.empty()?o=this.canvas:i=o.selectChild(".path-lines").empty()?"circle":".path-lines";let l=o.insert("g",i).attr("opacity",1).attr("class",n).append("polyline").data([t]).style("fill","none").attr("class",n).attr("stroke",r.color).attr("stroke-width",r.width).attr("stroke-opacity",r.opacity);r.dashed&&l.style("stroke-dasharray","5 5"),this.applyTransform(["polyline"])}drawLines(t,e,n=""){if(0==t.length)return;let r={color:"#000",dashed:!1,opacity:1,width:1,...e},o=this.canvas.select(".polygon"),i=null;o.empty()?o=this.canvas:i=o.selectChild(".path-lines").empty()?"circle":".path-lines";let l=o.insert("g",i).attr("opacity",1).attr("class",n).selectAll("line").data(t).join("line").attr("class",n).attr("stroke",r.color).attr("stroke-width",r.width).attr("stroke-opacity",r.opacity);r.dashed&&l.style("stroke-dasharray","5 5"),this.applyTransform(["line"])}drawManyLines(t,e,n=""){if(0==t.length)return;let r={color:"#000",width:1,...e},o=this.canvas.select(".polygon"),i=null;o.empty()?o=this.canvas:i=o.selectChild(".path-lines").empty()?"circle":".path-lines",o.insert("g",i).attr("opacity",1).attr("class",n).append("path").data([t]).attr("class",n).attr("stroke",r.color).attr("stroke-width",r.width),this.applyTransform(["path"])}drawPoints(t,e,n=""){if(0==t.length)return;let r={...{color:"#996f6e",size:5,fixed:!0},...e},o=this.canvas.append("g").attr("class",n).selectAll("circle").data(t).join("circle").attr("class",n).attr("r",r.size).attr("fill",r.color).attr("stroke-width",.5).attr("stroke","#000");r.fixed||o.style("cursor","move").call(this.pointDragger),this.applyTransform(["circle"])}getCurrentPolygon(){return this.currentPolygon}getCurrentEndpoints(){return this.currentEndpoints}};function m(){i()("#tri-btn").prop("disabled",!1),i()("#path-btn").prop("disabled",!1),i()("#export-btn").prop("disabled",!1)}function k(t){let e=i()("#alert");e.text(t),e.slideDown("slow",()=>setTimeout(()=>e.slideUp("slow"),1e3))}function x(t){return void 0===v&&(v=t.length>2e3||r.y(t)),!1===v?(k("Not a simple polygon!"),!1):(r.x(t)||t.reverse(),!0)}function S(){let t,e,n;for(;t=Math.floor(256*Math.random()),e=Math.floor(256*Math.random()),n=Math.floor(256*Math.random()),!(t+e+n<672););return`rgba(${t},${e},${n},0.5)`}function P(){return i()("#pick-color").val()+"77"}function C(t){return{"2opt":2e3,growth:2e3,space:5e4,permute:15}[t]}function T(){let t=i()("#file-opt")[0],e=new FileReader;e.readAsText(t.files[0]),e.onload=function(t){let e=t.target.result,n=[];for(let t of e.split("\n")){let e=t.trim().split(/\s+/);if(""!=e){if(2!=e.length)return void k("Invalid polygon file format!");{let t=[parseFloat(e[0]),parseFloat(e[1])];if(isNaN(t[0])||isNaN(t[1]))return void k("Invalid polygon file format!");n.push(t)}}}b.clearCanvas(),b.drawPolygon(n,{color:P(),vertexSize:n.length>200?0:2}),b.autoScale(n),m()},t.value=null}function E(){let t=b.getCurrentPolygon();r.x(t)||t.reverse();let e=t.map(t=>t.join(" ")).join("\n"),n=document.getElementById("export-link"),o=new Blob([e],{type:"text/plain"});n.href=URL.createObjectURL(o),n.download="polygon.pts",n.click()}function D(t,e){let n=b.getCurrentPolygon();if(!x(n))return;let o=r.v(n,t,e,"mono_partition");if(null==o)return void k("Unreachable!");let i=Array.prototype.concat([t],o.map(t=>n[t]),[e]);b.drawPath(i,{color:"#3159E4"},"path-lines")}b.onPolygonDrawn(m),b.onPolygonClear((function(){v=void 0,i()("#tri-btn").prop("disabled",!0),i()("#path-btn").prop("disabled",!0),i()("#export-btn").prop("disabled",!0),i()("#step-tri-btn").prop("disabled",!0),i()("#step-path-btn").prop("disabled",!0)})),b.onPolygonUpdated(()=>v=void 0),b.onEndpointsDrawn(t=>{D(t[0],t[1]),i()("#step-path-btn").prop("disabled",!1)}),b.onEndpointsClear(()=>i()("#step-path-btn").prop("disabled",!0)),i()(()=>{i()("#polygon-btn").on("change",()=>{switch(i()("#polygon-btn").val()){case"draw":i()("#color-opts").show(),i()("#clear-opts").show(),i()("#gen-opts").hide(),i()("#step-gen-btn").prop("disabled",!0),b.setMode("draw-polygon"),b.clearCanvas();break;case"random":i()("#color-opts").hide(),i()("#clear-opts").hide(),i()("#gen-opts").show(),b.setMode("move"),b.clearCanvas();break;case"load":i()("#color-opts").show(),i()("#clear-opts").hide(),i()("#gen-opts").hide(),i()("#step-gen-btn").prop("disabled",!0),b.setMode("move")}}),i()("#tri-btn").on("click",()=>{b.hasShape("tri-lines")?b.getCurrentPolygon().length>2e3?b.removeShape("tri-lines"):b.toggleShape("tri-lines"):function(){let t=b.getCurrentPolygon();if(!x(t))return;let e=r.z(t,"mono_partition").map(e=>[t[e[0]],t[e[1]]]);b.drawManyLines(e,{color:"#9c3829",width:.5},"tri-lines")}()}),i()("#path-btn").on("click",()=>{if(b.hasShape("path-lines"))b.toggleShape("path-lines");else if(b.getCurrentEndpoints().length)D(b.getCurrentEndpoints()[0],b.getCurrentEndpoints()[1]);else{let t=b.getCurrentPolygon();t.length<=2e3&&!r.y(t)?k("Not a simple polygon!"):b.setMode("draw-points")}}),i()("#load-btn").on("click",()=>document.getElementById("file-opt").click()),i()("#export-btn").on("click",E),i()("#file-opt").on("change",T),i()("#algo-btn").next().children().on("click",(function(t){let e=i()(t.target);i()("#algo-btn").val(e.val()).text(e.text()),i()("#pick-size").val()>C(e.val())&&i()("#pick-size").val(C(e.val()))})),i()("#polygon-btn").next().find("li > button.switch-mode").on("click",(function(t){let e=i()(t.currentTarget);e.val()!=i()("#polygon-btn").val()&&(i()("#polygon-btn img").attr("src",e.find("img").attr("src")),i()("#polygon-btn").val(e.val()).trigger("change"))})),i()("#pick-color").on("change",()=>{b.setShapeStyle("polyline","polygon-drawn","fill",P())}),i()("#clear-btn").on("click",()=>{b.clearCanvas(),b.setMode("draw-polygon")}),i()("#gen-btn").on("click",()=>{let t=i()("#pick-size").val(),e=i()("#algo-btn").val();!function(t,e){if(t<3)return void k(`Too few vertices for generation: ${t} < 3`);if(t>C(e))return void k(`Too many vertices for the ${i()("#algo-btn").text()} algorithm:             ${t} > ${C(e)}`);let n=Math.floor(4294967295*Math.random()),o=t<=100?100:t<=2e3?1e3:1e4;w=[t,o,n];let l=r.w(t,o,e,n);b.clearCanvas(),b.drawPolygon(l,{color:S(),vertexSize:t>200?0:2}),b.autoScale(l),m()}(t,e);let n=!0;"2opt"==e?n=t>500:"space"==e&&(n=t>1e3),i()("#step-gen-btn").val(e).text(i()("#algo-btn").text()).prop("disabled",n)}),y()})},2:function(t,e,n){"use strict";(function(t){n.d(e,"w",(function(){return m})),n.d(e,"x",(function(){return S})),n.d(e,"y",(function(){return P})),n.d(e,"z",(function(){return C})),n.d(e,"v",(function(){return T})),n.d(e,"a",(function(){return D})),n.d(e,"r",(function(){return A})),n.d(e,"q",(function(){return z})),n.d(e,"l",(function(){return M})),n.d(e,"t",(function(){return _})),n.d(e,"n",(function(){return L})),n.d(e,"k",(function(){return j})),n.d(e,"c",(function(){return R})),n.d(e,"g",(function(){return U})),n.d(e,"p",(function(){return $})),n.d(e,"d",(function(){return N})),n.d(e,"e",(function(){return X})),n.d(e,"j",(function(){return Y})),n.d(e,"b",(function(){return B})),n.d(e,"f",(function(){return F})),n.d(e,"h",(function(){return I})),n.d(e,"m",(function(){return q})),n.d(e,"i",(function(){return J})),n.d(e,"o",(function(){return O})),n.d(e,"u",(function(){return V})),n.d(e,"s",(function(){return G}));var r=n(95);const o=new Array(32).fill(void 0);function i(t){return o[t]}o.push(void 0,null,!0,!1);let l=0,s=null;function a(){return null!==s&&s.buffer===r.i.buffer||(s=new Uint8Array(r.i.buffer)),s}let p=new("undefined"==typeof TextEncoder?(0,t.require)("util").TextEncoder:TextEncoder)("utf-8");const c="function"==typeof p.encodeInto?function(t,e){return p.encodeInto(t,e)}:function(t,e){const n=p.encode(t);return e.set(n),{read:t.length,written:n.length}};function d(t,e,n){if(void 0===n){const n=p.encode(t),r=e(n.length);return a().subarray(r,r+n.length).set(n),l=n.length,r}let r=t.length,o=e(r);const i=a();let s=0;for(;s<r;s++){const e=t.charCodeAt(s);if(e>127)break;i[o+s]=e}if(s!==r){0!==s&&(t=t.slice(s)),o=n(o,r,r=s+3*t.length);const e=a().subarray(o+s,o+r);s+=c(t,e).written}return l=s,o}let h=null;function u(){return null!==h&&h.buffer===r.i.buffer||(h=new Int32Array(r.i.buffer)),h}let g=new("undefined"==typeof TextDecoder?(0,t.require)("util").TextDecoder:TextDecoder)("utf-8",{ignoreBOM:!0,fatal:!0});function f(t,e){return g.decode(a().subarray(t,t+e))}g.decode();let y=o.length;function v(t){y===o.length&&o.push(o.length+1);const e=y;return y=o[e],o[e]=t,e}function w(t){const e=i(t);return function(t){t<36||(o[t]=y,y=t)}(t),e}function b(t){return null==t}function m(t,e,n,o,i){var s=b(n)?0:d(n,r.b,r.c),a=l;return w(r.e(t,e,s,a,!b(o),b(o)?0:o,b(i)?16777215:i?1:0))}let k=32;function x(t){if(1==k)throw new Error("out of js stack");return o[--k]=t,k}function S(t){try{return 0!==r.g(x(t))}finally{o[k++]=void 0}}function P(t){try{return 0!==r.h(x(t))}finally{o[k++]=void 0}}function C(t,e){try{var n=b(e)?0:d(e,r.b,r.c),i=l;return w(r.j(x(t),n,i))}finally{o[k++]=void 0}}function T(t,e,n,i,s){try{var a=b(i)?0:d(i,r.b,r.c),p=l;return w(r.d(x(t),x(e),x(n),a,p,b(s)?16777215:s?1:0))}finally{o[k++]=void 0,o[k++]=void 0,o[k++]=void 0}}function E(t,e){try{return t.apply(this,e)}catch(t){r.a(v(t))}}function D(t,e){alert(f(t,e))}function A(t,e){const n=i(e);var o=d(JSON.stringify(void 0===n?null:n),r.b,r.c),s=l;u()[t/4+1]=s,u()[t/4+0]=o}function z(t,e){return v(JSON.parse(f(t,e)))}function M(){return E((function(){return v(self.self)}),arguments)}function _(t){w(t)}function L(){return v(t)}function j(t,e,n){return v(i(t).require(f(e,n)))}function R(t){return v(i(t).crypto)}function U(t){return v(i(t).msCrypto)}function $(t){return void 0===i(t)}function N(t){return v(i(t).getRandomValues)}function X(t,e){i(t).getRandomValues(i(e))}function Y(t,e,n){var r,o;i(t).randomFillSync((r=e,o=n,a().subarray(r/1,r/1+o)))}function B(t){return v(i(t).buffer)}function F(t){return i(t).length}function I(t){return v(new Uint8Array(i(t)))}function q(t,e,n){i(t).set(i(e),n>>>0)}function J(t){return v(new Uint8Array(t>>>0))}function O(t,e,n){return v(i(t).subarray(e>>>0,n>>>0))}function V(t,e){throw new Error(f(t,e))}function G(){return v(r.i)}}).call(this,n(94)(t))},95:function(t,e,n){"use strict";var r=n.w[t.i];t.exports=r;n(2);r.k()}}]);