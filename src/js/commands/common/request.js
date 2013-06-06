Commands.register("request", {
	requiredArguments: 1,
	format: '<pre>request [url]</pre>',
	run: function(args, finished) {
		App.disableInput();
		var self = this;
		var url = args[0];
		if(url.indexOf("http") == -1) url = "http://" + url;
		var callback = function(response) {
			App.enableInput();
			if(response.error) {
				App.execute('error request: ' + response.error, finished);
			} else {				
				App.execute("echo " + response.responseText, finished);
			}
		}
		if(chrome && chrome.runtime) {
			chrome.runtime.sendMessage({type: "request", url: url}, callback);
		} else {
			request(url, callback);
		}
	},
	man: function() {
		return 'Sends ajax request and shows the result in the console.';
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