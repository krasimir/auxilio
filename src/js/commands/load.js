Commands.load = function(args) {
	if(!args[0]) {
		App.error("<u>load</u> requires at least one parameter. Format: open &lt;url&gt;");
		return;
	}
	var url = args[0];
	if(url.indexOf("http") == -1) url = "http://" + url;
	if(chrome && chrome.runtime) chrome.runtime.sendMessage({type: "load", url: url});
}