/**
 * @name backbone.input.gamepad
 * Gamepad event bindings for Backbone views
 *
 * Version: 0.2.0 (Sat, 05 Apr 2014 01:06:52 GMT)
 * Homepage: https://github.com/backbone-input/gamepad
 *
 * @author makesites
 * Created by: Makis Tracend (@tracend)
 *
 * @cc_on Copyright © Makesites.org
 * @license Dual-licensed: MIT license
 */

(function(window, _, Backbone, APP) {

	// support for Backbone APP() view if available...
	var isAPP = ( typeof APP !== "undefined" && typeof APP.View !== "undefined" );
	var View = ( isAPP ) ? APP.View : Backbone.View;
	var getGamepads = navigator.webkitGetGamepads || navigator.getGamepads || false;
	var scanInterval;



	// Map buttons to key press
	var buttonMap = {
		// Key name convention taken from UDK's GFxProjectedUI.uc UnrealScript class file (\Src\UTGame\Classes\)
		// order matches the order returned from the navigator.getGamepads object
		xbox: ["A", "B", "X", "Y", "LeftShoulder", "RightShoulder", "LeftTrigger", "RightTrigger", "Back", "Start", "LeftThumbstick", "RightThumbstick", "DPad_Up", "DPad_Down", "DPad_Left", "DPad_Right"],
		playstation: [], //TBA
		steam: [] //TBA
	};

// extend existing params
var params = View.prototype.params || new Backbone.Model();

// defaults
params.set({
	gamepads: {}
});


	var Gamepad = View.extend({

		options: {
			monitor: [] // possible values: "gamepad"
		},

		params: params,

		state : {
		},

		initialize: function( options ) {
			// prerequisite
			if( this.options.monitor || options.monitor ){
				this.monitor();
				tick( _.bind(this._updateGamepads, this) );
			}
			// continue...
			return View.prototype.initialize.call(this, options);
		},

		/* events:*/
		monitor: function( state ){
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
		onConnectGamepad: function( e ) {

		},

		onDisconnectGamepad: function( e ) {

		},

		// private methods
		_onConnectGamepad: function( e ) {
			// prerequisite
			var monitor = _.inArray("gamepad", this.options.monitor);
			if( !monitor ) return this.monitor(false);
			// variables
			var gamepad = e.gamepad || e.detail.gamepad;
			// copy data to the event root
			if(e.detail.gamepad) e.gamepad = e.detail.gamepad;
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
			if( !monitor ) return this.monitor(false);
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
			this.trigger("gamepaddisconnected", e);
			if(this.onDisconnectGamepad) return this.onDisconnectGamepad( e );
		},

		_scanGamepads: function(){

			var controllers = getGamepads.call(navigator);
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
			// update data
			this.params.set({
				gamepads : gamepads
			});
		},

		_updateGamepads: function( e ){
			var monitor = _.inArray("gamepad", this.options.monitor);
			if( !monitor ) return this.monitor(false);
			this.trigger("updateGamepads", e);
			if(this.updateGamepads) this.updateGamepads( e );
			// repeat on animation frame
			tick.call( window, _.bind(this._updateGamepads, this) );
		},

		_buttonKey: function( number ){
			// only support xbox for now?
			return buttonMap.xbox[ number ];
		}

	});


	// Helpers

	function bind( scope, fn ) {

		return function () {

			fn.apply( scope, arguments );

		};

	}

	_.mixin({
		inArray: function(value, array){
			return array.indexOf(value) > -1;
		},
		// - Check if in debug mode (requires the existence of a global DEBUG var)
		// Usage: _.inDebug()
		inDebug : function() {
			return ( typeof DEBUG != "undefined" && DEBUG );
		}
	});

	var tick = window.mozRequestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.requestAnimationFrame;




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


})(this.window, this._, this.Backbone, this.APP);
