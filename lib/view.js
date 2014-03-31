
	var Gamepad = View.extend({

		options: {
			monitor: [] // possible values: "gamepad"
		},
		// use APP.Model if available?
		params: new Backbone.Model({
			gamepads: {}
		}),

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
		}

	});
