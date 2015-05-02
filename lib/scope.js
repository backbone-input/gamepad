/**
 * @name {{name}}
 * {{description}}
 *
 * Version: {{version}} ({{build_date}})
 * Homepage: {{homepage}}
 *
 * @author {{author}}
 * Initiated by Makis Tracend (@tracend)
 *
 * @cc_on Copyright © Makesites.org
 * @license Dual-licensed: {{#license licenses}}{{/license}}
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
	var getGamepads = navigator.getGamepads || navigator.webkitGetGamepads || false;
	var scanInterval;


{{{lib}}}


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
