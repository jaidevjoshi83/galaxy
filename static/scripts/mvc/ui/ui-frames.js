define("mvc/ui/ui-frames",["exports","utils/localization"],function(t,e){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=function(t){return t&&t.__esModule?t:{default:t}}(e),o=Backbone.View.extend({initialize:function(t){this.model=t&&t.model||new Backbone.Model(t),this.setElement($("<div/>").addClass("corner frame")),this.$el.append($("<div/>").addClass("f-header corner").append($("<div/>").addClass("f-title")).append($("<div/>").addClass("f-icon f-close fa fa-close").tooltip({title:(0,i.default)("Close"),placement:"bottom"}))).append($("<div/>").addClass("f-content")).append($("<div/>").addClass("f-resize f-icon corner fa fa-expand").tooltip({title:"Resize"})).append($("<div/>").addClass("f-cover")),this.$header=this.$(".f-header"),this.$title=this.$(".f-title"),this.$content=this.$(".f-content"),this.render(),this.listenTo(this.model,"change",this.render,this)},render:function(){var t=this,e=this.model.attributes;this.$title.html(e.title||""),this.$header.find(".f-icon-left").remove(),_.each(e.menu,function(e){var i=$("<div/>").addClass("f-icon-left").addClass(e.icon);_.isFunction(e.disabled)&&e.disabled()?i.attr("disabled",!0):i.on("click",function(){e.onclick(t)}).tooltip({title:e.tooltip,placement:"bottom"}),t.$header.append(i)}),e.url?this.$content.html($("<iframe/>").addClass("f-iframe").attr("scrolling","auto").attr("src",e.url+(-1===e.url.indexOf("?")?"?":"&")+"widget=True")):e.content&&(_.isFunction(e.content)?e.content(t.$content):t.$content.html(e.content))}}),s=Backbone.View.extend({defaultOptions:{frame:{cols:6,rows:3},rows:1e3,cell:130,margin:5,scroll:5,top_min:40,frame_max:9,visible:!0},cols:0,top:0,top_max:0,frame_z:0,frame_counter:0,frame_uid:0,frame_list:{},frame_shadow:null,visible:!1,event:{},initialize:function(t){var e=this;this.options=_.defaults(t||{},this.defaultOptions),this.visible=this.options.visible,this.top=this.top_max=this.options.top_min,this.setElement($("<div/>").addClass("galaxy-frame").append($("<div/>").addClass("frame-background")).append($("<div/>").addClass("frame-menu frame-scroll-up fa fa-chevron-up fa-2x")).append($("<div/>").addClass("frame-menu frame-scroll-down fa fa-chevron-down fa-2x"))),this.frame_shadow=new Backbone.View({el:$("<div/>").addClass("corner frame-shadow")}),this.$el.append(this.frame_shadow.$el),this._frameInit(this.frame_shadow,"#frame-shadow"),this._frameResize(this.frame_shadow,{width:0,height:0}),this.frame_list["#frame-shadow"]=this.frame_shadow,this.visible?this.show():this.hide(),this._panelRefresh(),$(window).resize(function(){e.visible&&e._panelRefresh()})},render:function(){this.$(".frame-scroll-up")[this.top!=this.options.top_min&&"show"||"hide"](),this.$(".frame-scroll-down")[this.top!=this.top_max&&"show"||"hide"]()},add:function(t){if(this.frame_counter>=this.options.frame_max)Galaxy.modal.show({title:(0,i.default)("Warning"),body:"You have reached the maximum number of allowed frames ("+this.options.frame_max+").",buttons:{Close:function(){Galaxy.modal.hide()}}});else{var e="#frame-"+this.frame_uid++;if(0!==$(e).length)Galaxy.modal.show({title:(0,i.default)("Error"),body:"This frame already exists. This page might contain multiple frame managers.",buttons:{Close:function(){Galaxy.modal.hide()}}});else{this.top=this.options.top_min;var s=new o(t);this.$el.append(s.$el),t.width=this._toPixelCoord("width",this.options.frame.cols),t.height=this._toPixelCoord("height",this.options.frame.rows),this.frame_z=parseInt(s.$el.css("z-index")),this.frame_list[e]=s,this.frame_counter++,this._frameInit(s,e),this._frameResize(s,{width:t.width,height:t.height}),this._frameInsert(s,{top:0,left:0},!0),!this.visible&&this.show(),this.trigger("add")}}},del:function(t){var e=this,i=t.$el;i.fadeOut("fast",function(){i.remove(),delete e.frame_list[t.id],e.frame_counter--,e._panelRefresh(!0),e._panelAnimationComplete(),e.trigger("remove")})},show:function(){this.visible=!0,this.$el.fadeIn("fast"),this.trigger("show")},hide:function(){this.event.type||(this.visible=!1,this.$el.fadeOut("fast",function(){$(this).hide()}),this.trigger("hide"))},length:function(){return this.frame_counter},events:{mousemove:"_eventFrameMouseMove",mouseup:"_eventFrameMouseUp",mouseleave:"_eventFrameMouseUp",mousewheel:"_eventPanelScroll",DOMMouseScroll:"_eventPanelScroll","mousedown .frame":"_eventFrameMouseDown","mousedown .frame-background":"_eventHide","mousedown .frame-scroll-up":"_eventPanelScroll_up","mousedown .frame-scroll-down":"_eventPanelScroll_down","mousedown .f-close":"_eventFrameClose"},_eventFrameMouseDown:function(t){$(".tooltip").hide(),this.event.type||(($(t.target).hasClass("f-header")||$(t.target).hasClass("f-title"))&&(this.event.type="drag"),$(t.target).hasClass("f-resize")&&(this.event.type="resize"),this.event.type&&(t.preventDefault(),this.event.target=this._frameIdentify(t.target),this.event.xy={x:t.originalEvent.pageX,y:t.originalEvent.pageY},this._frameDragStart(this.event.target)))},_eventFrameMouseMove:function(t){if(this.event.type){var e={x:t.originalEvent.pageX,y:t.originalEvent.pageY},i={x:e.x-this.event.xy.x,y:e.y-this.event.xy.y};this.event.xy=e;var o=this._frameScreen(this.event.target);if("resize"==this.event.type){o.width+=i.x,o.height+=i.y;var s=this.options.cell-this.options.margin-1;o.width=Math.max(o.width,s),o.height=Math.max(o.height,s),this._frameResize(this.event.target,o),o.width=this._toGridCoord("width",o.width)+1,o.height=this._toGridCoord("height",o.height)+1,o.width=this._toPixelCoord("width",o.width),o.height=this._toPixelCoord("height",o.height),this._frameResize(this.frame_shadow,o),this._frameInsert(this.frame_shadow,{top:this._toGridCoord("top",o.top),left:this._toGridCoord("left",o.left)})}else if("drag"==this.event.type){o.left+=i.x,o.top+=i.y,this._frameOffset(this.event.target,o);var n={top:this._toGridCoord("top",o.top),left:this._toGridCoord("left",o.left)};0!==n.left&&n.left++,this._frameInsert(this.frame_shadow,n)}}},_eventFrameMouseUp:function(t){this.event.type&&(this._frameDragStop(this.event.target),this.event.type=null)},_eventFrameClose:function(t){this.event.type||(t.preventDefault(),this.del(this._frameIdentify(t.target)))},_eventHide:function(t){!this.event.type&&this.hide()},_eventPanelScroll:function(t){!this.event.type&&this.visible&&(0!==$(t.srcElement).parents(".frame").length?t.stopPropagation():(t.preventDefault(),this._panelScroll(t.originalEvent.detail?t.originalEvent.detail:t.originalEvent.wheelDelta/-3)))},_eventPanelScroll_up:function(t){this.event.type||(t.preventDefault(),this._panelScroll(-this.options.scroll))},_eventPanelScroll_down:function(t){this.event.type||(t.preventDefault(),this._panelScroll(this.options.scroll))},_frameIdentify:function(t){return this.frame_list["#"+$(t).closest(".frame").attr("id")]},_frameDragStart:function(t){this._frameFocus(t,!0);var e=this._frameScreen(t);this._frameResize(this.frame_shadow,e),this._frameGrid(this.frame_shadow,t.grid_location),t.grid_location=null,this.frame_shadow.$el.show(),$(".f-cover").show()},_frameDragStop:function(t){this._frameFocus(t,!1);var e=this._frameScreen(this.frame_shadow);this._frameResize(t,e),this._frameGrid(t,this.frame_shadow.grid_location,!0),this.frame_shadow.grid_location=null,this.frame_shadow.$el.hide(),$(".f-cover").hide(),this._panelAnimationComplete()},_toGridCoord:function(t,e){var i="width"==t||"height"==t?1:-1;return"top"==t&&(e-=this.top),parseInt((e+i*this.options.margin)/this.options.cell,10)},_toPixelCoord:function(t,e){var i="width"==t||"height"==t?1:-1,o=e*this.options.cell-i*this.options.margin;return"top"==t&&(o+=this.top),o},_toGrid:function(t){return{top:this._toGridCoord("top",t.top),left:this._toGridCoord("left",t.left),width:this._toGridCoord("width",t.width),height:this._toGridCoord("height",t.height)}},_toPixel:function(t){return{top:this._toPixelCoord("top",t.top),left:this._toPixelCoord("left",t.left),width:this._toPixelCoord("width",t.width),height:this._toPixelCoord("height",t.height)}},_isCollision:function(t){for(var e in this.frame_list){var i=this.frame_list[e];if(null!==i.grid_location&&function(t,e){return!(t.left>e.left+e.width-1||t.left+t.width-1<e.left||t.top>e.top+e.height-1||t.top+t.height-1<e.top)}(t,i.grid_location))return!0}return!1},_locationRank:function(t){return t.top*this.cols+t.left},_panelRefresh:function(t){this.cols=parseInt($(window).width()/this.options.cell,10)+1,this._frameInsert(null,null,t)},_panelAnimationComplete:function(){var t=this;$(".frame").promise().done(function(){t._panelScroll(0,!0)})},_panelScroll:function(t,e){var i=this.top-this.options.scroll*t;if(i=Math.max(i,this.top_max),i=Math.min(i,this.options.top_min),this.top!=i){for(var o in this.frame_list){var s=this.frame_list[o];if(null!==s.grid_location){var n={top:s.screen_location.top-(this.top-i),left:s.screen_location.left};this._frameOffset(s,n,e)}}this.top=i}this.render()},_frameInit:function(t,e){t.id=e,t.screen_location={},t.grid_location={},t.grid_rank=null,t.$el.attr("id",e.substring(1))},_frameInsert:function(t,e,i){var o=this,s=[];t&&(t.grid_location=null,s.push([t,this._locationRank(e)])),_.each(this.frame_list,function(t){null!==t.grid_location&&(t.grid_location=null,s.push([t,t.grid_rank]))}),s.sort(function(t,e){return t[1]<e[1]?-1:t[1]>e[1]?1:0}),_.each(s,function(t){o._framePlace(t[0],i)}),this.top_max=0,_.each(this.frame_list,function(t){null!==t.grid_location&&(o.top_max=Math.max(o.top_max,t.grid_location.top+t.grid_location.height))}),this.top_max=$(window).height()-this.top_max*this.options.cell-2*this.options.margin,this.top_max=Math.min(this.top_max,this.options.top_min),this.render()},_framePlace:function(t,e){t.grid_location=null;for(var i=this._toGrid(this._frameScreen(t)),o=!1,s=0;s<this.options.rows;s++){for(var n=0;n<Math.max(1,this.cols-i.width);n++)if(i.top=s,i.left=n,!this._isCollision(i)){o=!0;break}if(o)break}o?this._frameGrid(t,i,e):console.log("Grid dimensions exceeded.")},_frameFocus:function(t,e){t.$el.css("z-index",this.frame_z+(e?1:0))},_frameOffset:function(t,e,i){if(t.screen_location.left=e.left,t.screen_location.top=e.top,i){this._frameFocus(t,!0);var o=this;t.$el.animate({top:e.top,left:e.left},"fast",function(){o._frameFocus(t,!1)})}else t.$el.css({top:e.top,left:e.left})},_frameResize:function(t,e){t.$el.css({width:e.width,height:e.height}),t.screen_location.width=e.width,t.screen_location.height=e.height},_frameGrid:function(t,e,i){t.grid_location=e,this._frameOffset(t,this._toPixel(e),i),t.grid_rank=this._locationRank(e)},_frameScreen:function(t){var e=t.screen_location;return{top:e.top,left:e.left,width:e.width,height:e.height}}});t.default={View:s}});
//# sourceMappingURL=../../../maps/mvc/ui/ui-frames.js.map