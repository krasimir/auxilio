var responsiveResolutionPort = null;
var currentWindowSize = {w: 0, h: 0};
var currentWindow = null;

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	switch(request.type) {
		case "ResponsiveResolutionUpdateUI":
			currentWindowSize = request.data;
			if(responsiveResolutionPort) {
				responsiveResolutionPort.postMessage(request);
			}
		break;
	}
	return true;
});

chrome.extension.onConnect.addListener(function (port) {
    port.onMessage.addListener(function (message) {
       	switch(port.name) {
			case "ResponsiveResolution":
				responsiveResolutionPort = port;
				responsiveResolutionPort.onDisconnect.addListener(function() {
					responsiveResolutionPort = null;
				});
				switch(message.type) {
					case "update-window-size":
						if(currentWindow) {
						    chrome.windows.update(currentWindow.id, {
						        width: message.data.w,
						        height: message.data.h
						    });
						    // changeDeviceMetrics(message.data.w, message.data.h);
						}
					break;
					case "give-me-current-window-size":
						responsiveResolutionPort.postMessage({data: currentWindowSize});
					break;
				}
			break;
			case "PageInfo":
				switch(message.type) {
					case "GetPageInfoData":
						chrome.tabs.getSelected(null, function(tab){
			                chrome.tabs.sendMessage(tab.id, {type: "GetPageInfoData"}, function(response) {
			                	port.postMessage({data: response});
			                });
			            });
					break;
					case "PageInfoHighlightTag":
						chrome.tabs.getSelected(null, function(tab){
			                chrome.tabs.sendMessage(tab.id, message);
			            });
					break;
				}				
			break;
		}
    });
});

chrome.windows.getCurrent({}, function(w) {
    currentWindow = w;
});

// --------------------------------------------------------------------------------- Responsive / Device metrics
// http://stackoverflow.com/questions/15618923/in-google-chrome-what-is-the-extension-api-for-changing-the-useragent-and-devic
// var changeDeviceMetrics = function(w, h) {

// 	var protocolVersion = '1.0';

// 	var onAttach = function(tabId) {
// 		chrome.debugger.sendCommand({
// 		    tabId: tabId
// 		}, "Page.setDeviceMetricsOverride", {
// 		    width: w,
// 		    height: h,
// 		    fontScaleFactor: 1,
// 		    fitWindow: false
// 		}, function(response) {
// 		    console.log("on setDeviceMetricsOverride", response);
// 		});
// 	}

// 	chrome.windows.getCurrent(function(win) {
// 		chrome.tabs.getSelected(win.id, function(tab) {
// 			chrome.debugger.detach({tabId:tab.id}, function() {
// 				console.log("on detach");
// 				chrome.debugger.attach({tabId:tab.id}, protocolVersion, onAttach.bind(null, tab.id));
// 			});
// 			// onAttach(tab.id)
// 		});
// 	});
// }