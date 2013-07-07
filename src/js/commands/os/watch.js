var WatchHelper = (function() {

	var _isSocketListenerAttached = false;
	var _callbacks = {};
	var _initCallback = null;

	var callInitCallback = function() {
		if(_initCallback) {
			_initCallback();
		}
	}
	var attachSocketListeners = function() {
		if(!_isSocketListenerAttached) {
			_isSocketListenerAttached = true;
			Shell.socket().on("watch-change", function(res) {
				if(_callbacks[res.auxilioId] && _callbacks[res.auxilioId].length > 0) {
					var line = _callbacks[res.auxilioId].join(" && ");
					if(line != '') {
						exec(_callbacks[res.auxilioId].join(" && "), null, res);
					}
				}
			});
			Shell.socket().on("watch-started", function(res) {
				exec('success Watcher started (<b>' + res.path + '</b>).');
				callInitCallback();
			});
			Shell.socket().on("watch-stopped", function(res) {
				exec('success Watcher stopped (<b>' + res.path + '</b>).');
				callInitCallback();
			});
			Shell.socket().on("watch-list", function(res) {
				var watchers = res.watchers ? res.watchers : [];
				if(watchers.length == 0) {
					exec("info There is no watchers.");
				} else {
					var str = '';
					for(var i=0; w=watchers[i]; i++) {
						str += 'ID: ' + w.id + ', Path: ' + w.path + '<br />';
					}
					exec("info Watchers:<br />" + str);
				}
				callInitCallback();
			});
			Shell.socket().on("watch-stopped-all", function(res) {
				exec('success All watchers are stopped.');
				callInitCallback();
			});
		}
	}
	var init = function(data, callback) {
		if(Shell.connected() && Shell.socket()) {
			attachSocketListeners();
			var auxilioId = _.uniqueId("watch");
			if(data.operation == 'start') {
				_callbacks[auxilioId] = data.watchCallback;
			}
			_initCallback = callback;
			Shell.socket().emit("watch", _.extend({auxilioId: auxilioId}, data));
		} else {
			NoShellError("watch: no shell");
			callback();
		}
	}

	return {
		init: init
	}

})();

Commands.register("watch", {
	requiredArguments: 0,
	format: '<pre></pre>',
	lookForQuotes: true,
	concatArgs: true,
	run: function(args, callback) {
		var operation = args.length > 0 ? args.shift() : 'list';
		var parameter = args.length > 0 ? args.shift() : '';
		var watchCallback = args.length > 0 ? args.shift() : '';
		if(operation != 'list' && operation != 'start' && operation != 'stop' && operation != 'stopall') {
			exec("error Wrong watch operation. User <i>start</i>, <i>stop</i> or <i>stopall</i>. Type <i>man watch</i> to get more information.")
			callback();
		} else {
			if(watchCallback.indexOf(",") >= 0) {
				watchCallback = watchCallback.replace(/, /g, ',').split(',');
			} else {
				watchCallback = [watchCallback];
			}
			WatchHelper.init({
				operation: operation,
				parameter: parameter,
				watchCallback: watchCallback
			}, callback);
		}
	},
	man: {
		desc: 'Watch directory or file for changes.',
		format: 'watch [operation] [id or path] [callback command]',
		examples: [
			{text: 'Get the current watchers and their ids', code: 'watch'},
			{text: 'Start watching', code: 'watch start ./ echo'},
			{text: 'Start watching and call multiple callbacks', code: 'watch start ./ "jshint, echo"'},
			{text: 'Stop watcher', code: 'watch stop 1'},
			{text: 'Stop all watchers', code: 'watch stopall'},
			{text: 'In script', code: 'watch("start", "./", "echo", function(res) {\n\
	console.log(res);\n\
});'}
		],
		returns: 'string',
		group: 'os'
	}	
})