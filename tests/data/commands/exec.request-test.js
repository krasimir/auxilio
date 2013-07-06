function requestTest(args) {
	request("http://github.com", function(res) {
		alert(res)
	})
}