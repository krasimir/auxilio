// Boot
window.onload = function() {
	Autocomplete.init();
	Autocomplete.on("match", function(res) {
		App.setCommandValue(res.value);
	});
	App.init();
	Context.init();
	Shell.init();
	document.querySelector("body").addEventListener("keydown", function(e) {
		if(e.ctrlKey && e.keyCode === 123) {
			App.command.focus();
		}
	});
};

// shortcuts
var exec = function(commandStr, callback, arg) {
	App.execute(commandStr, callback, arg);
}
// console.log in the background page
var bglog = function(obj) {
	if(chrome && chrome.runtime) {
		chrome.runtime.sendMessage({type: "bglog", obj: obj});
	}
}
// change the current directory
var gotoClick = function(e) {
	if(e.target.getAttribute("data-type") === "file") {
		exec('shell ' + e.target.getAttribute("data-path"));
	} else {
		exec('shell cd ' + e.target.getAttribute("data-path") + ' && ls');
	}
}
var attachGotoEvents = function() {
	var gotolinks = document.querySelectorAll(".goto");
	for(var i=0; link = gotolinks[i]; i++) {
		(function(link){
			link.removeEventListener("click", gotoClick)
			link.addEventListener("click", gotoClick);
		})(link);
	};
	setTimeout(attachGotoEvents, 500);
}
attachGotoEvents();