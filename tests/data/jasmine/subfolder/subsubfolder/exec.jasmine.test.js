function jasmineTest(args, callback) {
	describe("A test suite", function() {
		it("should echo something to the console", function(next) {
			exec("echo That's coming from a jasmine test.", function() {
				next();
			})
		});
		it("should get the current date", function(next) {
			exec("date true", function(res) {
				expect(res.monthName).toBeDefined();
				next();
			})
		})
	});
	callback();
}