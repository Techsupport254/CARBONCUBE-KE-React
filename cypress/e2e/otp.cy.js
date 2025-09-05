describe("The Home Page", () => {
	it("successfully loads", () => {
		// Intercept the POST request before visiting
		cy.intercept("POST", `/email_otps`, {
			statusCode: 200,
			body: {
				fullname: "John Doe",
				email: "johndoe123@test.com",
			},
		}).as("signupRequest");

		cy.visit("/");
		cy.get("#signInButton").click();
		cy.get("#buyerSignupBtn").click();
		cy.wait(500);
		cy.get("form").within(() => {
			cy.get("input[name='fullname']").type("John Doe");
			cy.get("input[name='username']").type("johndoe");
			cy.get("input[name='email']").type("johndoe123@test.com");
			cy.get("input[name='phone_number']").type("1234567890");
			cy.get("input[name='city']").type("123 Main St");
			cy.get("select[name='gender']").select("Male");
			cy.get("select[name='age_group_id']").select("1");
			cy.wait(500);
			cy.get("#step1ContinueBtn").click();

			cy.get("input[name='password']").type("Password123!");
			cy.get("input[name='password_confirmation']").type("Password123!");
			cy.get('[type="checkbox"]').check(); // Check checkbox element
		});

		cy.wait(500);
		// Submit the form
		cy.get("form").submit();

		// Wait for the stubbed request
		cy.wait("@signupRequest").its("response.statusCode").should("eq", 200);

		cy.intercept("POST", `/email_otps/verify`, {
			statusCode: 200,
			body: {
        verified: true,
        email:"johndoe123@test.com",
        otp:"123456"
			},
		}).as("otpVerifyRequest");

		cy.intercept("POST", "/buyer/signup", {
			statusCode: 200,
			body: {
        fullname: "John Doe",
        username: "johndoe",
        email: "johndoe123@test.com",
        phone_number: "1234567890",
        city: "123 Main St",
        gender: "Male",
        age_group_id: "1",
			},
		}).as("buyerSignupRequest");

		// submit otp and registter
		cy.get("form").within(() => {
			cy.get("input[name='otp']").type("123456");
		});

    // verify otp and signup in one click
		cy.get("#verifyOtpBtn").click();
    cy.wait(["@otpVerifyRequest","@buyerSignupRequest"])
    cy.visit("/")

	});
});
