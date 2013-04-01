chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	chrome.tabs.getSelected(null, function(tab){
        chrome.tabs.sendMessage(tab.id, request, function(response) {
        	sendResponse(response);
        });
    });
	return true;
});

// resizing viewport
// --------------------------------------------------------------------------------- Responsive / Device metrics
// http://stackoverflow.com/questions/15618923/in-google-chrome-what-is-the-extension-api-for-changing-the-useragent-and-devic
// var changeDeviceMetrics = function(w, h) {
// 	console.log("changeDeviceMetrics", w, h);

// 	var protocolVersion = '1.0';

// 	var onAttach = function(tabId) {
// 		console.log("onAttach");
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
// 			chrome.debugger.attach({tabId:tab.id}, protocolVersion, onAttach.bind(null, tab.id));			
// 			// onAttach(tab.id)
// 		});
// 	});
// }