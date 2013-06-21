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
		_cache = {},
		_gitstatus = {};

	var on = function() {
		_body.className = "shell-on";
	}
	var off = function() {
		_body.className = "shell-off";
	}
	var connect = function() {
		if(_connected) return;
		_socket = io.connect('http://' + _host + ":" + _port, {
			'force new connection': true
		});
		_socket.on('connect', function (data) {
			_connected = true;
			on();
		});
		_socket.on('welcome', function(res) {
			updateContext(res);
		});
		_socket.on('disconnect', function() {
			_connected = false;
			off();
		});
		_socket.on("result", function(res) {
			updateContext(res);
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
		_socket.on("showhint", function(res) {
			if(res && res.files) {
				Autocomplete.showHint(res.files.join("<br />"));
			}
		});
		_socket.on("updatecontext", function(res) {
			updateContext(res);
		})
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
	var updateContext = function(res) {
		_context = res.context;
		_gitstatus = res.git;
		FilesDictionary = res.files ? res.files : FilesDictionary;
		setContext();
	}
	var setContext = function() {
		var gitStatusMarkup = '';
		if(_gitstatus && _gitstatus.branch) {
			gitStatusMarkup += '&nbsp;&nbsp;<span style="background: #FFF;">&nbsp;';
			gitStatusMarkup += '<b style="color:' + (_gitstatus.branch === 'master' ? '#F00' : '#B4833A') + '">' + _gitstatus.branch + '</b>';
			if(_gitstatus.status) {
				gitStatusMarkup += '&nbsp;/&nbsp;';
				for(var i in _gitstatus.status) {
					gitStatusMarkup += '<span style="color:#F00;font-weight:bold;">';
					switch(i) {
						case "M": gitStatusMarkup += "&#8764;"; break;
						case "A": gitStatusMarkup += "+"; break;
						case "D": gitStatusMarkup += "&#8722;"; break;
						case "??": gitStatusMarkup += "&#8853;"; break;
						default: gitStatusMarkup += i; break;
					}
					gitStatusMarkup += _gitstatus.status[i] + '&nbsp;';
				}
			}
			gitStatusMarkup += '</span>';
		}
		_contextEl.innerHTML = _context + gitStatusMarkup;
	}
	var send = function(command, callback, data, preventResultShowing) {
		var id = _.uniqueId("shellcommand");
		if(!preventResultShowing) {
			App.setOutputPanelContent('<div id="' + id + '" class="shell-wrapper"></div>');
		}
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
		connect: connect,
		socket: function() { return _socket; }
	}

})();