function testingGitHubSearching(args, callback) {
	describe("Testing GitHub searching", function() {
		it("should load github.com", function(done) {
			load("github.com", done);
		});
		it("shoud type 'auxilio' in the search bar", function(done) {
			pageinsertjs('document.querySelector("#js-command-bar-field").value="auxilio";', done);
		});
		it("shoud submit the form", function(done) {
			pageinsertjsw('document.querySelector("#top_search_form").submit()', done);
		});
		it("should have h3 element which contains 'auxilio'", function(done) {
			pagequery('h3', 'krasimir/auxilio', function(res) {
				expect(res.elements >= 1).toBe(true);
				done();
				screenshot();
			})
		});
	});
	callback();
}