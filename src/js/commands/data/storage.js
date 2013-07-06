Commands.register("storage", {
	requiredArguments: 1,
	lookForQuotes: false,
	run: function(args, callback) {
		var operation = args.shift();
		var key = args.length > 0 ? args.shift() : null;
		var value = args.length > 0 ? args.join(" ") : null;
		if(operation !== "put" && operation != "get" && operation != "remove") {
			exec("error profile: Operation parameter could be 'put', 'get' or 'remove' (not '" + operation + "').");
			callback();
			return;
		}
		if((operation === "put" || operation === "remove") && !key) {
			exec("error profile: 'key' is missing.");
			callback();
			return;
		}
		if(operation === "put" && !value) {
			exec("error profile: 'put' operation used, but 'value' is missing.");
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
	man: {
		desc: 'Stores key-value pairs by using chrome.storage.sync API.',
		format: 'storage [operation] [key] [value]',
		examples: [
			{text: 'Storing variable', code: 'storage put username Auxilio'},
			{text: 'Getting variable', code: 'storage get username'},
			{text: 'Removing variable', code: 'storage remove username'},
			{text: 'Get all variable', code: 'storage get'}
		],
		returns: 'The result of the executed command.',
		group: 'data'
	}	
})