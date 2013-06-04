var Commands = {
	l: function(args) {
		App.clear();
	},
	open: function(args) {
		if(!args[0]) {
			App.error("<u>open</u> requires at least one parameter.<br />format: open &lt;url&gt;");
			return;
		}
		App.disableInput();
		var self = this;
		var url = args[0];
		var self = this;
		var callback = function(response) {
			App.enableInput();
			if(response.error) {
				App.error(response.error);
			} else {				
				App.echo(response.responseText);
			}
		}
		if(chrome && chrome.runtime) {
			chrome.runtime.sendMessage({type: "request", url: url}, callback);
		} else {
			request(url, callback);
		}
	}
}

// Used in development mode
var request = function(url, callback) {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", url, true);
	xhr.onreadystatechange = function() {
		console.log(url, xhr.readyState, xhr.status, "'" + xhr.responseText + "'");
		if (xhr.readyState == 4 && xhr.status == 200) {
			callback({responseText: xhr.responseText});
		} else if(xhr.readyState == 4) {
			callback({error: "Error requesting '" + url + "'."});
		}
	}
	xhr.send(null);
}