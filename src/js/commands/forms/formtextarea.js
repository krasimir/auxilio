Commands.register("formtextarea", {
	requiredArguments: 1,
	format: '<pre>formtextarea [title]\nformtextarea [title] [text]</pre>',
	run: function(args, callback) {
		
		var id = _.uniqueId("formtextarea");
		var title = args[0];
		var text = args[1] ? args[1] : '';
		var html = '';
		html += '<div id="' + id + '" class="form">';
		html += '<a href="#" id="' + id + '_button" class="btn right"><i class="icon-magic"></i> SUBMIT</a>';
		html += '<h1>' + title + '</h1>';
		html += '<textarea id="' + id + '_area" class="clear">' + text + '</textarea>';
		html += '</div>';
		exec("echo " + html);
		
		var form = document.getElementById(id);
		var button = document.getElementById(id + '_button');
		var textarea = document.getElementById(id + '_area');
		button.addEventListener("click", function() {
			form.parentNode.style.display = "none";
			exec("success Data successfully sent.");
			callback(textarea.value);
		});

	},
	man: function() {
		return 'Shows a simple form with textarea and button. Use the callback of the command to get the text submitted by the form.';
	}	
})