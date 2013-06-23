var CommandBase = {
	name: '',
	requiredArguments: 0,
	format: '',
	lookForQuotes: true,
	concatArgs: false,
	run: function(args, callback) {
		callback();
	},
	man: function() {
		return '<u>' + this.name + '</u> has no manual page.';
	},
	validate: function(args) {
		if(this.requiredArguments === 0 || (args && args.length && args.length >= this.requiredArguments)) { return true; }
		else {
			var message = '<u><b>' + this.name + '</b></u> requires at least ' + this.requiredArguments + ' arguments.';
			this.format != '' ? message += '<br />' + this.format : null;
			exec("error " + message);
		}
	},
	formatter: function(args, usePreTag, skipHTMLFormatting, convertHTMLToString) {
		var formatJSON = function(data) {
			data = JSON.stringify(data, null, '\t')
			data = nl2br(data);
			data = tabsToSpaces(data);
			return data;
		}
		var nl2br = function(data) {
			if(skipHTMLFormatting) return data;
			return data.replace(/\n/g, '<br />');
		}
		var tabsToSpaces = function(data) {
			if(skipHTMLFormatting) return data;
			return data.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
		}
		var html2String = function(data) {
			return data.replace(/</g, '&lt;').replace(/>/g, '&gt;');
		}
		if(args.length > 0) {
			var firstArgument = args[0];
			var data = '';
			if(typeof firstArgument === 'object') {
				data = formatJSON(firstArgument);
			} else {
				data = args.join(' ');
				try {
					var json = JSON.parse(data);
					data = formatJSON(json);
				} catch(e) {
					data = nl2br(data);
				}
			}
			if(convertHTMLToString) {
				data = html2String(data);
			}
			if(usePreTag) {
				return '<pre>' + data + '</pre>';
			} else {
				return data;
			}
		} else {
			return '';
		}
	}
}