window.onload = function() {

	var index = Math.floor((Math.random()*quotes.length));
	var quote = quotes[index];
	document.getElementById("quote").innerHTML = quote[0] + '<a href="#" id="sound"></a>';
	document.getElementById("author").innerHTML = quote[1];
	document.getElementById("get-the-old").onclick = function() {
		chrome.tabs.update({
		    url: 'chrome-internal://newtab/'
		});
	}
	document.getElementById("sound").onclick = function() {
		chrome.tts.speak(quote[0], {rate: 0.8});
	}
	chrome.tts.stop();

}