Commands.register("forminput", {
	requiredArguments: 1,
	format: '<pre>forminput [title]\forminput [title] [text]</pre>',
	run: function(args, callback) {
		
		var id = _.uniqueId("forminput");
		var title = args.shift();
		var text = args.length > 0 ? args.join(" ") : '';
		var html = '\
			<div id="' + id + '" class="form">\
				<div class="buttons right">\
					<a href="#" id="' + id + '_button_cancel" class="btn deny"><i class="icon-cancel"></i> CANCEL</a>\
					<a href="#" id="' + id + '_button" class="btn confirm"><i class="icon-ok"></i> OK</a>\
				</div>\
				<h1>' + title + '</h1>\
				<input type="text" id="' + id + '_area" class="clear" value="' + text + '"/>\
			</div>\
		';
		exec("echo " + html);
		
		var form = document.getElementById(id);
		var button = document.getElementById(id + '_button');
		var buttonCancel = document.getElementById(id + '_button_cancel');
		var textarea = document.getElementById(id + '_area');
		textarea.focus();
		button.addEventListener("click", function() {
			form.parentNode.style.display = "none";
			callback(textarea.value);
			App.commandInputFocus();
		});
		buttonCancel.addEventListener("click", function() {
			form.parentNode.style.display = "none";
			callback();
			App.commandInputFocus();
		});

	},
	man: function() {
		return 'Shows a simple form with input and button. Use the callback of the command to get the text submitted by the form.';
	}	
})