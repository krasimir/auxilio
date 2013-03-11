window.addEventListener("resize", function() {
	chrome.extension.sendMessage({
		type: "ResponsiveResolutionUpdateUI", 
		data: {
			w: window.outerWidth,
			h: window.outerHeight
		}
	});
}, false);