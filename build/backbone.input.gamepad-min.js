!function(e){"function"==typeof define&&define.amd?define("backbone.input.gamepad",["underscore","backbone"],e):"object"==typeof module&&module&&"object"==typeof module.exports?module.exports=e:e(window._,window.Backbone)}(function(e,t){var n,a=window.APP,i="undefined"!=typeof a&&"undefined"!=typeof a.View,o=i?a.View:t.View,d=i?a.Layout:!1,p=navigator.getGamepads||navigator.webkitGetGamepads||!1,s={xbox:["A","B","X","Y","LeftShoulder","RightShoulder","LeftTrigger","RightTrigger","Back","Start","LeftThumbstick","RightThumbstick","DPad_Up","DPad_Down","DPad_Left","DPad_Right"],playstation:[],steam:[]},r=o.prototype.params||new t.Model;r.set({gamepads:{}});var m,c={monitorGamepad:function(t){"undefined"==typeof t&&(t=!0),t&&p?(window.addEventListener("gamepadconnected",e.bind(this._onConnectGamepad,this)),window.addEventListener("gamepaddisconnected",e.bind(this._onDisconnectGamepad,this)),n=setInterval(e.bind(this._scanGamepads,this),500)):(window.removeEventListener("gamepadconnected"),window.removeEventListener("gamepaddisconnected"),clearInterval(n))},onClickGamepad:function(){},onConnectGamepad:function(){},onDisconnectGamepad:function(){},_onConnectGamepad:function(t){var n=e.inArray("gamepad",this.options.monitor);if(!n)return this.monitorGamepad(!1);var a=t.gamepad||t.detail.gamepad;t.detail&&(t.gamepad=t.detail.gamepad),e.inDebug()&&console.log("connect",t),t.stopPropagation&&t.stopPropagation();var i=this.params.get("gamepads");return i[a.index]=a,this.params.set({gamepads:i}),this.onConnectGamepad?this.onConnectGamepad(t):void 0},_onDisconnectGamepad:function(t){var n=e.inArray("gamepad",this.options.monitor);if(!n)return this.monitorGamepad(!1);e.inDebug()&&console.log("disconnect",t),t.stopPropagation&&t.stopPropagation();var a=this.params.get("gamepads");return delete a[t.gamepad.index],this.params.set({gamepads:a}),this.trigger("gamepaddisconnected",t),this.onDisconnectGamepad?this.onDisconnectGamepad(t):void 0},_scanGamepads:function(){for(var e=p.call(navigator),t=this.params.get("gamepads"),n=0;n<e.length;n++)if(e[n])if(e[n].index in t)t[e[n].index]=e[n];else{var a=new CustomEvent("gamepadconnected",{detail:{gamepad:e[n]}});window.dispatchEvent(a)}this.params.set({gamepads:t})},_updateGamepads:function(t){var n=e.inArray("gamepad",this.options.monitor);return n?(this.trigger("updateGamepads",t),this.updateGamepads&&this.updateGamepads(t),void g.call(window,e.bind(this._updateGamepads,this))):this.monitorGamepad(!1)},_buttonKey:function(e){return s.xbox[e]}},u=o.extend(e.extend({},c,{options:{monitor:[]},params:r,state:{gamepadButtons:[]},initialize:function(t){return t=t||{},e.bindAll(this,"onClickGamepad"),t.monitor&&e.extend(this.options.monitor,t.monitor),e.inArray("gamepad",this.options.monitor)&&(this.monitorGamepad(),g(e.bind(this._updateGamepads,this)),this.on("gamepadclick",this.onClickGamepad)),o.prototype.initialize.call(this,t)}}));d&&(m=d.extend(e.extend({},c,{options:{monitor:[]},params:r,state:{gamepadButtons:[]},initialize:function(t){return t=t||{},t.monitor&&e.extend(this.options.monitor,t.monitor),e.inArray("gamepad",this.options.monitor)&&(this.monitorGamepad(),g(e.bind(this._updateGamepads,this)),this.on("gamepadclick",this.onClickGamepad)),d.prototype.initialize.call(this,t)}}))),e.mixin({inArray:function(e,t){return t instanceof Array?t.indexOf(e)>-1:!1},inDebug:function(){return"undefined"!=typeof DEBUG&&DEBUG}});var g=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame;return e.isUndefined(t.Input)&&(t.Input={}),t.Input.Gamepad=u,"object"==typeof module&&module&&"object"==typeof module.exports?module.exports=u:"function"==typeof define&&define.amd&&define([],function(){return u}),"object"==typeof window&&"object"==typeof window.document&&(i?(a.View=u,a.Layout=m,a.Input=a.Input||{},a.Input.Gamepad=t.Input.Gamepad,window.APP=a):t.View=u,window.Backbone=t),u});