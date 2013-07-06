Commands.register("history", {
	requiredArguments: 0,
	format: '<pre></pre>',
	run: function(args, callback) {
		var message = 'History:<pre class="history-panel">';
		for(var i=App.commandsHistory.length-2; i>=0; i--) {
			var str = App.commandsHistory[i];
			if(str != '' && str != ' ') {
				var linkId = _.uniqueId("historylink");
				message += "<a href='#' id='" + linkId + "'>" + str.toString().replace(/&/g, '&amp;') + "</a>\n";
				(function(command, linkId){
					setTimeout(function() {
						document.querySelector("#" + linkId).addEventListener("click", function() {
							exec(command);
						});
					}, 200);
				})(str, linkId);
			}
		}
		message += '</pre>';
		exec('info ' + message, callback);
	},
	man: {
		desc: 'Outputs the current console\'s history.',
		format: 'history',
		examples: [
			{text: 'Command line', code: 'history'}
		],
		returns: 'null',
		group: 'common'
	}	
})