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
			if(res.command && _cache[res.id]) {
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
		var id = _.uniqueId("shellcommand");
		App.setOutputPanelContent('<div id="' + id + '" class="shell-wrapper"></div>');
		_cache[id] = callback;
		_socket.emit("command", {
			command: command,
			id: id
		});
	}
	var formatOutput = function(str) {
		return str.replace(/\n/g, '<br />').replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
	}

	return {
		init: init,
		send: send,
		connected: connected,
		connect: connect
	}

})();