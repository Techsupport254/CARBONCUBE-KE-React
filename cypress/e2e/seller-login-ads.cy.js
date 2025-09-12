/* eslint-disable no-undef */
/* global cy, Cypress */

describe("Seller Login and Ad Creation Flow", () => {
	beforeEach(() => {
		// Clear any existing session data
		cy.clearLocalStorage();
		cy.clearCookies();

		// Visit the login page
		cy.visit("/login");
	});

	describe("Seller Login Process", () => {
		beforeEach(() => {
			// Intercept the login API call
			cy.intercept("POST", "**/auth/login", {
				statusCode: 200,
				body: {
					token: "mock-seller-token-12345",
					user: {
						id: 1,
						email: "seller@example.com",
						role: "seller",
						name: "Test Seller",
						username: "testseller",
					},
				},
			}).as("sellerLogin");
		});

		it("should successfully log in as a seller", () => {
			// Fill in login form
			cy.get('input[type="text"]').type("seller@example.com");
			cy.get('input[type="password"]').type("password123");

			// Submit the form
			cy.get('button[type="submit"]').click();

			// Wait for the API call
			cy.wait("@sellerLogin");

			// Verify navigation to seller dashboard
			cy.url().should("include", "/seller/dashboard");

			// Verify token is stored
			cy.window().then((win) => {
				expect(win.localStorage.getItem("token")).to.equal(
					"mock-seller-token-12345"
				);
			});
		});

		it("should handle login errors gracefully", () => {
			// Intercept with error response
			cy.intercept("POST", "**/auth/login", {
				statusCode: 401,
				body: {
					errors: ["Invalid login credentials"],
				},
			}).as("loginError");

			// Fill in login form with invalid credentials
			cy.get('input[type="text"]').type("invalid@example.com");
			cy.get('input[type="password"]').type("wrongpassword");

			// Submit the form
			cy.get('button[type="submit"]').click();

			// Wait for the error response
			cy.wait("@loginError");

			// Verify error modal is shown
			cy.contains("Login Failed").should("be.visible");
			cy.contains("Invalid login credentials").should("be.visible");

			// Verify we stay on login page
			cy.url().should("include", "/login");
		});

		it("should show loading state during login", () => {
			// Intercept with delay to test loading state
			cy.intercept("POST", "**/auth/login", (req) => {
				req.reply((res) => {
					res.delay(1000);
					res.send({
						statusCode: 200,
						body: {
							token: "mock-seller-token-12345",
							user: {
								id: 1,
								email: "seller@example.com",
								role: "seller",
								name: "Test Seller",
							},
						},
					});
				});
			}).as("delayedLogin");

			// Fill in login form
			cy.get('input[type="text"]').type("seller@example.com");
			cy.get('input[type="password"]').type("password123");

			// Submit the form
			cy.get('button[type="submit"]').click();

			// Check loading state
			cy.get('button[type="submit"]').should("contain", "Signing In...");
			cy.get('button[type="submit"]').should("be.disabled");

			// Wait for completion
			cy.wait("@delayedLogin");

			// Verify navigation
			cy.url().should("include", "/seller/dashboard");
		});
	});

	describe("Seller Dashboard Navigation", () => {
		beforeEach(() => {
			// Mock successful login and navigate to dashboard
			cy.intercept("POST", "**/auth/login", {
				statusCode: 200,
				body: {
					token: "mock-seller-token-12345",
					user: {
						id: 1,
						email: "seller@example.com",
						role: "seller",
						name: "Test Seller",
					},
				},
			}).as("sellerLogin");

			// Login first
			cy.get('input[type="text"]').type("seller@example.com");
			cy.get('input[type="password"]').type("password123");
			cy.get('button[type="submit"]').click();
			cy.wait("@sellerLogin");
		});

		it("should navigate to ads management page", () => {
			// Intercept ads API call
			cy.intercept("GET", "**/seller/ads", {
				statusCode: 200,
				body: {
					active_ads: [],
					deleted_ads: [],
				},
			}).as("fetchAds");

			// Navigate to ads page (assuming there's a link or button)
			cy.visit("/seller/ads");

			// Wait for ads to load
			cy.wait("@fetchAds");

			// Verify we're on the ads page
			cy.url().should("include", "/seller/ads");
		});
	});

	describe("Ad Creation Process", () => {
		beforeEach(() => {
			// Mock login and navigate to add ad page
			cy.intercept("POST", "**/auth/login", {
				statusCode: 200,
				body: {
					token: "mock-seller-token-12345",
					user: {
						id: 1,
						email: "seller@example.com",
						role: "seller",
						name: "Test Seller",
					},
				},
			}).as("sellerLogin");

			// Mock categories API
			cy.intercept("GET", "**/seller/categories", {
				statusCode: 200,
				body: [
					{ id: 1, name: "Electronics" },
					{ id: 2, name: "Clothing" },
					{ id: 3, name: "Home & Garden" },
				],
			}).as("fetchCategories");

			// Mock subcategories API
			cy.intercept("GET", "**/seller/subcategories*", {
				statusCode: 200,
				body: [
					{ id: 1, name: "Smartphones", category_id: 1 },
					{ id: 2, name: "Laptops", category_id: 1 },
					{ id: 3, name: "Tablets", category_id: 1 },
				],
			}).as("fetchSubcategories");

			// Mock ad creation API
			cy.intercept("POST", "**/seller/ads", {
				statusCode: 201,
				body: {
					id: 123,
					title: "Test Product",
					description: "Test Description",
					price: 1000,
					category_id: 1,
					subcategory_id: 1,
					brand: "Test Brand",
					manufacturer: "Test Manufacturer",
					condition: "New",
					created_at: "2024-01-01T00:00:00Z",
					category: { id: 1, name: "Electronics" },
					reviews: [],
					mean_rating: 0,
				},
			}).as("createAd");

			// Login and navigate to add ad page
			cy.get('input[type="text"]').type("seller@example.com");
			cy.get('input[type="password"]').type("password123");
			cy.get('button[type="submit"]').click();
			cy.wait("@sellerLogin");

			cy.visit("/seller/add-ad");
		});

		it("should successfully create a new ad", () => {
			// Wait for categories to load
			cy.wait("@fetchCategories");

			// Fill in the ad form
			cy.get('input[name="title"]').type("Test Product");
			cy.get('textarea[name="description"]').type(
				"This is a test product description"
			);
			cy.get('input[name="price"]').type("1000");
			cy.get('input[name="brand"]').type("Test Brand");
			cy.get('input[name="manufacturer"]').type("Test Manufacturer");

			// Select category
			cy.get('select[name="category_id"]').select("Electronics");
			cy.wait("@fetchSubcategories");

			// Select subcategory
			cy.get('select[name="subcategory_id"]').select("Smartphones");

			// Select condition
			cy.get('select[name="condition"]').select("New");

			// Fill in dimensions (optional fields)
			cy.get('input[name="item_length"]').type("10");
			cy.get('input[name="item_width"]').type("5");
			cy.get('input[name="item_height"]').type("2");
			cy.get('input[name="item_weight"]').type("200");
			cy.get('select[name="weight_unit"]').select("Grams");

			// Submit the form
			cy.get('button[type="submit"]').click();

			// Wait for ad creation API call
			cy.wait("@createAd");

			// Verify success (assuming there's a success message or redirect)
			cy.url().should("include", "/seller/ads");
		});

		it("should handle ad creation errors", () => {
			// Intercept with error response
			cy.intercept("POST", "**/seller/ads", {
				statusCode: 422,
				body: {
					errors: ["Title cannot be blank", "Price must be greater than 0"],
				},
			}).as("createAdError");

			// Wait for categories to load
			cy.wait("@fetchCategories");

			// Try to submit form with missing required fields
			cy.get('button[type="submit"]').click();

			// Wait for error response
			cy.wait("@createAdError");

			// Verify error handling (assuming there's error display)
			// This depends on how errors are shown in the UI
		});

		it("should validate required fields", () => {
			// Wait for categories to load
			cy.wait("@fetchCategories");

			// Try to submit empty form
			cy.get('button[type="submit"]').click();

			// Verify HTML5 validation prevents submission
			cy.get('input[name="title"]').should("have.attr", "required");
			cy.get('textarea[name="description"]').should("have.attr", "required");
			cy.get('input[name="price"]').should("have.attr", "required");
		});

		it("should handle image upload simulation", () => {
			// Wait for categories to load
			cy.wait("@fetchCategories");

			// Fill in basic form data
			cy.get('input[name="title"]').type("Test Product with Images");
			cy.get('textarea[name="description"]').type("Test Description");
			cy.get('input[name="price"]').type("1000");
			cy.get('select[name="category_id"]').select("Electronics");
			cy.wait("@fetchSubcategories");
			cy.get('select[name="subcategory_id"]').select("Smartphones");

			// Test file input (simulate image selection)
			const fileName = "test-image.jpg";
			cy.fixture("test-image.jpg").then((fileContent) => {
				cy.get('input[type="file"]').selectFile({
					contents: Cypress.Buffer.from(fileContent),
					fileName: fileName,
					mimeType: "image/jpeg",
				});
			});

			// Verify file was selected (if there's a preview or indicator)
			// This depends on the UI implementation

			// Submit the form
			cy.get('button[type="submit"]').click();

			// Wait for ad creation
			cy.wait("@createAd");
		});

		it("should show loading state during ad creation", () => {
			// Intercept with delay to test loading state
			cy.intercept("POST", "**/seller/ads", (req) => {
				req.reply((res) => {
					res.delay(2000);
					res.send({
						statusCode: 201,
						body: {
							id: 123,
							title: "Test Product",
							description: "Test Description",
							price: 1000,
							created_at: "2024-01-01T00:00:00Z",
						},
					});
				});
			}).as("delayedCreateAd");

			// Wait for categories to load
			cy.wait("@fetchCategories");

			// Fill in the form
			cy.get('input[name="title"]').type("Test Product");
			cy.get('textarea[name="description"]').type("Test Description");
			cy.get('input[name="price"]').type("1000");
			cy.get('select[name="category_id"]').select("Electronics");
			cy.wait("@fetchSubcategories");
			cy.get('select[name="subcategory_id"]').select("Smartphones");

			// Submit the form
			cy.get('button[type="submit"]').click();

			// Check loading state (assuming there's a loading indicator)
			cy.get('button[type="submit"]').should("be.disabled");

			// Wait for completion
			cy.wait("@delayedCreateAd");
		});
	});

	describe("Ad Management Features", () => {
		beforeEach(() => {
			// Mock login
			cy.intercept("POST", "**/auth/login", {
				statusCode: 200,
				body: {
					token: "mock-seller-token-12345",
					user: {
						id: 1,
						email: "seller@example.com",
						role: "seller",
						name: "Test Seller",
					},
				},
			}).as("sellerLogin");

			// Mock existing ads
			cy.intercept("GET", "**/seller/ads", {
				statusCode: 200,
				body: {
					active_ads: [
						{
							id: 1,
							title: "Existing Product 1",
							description: "Description 1",
							price: 500,
							created_at: "2024-01-01T00:00:00Z",
							category: { id: 1, name: "Electronics" },
							reviews: [],
							mean_rating: 4.5,
						},
					],
					deleted_ads: [],
				},
			}).as("fetchAds");

			// Login and navigate to ads page
			cy.get('input[type="text"]').type("seller@example.com");
			cy.get('input[type="password"]').type("password123");
			cy.get('button[type="submit"]').click();
			cy.wait("@sellerLogin");

			cy.visit("/seller/ads");
			cy.wait("@fetchAds");
		});

		it("should display existing ads", () => {
			// Verify ads are displayed
			cy.contains("Existing Product 1").should("be.visible");
			cy.contains("500").should("be.visible");
			cy.contains("Electronics").should("be.visible");
		});

		it("should handle ad deletion", () => {
			// Mock ad deletion API
			cy.intercept("DELETE", "**/seller/ads/1", {
				statusCode: 204,
			}).as("deleteAd");

			// Find and click delete button (assuming there's a delete button)
			cy.get('[data-testid="delete-ad-1"]').click();

			// Confirm deletion (if there's a confirmation dialog)
			cy.get('[data-testid="confirm-delete"]').click();

			// Wait for deletion API call
			cy.wait("@deleteAd");

			// Verify ad is removed from UI
			cy.contains("Existing Product 1").should("not.exist");
		});

		it("should handle ad editing", () => {
			// Mock ad update API
			cy.intercept("PUT", "**/seller/ads/1", {
				statusCode: 200,
				body: {
					id: 1,
					title: "Updated Product",
					description: "Updated Description",
					price: 600,
					updated_at: "2024-01-02T00:00:00Z",
				},
			}).as("updateAd");

			// Mock categories for edit form
			cy.intercept("GET", "**/seller/categories", {
				statusCode: 200,
				body: [
					{ id: 1, name: "Electronics" },
					{ id: 2, name: "Clothing" },
				],
			}).as("fetchCategoriesForEdit");

			// Click edit button (assuming there's an edit button)
			cy.get('[data-testid="edit-ad-1"]').click();

			// Wait for categories to load
			cy.wait("@fetchCategoriesForEdit");

			// Update form fields
			cy.get('input[name="title"]').clear().type("Updated Product");
			cy.get('input[name="price"]').clear().type("600");

			// Submit the form
			cy.get('button[type="submit"]').click();

			// Wait for update API call
			cy.wait("@updateAd");

			// Verify update success
			cy.url().should("include", "/seller/ads");
		});
	});

	describe("Responsive Design", () => {
		beforeEach(() => {
			// Mock login
			cy.intercept("POST", "**/auth/login", {
				statusCode: 200,
				body: {
					token: "mock-seller-token-12345",
					user: {
						id: 1,
						email: "seller@example.com",
						role: "seller",
						name: "Test Seller",
					},
				},
			}).as("sellerLogin");
		});

		it("should work on mobile viewport", () => {
			cy.viewport("iphone-6");

			// Login
			cy.get('input[type="text"]').type("seller@example.com");
			cy.get('input[type="password"]').type("password123");
			cy.get('button[type="submit"]').click();
			cy.wait("@sellerLogin");

			// Verify mobile layout
			cy.url().should("include", "/seller/dashboard");
		});

		it("should work on tablet viewport", () => {
			cy.viewport("ipad-2");

			// Login
			cy.get('input[type="text"]').type("seller@example.com");
			cy.get('input[type="password"]').type("password123");
			cy.get('button[type="submit"]').click();
			cy.wait("@sellerLogin");

			// Verify tablet layout
			cy.url().should("include", "/seller/dashboard");
		});
	});

	describe("Accessibility", () => {
		beforeEach(() => {
			// Mock login
			cy.intercept("POST", "**/auth/login", {
				statusCode: 200,
				body: {
					token: "mock-seller-token-12345",
					user: {
						id: 1,
						email: "seller@example.com",
						role: "seller",
						name: "Test Seller",
					},
				},
			}).as("sellerLogin");
		});

		it("should have proper form labels and accessibility attributes", () => {
			// Check login form accessibility
			cy.get('input[type="text"]').should(
				"have.attr",
				"placeholder",
				"Enter your email"
			);
			cy.get('input[type="password"]').should(
				"have.attr",
				"placeholder",
				"Enter your password"
			);
			cy.get('button[type="submit"]').should("contain", "Sign In");

			// Login and check add ad form accessibility
			cy.get('input[type="text"]').type("seller@example.com");
			cy.get('input[type="password"]').type("password123");
			cy.get('button[type="submit"]').click();
			cy.wait("@sellerLogin");

			cy.visit("/seller/add-ad");

			// Check add ad form accessibility
			cy.get('input[name="title"]').should("have.attr", "required");
			cy.get('textarea[name="description"]').should("have.attr", "required");
			cy.get('input[name="price"]').should("have.attr", "required");
		});
	});
});
