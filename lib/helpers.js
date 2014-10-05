
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

