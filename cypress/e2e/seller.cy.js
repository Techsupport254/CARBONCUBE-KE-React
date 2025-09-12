/* eslint-disable no-undef */
/* global cy, Cypress */

describe("Seller Login and Ad Creation", () => {
	beforeEach(() => {
		// Clear any existing session data
		cy.clearLocalStorage();
		cy.clearCookies();

		// Intercept API calls to prevent actual database modifications
		setupApiIntercepts();
	});

	describe("Seller Authentication", () => {
		beforeEach(() => {
			cy.visit("/login");
		});

		it("should display login form correctly", () => {
			cy.url().should("include", "/login");
			cy.contains("Welcome Back").should("be.visible");
			cy.contains("Sign in to your account").should("be.visible");
			cy.get('input[name="identifier"]').should("be.visible");
			cy.get('input[name="password"]').should("be.visible");
			cy.get('button[type="submit"]').should("contain", "Sign In");
		});

		it("should show validation errors for empty fields", () => {
			cy.get('button[type="submit"]').click();
			// Form should prevent submission with empty required fields
			cy.url().should("include", "/login");
		});

		it("should login successfully as seller", () => {
			// Fill login form
			cy.get('input[name="identifier"]').type("seller@example.com");
			cy.get('input[name="password"]').type("password123");

			// Submit login form
			cy.get('button[type="submit"]').click();

			// Wait for login API call
			cy.wait("@loginRequest");

			// Verify redirect to seller dashboard
			cy.url().should("include", "/seller/dashboard");

			// Verify user data is stored
			cy.window().then((win) => {
				expect(win.localStorage.getItem("token")).to.exist;
			});
		});

		it("should handle login errors gracefully", () => {
			// Mock login error response
			cy.intercept("POST", "**/auth/login", {
				statusCode: 401,
				body: {
					errors: ["Invalid credentials"],
				},
			}).as("loginError");

			// Fill login form
			cy.get('input[name="identifier"]').type("wrong@email.com");
			cy.get('input[name="password"]').type("wrongpassword");

			// Submit login form
			cy.get('button[type="submit"]').click();

			// Wait for error response
			cy.wait("@loginError");

			// Verify error message is displayed
			cy.contains("Login Failed").should("be.visible");
		});
	});

	describe("Seller Ad Creation", () => {
		beforeEach(() => {
			// Login first
			cy.visit("/login");
			cy.get('input[name="identifier"]').type("seller@example.com");
			cy.get('input[name="password"]').type("password123");
			cy.get('button[type="submit"]').click();
			cy.wait("@loginRequest");

			// Navigate to add new ad page
			cy.visit("/seller/add-new-ad");
		});

		it("should load add new ad page correctly", () => {
			cy.url().should("include", "/seller/add-new-ad");
			cy.contains("Add New Product").should("be.visible");
			cy.contains("Create a new product listing for your store").should(
				"be.visible"
			);

			// Verify form sections are present
			cy.contains("Basic Information").should("be.visible");
			cy.contains("Product Images").should("be.visible");
			cy.contains("Pricing & Inventory").should("be.visible");
			cy.contains("Product Details").should("be.visible");
		});

		it("should display categories and subcategories", () => {
			// Wait for categories to load
			cy.wait("@categoriesRequest");

			// Verify categories dropdown has options
			cy.get('select[name="category"]').should("be.visible");
			cy.get('select[name="category"] option').should(
				"have.length.greaterThan",
				1
			);

			// Select a category
			cy.get('select[name="category"]').select(1);

			// Wait for subcategories to load
			cy.wait("@subcategoriesRequest");

			// Verify subcategories dropdown is enabled and has options
			cy.get('select[name="subcategory"]').should("not.be.disabled");
			cy.get('select[name="subcategory"] option').should(
				"have.length.greaterThan",
				1
			);
		});

		it("should create ad successfully with all required fields", () => {
			// Wait for categories to load
			cy.wait("@categoriesRequest");

			// Fill basic information
			cy.get('input[name="title"]').type("Test Product - Cypress Automation");
			cy.get('input[name="brand"]').type("Test Brand");
			cy.get('input[name="manufacturer"]').type("Test Manufacturer");
			cy.get('textarea[name="description"]').type(
				"This is a test product created by Cypress automated testing. It should not be saved to the database."
			);

			// Fill pricing
			cy.get('input[name="price"]').type("1500");

			// Select category and subcategory
			cy.get('select[name="category"]').select(1);
			cy.wait("@subcategoriesRequest");
			cy.get('select[name="subcategory"]').select(1);

			// Select condition
			cy.get('select[name="condition"]').select("brand_new");

			// Add dimensions (optional)
			cy.get('input[name="item_length"]').type("10");
			cy.get('input[name="item_width"]').type("5");
			cy.get('input[name="item_height"]').type("2");
			cy.get('input[name="item_weight"]').type("0.5");

			// Submit the form
			cy.get('button[type="submit"]').contains("Create Product").click();

			// Wait for ad creation API call
			cy.wait("@createAdRequest");

			// Verify success message
			cy.contains("Product Created Successfully").should("be.visible");
			cy.contains("has been successfully added to your store").should(
				"be.visible"
			);

			// Verify redirect to ads page
			cy.url().should("include", "/seller/ads");
		});

		it("should create ad with image upload", () => {
			// Wait for categories to load
			cy.wait("@categoriesRequest");

			// Fill basic information
			cy.get('input[name="title"]').type("Test Product with Image");
			cy.get('input[name="brand"]').type("Test Brand");
			cy.get('input[name="manufacturer"]').type("Test Manufacturer");
			cy.get('textarea[name="description"]').type(
				"Test product with image upload"
			);

			// Fill pricing
			cy.get('input[name="price"]').type("2000");

			// Select category and subcategory
			cy.get('select[name="category"]').select(1);
			cy.wait("@subcategoriesRequest");
			cy.get('select[name="subcategory"]').select(1);

			// Select condition
			cy.get('select[name="condition"]').select("brand_new");

			// Upload test image
			cy.fixture("test-image.jpg", "base64").then((fileContent) => {
				cy.get('input[type="file"]').attachFile({
					fileContent,
					fileName: "test-image.jpg",
					mimeType: "image/jpeg",
				});
			});

			// Wait for image processing
			cy.contains("Scanning...", { timeout: 10000 }).should("be.visible");

			// Submit the form
			cy.get('button[type="submit"]').contains("Create Product").click();

			// Wait for ad creation API call
			cy.wait("@createAdRequest");

			// Verify success
			cy.contains("Product Created Successfully").should("be.visible");
		});

		it("should validate required fields", () => {
			// Try to submit without filling required fields
			cy.get('button[type="submit"]').contains("Create Product").click();

			// Verify validation errors
			cy.contains("Title is required").should("be.visible");
			cy.contains("Description is required").should("be.visible");
			cy.contains("Price is required").should("be.visible");
			cy.contains("Category is required").should("be.visible");
			cy.contains("Subcategory is required").should("be.visible");
			cy.contains("Condition is required").should("be.visible");
			cy.contains("Brand is required").should("be.visible");
			cy.contains("Manufacturer is required").should("be.visible");

			// Verify form doesn't submit
			cy.url().should("include", "/seller/add-new-ad");
		});

		it("should handle ad creation errors gracefully", () => {
			// Mock ad creation error
			cy.intercept("POST", "**/seller/ads", {
				statusCode: 422,
				body: {
					errors: ["Title must be unique", "Price must be a positive number"],
				},
			}).as("createAdError");

			// Wait for categories to load
			cy.wait("@categoriesRequest");

			// Fill form
			cy.get('input[name="title"]').type("Error Test Product");
			cy.get('input[name="brand"]').type("Test Brand");
			cy.get('input[name="manufacturer"]').type("Test Manufacturer");
			cy.get('textarea[name="description"]').type("Test description");
			cy.get('input[name="price"]').type("1500");
			cy.get('select[name="category"]').select(1);
			cy.wait("@subcategoriesRequest");
			cy.get('select[name="subcategory"]').select(1);
			cy.get('select[name="condition"]').select("brand_new");

			// Submit form
			cy.get('button[type="submit"]').contains("Create Product").click();

			// Wait for error response
			cy.wait("@createAdError");

			// Verify error message
			cy.contains("Product Creation Failed").should("be.visible");
			cy.contains("Title must be unique").should("be.visible");
		});

		it("should handle network errors during ad creation", () => {
			// Mock network error
			cy.intercept("POST", "**/seller/ads", { forceNetworkError: true }).as(
				"networkError"
			);

			// Wait for categories to load
			cy.wait("@categoriesRequest");

			// Fill form
			cy.get('input[name="title"]').type("Network Error Test");
			cy.get('input[name="brand"]').type("Test Brand");
			cy.get('input[name="manufacturer"]').type("Test Manufacturer");
			cy.get('textarea[name="description"]').type("Test description");
			cy.get('input[name="price"]').type("1500");
			cy.get('select[name="category"]').select(1);
			cy.wait("@subcategoriesRequest");
			cy.get('select[name="subcategory"]').select(1);
			cy.get('select[name="condition"]').select("brand_new");

			// Submit form
			cy.get('button[type="submit"]').contains("Create Product").click();

			// Wait for network error
			cy.wait("@networkError");

			// Verify error message
			cy.contains("Connection Error").should("be.visible");
		});

		it("should show upload progress during ad creation", () => {
			// Wait for categories to load
			cy.wait("@categoriesRequest");

			// Fill form
			cy.get('input[name="title"]').type("Progress Test Product");
			cy.get('input[name="brand"]').type("Test Brand");
			cy.get('input[name="manufacturer"]').type("Test Manufacturer");
			cy.get('textarea[name="description"]').type("Test description");
			cy.get('input[name="price"]').type("1500");
			cy.get('select[name="category"]').select(1);
			cy.wait("@subcategoriesRequest");
			cy.get('select[name="subcategory"]').select(1);
			cy.get('select[name="condition"]').select("brand_new");

			// Submit form
			cy.get('button[type="submit"]').contains("Create Product").click();

			// Verify upload progress is shown
			cy.contains("Creating Product...").should("be.visible");
			cy.get('button[type="submit"]').should("be.disabled");

			// Wait for completion
			cy.wait("@createAdRequest");

			// Verify progress is hidden and button is enabled
			cy.contains("Creating Product...").should("not.exist");
			cy.get('button[type="submit"]').should("not.be.disabled");
		});

		it("should cancel ad creation and return to ads page", () => {
			// Click cancel button
			cy.get("button").contains("Cancel").click();

			// Verify redirect to ads page
			cy.url().should("include", "/seller/ads");
		});
	});

	describe("Responsive Design", () => {
		beforeEach(() => {
			// Login first
			cy.visit("/login");
			cy.get('input[name="identifier"]').type("seller@example.com");
			cy.get('input[name="password"]').type("password123");
			cy.get('button[type="submit"]').click();
			cy.wait("@loginRequest");
			cy.visit("/seller/add-new-ad");
		});

		it("should be responsive on mobile viewport", () => {
			cy.viewport("iphone-6");
			cy.contains("Add New Product").should("be.visible");
			cy.get('input[name="title"]').should("be.visible");
			cy.get('button[type="submit"]').should("be.visible");
		});

		it("should be responsive on tablet viewport", () => {
			cy.viewport("ipad-2");
			cy.contains("Add New Product").should("be.visible");
			cy.get('input[name="title"]').should("be.visible");
			cy.get('button[type="submit"]').should("be.visible");
		});

		it("should be responsive on desktop viewport", () => {
			cy.viewport("macbook-15");
			cy.contains("Add New Product").should("be.visible");
			cy.get('input[name="title"]').should("be.visible");
			cy.get('button[type="submit"]').should("be.visible");
		});
	});
});

// Helper function to set up all API intercepts
function setupApiIntercepts() {
	// Intercept login API
	cy.intercept("POST", "**/auth/login", {
		statusCode: 200,
		body: {
			token: "mock-jwt-token-seller",
			user: {
				id: 1,
				email: "seller@example.com",
				role: "seller",
				fullname: "Test Seller",
			},
		},
	}).as("loginRequest");

	// Intercept categories API
	cy.intercept("GET", "**/seller/categories", {
		statusCode: 200,
		body: [
			{ id: 1, name: "Electronics" },
			{ id: 2, name: "Clothing" },
			{ id: 3, name: "Home & Garden" },
			{ id: 4, name: "Sports & Outdoors" },
		],
	}).as("categoriesRequest");

	// Intercept subcategories API
	cy.intercept("GET", "**/seller/subcategories*", {
		statusCode: 200,
		body: [
			{ id: 1, name: "Smartphones" },
			{ id: 2, name: "Laptops" },
			{ id: 3, name: "Tablets" },
			{ id: 4, name: "Accessories" },
		],
	}).as("subcategoriesRequest");

	// Intercept ad creation API
	cy.intercept("POST", "**/seller/ads", {
		statusCode: 201,
		body: {
			id: 123,
			title: "Test Product",
			description: "Test description",
			price: 1500,
			status: "active",
			created_at: new Date().toISOString(),
		},
	}).as("createAdRequest");
}
