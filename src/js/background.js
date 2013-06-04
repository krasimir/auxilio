chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	chrome.tabs.getSelected(null, function(tab){
        chrome.tabs.sendMessage(tab.id, request, function(response) {
        	sendResponse(response);
        });
    });
	return true;
});