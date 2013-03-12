// common
var responsiveSize = {};
var mediaQueries = [];

// main
var onWindowLoad = function() {
	reportMediaQueries();
	reportSize();
}
var responsiveUpdateUI = function() {
	chrome.extension.sendMessage({
		type: "ResponsiveResolutionUpdateUI", 
		data: {
			w: responsiveSize.w,
			h: responsiveSize.h,
			mediaQueries: mediaQueries
		}
	});
}

// screen size
var reportSize = function() {
	responsiveSize.w = window.outerWidth;
	responsiveSize.h = window.outerHeight;
	responsiveUpdateUI();
}

// media queries
var reportMediaQueries = function() {
	mediaQueries = [];	
	if(document && document.styleSheets) {
		for(var i=0; i<document.styleSheets.length; i++) {
			var stylesheet = document.styleSheets[i];
			var file = stylesheet.href;
			var medias = [];
			medias.push(collectMediaQueries(stylesheet.media));
			if(stylesheet.rules) {
				for(var j=0; j<stylesheet.rules.length; j++) {
					medias.push(collectMediaQueries(stylesheet.rules[j].media));
				}
			}
			medias = normilizeMediaQuaeries(medias);
			mediaQueries.push({
				file: file,
				medias: medias
			});
		}
	}
}
var collectMediaQueries = function(media) {
	if(media) {
		return {mediaText: media.mediaText};
	}
	return null;
}
var normilizeMediaQuaeries = function(medias) {
	var newArr = [];
	var texts = {};
	for(var i=0; i<medias.length; i++) {
		if(medias[i] !== null && !texts[medias[i].mediaText]) {
			texts[medias[i].mediaText] = true;
			newArr.push(medias[i]);
		}
	}
	return newArr;
}


// initialization
if(window) {
	window.addEventListener("resize", reportSize, false);
	if(document && document.readyState == "complete") {
		onWindowLoad();
	} else {
		window.addEventListener("load", onWindowLoad, true);
	}
}

