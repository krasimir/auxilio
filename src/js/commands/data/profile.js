var Profile = (function() {

	var init = function() {
		var onSocketConnect = function() {
			exec("profile", function(path) {
				if(path && path !== '') {
					exec("run " + path);
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
	run: function(args, callback) {
		var path = args.join(" ");
		var self = this;
		if(path === '') {
			exec("storage get profiledata", function(data) {
				if(data.profiledata && data.profiledata !== "") {
					callback(data.profiledata);
				} else {
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
	man: {
		desc: 'Manages your current profile file. Every time when you start auxilio the extension reads the files of the given directory (recursively). It searches for files which start with <i>function </i> and register them as commands. If the file starts with <i>exec.</i> directly executes the function inside the file. Check <i>man run</i> for more information.',
		format: 'profile [path]',
		examples: [
			{text: 'Getting current profile path', code: 'profile'},
			{text: 'Setting profile', code: 'profile D:/work/auxilio/profile'},
			{text: 'Clearing profile', code: 'profile clear'}
		],
		returns: 'Check examples.',
		group: 'data'
	}	
})