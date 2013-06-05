Commands.click = function(args) {
	if(!args[0]) {
		App.error("<u>click</u> requires at least one parameter. Format: open &lt;selector&gt;");
		return;
	}
	var selector = args.join(" ");
	if(chrome && chrome.runtime) chrome.runtime.sendMessage({type: "click", selector: selector});
}