var Shell = (function() {

	var _body,
		_contextEl,
		_host = "localhost",
		_port = 3443,
		_retryInterval = 30000,
		_retryTries = 0,
		_retryTriesMax = 20,
		_socket,
		_connected = false,
		_context,
		_cache = {};

	var on = function() {
		_body.className = "shell-on";
	}
	var off = function() {
		_body.className = "shell-off";
	}
	var connect = function() {
		_socket = io.connect('http://' + _host + ":" + _port, {
			'force new connection': true
		});
		_socket.on('connect', function (data) {
			_connected = true;
			on();
		});
		_socket.on('welcome', function(data) {
			_context = data.context;
			FilesDictionary = data.files;
			setContext();
		});
		_socket.on('disconnect', function() {
			_connected = false;
			off();
		});
		_socket.on("result", function(res) {
			_context = res.context;
			FilesDictionary = res.files;
			setContext();
			if(res.command && _cache[res.command]) {
				if(res.stderr !== "") {
					exec("error " + res.stderr + "<pre>" + res.command + "</pre>");
				} else if(res.stdout !== '') {
					exec("echo " + res.stdout);
				}
				_cache[res.command](res);
			}
		});
	}
	var init = function() {
		_body = document.querySelector("body");
		_contextEl = document.getElementById("js-shell-cwd");
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
	var setContext = function() {
		_contextEl.innerHTML = _context;
	}
	var send = function(command, callback) {
		_cache[command] = callback;
		_socket.emit("command", {
			command: command,
			context: _context
		});
	}

	return {
		init: init,
		send: send,
		connected: connected
	}

})();