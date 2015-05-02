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