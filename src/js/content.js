// helper methods
var filterDOMElements = function(elements, filter) {
    if(filter === null || filter === false || typeof filter === "undefined") {
        return elements;
    }
    var filteredElements = [];
    var r = new RegExp(filter, "gi");
    for(var i=0; i<elements.length; i++) {
        if(elements[i].outerHTML.toString().match(r)) {
            filteredElements.push(elements[i]);
        }
    }
    return filteredElements;
}
var getRawOfDOMElements = function(elements) {
    var raw = [];
    for(var i=0; i<elements.length; i++) {
        raw.push(elements[i].outerHTML);
    }
    return raw;
}
var queryAll = function(selector) {
    try {
        var result = document.querySelectorAll(selector);
        return result;
    } catch(e) {
        alert('Wrong selector ' + selector);
        return [];
    }
}

// communication
chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {
    switch(message.type) {
    	case "request":
    		request(message.url, function(response) {
    			sendResponse(response);
    		})
    	break;
    	case "pageclick":
    		var elements = filterDOMElements(queryAll(message.selector), message.filter);
    		if(elements && elements.length > 0) {
    			elements[0].click();
    			sendResponse({elements: elements.length, raw: getRawOfDOMElements(elements)});
    		} else {
    			sendResponse({elements: 0});
    		}
    	break;
        case "pagehighlight":
    		var elements = filterDOMElements(queryAll(message.selector), message.filter);
            sendResponse({elements: elements && elements.length > 0 ? elements.length : 0});
        	for(var i=0; i<elements.length; i++) {
        		if(message.selector != "img") {
                	elements[i].style.backgroundColor = '#FF0000';
                    elements[i].style.boxShadow = "1px 2px 1px #000";
                    elements[i].style.color = "#FFF";
            	} else {
            		elements[i].style.boxShadow = "5px 5px 1px #FF0000";
            		elements[i].style.MozBoxShadow = "5px 5px 1px #FF0000";
            		elements[i].style.WebkitBoxShadow = "5px 5px 1px #FF0000";
            	}
            }
        break;
        case "pagequery":
            var elements = filterDOMElements(queryAll(message.selector), message.filter);
            sendResponse({
                elements: elements && elements.length > 0 ? elements.length : 0,
                raw: getRawOfDOMElements(elements)
            });
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


// ----------------------------------------------------------------------------------- Boot code
// var onWindowLoad = function() {
	
// }
// if(window) {
// 	if(document && document.readyState == "complete") {
// 		onWindowLoad();
// 	} else {
// 		window.addEventListener("load", onWindowLoad, true);
// 	}
// }
