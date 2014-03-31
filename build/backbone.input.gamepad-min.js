!function(e,t,n,a){var i,o="undefined"!=typeof a&&"undefined"!=typeof a.View,d=o?a.View:n.View,s=navigator.webkitGetGamepads||navigator.getGamepads||!1,p=d.extend({options:{monitor:[]},params:new n.Model({gamepads:{}}),state:{},initialize:function(e){return(this.options.monitor||e.monitor)&&(this.monitor(),r(t.bind(this._updateGamepads,this))),d.prototype.initialize.call(this,e)},monitor:function(n){"undefined"==typeof n&&(n=!0),n&&s?(e.addEventListener("gamepadconnected",t.bind(this._onConnectGamepad,this)),e.addEventListener("gamepaddisconnected",t.bind(this._onDisconnectGamepad,this)),i=setInterval(t.bind(this._scanGamepads,this),500)):(e.removeEventListener("gamepadconnected"),e.removeEventListener("gamepaddisconnected"),clearInterval(i))},onConnectGamepad:function(){},onDisconnectGamepad:function(){},_onConnectGamepad:function(e){var n=t.inArray("gamepad",this.options.monitor);if(!n)return this.monitor(!1);var a=e.gamepad||e.detail.gamepad;e.detail.gamepad&&(e.gamepad=e.detail.gamepad),t.inDebug()&&console.log("connect",e),e.stopPropagation&&e.stopPropagation();var i=this.params.get("gamepads");return i[a.index]=a,this.params.set({gamepads:i}),this.onConnectGamepad?this.onConnectGamepad(e):void 0},_onDisconnectGamepad:function(e){var n=t.inArray("gamepad",this.options.monitor);if(!n)return this.monitor(!1);t.inDebug()&&console.log("disconnect",e),e.stopPropagation&&e.stopPropagation();var a=this.params.get("gamepads");return delete a[e.gamepad.index],this.params.set({gamepads:a}),this.trigger("gamepaddisconnected",e),this.onDisconnectGamepad?this.onDisconnectGamepad(e):void 0},_scanGamepads:function(){for(var t=s.call(navigator),n=this.params.get("gamepads"),a=0;a<t.length;a++)if(t[a])if(t[a].index in n)n[t[a].index]=t[a];else{var i=new CustomEvent("gamepadconnected",{detail:{gamepad:t[a]}});e.dispatchEvent(i)}this.params.set({gamepads:n})},_updateGamepads:function(n){var a=t.inArray("gamepad",this.options.monitor);return a?(this.trigger("updateGamepads",n),this.updateGamepads&&this.updateGamepads(n),void r.call(e,t.bind(this._updateGamepads,this))):this.monitor(!1)}});t.mixin({inArray:function(e,t){return t.indexOf(e)>-1},inDebug:function(){return"undefined"!=typeof DEBUG&&DEBUG}});var r=e.mozRequestAnimationFrame||e.webkitRequestAnimationFrame||e.requestAnimationFrame;t.isUndefined(n.Input)&&(n.Input={}),n.Input.Gamepad=p,"object"==typeof module&&module&&"object"==typeof module.exports?module.exports=p:"function"==typeof define&&define.amd&&define([],function(){return p}),"object"==typeof e&&"object"==typeof e.document&&(o?(a.View=p,a.Input=a.Input||{},a.Input.Gamepad=n.Input.Gamepad,e.APP=a):n.View=p,e.Backbone=n)}(this.window,this._,this.Backbone,this.APP);