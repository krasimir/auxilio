Commands.register("inject", {
	requiredArguments: 0,
	format: '<pre>inject</pre>',
	processing: false,
	files: null,
	proccessedFiles: -1,
	commands: [],
	run: function(args, callback) {
		if(this.processing) {
			App.execute("error Sorry but <b>inject</b> command is working right now. Try again later.");
			callback();
			return;
		}
		var id = _.uniqueId("files");
		var self = this;
		var input = '<input type="file" id="' + id + '" name="files[]" multiple />';
		App.execute('hidden ' + input);
		var inputElement = document.getElementById(id);
		inputElement.addEventListener('change', function(e) {
			self.processing = true;
			self.handleFileSelected(e);
		}, false);
		inputElement.click();
	},
	handleFileSelected: function(e) {
		this.files = e.target.files;
		var message = '<b>Selected file(s):</b><br />';
		var self = this;
		for(var i=0, f; f=this.files[i]; i++) {
			message += f.name + "<br />";
			var reader = new FileReader();
			(function(reader, f) {
				reader.onload = function(e) {
					if(e.target.result) {
						self.handleFileRead(f, e.target.result);
					}
				};
				reader.readAsText(f);
			})(reader, f);
		}
		App.execute('echo ' + message);
	},
	handleFileRead: function(file, content) {
		var fileCommands = content.split("\n");
		for(var i=0, c; c = fileCommands[i]; i++) {
			this.commands.push(c);
		}
		this.proccessedFiles += 1;
		if(this.proccessedFiles == this.files.length-1) {
			this.executeCommands();
		}
	},
	executeCommands: function() {
		var self = this;
		exec(this.commands.join(" & "), function() {
			self.processing = false;
			self.files = null;
			self.proccessedFiles = -1;
			self.commands = [];
		});
	},
	man: function() {
		return 'Inject external javascript to be run in the context of Auxilio and current page.';
	}	
})