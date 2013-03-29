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
				switch(message.type) {
					case "update-window-size":
						if(currentWindow) {
						    chrome.windows.update(currentWindow.id, {
						        width: message.data.w,
						        height: message.data.h
						    });
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