Commands.register("storage", {
	requiredArguments: 1,
	format: '<pre>storage [operation] [key] [value]</pre>',
	run: function(args, callback) {
		var operation = args.shift();
		var key = args.length > 0 ? args.shift() : null;
		var value = args.length > 0 ? args.join(" ") : null;
		if(operation !== "put" && operation != "get" && operation != "remove") {
			exec("error Operation parameter could be 'put', 'get' or 'remove' (not '" + operation + "').");
			callback();
			return;
		}
		if((operation === "put" || operation === "remove") && !key) {
			exec("'key' is missing.");
			callback();
			return;
		}
		if(operation === "put" && !value) {
			exec("error 'put' operation used, but 'value' is missing.");
			callback();
			return;
		}
		if(chrome && chrome.runtime) {
			chrome.runtime.sendMessage({type: "storage", operation: operation, key: key, value: value}, function(res) {
				if(res.error) {
					exec("error " + error.error);
				} else {
					if(operation === "get") {
						// exec("info " + JSON.stringify(res.value))
						callback(res.value);
					} else {
						callback();
					}
				}
			});
		}
	},
	man: function() {
		return '\
			Store key-value pairs by using chrome.storage.sync API.<br />\
			Examples:<br />\
			storage put username Auxilio // stores username=Auxilio<br />\
			storage get username // returns Auxilio<br />\
			storage remove username // returns Auxilio<br />\
			storage get // returns all stored values<br />\
		';
	}	
})