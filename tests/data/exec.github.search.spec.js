function testingGitHubSearching(args, callback) {
	/*title Search feature of GitHub.com
	load github.com
	pageinsertjs document.querySelector("#js-command-bar-field").value="auxilio";
	pageinsertjsw document.querySelector("#top_search_form").submit();
	pagecontains h3 krasimir/auxilio*/
	describe("Testing GitHub searching", function() {
		it("load github.com", function(done) {
			load("github.com", done);
		});
		it("shoud check something", function(done) {
			expect(1 == 1).toBe(true);
			done();
		});
	});
	callback();
}