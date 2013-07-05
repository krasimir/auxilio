var Profile = (function() {

	var init = function() {
		var onSocketConnect = function() {
			exec("profile", function(path) {
				if(path && path !== '') {
					exec("import " + path);
				}
			});
			Shell.socket().removeListener("updatecontext", onSocketConnect);
		}
		Shell.socket().on("updatecontext", onSocketConnect);
	}

	return {
		init: init
	}

})();

Commands.register("profile", {
	requiredArguments: 0,
	lookForQuotes: true,
	concatArgs: true,
	format: '<pre>profile [path]</pre>',
	run: function(args, callback) {
		var path = args.join(" ");
		var self = this;
		if(path === '') {
			exec("storage get profiledata", function(data) {
				if(data.profiledata && data.profiledata !== "") {
					callback(data.profiledata);
				} else {
					exec('info There is no profile set.');
					callback(null);
				}
			});
		} else if(path === 'clear') {
			exec("storage remove profiledata " + path, function() {				
				exec('success Profile removed.', callback);
			});
		} else {
			exec("storage put profiledata " + path, function() {
				Profile.init();
				exec('success Profile changed successfully.', callback);
			});
		}
	},
	man: function() {
		return 'Manages your current profile file.\
		If you pass <i>clear</i> the profile will be not active next time when you launch auxilio.\
		';
	}	
})