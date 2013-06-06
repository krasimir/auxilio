var TabCompleteNotifier = {
	tabs: {},
	add: function(tabId, callback) {
		if(!callback) return;
		if(!this.tabs["tab" + tabId]) this.tabs["tab" + tabId] = [];
		this.tabs["tab" + tabId].push(callback);
	},
	notify: function(tabId) {
		if(this.tabs["tab" + tabId]) {
			var tabs = this.tabs["tab" + tabId];
			for(var i=0; i<tabs.length; i++) {
				tabs[i]();
			}
			this.tabs["tab" + tabId] = [];
		}
	}
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	switch(message.type) {
    	case "load": 
    		chrome.tabs.getSelected(null, function (tab) {
    			TabCompleteNotifier.add(tab.id, sendResponse);
				chrome.tabs.update(tab.id, {url: message.url});
			});
    	break;
    	case "refresh":
    		chrome.tabs.getSelected(null, function (tab) {
    			TabCompleteNotifier.add(tab.id, sendResponse);
				chrome.tabs.update(tab.id, {url: tab.url});
			});
    	break;
    	case "newtab":
    		chrome.tabs.create({ active: true, url: message.url }, function(tab) {
    			TabCompleteNotifier.add(tab.id, sendResponse);
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

chrome.tabs.onUpdated.addListener(function(tabId, info, tab) {	
	if(info.status == "complete") {
        TabCompleteNotifier.notify(tabId);
    }
});