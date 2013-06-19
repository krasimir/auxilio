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
                chrome.tabs.reload(tab.id);
            });
        break;
        case "newtab":
            chrome.tabs.create({ active: message.active.toString() === "true", url: message.url }, function(tab) {
                TabCompleteNotifier.add(tab.id, sendResponse);
            });
        break;
        case "screenshot":
            chrome.windows.getCurrent(function (win) {    
                chrome.tabs.captureVisibleTab(win.id, {quality: 100}, function(image) {
                    sendResponse(image);                                           
                });    
              });
        break;
        case "pageclickw":
            chrome.tabs.getSelected(null, function (tab) {
                var clickResponse = null;
                TabCompleteNotifier.add(tab.id, function() {
                    sendResponse(clickResponse);
                });
                message.type = "pageclick";
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
        case "pageinsertjs":
            chrome.tabs.getSelected(null, function(tab){
                chrome.tabs.executeScript(tab.id, {code: message.jscode}, function(response) {
                    sendResponse(response ? JSON.stringify(response) : null);
                });
            });
        break;
        case "pageinsertjsw":
            chrome.tabs.getSelected(null, function (tab) {
                var clickResponse = null;
                TabCompleteNotifier.add(tab.id, function() {
                    sendResponse(sendResponse(clickResponse ? JSON.stringify(clickResponse) : null));
                });
                chrome.tabs.executeScript(tab.id, {code: message.jscode}, function(response) {
                    clickResponse = response;
                });
            });
        break;
        case "pageinsertcss":
            chrome.tabs.getSelected(null, function(tab) {
                chrome.tabs.insertCSS(tab.id, {code: message.csscode}, function(response) {
                    sendResponse(response);
                });
            });
        break;
        case "marker":
            chrome.tabs.getSelected(null, function(tab) {
                chrome.tabs.insertCSS(tab.id, {file: "css/marker.css"}, function(response) {
                    sendResponse(response);
                });
                chrome.tabs.executeScript(tab.id, {file: "js/scripts/marker.js"}, function(response) {
                    sendResponse(response ? JSON.stringify(response) : null);
                });
            });
        break;
        case "bglog":
            console.log(message.obj);
        break;
        default:
            try {
                chrome.tabs.getSelected(null, function(tab){
                    chrome.tabs.sendMessage(tab.id, message, function(response) {
                        sendResponse(response);
                    });
                });
            } catch(e) {
                sendResponse({error: e.message});
            }
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