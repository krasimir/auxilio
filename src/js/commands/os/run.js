Commands.register("run", {
	requiredArguments: 1,
	lookForQuotes: false,
	concatArgs: true,
	totalFiles: 0,
	totalFilesProcessed: 0,
	run: function(args, callback) {
		
		var _path = args.shift();

		var evalJSCode = function(js, parameter, callback) {
			try {
				eval("var auxilioFunction=" + js);
				if(typeof auxilioFunction !== "undefined") {
					auxilioFunction(parameter, callback);
					return;
				}
			} catch(e) {
				exec("error Error executing<pre>" + js + "</pre>" + e.message + "<pre>" + e.stack + "</pre>");
				if(callback) callback();
			}			
		}
		var execFile = function(path, callback) {
			exec("readfile " + path, function(content) {
				var js = content.replace(/\n/g, '').replace(/\r/g, '');
				if(js.indexOf("function ") !== 0) {
					exec("warning The file <b>" + path + "</b> doesn't contain a valid command definition");
					callback();
					return;
				}
				evalJSCode(js, args, callback);
			});
		}
		var registerFile = function(path, callback) {
			exec("readfile " + path, function(content) {
				var js = content.replace(/\n/g, '').replace(/\r/g, '');
				if(js.indexOf("function ") !== 0) {
					exec("warning The file <b>" + path + "</b> doesn't contain a valid command definition");
					callback();
					return;
				};
				var fileName = getFileName(path);
				Commands.register(fileName, {
					requiredArguments: 0,
					format: '',
					lookForQuotes: true,
					concatArgs: true,
					run: function(args, callback) {
						evalJSCode(js, args, callback);
					},
					man: {
						desc: fileName,
						format: fileName,
						examples: [
							{text: 'Command line', code: fileName},
							{text: 'Source code', code: content},
						],
						returns: 'unknown',
						group: 'add-ons'
					}	
				});
				Autocomplete.prepareDictionary();
			});	
		}
		var loadFiles = function(callback) {
			var dir = _path;
			var cwd = Context.get();
			var self = this;
			Shell.suppressErrorsOnce(); // suppress the errors if cd to a file
			this.totalFiles = this.totalFilesProcessed = 0;
			App.hideNextCommands(2);
			exec("cd " + dir, function(res) {
				if(res.stderr && res.stderr != '') {
					// tries to import a specific file
					processFile(dir, callback);
				} else {
					exec("tree -1 suppressdislay", function(res) {
						if(res && res.result) {

							// counting files
							var count = function(files) {
								for(var f in files) {
									if(files[f] === "file") {
										self.totalFiles += 1;
									} else {
										count(files[f]);
									}
								}
							}
							count(res.result);

							// processing files
							var parseDir = function(childs, dir) {
								for(var f in childs) {
									if(typeof childs[f] === 'string') {
										processFile(dir + "/" + f, function() {
											self.totalFilesProcessed += 1;
											if(self.totalFilesProcessed === self.totalFiles) {
												callback(self.totalFilesProcessed);
											}
										});
									} else {
										parseDir(childs[f], dir + "/" + f);
									}
								}
							}
							App.hideNextCommands(2);
							exec("cd " + cwd, function() {
								parseDir(res.result, dir);
							});

						}
					});
				}
			});		
		}
		var getFileName = function(path) {
			var fileName = path.replace(/\\/g, '/').split('/').pop().split(".");
			fileName.pop();
			return fileName.join(".");
		}
		var processFile = function(filePath, callback) {
			var fileName = getFileName(filePath);
			if(fileName.indexOf("exec.") === 0) {
				execFile(filePath, callback);
			} else {
				registerFile(filePath, callback);
			}
		}

		loadFiles(callback);

	},
	man: {
		desc: 'Register or execute commands stored in external files. The files should contain valid javascript which is actually a function definition in the following format:<pre>\
function nameOfMyFunction(args) {\n\
...\n\n\
}\
</pre>Normally the content of the file is registered as a command, but if the filename starts with <i>exec.</i> the function is executed immediately. For example:<pre>run ./exec.myscript.js</pre>',
		format: 'run [path]',
		examples: [
			{text: 'Importing directory', code: 'run ./files'},
			{text: 'Importing file', code: 'run ./files/myscript.js'},
			{text: 'In script', code: 'run("./myfiles", function(res) {\n\
	console.log(res);\n\
});'}
		],
		returns: 'Result of the function.',
		group: 'os'
	}	
})