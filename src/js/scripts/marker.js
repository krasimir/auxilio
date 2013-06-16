var AuxilioMarker = {
	curtain: null,
	body: null,
	markers: [],
	markersHolder: null,
	init: function() {
		var self = this;
		this.markers = [];
		this.curtain = document.createElement("DIV");
		this.curtain.className = "auxilio-marker-curtain";
		this.curtain.id = "js-auxilio-marker-curtain";
		this.curtain.innerHTML = '\
			<div class="auxilio-marker-curtain-bg"></div>\
			<h1>CLICK HERE!<br /><small>Press <u>Esc</u> key to exit.</small></h1>\
			<div class="auxilio-markers"></div>\
		';
		this.body = document.querySelector("body");
		
		if(this.body) {

			setTimeout(function() {
				self.markersHolder = document.querySelector(".auxilio-markers");
			}, 300);
			this.body.appendChild(this.curtain);
			this.curtain.addEventListener("click", function(e) {
				self.hideCurtain();
				self.placeMarker(e);
			});

			var onKeyDown = function(e) {
				if(e.keyCode == 27) {
					self.body.removeEventListener("keydown", onKeyDown);
					self.body.removeChild(self.curtain);
				}
			}
			this.body.addEventListener("keydown", onKeyDown);
		}

	},
	hideCurtain: function() {
		if(this.markers.length === 0) {
			document.querySelector(".auxilio-marker-curtain-bg").style.opacity = 0;
			document.querySelector(".auxilio-marker-curtain h1").style.opacity = 0;
		}
	},
	placeMarker: function(e) {
		var marker = document.createElement("DIV");
		marker.className = "auxilio-marker-item";
		marker.innerHTML = this.markers.length + 1;
		marker.style.top = (e.pageY-15) + "px";
		marker.style.left = (e.pageX-15) + "px";
		this.markers.push(marker);
		this.markersHolder.appendChild(marker);
	},
	error: function(msg) {
		alert(msg);
	}
};

(function() {
	AuxilioMarker.init();
})();