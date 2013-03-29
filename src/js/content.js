// ----------------------------------------------------------------------------------- common
var responsiveSize = {};
var mediaQueries = [];

// ----------------------------------------------------------------------------------- main
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

// ----------------------------------------------------------------------------------- screen size
var reportSize = function() {
	responsiveSize.w = window.outerWidth;
	responsiveSize.h = window.outerHeight;
	responsiveUpdateUI();
}

// ----------------------------------------------------------------------------------- page info
chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {
    switch(message.type) {
        case "GetPageInfoData":
			sendResponse(getPageInfo());
        break;
        case "PageInfoHighlightTag":
        	if(message.tag) {
        		var elements = document.querySelectorAll(message.tag);
	        	for(var i=0; i<elements.length; i++) {
	        		if(message.tag != "img") {
	                	elements[i].style.backgroundColor = message.color;
	            	} else {
	            		if(message.color == "") {
	            			elements[i].style.boxShadow = "";
		            		elements[i].style.MozBoxShadow = "";
		            		elements[i].style.WebkitBoxShadow = "";
	            		} else {
	            			elements[i].style.boxShadow = "5px 5px 1px #FF0000";
		            		elements[i].style.MozBoxShadow = "5px 5px 1px #FF0000";
		            		elements[i].style.WebkitBoxShadow = "5px 5px 1px #FF0000";
	            		}
	            	}
	            }
        	}
        break;
    }
});
var getPageInfo = function() {
	var data = {
		url: window.location.href,
		meta: convertListToStrings(document.querySelectorAll("meta")),
		titles: {
			h1: convertListToStrings(document.querySelectorAll("h1")),
			h2: convertListToStrings(document.querySelectorAll("h2")),
			h3: convertListToStrings(document.querySelectorAll("h3")),
			h4: convertListToStrings(document.querySelectorAll("h4")),
			h5: convertListToStrings(document.querySelectorAll("h5")),
			h6: convertListToStrings(document.querySelectorAll("h6"))
		},
		section: convertListToStrings(document.querySelectorAll("section")),
		article: convertListToStrings(document.querySelectorAll("article")),
		nav: convertListToStrings(document.querySelectorAll("nav")),
		header: convertListToStrings(document.querySelectorAll("header")),
		footer: convertListToStrings(document.querySelectorAll("footer")),
		links: convertListToStrings(document.querySelectorAll("a")),
		paragraphs: convertListToStrings(document.querySelectorAll("p")),
		images: convertListToStrings(document.querySelectorAll("img"))
	}
	return data;
}
var convertListToStrings = function(list) {
	if(!list) return [];
	var arr = [];
	for(var i=0; i<list.length; i++) {
		if(list[i] && list[i].outerHTML) {
			arr.push(list[i].outerHTML);
		}
	}
	return arr;
}

// ----------------------------------------------------------------------------------- media queries
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


// ----------------------------------------------------------------------------------- initialization
if(window) {
	window.addEventListener("resize", reportSize, false);
	if(document && document.readyState == "complete") {
		onWindowLoad();
	} else {
		window.addEventListener("load", onWindowLoad, true);
	}
}

