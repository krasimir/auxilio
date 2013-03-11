var Views = {
	collection: {},
	register: function(key, custom) {

		var view = function() {

			// setting the template
			if($("#" + key + "_template").length == 0) {
				console.log("Template " + key + "_template is missing.");
				return;
			}
			var html = $("#" + key + "_template").html();
	        html = html.replace(/\n/gi, "");
	        html = html.replace(/\t/gi, "");

			return _.extend({
				events: {},
				template: html,
				el: $("<div></div>"),
				on: function(event, listener) {
					if(!this.events[event]) this.events[event] = [];
					this.events[event].push(listener);
				},
				dispatch: function(event, data) {
					if(this.events[event]) {
						for(var i=0; i<this.events[event].length; i++) {
							this.events[event][i](data);
						}
					}
				}
			}, custom);
		}

		this.collection[key] = view;
		
	},
	get: function(key) {
		var view = new this.collection[key];
		view.initialize();
		return view;
	}
}

if(typeof views == "undefined") views = {};