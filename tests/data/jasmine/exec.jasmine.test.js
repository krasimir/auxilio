function jasmineTest(args, callback) {
	describe("A test suite", function() {
		it("should echo something to the console", function(done) {
			exec("echo That's coming from a jasmine test.", function() {
				done();
			})
		});
		it("should get the current date", function(done) {
			exec("date true", function(res) {
				expect(res.monthName).toBeDefined();
				done();
			})
		});
	});
	callback();
}