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
	man: function() {
		return 'Checks if there is an element matching the provided selector and containing the provided text.<br />\
		Example:<br />\
		pagecontains "body > a" "my link"';
	}	
})