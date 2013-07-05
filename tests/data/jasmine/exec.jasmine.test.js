function jasmineTest(args) {
	describe("A test suite", function() {
		it("should echo something to the console", function() {
			exec("echo That's coming from a jasmine test.", function() {
				
			})
		});
		it("should get the current date", function() {
			console.log("B");
			exec("date true", function(res) {
				expect(res.monthName).toBeDefined();
			})
		});
	})	
}