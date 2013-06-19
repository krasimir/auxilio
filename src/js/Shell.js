var Shell = (function() {

	var _el,
		_host = "localhost",
		_port = 3443,
		_retryInterval = 30000,
		_socket,
		_connected = false,
		_context,
		_cache = {};

	var on = function() {
		_el.className = "shell-indicator-on";
	}
	var off = function() {
		_el.className = "shell-indicator-off";
	}
	var connect = function() {
		_socket = io.connect('http://' + _host + ":" + _port, {
			'force new connection': true
		});
		_socket.on('connect', function (data) {
			_connected = true;
			on();
		});
		_socket.on('disconnect', function() {
			_connected = false;
			off();
		});
		_socket.on("result", function(res) {
			try {
				if(res.command && _cache[res.command]) {
					_cache[res.command](res.stdout === "" ? res.stderr : res.stdout);
				}
			} catch(e) {
				// console.log(e);
			}
		});
	}
	var init = function() {
		_el = document.getElementById("js-shell-indicator");
		connect();
		setTimeout(function() {
			retry();
		}, _retryInterval);
	}
	var retry = function() {
		if(!_connected) {
			connect();
			setTimeout(function() {
				retry();
			}, _retryInterval);
		}
	}
	var connected = function() {
		return _connected;
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