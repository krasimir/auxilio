function(date) {
	if(date.monthName === "June") {
		exec("success Yep, it's June");
	} else {
		exec("error Nope, it's not June");
	}
}