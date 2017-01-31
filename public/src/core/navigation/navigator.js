(function(window,document,undefined){

	if(CustomMap === undefined)
		throw "CustomMap can not load";
	var Navigator = {};

	Navigator.navigate = function() { throw "Not implemented exception" }


	CustomMap.Navigator = Navigator;


}(window,document))