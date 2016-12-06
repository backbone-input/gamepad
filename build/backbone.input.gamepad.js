/**
 * @name backbone.input.gamepad
 * Gamepad event bindings for Backbone views
 *
 * Version: 0.3.5 (Tue, 06 Dec 2016 09:36:22 GMT)
 * Homepage: https://github.com/backbone-input/gamepad
 *
 * @author makesites
 * Initiated by Makis Tracend (@tracend)
 *
 * @cc_on Copyright © Makesites.org
 * @license Dual-licensed: MIT license
 */

(function (lib) {

	//"use strict";

	// Support module loaders
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define('backbone.input.gamepad', ['underscore', 'backbone'], lib);
	} else if ( typeof module === "object" && module && typeof module.exports === "object" ){
		// Expose as module.exports in loaders that implement CommonJS module pattern.
		module.exports = lib;
	} else {
		// Browser globals
		lib(window._, window.Backbone);
	}

}(function (_, Backbone) {

	var APP = window.APP;
	// support for Backbone APP() view if available...
	var isAPP = ( typeof APP !== "undefined" && typeof APP.View !== "undefined" );

	var View = ( isAPP ) ? APP.View : Backbone.View;
	var Layout = ( isAPP ) ? APP.Layout : false;
	var getGamepads = navigator.getGamepads || navigator.webkitGamepads || navigator.webkitGetGamepads || false;
	var scanInterval;


// default options
var defaults = {
	analogMin: 0.03,
	analogMax: 0.97
};


	// Map buttons to key press
	// Key name convention taken from UDK's GFxProjectedUI.uc UnrealScript class file (\Src\UTGame\Classes\)
	// order matches the order returned from the navigator.getGamepads object
	var buttonMap = [
		"Button_1", "Button_2", "Button_3", "Button_4", "LeftShoulder", "RightShoulder", "LeftTrigger", "RightTrigger", "Back", "Start", "LeftThumbstick", "RightThumbstick", "DPad_Up", "DPad_Down", "DPad_Left", "DPad_Right", "Home"
	];

	var axes = ['LeftThumbstick_X', 'LeftThumbstick_Y', 'RightThumbstick_X', 'RightThumbstick_Y'];

	var mappings = {
		// Generic
		'default': {
			index: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
			axes: [0, 1, 2, 3],
			buttons: ["A", "B", "X", "Y"]
		},
		// Xbox
		'xbox': {
			index: [0, 1, 2, 3, 4, 5, 15, 16, 9, 8, 6, 7, 11, 12, 13, 14, 10],
			axes: [0, 1, 2, 3],
			buttons: ["A", "B", "X", "Y"]
		},
		// PlayStation
		'playstation': {
			index: [14, 13, 15, 12, 10, 11, 8, 9, 0, 3, 1, 2, 4, 6, 7, 5, 16],
			axes: [0, 1, 2, 3],
			buttons: ["Cross", "Circle", "Square", "Triangle"]
		},
		// Logitech
		'logitech': {
			index: [0, 1, 2, 3, 4, 5, -1, -1, 6, 7, 8, 9, 11, 12, 13, 14, 10],
			axes: [0, 1, 3, 4],
			buttons: ["A", "B", "X", "Y"]
		},
		'steam': {} //TBA
	};

	// Helpers
	var getControlName = function(names, index, extraPrefix) {
		return (index < names.length) ? names[index] : extraPrefix + (index - names.length + 1);
	};

// extend existing params
var params = View.prototype.params || new Backbone.Model();

// defaults
params.set({
	gamepads: {}
});


	var methods = {


		// returns the number of connected gamepads.
		countGamepads: function() {
			var gamepads = this.params.get("gamepads");
			return Object.keys( gamepads ).length;
		},

		/* events:*/
		monitorGamepad: function( state ){
			// fallback
			if(typeof state == "undefined") state = true;

			if( state && getGamepads){
				window.addEventListener("gamepadconnected", _.bind(this._onConnectGamepad, this));
				window.addEventListener("gamepaddisconnected", _.bind(this._onDisconnectGamepad, this));
				// watch for new connections
				scanInterval = setInterval( _.bind(this._scanGamepads, this), 500);

			} else {
				window.removeEventListener("gamepadconnected");
				window.removeEventListener("gamepaddisconnected");
				clearInterval(scanInterval);
			}

		},

		// public methods
		onClickGamepad: function( e ) {

		},

		onConnectGamepad: function( e ) {

		},

		onDisconnectGamepad: function( e ) {

		},

		// private methods
		_onConnectGamepad: function( e ) {
			// prerequisite
			var monitor = _.inArray("gamepad", this.options.monitor);
			if( !monitor ) return this.monitorGamepad(false);
			// variables
			var gamepad = e.gamepad || e.detail.gamepad;
			// copy data to the event root
			if(e.detail) e.gamepad = e.detail.gamepad; // is this even needed?
			// flags
			if( _.inDebug() ) console.log("connect", e);
			if (e.stopPropagation) e.stopPropagation();
			//if (e.preventDefault) e.preventDefault();
			// set data
			var gamepads = this.params.get("gamepads");
			gamepads[gamepad.index] = gamepad;
			this.params.set({
				gamepads : gamepads
			});
			//this.state.play = true;
			if(this.onConnectGamepad) return this.onConnectGamepad( e );
		},

		_onDisconnectGamepad: function( e ) {
			// prerequisite
			var monitor = _.inArray("gamepad", this.options.monitor);
			if( !monitor ) return this.monitorGamepad(false);
			// flags
			if( _.inDebug() ) console.log("disconnect", e);
			if (e.stopPropagation) e.stopPropagation();
			//if (e.preventDefault) e.preventDefault();
			// delete data
			var gamepads = this.params.get("gamepads");
			delete gamepads[e.gamepad.index];
			this.params.set({
				gamepads : gamepads
			});
			//this.state.play = false;
			this.trigger("gamepaddisconnected", e); // Gamepad.Event.DISCONNECTED, e.gamepad
			if(this.onDisconnectGamepad) return this.onDisconnectGamepad( e );
		},

		_scanGamepads: function(){

			var controllers = getGamepads.call(navigator); // call method with the right context
			var gamepads = this.params.get("gamepads");
			for (var i = 0; i < controllers.length; i++) {
				if (controllers[i]) {
					if (!(controllers[i].index in gamepads)) {
						// Create the event (data nested in detail unfortunately..)
						var event = new CustomEvent("gamepadconnected", { detail: { gamepad: controllers[i] } });
						// Dispatch/Trigger/Fire the event
						window.dispatchEvent(event);
					} else {
						gamepads[controllers[i].index] = controllers[i];
					}
				}
			}
			/* // scan existing gamepads for disconnects
			for (i = gamepads.length - 1; i >= 0; i--) {
				gamepad = gamepads[i];
				if (controllers.indexOf(gamepad) < 0) {
					gamepads.splice(i, 1);
					this.thigger("gamepaddisconnect", gamepad);
				}
			}
			*/
			// update data
			this.params.set({
				gamepads : gamepads
			});
		},

		_updateGamepads: function( e ){
			var monitor = _.inArray("gamepad", this.options.monitor);
			if( !monitor ) return this.monitorGamepad(false);
			this.trigger("updateGamepads", e);
			if(this.updateGamepads) this.updateGamepads( e );
			// repeat on animation frame
			tick.call( window, _.bind(this._updateGamepads, this) );
		},

		_buttonKey: function( number, type ){
			// only support xbox for now?
			type = type || "xbox";
			var index = mapping[type].index[ number ];
			return buttonMap[index];
		},

		getType: function( id ) {
			return 'WebKit';
		},

		listButtons: function(gamepad) {
			for (var i = 0; i < gamepad.buttons.length; i++) {
				var b = gamepad.buttons[i];
				var pressed, val;
				if (typeof(b) == "object") {
					pressed = b.pressed;
					val = b.value;
				} else {
					val = b;
					pressed = b == 1.0;
				}
				console.log("Button %d: %s (%f)", i, pressed ? "pressed" : "not pressed", val);
			}
		},

		_resolveControllerType: function(id) {
			// Lowercase and strip all extra whitespace.
			// id = gamepad.id
			id = id.toLowerCase().replace(/\s+/g, ' ').replace(/^\s+|\s+$/g, '');

			if (id.indexOf('playstation') !== -1) {
				return Gamepad.Type.PLAYSTATION;
			} else if (
				id.indexOf('logitech') !== -1 || id.indexOf('wireless gamepad') !== -1) {
				return Gamepad.Type.LOGITECH;
			} else if (id.indexOf('xbox') !== -1 || id.indexOf('360') !== -1) {
				return Gamepad.Type.XBOX;
			} else if ((id.indexOf('79-6-generic') !== -1 && id.indexOf('joystick') !== -1) ||
				(id.indexOf('vendor: 0079 product: 0006') !== -1 &&
					id.indexOf('generic usb joystick') !== -1)) {
				return Gamepad.Type.N64;
			} else {
				return Gamepad.Type.UNKNOWN;
			}
		}

	};




		var tmpGamepad = function(){};
		/**
		 * Registers given gamepad.
		 *
		 * @method _connect
		 * @param {Object} gamepad Gamepad to connect to
		 * @private
		 */
		tmpGamepad.prototype._connect = function(gamepad) {
			var mapping = this._resolveMapping(gamepad);
			var count;
			var i;

			//gamepad.mapping = this._resolveMapping(gamepad);
			gamepad.state = {};
			gamepad.lastState = {};
			gamepad.updater = [];

			count = mapping.buttons.byButton.length;
			for (i = 0; i < count; i++) {
				this._addButtonUpdater(gamepad, mapping, i);
			}

			count = mapping.axes.byAxis.length;
			for (i = 0; i < count; i++) {
				this._addAxisUpdater(gamepad, mapping, i);
			}

			this.gamepads[gamepad.index] = gamepad;

			this._fire(Gamepad.Event.CONNECTED, gamepad);
		};

		/**
		 * Adds an updater for a button control
		 *
		 * @method _addButtonUpdater
		 * @private
		 * @param {Object} gamepad the gamepad for which to create the updater
		 * @param {Object} mapping the mapping on which to work on
		 * @param {Number} index button index
		 */
		tmpGamepad.prototype._addButtonUpdater = function(gamepad, mapping, index) {
			var updater = nullFunction;
			var controlName = getControlName(Gamepad.StandardButtons, index, 'EXTRA_BUTTON_');
			var getter = this._createButtonGetter(gamepad, mapping.buttons, index);
			var that = this;
			var buttonEventData = {
				gamepad: gamepad,
				control: controlName
			};

			gamepad.state[controlName] = 0;
			gamepad.lastState[controlName] = 0;

			updater = function() {
				var value = getter();
				var lastValue = gamepad.lastState[controlName];
				var isDown = value > 0.5;
				var wasDown = lastValue > 0.5;

				gamepad.state[controlName] = value;

				if (isDown && !wasDown) {
					that._fire(Gamepad.Event.BUTTON_DOWN, Object.create(buttonEventData));
				} else if (!isDown && wasDown) {
					that._fire(Gamepad.Event.BUTTON_UP, Object.create(buttonEventData));
				}

				if ((value !== 0) && (value !== 1) && (value !== lastValue)) {
					that._fireAxisChangedEvent(gamepad, controlName, value);
				}

				gamepad.lastState[controlName] = value;
			};

			gamepad.updater.push(updater);
		};

		/**
		 * Adds an updater for an axis control
		 *
		 * @method _addAxisUpdater
		 * @private
		 * @param {Object} gamepad the gamepad for which to create the updater
		 * @param {Object} mapping the mapping on which to work on
		 * @param {Number} index axis index
		 */
		tmpGamepad.prototype._addAxisUpdater = function(gamepad, mapping, index) {
			var updater = nullFunction;
			var controlName = getControlName(Gamepad.StandardAxes, index, 'EXTRA_AXIS_');
			var getter = this._createAxisGetter(gamepad, mapping.axes, index);
			var that = this;

			gamepad.state[controlName] = 0;
			gamepad.lastState[controlName] = 0;

			updater = function() {
				var value = getter();
				var lastValue = gamepad.lastState[controlName];

				gamepad.state[controlName] = value;

				if ((value !== lastValue)) {
					that._fireAxisChangedEvent(gamepad, controlName, value);
				}

				gamepad.lastState[controlName] = value;
			};

			gamepad.updater.push(updater);
		};

		/**
		 * Fires an AXIS_CHANGED event
		 * @method _fireAxisChangedEvent
		 * @private
		 * @param {Object} gamepad the gamepad to notify for
		 * @param {String} controlName name of the control that changes its value
		 * @param {Number} value the new value
		 */
		tmpGamepad.prototype._fireAxisChangedEvent = function(gamepad, controlName, value) {
			var eventData = {
				gamepad: gamepad,
				axis: controlName,
				value: value
			};

			this._fire(Gamepad.Event.AXIS_CHANGED, eventData);
		};

		/**
		 * Creates a getter according to the mapping entry for the specific index.
		 * Currently supported entries:
		 *
		 * buttons.byButton[index]: Number := Index into gamepad.buttons; -1 tests byAxis
		 * buttons.byAxis[index]: Array := [Index into gamepad.axes; Zero Value, One Value]
		 *
		 * @method _createButtonGetter
		 * @private
		 * @param {Object} gamepad the gamepad for which to create a getter
		 * @param {Object} buttons the mappings entry for the buttons
		 * @param {Number} index the specific button entry
		 * @return {Function} a getter returning the value for the requested button
		 */
		tmpGamepad.prototype._createButtonGetter = (function() {
			var nullGetter = function() {
				return 0;
			};

			var createRangeGetter = function(valueGetter, from, to) {
				var getter = nullGetter;

				if (from < to) {
					getter = function() {
						var range = to - from;
						var value = valueGetter();

						value = (value - from) / range;

						return (value < 0) ? 0 : value;
					};
				} else if (to < from) {
					getter = function() {
						var range = from - to;
						var value = valueGetter();

						value = (value - to) / range;

						return (value > 1) ? 0 : (1 - value);
					};
				}

				return getter;
			};

			var isArray = function(thing) {
				return Object.prototype.toString.call(thing) === '[object Array]';
			};

			return function(gamepad, buttons, index) {
				var getter = nullGetter;
				var entry;
				var that = this;

				entry = buttons.byButton[index];
				if (entry !== -1) {
					if ((typeof(entry) === 'number') && (entry < gamepad.buttons.length)) {
						getter = function() {
							var value = gamepad.buttons[entry];

							if (typeof value === 'number') {
								return value;
							}

							if (typeof value.value === 'number') {
								return value.value;
							}

							return 0;
						};
					}
				} else if (buttons.byAxis && (index < buttons.byAxis.length)) {
					entry = buttons.byAxis[index];
					if (isArray(entry) && (entry.length == 3) && (entry[0] < gamepad.axes.length)) {
						getter = function() {
							var value = gamepad.axes[entry[0]];

							return that._applyDeadzoneMaximize(value);
						};

						getter = createRangeGetter(getter, entry[1], entry[2]);
					}
				}

				return getter;
			};
		})();

		/**
		 * Creates a getter according to the mapping entry for the specific index.
		 * Currently supported entries:
		 *
		 * axes.byAxis[index]: Number := Index into gamepad.axes; -1 ignored
		 *
		 * @method _createAxisGetter
		 * @private
		 * @param {Object} gamepad the gamepad for which to create a getter
		 * @param {Object} axes the mappings entry for the axes
		 * @param {Number} index the specific axis entry
		 * @return {Function} a getter returning the value for the requested axis
		 */
		tmpGamepad.prototype._createAxisGetter = (function() {
			var nullGetter = function() {
				return 0;
			};

			return function(gamepad, axes, index) {
				var getter = nullGetter;
				var entry;
				var that = this;

				entry = axes.byAxis[index];
				if (entry !== -1) {
					if ((typeof(entry) === 'number') && (entry < gamepad.axes.length)) {
						getter = function() {
							var value = gamepad.axes[entry];

							return that._applyDeadzoneMaximize(value);
						};
					}
				}

				return getter;
			};
		})();

		/**
		 * @method _resolveMapping
		 * @private
		 * @param {Object} gamepad the gamepad for which to resolve the mapping
		 * @return {Object} a mapping object for the given gamepad
		 */
		tmpGamepad.prototype._resolveMapping = function(gamepad) {
			var mappings = Gamepad.Mappings;
			var mapping = null;
			var env = {
				platform: this.platform.getType(),
				type: this._resolveControllerType(gamepad.id)
			};
			var i;
			var test;

			for (i = 0; !mapping && (i < mappings.length); i++) {
				test = mappings[i];
				if (Gamepad.envMatchesFilter(test.env, env)) {
					mapping = test;
				}
			}

			return mapping || Gamepad.StandardMapping;
		};

		tmpGamepad.prototype._applyDeadzoneMaximize = function(
			value,
			deadzone,
			maximizeThreshold) {
			deadzone = typeof(deadzone) !== 'undefined' ? deadzone : this.deadzone;
			maximizeThreshold = typeof(maximizeThreshold) !== 'undefined' ? maximizeThreshold : this.maximizeThreshold;

			if (value >= 0) {
				if (value < deadzone) {
					value = 0;
				} else if (value > maximizeThreshold) {
					value = 1;
				}
			} else {
				if (value > -deadzone) {
					value = 0;
				} else if (value < -maximizeThreshold) {
					value = -1;
				}
			}

			return value;
		};


	var Gamepad = View.extend( _.extend({}, methods, {

		options: {
			monitor: [] // possible values: "gamepad"
		},

		params: params,

		state : {
			gamepadButtons: []
		},

		initialize: function( options ) {
			options = options || {};
			_.bindAll(this, 'onClickGamepad');
			// prerequisite
			if(options.monitor) _.extend(this.options.monitor, options.monitor);
			if( _.inArray("gamepad", this.options.monitor) ){
				this.monitorGamepad();
				tick( _.bind(this._updateGamepads, this) );
				// events
				this.on("gamepadclick", this.onClickGamepad);
			}
			// continue...
			return Gamepad.__super__.initialize.call(this, options);
		}

	}) );

var GamepadLayout;
if( Layout ){
	GamepadLayout = Layout.extend( _.extend({}, methods, {

		options: {
			monitor: [] // possible values: "gamepad"
		},

		params: params, // create different params for the layout?

		state : {
			gamepadButtons: []
		},

		initialize: function( options ) {
			options = options || {};
			// prerequisite
			if(options.monitor) _.extend(this.options.monitor, options.monitor);
			if( _.inArray("gamepad", this.options.monitor) ){
				this.monitorGamepad();
				tick( _.bind(this._updateGamepads, this) );
				// events
				this.on("gamepadclick", this.onClickGamepad);
			}
			// continue...
			return GamepadLayout.__super__.initialize.call(this, options);
		}

	}) );

}

	// Helpers

	function bind( scope, fn ) {

		return function () {

			fn.apply( scope, arguments );

		};

	}

	_.mixin({
		inArray: function(value, array){
			// if not an array just output false
			return ( array instanceof Array ) ? (array.indexOf(value) > -1) : false;
		},
		// - Check if in debug mode (requires the existence of a global DEBUG var)
		// Usage: _.inDebug()
		inDebug : function() {
			return ( typeof DEBUG != "undefined" && DEBUG );
		}
	});

	var tick = window.requestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	window.webkitRequestAnimationFrame;




	// fallbacks
	if( _.isUndefined( Backbone.Input ) ) Backbone.Input = {};
	Backbone.Input.Gamepad = Gamepad;

	// Support module loaders
	if ( typeof module === "object" && module && typeof module.exports === "object" ) {
		// Expose as module.exports in loaders that implement CommonJS module pattern.
		module.exports = Gamepad;
	} else {
		// Register as a named AMD module, used in Require.js
		if ( typeof define === "function" && define.amd ) {
			//define( "backbone.input.mouse", [], function () { return Gamepad; } );
			//define( ['underscore', 'backbone'], function () { return Gamepad; } );
			define( [], function () { return Gamepad; } );
		}
	}
	// If there is a window object, that at least has a document property
	if ( typeof window === "object" && typeof window.document === "object" ) {
		// update APP namespace
		if( isAPP ){
			APP.View = Gamepad;
			APP.Layout = GamepadLayout;
			APP.Input = APP.Input || {};
			APP.Input.Gamepad = Backbone.Input.Gamepad;
			// save namespace
			window.APP = APP;
		} else {
			// update Backbone namespace
			Backbone.View = Gamepad;
		}
		// save Backbone namespace either way
		window.Backbone = Backbone;
	}

	// for module loaders (returning the view)
	return Gamepad;

}));
