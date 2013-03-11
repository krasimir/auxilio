var responsiveResolutionPort = null;

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	switch(request.type) {
		case "ResponsiveResolutionUpdateUI":
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
				chrome.windows.getCurrent({}, function(currentWindow) {
				    chrome.windows.update(currentWindow.id, {
				        width: message.data.w,
				        height: message.data.h
				    })
				});
			break;
		}
    });
});