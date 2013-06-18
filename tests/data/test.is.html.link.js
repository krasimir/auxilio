function(res) {
	if(res.elements >= 1) {
		exec("success Yep, there are some links on the page.");
	} else {
		exec("error Nope, there aren't any links.");
	}
}