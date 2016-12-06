// extend existing params
var state = View.prototype.params || new Backbone.Model();

// defaults
state.set({
	gamepadButtons: []
});
