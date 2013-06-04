// ----------------------------------------------------------------------------------- Auxilio Console
function applyAuxilioConsole() {
	var Auxilio = {
		auxilio: function() {
			console.log("Hello!");
		}
	}
	for(var i in Auxilio) {
		window[i] = Auxilio[i];
	}
}

var script = document.createElement('script');
var code = document.createTextNode('(' + applyAuxilioConsole + ')();');
script.appendChild(code);
(document.body || document.head).appendChild(script);

// ----------------------------------------------------------------------------------- Boot code
var onWindowLoad = function() {
	
}
if(window) {
	if(document && document.readyState == "complete") {
		onWindowLoad();
	} else {
		window.addEventListener("load", onWindowLoad, true);
	}
}
