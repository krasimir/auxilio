Commands.register("inject", {
	requiredArguments: 0,
	format: '<pre>inject</pre>',
	run: function(args, callback) {
		var id = _.uniqueId("files");
		var self = this;
		var input = '<input type="file" id="' + id + '" name="files[]" multiple />';
		App.execute('hidden ' + input);
		var inputElement = document.getElementById(id);
		inputElement.addEventListener('change', function(e) {
			self.handleFileSelected(e);
		}, false);
		inputElement.click();
	},
	handleFileSelected: function(e) {
		var files = e.target.files;
		var message = '<b>Selected file(s):</b><br />';
		var self = this;
		for(var i=0, f; f=files[i]; i++) {
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
		eval(content);
	},
	man: function() {
		return 'Inject external javascript to be run in the context of Auxilio and current page.';
	}	
})