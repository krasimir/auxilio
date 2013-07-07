Commands.register("formconfirm", {
	requiredArguments: 1,
	run: function(args, callback) {
		
		var id = _.uniqueId("formconfirm");
		var question = args.join(" ");
		var html = '\
			<div id="' + id + '" class="form">\
				<div class="buttons right">\
					<a href="#" id="' + id + '_buttonno" class="btn deny"><i class="icon-ok"></i> NO</a>\
					<a href="#" id="' + id + '_buttonyes" class="btn confirm"><i class="icon-ok"></i> YES</a>\
				</div>\
				<h1>' + question + '</h1>\
				<span class="clear" />\
			</div>\
		';
		App.setOutputPanelContent('<div class="regular">' + html + '</div>');
		
		var form = document.getElementById(id);
		var buttonYes = document.getElementById(id + '_buttonyes');
		var buttonNo = document.getElementById(id + '_buttonno');
		buttonYes.addEventListener("click", function() {
			form.parentNode.style.display = "none";
			callback(true);
			App.commandInputFocus();
		});
		buttonNo.addEventListener("click", function() {
			form.parentNode.style.display = "none";
			callback(false);
			App.commandInputFocus();
		});

	},
	man: {
		desc: 'Shows a text (question) with two options - YES and NO.',
		format: 'formconfirm [question]',
		examples: [
			{text: 'Command line', code: 'formconfirm Are you sure?'},
			{text: 'In script', code: 'formconfirm(\'"Are you sure?"\', function(res) {\n\
	console.log(res ? "yes" : "no");\n\
});'}
		],
		returns: 'Boolean (true | false)',
		group: 'forms'
	}	
})