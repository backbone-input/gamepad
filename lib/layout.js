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
			// prerequisite
			if(options.monitor) _.extend(this.options.monitor, options.monitor);
			if( _.inArray("gamepad", this.options.monitor) ){
				this.monitorGamepad();
				tick( _.bind(this._updateGamepads, this) );
			}
			// continue...
			return Layout.prototype.initialize.call(this, options);
		}

	}) );

}