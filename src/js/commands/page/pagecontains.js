Commands.register("pagecontains", {
	requiredArguments: 2,
	format: '<pre>pagecontains [selector] [text]</pre>',
	run: function(args, callback) {
		var selector = args.shift();
		var text = args.join(" ");
		exec("pagequery " + selector, function(res) {
			if(res.elements && res.elements > 0) {
				var matching = 0;
				var matchedTags = '';
				for(var i=0; i<res.raw.length; i++) {
					if(res.raw[i].indexOf(text) >= 0) {
						matching += 1;
						matchedTags += '<pre>' + res.raw[i].replace(/</g, '&lt;') + '</pre>';
					}
				}
				if(matching === 1) {
					exec('success There is one element matching <b>"' + selector + '"</b> selector and containing <b>"' + text + '"</b> text.<br />' + matchedTags);
				} else if(matching > 1) {
					exec('success There are ' + matching + ' elements matching <b>"' + selector + '"</b> selector and containing <b>"' + text + '"</b> text.<br />' + matchedTags);
				} else {
					exec('error There are ' + res.elements + ' elements matching <b>"' + selector + '"</b> but non of them contain <b>"' + text + '"</b> text.');
				}
				callback(true);
			} else {
				exec('error There are no elements matching <b>"' + selector + '"</b> selector.')
				callback(false);
			}			
		});
	},
	man: function() {
		return 'Checks if there is an element matching the provided selector and containing the provided text.<br />\
		Example:<br />\
		pagecontains "body > a" "my link"';
	}	
})