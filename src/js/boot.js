// Boot
window.onload = function() {
	Autocomplete.init();
	Autocomplete.on("match", function(res) {
		App.setCommandValue(res.value);
	});
	App.init();
	Shell.init();
	document.querySelector("body").addEventListener("keydown", function(e) {
		if(e.ctrlKey && e.keyCode === 123) {
			App.command.focus();
		}
	});
};

// shortcuts
var exec = function(commandStr, callback) {
	App.execute(commandStr, callback);
}
// console.log in the background page
var bglog = function(obj) {
	if(chrome && chrome.runtime) {
		chrome.runtime.sendMessage({type: "bglog", obj: obj});
	}
}