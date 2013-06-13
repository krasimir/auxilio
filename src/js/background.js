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
var onMessageListener = function(message, sender, sendResponse) {
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
        case "clicknavigate":
            chrome.tabs.getSelected(null, function (tab) {
                var clickResponse = null;
                TabCompleteNotifier.add(tab.id, function() {
                    sendResponse(clickResponse);
                });
                message.type = "click";
                chrome.tabs.sendMessage(tab.id, message, function(response) {
                    clickResponse = response;
                });
            });
        break;
        case "storage":
            if(message.operation == "put") {
                var o = {};
                o[message.key] = message.value;
                storage.set(o, function() {
                    sendResponse({error: null});
                });
            } else if(message.operation == "get") {
                var o = null;
                if(message.key) {
                    o = {};
                    o[message.key] = '';
                }
                storage.get(o, function(res) {
                    sendResponse({error: null, value: res});
                });
            } else if(message.operation == "remove") {
                if(message.key) {
                    storage.remove(message.key, function(res) {
                        sendResponse({error: null});
                    });
                } else {
                    sendResponse({error: "Missing key."});
                }
            } else {
                sendResponse({error: "Wrong operation (" + message.operation + ")."});
            }
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
}
var onUpdatedListener = function(tabId, info, tab) {    
    if(info.status == "complete") {
        TabCompleteNotifier.notify(tabId);
    }
}
var onSuspendListener = function() {
    // chrome.runtime.onMessage.removeListener(onMessageListener);
    // chrome.tabs.onUpdated.removeListener(onUpdatedListener);
}

var storage = chrome.storage.local;
chrome.runtime.onMessage.addListener(onMessageListener);
chrome.tabs.onUpdated.addListener(onUpdatedListener);
chrome.runtime.onSuspend.addListener(onSuspendListener);