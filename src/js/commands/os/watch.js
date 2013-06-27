var WatchHelper = (function() {

	var _isSocketListenerAttached = false;
	var _callbacks = {};

	var attachSocketListeners = function() {
		if(!_isSocketListenerAttached) {
			_isSocketListenerAttached = true;
			Shell.socket().on("watch-change", function(res) {
				if(_callbacks[res.auxilioId] && _callbacks[res.auxilioId].length > 0) {
					for(var i=0; c = _callbacks[res.auxilioId][i]; i++) {
						if(c != '') {
							exec(c, null, res);
						}
					}
				}
			});
			Shell.socket().on("watch-started", function(res) {
				exec('success Watcher started (<b>' + res.path + '</b>).');
			});
			Shell.socket().on("watch-stopped", function(res) {
				exec('success Watcher stopped (<b>' + res.path + '</b>).');
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
			});
			Shell.socket().on("watch-stopped-all", function(res) {
				exec('success All watchers are stopped.');
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
			Shell.socket().emit("watch", _.extend({auxilioId: auxilioId}, data));
		} else {
			NoShellError();
			callback();
		}
	}

	return {
		init: init
	}

})();

Commands.register("watch", {
	requiredArguments: 0,
	format: '<pre>watch [operation] [id or path] [callback command]</pre>',
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
				watchCallback = watchCallback.replace(/ /g, '').split(',');
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
	man: function() {
		return 'Watch directory or file for changes.\
		<br />Operations:\
		<br />a) watch (without arguments) - shows the current watched file or directory\
		<br />b) watch start [path to file or directory] [callback command] - start watching\
		<br />c) watch stop [id] - stop watching. Use a) to find out the ids\
		<br />c) watch stopall - stop the all watchers\
		';
	}	
})