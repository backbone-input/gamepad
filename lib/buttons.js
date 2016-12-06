
	// Map buttons to key press
	// Key name convention taken from UDK's GFxProjectedUI.uc UnrealScript class file (\Src\UTGame\Classes\)
	// order matches the order returned from the navigator.getGamepads object
	var buttonMap = [
		"Button_1", "Button_2", "Button_3", "Button_4", "LeftShoulder", "RightShoulder", "LeftTrigger", "RightTrigger", "Back", "Start", "LeftThumbstick", "RightThumbstick", "DPad_Up", "DPad_Down", "DPad_Left", "DPad_Right", "Home"
	];

	var axes = ['LeftThumbstick_X', 'LeftThumbstick_Y', 'RightThumbstick_X', 'RightThumbstick_Y'];

	var mappings = {
		// Generic
		'default': {
			index: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
			axes: [0, 1, 2, 3],
			buttons: ["A", "B", "X", "Y"]
		},
		// Xbox
		'xbox': {
			index: [0, 1, 2, 3, 4, 5, 15, 16, 9, 8, 6, 7, 11, 12, 13, 14, 10],
			axes: [0, 1, 2, 3],
			buttons: ["A", "B", "X", "Y"]
		},
		// PlayStation
		'playstation': {
			index: [14, 13, 15, 12, 10, 11, 8, 9, 0, 3, 1, 2, 4, 6, 7, 5, 16],
			axes: [0, 1, 2, 3],
			buttons: ["Cross", "Circle", "Square", "Triangle"]
		},
		// Logitech
		'logitech': {
			index: [0, 1, 2, 3, 4, 5, -1, -1, 6, 7, 8, 9, 11, 12, 13, 14, 10],
			axes: [0, 1, 3, 4],
			buttons: ["A", "B", "X", "Y"]
		},
		'steam': {} //TBA
	};

	// Helpers
	var getControlName = function(names, index, extraPrefix) {
		return (index < names.length) ? names[index] : extraPrefix + (index - names.length + 1);
	};
