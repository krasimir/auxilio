Commands.register("pagecontains", {
	requiredArguments: 2,
	run: function(args, callback) {
		var selector = args.shift();
		var text = args.join(" ");
		exec("pagequery " + selector, function(res) {
			if(res.elements && res.elements > 0) {
				var matching = 0;
				var matchedTags = '';
				var r = new RegExp("(" + text + ")", "gi");
				for(var i=0; i<res.raw.length; i++) {
					if(res.raw[i].match(r)) {
						matching += 1;
						matchedTags += '<pre>' + res.raw[i].replace(/</g, '&lt;').replace(r, '<b class="bordered">$1</b>') + '</pre>';
					}
				}
				if(matching === 1) {
					exec('success There is one element matching <b>"' + selector + '"</b> selector and contains <b>"' + text + '"</b> text.<br />' + matchedTags);
				} else if(matching > 1) {
					exec('success There are ' + matching + ' elements matching <b>"' + selector + '"</b> selector and contains <b>"' + text + '"</b> text.<br />' + matchedTags);
				} else {
					exec('error There are element/s(' + res.elements + ') matching <b>"' + selector + '"</b> but non of them contain <b>"' + text + '"</b> text.');
				}
				callback(true);
			} else {
				exec('error There are no elements matching <b>"' + selector + '"</b> selector.')
				callback(false);
			}			
		});
	},
	man: {
		desc: 'Checks if there is an element matching the provided selector and containing the provided text.',
		format: 'pagecontains [selector] [text]',
		examples: [
			{text: 'Command line', code: 'pagecontains "body > a" "my link"'},
			{text: 'In script', code: 'pagecontains("body > a", "my link", function(res) {\n\
	console.log(res ? "yes" : "no");\n\
});'}
		],
		returns: 'Boolean (true | false)',
		group: 'page'
	}	
})