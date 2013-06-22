var Shell = (function() {

	var _host = "localhost",
		_port = 3443,
		_retryInterval = 30000,
		_retryTries = 0,
		_retryTriesMax = 20,
		_socket,
		_connected = false,
		_cache = {};

	var connect = function() {
		if(_connected) { return; }
		_socket = io.connect('http://' + _host + ":" + _port, {
			'force new connection': true
		});
		_socket.on('connect', function (data) {
			_connected = true;
			Context.on();
		});
		_socket.on('disconnect', function() {
			_connected = false;
			Context.off();
		});
		_socket.on("command", function(res) {
			if(res.id && _cache[res.id]) {
				var output = document.getElementById(res.id);
				if(output) {
					if(res.stderr !== "") {
						output.style.display = "block";
						output.innerHTML += '<div class="regular-shell">' + formatOutput(res.stderr) + '</div>';
					} else if(res.stdout !== '') {
						output.style.display = "block";
						output.innerHTML += '<div class="regular-shell">' + formatOutput(res.stdout) + '</div>';
					}
				}
				_cache[res.id](res);
				_cache[res.id] = null;
			}
		});
		_socket.on("updatecontext", function(res) {
			Context.updateContext(res);
			Autocomplete.setContextFiles(res.files);
		})
	}
	var init = function() {
		connect();
		setTimeout(function() {
			retry();
		}, _retryInterval);
	}
	var retry = function() {
		if(!_connected) {
			connect();
			setTimeout(function() {
				if(++_retryTries < _retryTriesMax) {
					retry();
				}
			}, _retryInterval);
		}
	}
	var connected = function() {
		return _connected;
	}
	var send = function(command, callback, data, preventResultShowing) {
		var id = _.uniqueId("shellcommand");
		if(!preventResultShowing) {
			App.setOutputPanelContent('<div id="' + id + '" class="shell-wrapper"></div>');
		}
		_cache[id] = callback;
		_socket.emit("command", _.extend(data || {}, {
			command: command,
			id: id
		}));
	}
	var formatOutput = function(str) {
		return str.replace(/\n/g, '<br />').replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
	}

	return {
		init: init,
		send: send,
		connected: connected,
		connect: connect,
		socket: function() { return _socket; }
	}

})();