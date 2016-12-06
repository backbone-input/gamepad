!function(t){"function"==typeof define&&define.amd?define("backbone.input.gamepad",["underscore","backbone"],t):"object"==typeof module&&module&&"object"==typeof module.exports?module.exports=t:t(window._,window.Backbone)}(function(t,e){var n,a=window.APP,i="undefined"!=typeof a&&"undefined"!=typeof a.View,o=i?a.View:e.View,r=i?a.Layout:!1,d=navigator.getGamepads||navigator.webkitGamepads||navigator.webkitGetGamepads||!1,s=["Button_1","Button_2","Button_3","Button_4","LeftShoulder","RightShoulder","LeftTrigger","RightTrigger","Back","Start","LeftThumbstick","RightThumbstick","DPad_Up","DPad_Down","DPad_Left","DPad_Right","Home"],p=function(t,e,n){return e<t.length?t[e]:n+(e-t.length+1)},u=o.prototype.params||new e.Model;u.set({gamepads:{}});var c={countGamepads:function(){var t=this.params.get("gamepads");return Object.keys(t).length},monitorGamepad:function(e){"undefined"==typeof e&&(e=!0),e&&d?(window.addEventListener("gamepadconnected",t.bind(this._onConnectGamepad,this)),window.addEventListener("gamepaddisconnected",t.bind(this._onDisconnectGamepad,this)),n=setInterval(t.bind(this._scanGamepads,this),500)):(window.removeEventListener("gamepadconnected"),window.removeEventListener("gamepaddisconnected"),clearInterval(n))},onClickGamepad:function(){},onConnectGamepad:function(){},onDisconnectGamepad:function(){},_onConnectGamepad:function(e){var n=t.inArray("gamepad",this.options.monitor);if(!n)return this.monitorGamepad(!1);var a=e.gamepad||e.detail.gamepad;e.detail&&(e.gamepad=e.detail.gamepad),t.inDebug()&&console.log("connect",e),e.stopPropagation&&e.stopPropagation();var i=this.params.get("gamepads");return i[a.index]=a,this.params.set({gamepads:i}),this.onConnectGamepad?this.onConnectGamepad(e):void 0},_onDisconnectGamepad:function(e){var n=t.inArray("gamepad",this.options.monitor);if(!n)return this.monitorGamepad(!1);t.inDebug()&&console.log("disconnect",e),e.stopPropagation&&e.stopPropagation();var a=this.params.get("gamepads");return delete a[e.gamepad.index],this.params.set({gamepads:a}),this.trigger("gamepaddisconnected",e),this.onDisconnectGamepad?this.onDisconnectGamepad(e):void 0},_scanGamepads:function(){for(var t=d.call(navigator),e=this.params.get("gamepads"),n=0;n<t.length;n++)if(t[n])if(t[n].index in e)e[t[n].index]=t[n];else{var a=new CustomEvent("gamepadconnected",{detail:{gamepad:t[n]}});window.dispatchEvent(a)}this.params.set({gamepads:e})},_updateGamepads:function(e){var n=t.inArray("gamepad",this.options.monitor);return n?(this.trigger("updateGamepads",e),this.updateGamepads&&this.updateGamepads(e),void g.call(window,t.bind(this._updateGamepads,this))):this.monitorGamepad(!1)},_buttonKey:function(t,e){e=e||"xbox";var n=mapping[e].index[t];return s[n]},getType:function(){return"WebKit"},listButtons:function(t){for(var e=0;e<t.buttons.length;e++){var n,a,i=t.buttons[e];"object"==typeof i?(n=i.pressed,a=i.value):(a=i,n=1==i),console.log("Button %d: %s (%f)",e,n?"pressed":"not pressed",a)}},_resolveControllerType:function(t){return t=t.toLowerCase().replace(/\s+/g," ").replace(/^\s+|\s+$/g,""),-1!==t.indexOf("playstation")?l.Type.PLAYSTATION:-1!==t.indexOf("logitech")||-1!==t.indexOf("wireless gamepad")?l.Type.LOGITECH:-1!==t.indexOf("xbox")||-1!==t.indexOf("360")?l.Type.XBOX:-1!==t.indexOf("79-6-generic")&&-1!==t.indexOf("joystick")||-1!==t.indexOf("vendor: 0079 product: 0006")&&-1!==t.indexOf("generic usb joystick")?l.Type.N64:l.Type.UNKNOWN}},m=function(){};m.prototype._connect=function(t){var e,n,a=this._resolveMapping(t);for(t.state={},t.lastState={},t.updater=[],e=a.buttons.byButton.length,n=0;e>n;n++)this._addButtonUpdater(t,a,n);for(e=a.axes.byAxis.length,n=0;e>n;n++)this._addAxisUpdater(t,a,n);this.gamepads[t.index]=t,this._fire(l.Event.CONNECTED,t)},m.prototype._addButtonUpdater=function(t,e,n){var a=nullFunction,i=p(l.StandardButtons,n,"EXTRA_BUTTON_"),o=this._createButtonGetter(t,e.buttons,n),r=this,d={gamepad:t,control:i};t.state[i]=0,t.lastState[i]=0,a=function(){var e=o(),n=t.lastState[i],a=e>.5,s=n>.5;t.state[i]=e,a&&!s?r._fire(l.Event.BUTTON_DOWN,Object.create(d)):!a&&s&&r._fire(l.Event.BUTTON_UP,Object.create(d)),0!==e&&1!==e&&e!==n&&r._fireAxisChangedEvent(t,i,e),t.lastState[i]=e},t.updater.push(a)},m.prototype._addAxisUpdater=function(t,e,n){var a=nullFunction,i=p(l.StandardAxes,n,"EXTRA_AXIS_"),o=this._createAxisGetter(t,e.axes,n),r=this;t.state[i]=0,t.lastState[i]=0,a=function(){var e=o(),n=t.lastState[i];t.state[i]=e,e!==n&&r._fireAxisChangedEvent(t,i,e),t.lastState[i]=e},t.updater.push(a)},m.prototype._fireAxisChangedEvent=function(t,e,n){var a={gamepad:t,axis:e,value:n};this._fire(l.Event.AXIS_CHANGED,a)},m.prototype._createButtonGetter=function(){var t=function(){return 0},e=function(e,n,a){var i=t;return a>n?i=function(){var t=a-n,i=e();return i=(i-n)/t,0>i?0:i}:n>a&&(i=function(){var t=n-a,i=e();return i=(i-a)/t,i>1?0:1-i}),i},n=function(t){return"[object Array]"===Object.prototype.toString.call(t)};return function(a,i,o){var r,d=t,s=this;return r=i.byButton[o],-1!==r?"number"==typeof r&&r<a.buttons.length&&(d=function(){var t=a.buttons[r];return"number"==typeof t?t:"number"==typeof t.value?t.value:0}):i.byAxis&&o<i.byAxis.length&&(r=i.byAxis[o],n(r)&&3==r.length&&r[0]<a.axes.length&&(d=function(){var t=a.axes[r[0]];return s._applyDeadzoneMaximize(t)},d=e(d,r[1],r[2]))),d}}(),m.prototype._createAxisGetter=function(){var t=function(){return 0};return function(e,n,a){var i,o=t,r=this;return i=n.byAxis[a],-1!==i&&"number"==typeof i&&i<e.axes.length&&(o=function(){var t=e.axes[i];return r._applyDeadzoneMaximize(t)}),o}}(),m.prototype._resolveMapping=function(t){var e,n,a=l.Mappings,i=null,o={platform:this.platform.getType(),type:this._resolveControllerType(t.id)};for(e=0;!i&&e<a.length;e++)n=a[e],l.envMatchesFilter(n.env,o)&&(i=n);return i||l.StandardMapping},m.prototype._applyDeadzoneMaximize=function(t,e,n){return e="undefined"!=typeof e?e:this.deadzone,n="undefined"!=typeof n?n:this.maximizeThreshold,t>=0?e>t?t=0:t>n&&(t=1):t>-e?t=0:-n>t&&(t=-1),t};var f,l=o.extend(t.extend({},c,{options:{monitor:[]},params:u,state:{gamepadButtons:[]},initialize:function(e){return e=e||{},t.bindAll(this,"onClickGamepad"),e.monitor&&t.extend(this.options.monitor,e.monitor),t.inArray("gamepad",this.options.monitor)&&(this.monitorGamepad(),g(t.bind(this._updateGamepads,this)),this.on("gamepadclick",this.onClickGamepad)),l.__super__.initialize.call(this,e)}}));r&&(f=r.extend(t.extend({},c,{options:{monitor:[]},params:u,state:{gamepadButtons:[]},initialize:function(e){return e=e||{},e.monitor&&t.extend(this.options.monitor,e.monitor),t.inArray("gamepad",this.options.monitor)&&(this.monitorGamepad(),g(t.bind(this._updateGamepads,this)),this.on("gamepadclick",this.onClickGamepad)),f.__super__.initialize.call(this,e)}}))),t.mixin({inArray:function(t,e){return e instanceof Array?e.indexOf(t)>-1:!1},inDebug:function(){return"undefined"!=typeof DEBUG&&DEBUG}});var g=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame;return t.isUndefined(e.Input)&&(e.Input={}),e.Input.Gamepad=l,"object"==typeof module&&module&&"object"==typeof module.exports?module.exports=l:"function"==typeof define&&define.amd&&define([],function(){return l}),"object"==typeof window&&"object"==typeof window.document&&(i?(a.View=l,a.Layout=f,a.Input=a.Input||{},a.Input.Gamepad=e.Input.Gamepad,window.APP=a):e.View=l,window.Backbone=e),l});