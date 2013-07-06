Commands.register("request", {
	requiredArguments: 1,
	run: function(args, finished) {
		var self = this;
		var url = args.shift();
		var showRawOutput = args.length > 0 && args[0] === "true";
		if(url.indexOf("http") == -1) url = "http://" + url;
		var callback = function(response) {
			if(response.error) {
				exec('error request: ' + response.error, finished);
			} else {
				var responseText = response.responseText;
				if(!showRawOutput) {
					responseText = responseText.replace(/</g, '&lt;');
					responseText = responseText.replace(/>/g, '&gt;');
					responseText = '<pre>' + responseText + '</pre>';
				}
				finished(responseText);
			}
		}
		if(chrome && chrome.runtime) {
			chrome.runtime.sendMessage({type: "request", url: url}, callback);
		} else {
			request(url, callback);
		}
	},
	man: {
		desc: 'Sends ajax request and returns the result.',
		format: 'request [url]<br />request [url] [raw (true | false)]',
		examples: [
			{text: 'Command line', code: 'request github.com && echo'},
			{text: 'Getting raw html', code: 'request github.com true && echo'},
			{text: 'In script', code: 'This command is not supported in external scripts.'}
		],
		returns: 'Response of the given url or the raw output if <i>raw</i> parameter is passed.',
		group: 'common'
	}
})

// Used in development mode
var request = function(url, callback) {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", url, true);
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			callback({responseText: xhr.responseText});
		} else if(xhr.readyState == 4) {
			callback({error: "Error requesting '" + url + "'. (xhr.status=" + xhr.status + ")"});
		}
	}
	xhr.send();
}