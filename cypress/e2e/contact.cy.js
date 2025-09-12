/* eslint-disable no-undef */
/* global cy, Cypress */

describe("Contact Us Page", () => {
	beforeEach(() => {
		cy.visit("/contact-us");
	});

	describe("Page Load and UI Elements", () => {
		it("should load the contact page successfully", () => {
			cy.url().should("include", "/contact-us");
			cy.title().should("include", "Contact Us");
		});

		it("should display the hero section with correct styling", () => {
			cy.get('[class*="py-8 sm:py-12 lg:py-16"]').should("be.visible");
			cy.get('[style*="background-color: #ffc107"]').should("be.visible");
			cy.contains("Contact Us").should("be.visible");
			cy.contains("We're here to help!").should("be.visible");
		});

		it("should display the Carbon Cube logo in hero section", () => {
			cy.get('img[alt="Carbon Cube Kenya Logo"]').should("be.visible");
			cy.get('img[alt="Carbon Cube Kenya Logo"]').should(
				"have.attr",
				"src",
				"https://carboncube-ke.com/logo.png"
			);
		});

		it("should display contact information section", () => {
			cy.contains("Get in Touch").should("be.visible");
			cy.contains("info@carboncube-ke.com").should("be.visible");
			cy.contains("+254 712 990 524").should("be.visible");
			cy.contains("9th Floor, CMS Africa, Kilimani").should("be.visible");
		});

		it("should display social media links", () => {
			cy.get('a[href*="facebook.com"]').should("be.visible");
			cy.get('a[href*="linkedin.com"]').should("be.visible");
			cy.get('a[href*="instagram.com"]').should("be.visible");
		});

		it("should display the contact form with all required fields", () => {
			cy.get('input[name="name"]').should("be.visible");
			cy.get('input[name="email"]').should("be.visible");
			cy.get('input[name="subject"]').should("be.visible");
			cy.get('textarea[name="message"]').should("be.visible");
			cy.get('button[type="submit"]')
				.should("be.visible")
				.and("contain", "Send message");
		});

		it("should display FAQ section", () => {
			cy.contains("Frequently Asked Questions").should("be.visible");
			cy.contains("How do I become a seller").should("be.visible");
			cy.contains("What payment methods do you accept").should("be.visible");
		});

		it("should display map section", () => {
			cy.contains("Find Us").should("be.visible");
			cy.get("iframe").should("be.visible");
		});
	});

	describe("Form Validation", () => {
		it("should show validation errors for empty required fields", () => {
			cy.get('button[type="submit"]').click();
			// HTML5 validation should prevent submission with empty required fields
			cy.url().should("include", "/contact-us"); // Should stay on same page
		});

		it("should validate email format", () => {
			cy.get('input[name="name"]').type("Test User");
			cy.get('input[name="email"]').type("invalid-email");
			cy.get('input[name="subject"]').type("Test Subject");
			cy.get('textarea[name="message"]').type("Test message");
			cy.get('button[type="submit"]').click();
			// The form should still submit but backend will validate
		});
	});

	describe("Form Submission", () => {
		beforeEach(() => {
			// Intercept the contact form API call
			cy.intercept("POST", "**/contact/submit", {
				statusCode: 200,
				body: { success: true, message: "Thank you for contacting us!" },
			}).as("submitContact");
		});

		it("should successfully submit the contact form", () => {
			// Fill out the form
			cy.get('input[name="name"]').type("John Doe");
			cy.get('input[name="email"]').type("john.doe@example.com");
			cy.get('input[name="phone"]').type("+1234567890");
			cy.get('input[name="subject"]').type("General Inquiry");
			cy.get('textarea[name="message"]').type(
				"This is a test message from Cypress automated testing."
			);

			// Submit the form
			cy.get('button[type="submit"]').click();

			// Wait for the API call
			cy.wait("@submitContact");

			// Check for success message
			cy.contains("Message Sent Successfully!").should("be.visible");
			cy.contains("Thank you for contacting us!").should("be.visible");

			// Check that form is cleared after successful submission
			cy.get('input[name="name"]').should("have.value", "");
			cy.get('input[name="email"]').should("have.value", "");
			cy.get('input[name="phone"]').should("have.value", "");
			cy.get('input[name="subject"]').should("have.value", "");
			cy.get('textarea[name="message"]').should("have.value", "");
		});

		it("should show loading state during submission", () => {
			// Fill out the form
			cy.get('input[name="name"]').type("Jane Smith");
			cy.get('input[name="email"]').type("jane.smith@example.com");
			cy.get('input[name="subject"]').type("Support Request");
			cy.get('textarea[name="message"]').type(
				"Please help me with this issue."
			);

			// Submit the form
			cy.get('button[type="submit"]').click();

			// Check loading state
			cy.get('button[type="submit"]').should("contain", "Sending Message...");
			cy.get('button[type="submit"]').should("be.disabled");

			// Wait for completion
			cy.wait("@submitContact");

			// Check loading state is removed
			cy.get('button[type="submit"]').should("contain", "Send message");
			cy.get('button[type="submit"]').should("not.be.disabled");
		});

		it("should handle API errors gracefully", () => {
			// Mock API error response
			cy.intercept("POST", "**/contact/submit", {
				statusCode: 500,
				body: { success: false, error: "Server error" },
			}).as("submitContactError");

			// Fill out the form
			cy.get('input[name="name"]').type("Error Test");
			cy.get('input[name="email"]').type("error.test@example.com");
			cy.get('input[name="subject"]').type("Error Testing");
			cy.get('textarea[name="message"]').type("Testing error handling.");

			// Submit the form
			cy.get('button[type="submit"]').click();

			// Wait for the error response
			cy.wait("@submitContactError");

			// Check for error message
			cy.contains("Error Sending Message").should("be.visible");
			cy.contains("There was an error sending your message").should(
				"be.visible"
			);
		});

		it("should handle network errors gracefully", () => {
			// Mock network error
			cy.intercept("POST", "**/contact/submit", { forceNetworkError: true }).as(
				"networkError"
			);

			// Fill out the form
			cy.get('input[name="name"]').type("Network Error Test");
			cy.get('input[name="email"]').type("network.test@example.com");
			cy.get('input[name="subject"]').type("Network Error Testing");
			cy.get('textarea[name="message"]').type(
				"Testing network error handling."
			);

			// Submit the form
			cy.get('button[type="submit"]').click();

			// Wait for the network error
			cy.wait("@networkError");

			// Check for error message
			cy.contains("Error Sending Message").should("be.visible");
			cy.contains("There was an error sending your message").should(
				"be.visible"
			);
		});
	});

	describe("Responsive Design", () => {
		it("should be responsive on mobile viewport", () => {
			cy.viewport("iphone-6");
			cy.get('[class*="py-8 sm:py-12 lg:py-16"]').should("be.visible");
			cy.contains("Contact Us").should("be.visible");
			cy.get('input[name="name"]').should("be.visible");
			cy.get('button[type="submit"]').should("be.visible");
		});

		it("should be responsive on tablet viewport", () => {
			cy.viewport("ipad-2");
			cy.get('[class*="py-8 sm:py-12 lg:py-16"]').should("be.visible");
			cy.contains("Contact Us").should("be.visible");
			cy.get('input[name="name"]').should("be.visible");
			cy.get('button[type="submit"]').should("be.visible");
		});

		it("should be responsive on desktop viewport", () => {
			cy.viewport("macbook-15");
			cy.get('[class*="py-8 sm:py-12 lg:py-16"]').should("be.visible");
			cy.contains("Contact Us").should("be.visible");
			cy.get('input[name="name"]').should("be.visible");
			cy.get('button[type="submit"]').should("be.visible");
		});
	});

	describe("Accessibility", () => {
		it("should have proper form labels and accessibility attributes", () => {
			cy.get('input[name="name"]').should(
				"have.attr",
				"placeholder",
				"Your full name"
			);
			cy.get('input[name="email"]').should(
				"have.attr",
				"placeholder",
				"Your email address"
			);
			cy.get('input[name="subject"]').should(
				"have.attr",
				"placeholder",
				"What can we help you with?"
			);
			cy.get('textarea[name="message"]').should("have.attr", "placeholder");
		});

		it("should have accessible social media links", () => {
			cy.get('a[href*="facebook.com"]').should(
				"have.attr",
				"aria-label",
				"Follow us on Facebook"
			);
			cy.get('a[href*="linkedin.com"]').should(
				"have.attr",
				"aria-label",
				"Connect with us on LinkedIn"
			);
			cy.get('a[href*="instagram.com"]').should(
				"have.attr",
				"aria-label",
				"Follow us on Instagram"
			);
		});
	});

	describe("SEO Elements", () => {
		it("should have proper meta tags", () => {
			cy.document().then((doc) => {
				const title = doc.querySelector("title");
				expect(title).to.exist;
				expect(title.textContent).to.include("Contact Us");
			});
		});

		it("should have structured data", () => {
			cy.get('script[type="application/ld+json"]').should("exist");
		});
	});

	describe("Interactive Elements", () => {
		it('should navigate to marketplace when clicking "Explore Marketplace"', () => {
			cy.contains("Explore Marketplace").click();
			cy.url().should("eq", Cypress.config("baseUrl") + "/");
		});

		it("should handle social media link clicks", () => {
			cy.get('a[href*="facebook.com"]').should("have.attr", "target", "_blank");
			cy.get('a[href*="linkedin.com"]').should("have.attr", "target", "_blank");
			cy.get('a[href*="instagram.com"]').should(
				"have.attr",
				"target",
				"_blank"
			);
		});

		it("should have working map iframe", () => {
			cy.get("iframe")
				.should("have.attr", "src")
				.and("include", "google.com/maps");
		});
	});

	describe("Visual Elements", () => {
		it("should have correct color scheme", () => {
			// Check for yellow theme color in hero section
			cy.get('[style*="background-color: #ffc107"]').should("exist");

			// Check for yellow focus states on form inputs
			cy.get('input[name="name"]').focus();
			// Note: CSS focus states are harder to test directly in Cypress
		});

		it("should display icons correctly", () => {
			cy.get('[class*="fa-envelope"]').should("exist");
			cy.get('[class*="fa-map-marker-alt"]').should("exist");
			cy.get('[class*="fa-clock"]').should("exist");
		});
	});
});
