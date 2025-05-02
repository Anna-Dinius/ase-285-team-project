# **Testing Module**

Handles validation of application logic and data flow across key modules using Jest, Supertest, and MongoDB Memory Server.

---

## **Schema Tests (Unit)**

#### `User.test.js`

* Verifies required fields: `first_name`, `last_name`, `email`, `password`, `admin`
* Tests password hashing via Mongoose pre-save middleware
* Ensures `comparePassword()` and `getFullName()` methods work as intended

#### `Business.test.js`

* Validates creation with default fields (`menus`, `allergens`)
* Ensures missing required fields trigger validation errors

#### `Menu.test.js`

* Confirms proper storage of `title`, `description`, and reference to business
* Fails when required fields like `title` are missing

#### `MenuItem.test.js`

* Tests flexibility with optional fields such as `ingredients`, `allergens`, and `menuIDs`
* Verifies schema constraints and successful creation

### `db.test.js` – Database Connection Test (Unit Test)

This unit test verifies that the MongoDB connection function (`connectDB`) defined in `config/db.js` executes successfully without throwing errors. It ensures that:

* The `MONGO_URI` environment variable is loaded correctly
* `mongoose.connect()` is called and resolves without exception
* The connection logic gracefully handles connection setup

**Purpose:**
To catch issues with misconfigured database URIs, connection errors, or missing environment variables early in development or deployment.

---

## **Route Tests (Integration)**

#### `userRoutes.test.js` – Authentication Module

* Tests:

  * Sign-up with valid input
  * Login with correct credentials
  * Login failure with incorrect email or password
  * Password and email updates
  * Cookie handling and logout behavior

#### `adminRoutes.test.js` – Admin Module

* Tests:

  * Viewing users associated with the same business
  * Promoting and demoting users
  * Adding and removing user access to a business
  * Handling invalid actions gracefully

#### `businessRoutes.test.js` – Business Module

* Tests:

  * Creating a business and retrieving it
  * Updating business information
  * Handling duplicate business names and missing fields

#### `menuRoutes.test.js` – Menu Module

* Tests:

  * Creating a new menu and linking it to a business
  * Sorting menus to place "Master Menu" first
  * Updating the title and description of the most recent menu
  * Deleting a menu and updating the business’s `menus` array

#### `menuItemsRoutes.test.js` – Menu Items Module

* Tests:

  * Creating a new menu item
  * Filtering menu items by `menuID`
  * Editing fields such as `name`, `ingredients`, `allergens`, and `menuIDs`
  * Deleting a menu item by ID
  * Accessing menu items for menuswap functionality
