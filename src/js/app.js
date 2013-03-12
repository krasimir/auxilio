var App = {
	addView: function(key) {
		var view = Views.get(key);
		$("#content").empty().append(view.render().el);
		view.on("change-view", function(viewKey) {
			App.addView(viewKey)
		})
		return view;
	}
}

$(document).ready(function() {
	App.addView("Navigation");
	// App.addView("Responsive");
});