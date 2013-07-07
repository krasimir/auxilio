Commands.register("forminput", {
	requiredArguments: 0,
	run: function(args, callback) {
		
		var id = _.uniqueId("forminput");
		var title = args.length > 0 ? args.shift() : "Type something:";
		var text = args.length > 0 ? args.join(" ") : '';
		var html = '\
			<div id="' + id + '" class="form">\
				<div class="buttons right">\
					<a href="#" id="' + id + '_button_cancel" class="btn deny"><i class="icon-cancel"></i> CANCEL</a>\
					<a href="#" id="' + id + '_button" class="btn confirm"><i class="icon-ok"></i> OK</a>\
				</div>\
				<h1>' + title + '</h1>\
				<input type="text" id="' + id + '_area" class="clear" value="' + text + '"/>\
				<small class="form-hint">Ctrl+Enter = OK, Esc = CANCEL</small>\
			</div>\
		';
		App.setOutputPanelContent('<div class="regular">' + html + '</div>');
		
		var form = document.getElementById(id);
		var button = document.getElementById(id + '_button');
		var buttonCancel = document.getElementById(id + '_button_cancel');
		var textarea = document.getElementById(id + '_area');
		var onKeyDown = function(e) {
			if(e.ctrlKey && e.keyCode === 13) {
				button.click();
			} else if(e.keyCode == 27) {
				buttonCancel.click();
			}
		}

		textarea.focus();
		button.addEventListener("click", function() {
			form.parentNode.style.display = "none";
			var value = textarea.value.replace(/ && /g, '\n');
			callback(value);
			textarea.removeEventListener("keydown", onKeyDown);
			App.commandInputFocus();
		});
		buttonCancel.addEventListener("click", function() {
			form.parentNode.style.display = "none";
			callback();
			App.commandInputFocus();
		});
		textarea.addEventListener("keydown", onKeyDown);

	},
	man: {
		desc: 'Shows a simple form with input and button.',
		format: 'forminput<br />forminput [title]<br />forminput [title] [default text]',
		examples: [
			{text: 'Command line', code: 'forminput "Please type your age." 18'},
			{text: 'In script', code: 'forminput(\'"Please type your age."\', 18, function(age) {\n\
	console.log(age);\n\
});'}
		],
		returns: 'string',
		group: 'forms'
	}	
})