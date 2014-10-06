
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
			// prerequisite
			if(options.monitor) _.extend(this.options.monitor, options.monitor);
			if( _.inArray("gamepad", this.options.monitor) ){
				this.monitorGamepad();
				tick( _.bind(this._updateGamepads, this) );
			}
			// continue...
			return View.prototype.initialize.call(this, options);
		}

	}) );
