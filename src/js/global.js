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
		exec('shell cd ' + e.target.getAttribute("data-path"));
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