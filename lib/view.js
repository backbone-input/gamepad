
	var Gamepad = View.extend( _.extend({}, methods, {

		options: {
			monitor: [] // possible values: "gamepad"
		},

		params: params.clone(),

		state : state.clone(),

		initialize: function( options ) {
			options = options || {};
			_.bindAll(this, 'onGamepadClick');
			// prerequisite
			if(options.monitor) _.extend(this.options.monitor, options.monitor);
			if( _.inArray("gamepad", this.options.monitor) ){
				this.monitorGamepad();
				tick( _.bind(this._updateGamepads, this) );
				// events
				this.on("gamepadclick", this.onGamepadClick);
			}
			// continue...
			return Gamepad.__super__.initialize.call(this, options);
		}

	}) );
