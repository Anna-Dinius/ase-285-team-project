# **Backend Module**

Manages backend functionality and server for MongoDB.

---

## **Table of Contents**

- Features
- API Integration
- Data Models
- Authentication
- Error Handling
- Dependencies

---

## **Features**

| **Feature** | **Description** | **Endpoint** | **Schema/Model** | **Key Methods** |
| --- | --- | --- | --- | --- |
| **User Authentication** | Secure signup/login with password hashing and cookie-based sessions | **`POST /api/auth/signinPOST /api/auth/signup`** | **`User.js`** | **`comparePassword()`**, **`pre('save')`** (hooking) |
| **Business Management** | CRUD operations for restaurant profiles with allergen/diet tracking | **`GET/POST/PUT/DELETE /api/businesses`** | **`Business.js`** | **`populate('menus')`** (for nested data) |
| **Menu Management** | Create/delete menus, prioritize "Master Menu," and link to businesses | **`POST /api/menusDELETE /api/menus/:id`** | **`Menu.js`** | **`sort()`** (Master Menu prioritization) |
| **Menu Item Management** | Add/edit/delete items with ingredients, allergens, and multi-menu associations | **`POST /api/menuitems/add-menu-itemPUT /api/menuitems/:id`** | **`MenuItem.js`** | **`find({ menuIDs })`** (filtering by menu) |
| **Admin Controls** | Promote/demote admins, grant/revoke business access to users | **`POST /api/admin/change-admin-statusPOST /api/admin/add-user-access`** | **`User.js`** | Aggregation pipelines (e.g., **`$match`**, **`$project`**) |
| **Dietary Filtering** | Track allergens/diets at business and item levels | **`PUT /api/businesses/:id`** (update **`allergens`**/**`diets`**) | **`Business.jsMenuItem.js`** | Array operations (e.g., **`$push`**, **`$pull`**) |
| **Real-Time Sync** | Instant UI updates via cookie-based session states (e.g., **`hasBusiness`**) | N/A (Middleware) | **`cookies.js`** | **`setCookies()`**, **`updateCookie()`** |

---

## **API Integration**

### **Endpoints**

| **Endpoint** | **Method** | **Request Body** | **Success Response** | **Error Cases** |
| --- | --- | --- | --- | --- |
| **`/api/auth/signin`** | **`POST`** | **`{ email: "user@example.com", password: "..." }`** | **`200`** + User data + cookies set | **`401`** (Invalid email/password), **`400`** (Missing fields) |
| **`/api/businesses`** | **`POST`** | **`{ name: "Cafe", allergens: ["Dairy"], diets: ["Vegan"] }`** | **`201`** + Created business | **`400`** (Duplicate name), **`500`** (DB error) |
| **`/api/menus`** | **`POST`** | **`{ title: "Lunch", description: "...", restaurant: "business_id" }`** | **`201`** + New menu | **`404`** (Business not found), **`400`** (Validation) |
| **`/api/menuitems/add-menu-item`** | **`POST`** | **`{ name: "Salad", allergens: ["Nuts"], menuIDs: ["menu_id"] }`** | **`201`** + Saved item | **`400`** (Empty fields), **`500`** (Save failed) |
| **`/api/menuitems/swap-menu/:id`** | **`PUT`** | **`{ menuIDs: ["new_menu_id"] }`** (Update item's menu associations) | **`200`** + Updated item | **`404`** (Item not found), **`400`** (Invalid ID) |
| **`/api/admin/get-user-list`** | **`POST`** | Requires **`email`** cookie (auto-sent) | **`200`** + **`[{ email: "...", status: "admin" }]`** | **`401`** (No business ID), **`404`** (No users) |
| **`/api/businesses/:id`** | **`GET`** | None (ID in URL) | **`200`** + Business data with populated menus | **`404`** (Business not found) |
| **`PUT /api/menuitems/:id`** | **`PUT`** | **`{ name: "...", allergens: [...] }`** (Partial updates allowed) | **`200`** + Updated item | **`404`** (Item not found), **`400`** (Invalid data) |
| **`DELETE /api/menuitems/:id`** | **`DELETE`** | None | **`200`** + **`{ message: "Deleted successfully" }`** | **`404`** (Item not found) |

---

## **Data Models**

| **Model** | **Key Fields** | **Relationships** |
| --- | --- | --- |
| **User** | **`email`**, **`password (hashed)`**, **`business_id`**, **`admin`** (boolean) | References **`Business`** |
| **Business** | **`name`**, **`allergens[]`**, **`diets[]`**, **`menus[]`** (ObjectIDs) | Has many **`Menu`** |
| **Menu** | **`title`**, **`description`**, **`restaurant`** (ObjectID) | Belongs to **`Business`** |
| **MenuItem** | **`name`**, **`ingredients[]`**, **`allergens[]`**, **`menuIDs[]`** | Many-to-many with **`Menu`** |

---

## **Authentication**

| **Method** | **Implementation** | **Security** |
| --- | --- | --- |
| **Cookie-Based** | Secure/HttpOnly cookies with **`sameSite: 'None'`** | Encrypted via **`bcrypt`** password hashing |
| **Admin Controls** | **`admin`** boolean in User model | Role checks in admin routes |
| **Session Flow** | Auto-logout on token expiration | CSRF protection via CORS policies |

---

## **Error Handling**

| **Scenario** | **Response** | **Example Route** |
| --- | --- | --- |
| Invalid Credentials | **`401`** + **`{ error: "Password is incorrect" }`** | **`user.routes.js`** (signin) |
| Duplicate Business | **`400`** + **`{ error: "Business name exists" }`** | **`businessRoutes.js`** (POST) |
| Missing Required Fields | **`400`** + **`{ error: "All fields required" }`** | **`menuItemsRoutes.js`** (add-menu-item) |
| Unauthorized Access | **`401`** + **`{ error: "Business ID not found" }`** | **`admin.routes.js`** (get-user-list) |

---

## **Dependencies**

| **Package** | **Role** |
| --- | --- |
| **`express`** | REST API framework |
| **`mongoose`** | MongoDB ODM (Object-Document Mapping) |
| **`bcrypt`** | Password hashing |
| **`cookie-parser`** | Secure session management |
| **`cors`** | Cross-origin resource sharing (frontend connectivity) |