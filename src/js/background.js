chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	switch(message.type) {
    	case "load": 
    		chrome.tabs.getSelected(null, function (tab) {
				chrome.tabs.update(tab.id, {url: message.url});
			});
    	break;
    	case "refresh": 
    		chrome.tabs.getSelected(null, function (tab) {
				chrome.tabs.update(tab.id, {url: tab.url});
			});
    	break;
    	default:
    		chrome.tabs.getSelected(null, function(tab){
		        chrome.tabs.sendMessage(tab.id, message, function(response) {
		        	sendResponse(response);
		        });
		    });
    	break;
	}
	return true;
});