Commands.refresh = function(args) {
	if(chrome && chrome.runtime) chrome.runtime.sendMessage({type: "refresh"});
}