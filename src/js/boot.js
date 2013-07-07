window.onload = function() {
	Autocomplete.init();
	Autocomplete.on("match", function(res) {
		App.setCommandValue(res.value);
	});
	App.init();
	Context.init();
	Shell.init();
	Profile.init();
	document.querySelector("body").addEventListener("keydown", function(e) {
		if(e.ctrlKey && e.keyCode === 123) {
			App.command.focus();
		}
	});
};