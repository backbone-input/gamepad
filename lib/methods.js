
	var methods = {


		// returns the number of connected gamepads.
		countGamepads: function() {
			var gamepads = this.params.get("gamepads");
			return Object.keys( gamepads ).length;
		},

		// interface methods
		monitorGamepad: function( state ){
			// fallback
			if(typeof state == "undefined") state = true;

			if( state && getGamepads){
				window.addEventListener('gamepadconnected', _.bind(this._onGamepadConnect, this), false );
				window.addEventListener('gamepaddisconnected', _.bind(this._onGamepadDisconnect, this), false );
				// watch for new connections
				scanInterval = setInterval( _.bind(this._scanGamepads, this), 500);
				// broadcast event
				this.trigger('monitor-gamepad-on');
			} else {
				window.removeEventListener('gamepadconnected', _.bind(this._onGamepadConnect, this), false );
				window.removeEventListener('gamepaddisconnected', _.bind(this._onGamepadDisconnect, this), false );
				clearInterval(scanInterval);
				// broadcast event
				this.trigger('monitor-gamepad-off');
			}

		},

		// events
		onGamepadClick: function( e ) {

		},

		onGamepadConnect: function( e ) {

		},

		onGamepadDisconnect: function( e ) {

		},

		// private methods
		_onGamepadConnect: function( e ) {
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
			// broadcast event
			this.trigger('gamepad-connect', { originalEvent: e });
			// update state?
			//this.state.play = true;
			// app-specific logic
			return this.onGamepadConnect( e );
		},

		_onGamepadDisconnect: function( e ) {
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

			// broadcast event
			this.trigger('gamepad-disconnect', { originalEvent: e }); // Gamepad.Event.DISCONNECTED, e.gamepad
			// update state?
			//this.state.play = false;
			// app-specific logic
			return this.onGamepadDisconnect( e );
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
				//console.log("Button %d: %s (%f)", i, pressed ? "pressed" : "not pressed", val);
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
