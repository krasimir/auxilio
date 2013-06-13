Commands.register("profile", {
	requiredArguments: 0,
	format: '<pre>echo [operation]</pre>',
	run: function(args, callback) {
		var operation = args[0] || "show";
		var self = this;
		switch(operation) {
			case "show":
				exec("storage get profiledata", function(data) {
					if(data.profiledata && data.profiledata !== "") {
						var str = 'Your profile:<br />';
						str += '<pre>' + data.profiledata + '</pre>';
						exec('info ' + str, callback);
					} else {
						exec('info There is no profile data.', callback);
					}
				});
			break;
			case "edit":
				exec("storage get profiledata", function(data) {
					var currentValue = '';
					if(data.profiledata && data.profiledata !== "") {
						currentValue = data.profiledata;
					}
					exec('formtextarea "Manage your profile:" ' + currentValue, function(newValue) {
						exec("storage put profiledata " + newValue, function() {
							exec('success Profile changed successfully.', callback);
						});
					}, true)
				});
			break;
			case "import":
				exec("inject", function(data) {
					data = data.replace(/ && /g, '\n');
					exec("storage put profiledata " + data, function() {
						exec('success Profile changed successfully.', callback);
					});
				});
			break;
			case "clear":
				exec("storage remove profiledata", function() {
					exec('success Profile cleared successfully.', callback);
				});
			break;
			case "run":
				App.loadProfile();
				callback();
			break;
		}
	},
	man: function() {
		return 'Manages your current profile file. Valid operations:<br />show, edit, import, clear, run';
	}	
})