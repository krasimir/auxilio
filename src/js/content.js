// communication
chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {
    switch(message.type) {
    	case "request":
    		request(message.url, function(responseText) {
    			sendResponse({responseText: responseText});
    		})
    	break;
        case "PageInfoHighlightTag":
        	if(message.tag) {
        		var elements = document.querySelectorAll(message.tag);
	        	for(var i=0; i<elements.length; i++) {
	        		if(message.tag != "img") {
	                	elements[i].style.backgroundColor = message.color;
	            	} else {
	            		if(message.color == "") {
	            			elements[i].style.boxShadow = "";
		            		elements[i].style.MozBoxShadow = "";
		            		elements[i].style.WebkitBoxShadow = "";
	            		} else {
	            			elements[i].style.boxShadow = "5px 5px 1px #FF0000";
		            		elements[i].style.MozBoxShadow = "5px 5px 1px #FF0000";
		            		elements[i].style.WebkitBoxShadow = "5px 5px 1px #FF0000";
	            		}
	            	}
	            }
        	}
        break;
    }
    return true;
});

// request
var request = function(url, callback) {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", url, true);
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			callback({responseText: xhr.responseText});
		} else if(xhr.readyState == 4) {
			callback({error: "Error requesting '" + url + "'."});
		}
	}
	xhr.send(null);
}

// ----------------------------------------------------------------------------------- Auxilio Console
function applyAuxilioConsole() {
	window.auxilio = function() {
		console.log("What's up!");
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
