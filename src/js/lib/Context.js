var Context = (function() {

	var _body,
		_contextEl,
		_context,
		_gitstatus;

	var on = function() {
		_body.className = "shell-on";
	}
	var off = function() {
		_body.className = "shell-off";
	}
	var updateContext = function(res) {
		_context = res.context;
		_gitstatus = res.git;
		setContext();
	}
	var init = function() {
		_body = document.querySelector("body");
		_contextEl = document.getElementById("js-shell-cwd");
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

	return {
		init: init,
		on: on,
		off: off,
		updateContext: updateContext
	}

})();