Commands.register("request", {
	requiredArguments: 1,
	format: '<pre>request [url]<br />request [url] [raw]</pre>',
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
	man: function() {
		return 'Sends ajax request and shows the result in the console.<br />\
		Use <b>raw</b> parameter to leave the data as it is received from the url. \
		For example:<br />\
		request github.com true';
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