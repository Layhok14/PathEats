# **PathEat Developer Guide: Architecture & Folder Breakdown**


Welcome to the **PathEat Backend** team\! As the developer responsible for both the **Global Admin** and **Developer Admin** domains, this document serves as your precise roadmap.  
Our architecture dictates **responsibility by structural layer**, not by user role. You will not build separate folders for your two roles; instead, you will write code across our unified, Object-Oriented layers, keeping logic cleanly separated by file and function.

## 

## **1\. The Core Data Flow (Non-Negotiable)**

No matter which admin feature you are building, data **must** always flow linearly through these 5 steps. Never skip a layer:

Request  
  → Route (Validates URL, checks HTTP method, applies RBAC middleware)  
    → Controller (Extracts req/res data, calls Service, sends JSON response)  
      → Service (Executes core business logic, checks rules, calls Repository, throws AppError)  
        → Repository (ONLY layer permitted to interact with Supabase client)  
          → Supabase (PostgreSQL / PostGIS Database)

## **2\. Folder Navigation Cheat Sheet**

When working on a feature, identify your current task below to know exactly which folder and file to open:

### **📂 src/routes/**

* **When to use:** You are defining a new URL endpoint, choosing an HTTP verb (GET, POST, PUT, DELETE), or setting access permissions.  
* **Your files:** \* adminRoutes.js — All endpoints requiring restrictToRoles("GLOBAL\_ADMIN").  
  * devRoutes.js — All endpoints requiring restrictToRoles("DEVELOPER\_ADMIN").  
* **Action item:** Connect the URL path to your controller, apply authMiddleware, and use the restrictToRoles guard. Add @swagger JSDoc comments directly above the route for auto-documentation.

### **📂 src/middleware/**

* **When to use:** You need to intercept requests *before* they hit your controllers to handle security, role guarding, or input formatting/validation.  
* **Your files:**  
  * authMiddleware.js — Decodes JWT and attaches req.user (Keo Seavpav handles this, but you will import and use it).  
  * rbacGuard.js — The logic behind restrictToRoles(...).  
  * validateMiddleware.js — Where you write request body schema validation (e.g., using Joi/Zod) to intercept bad data before it hits the controller.  
* **Action item:** If a middleware check fails (e.g., invalid token or missing fields), return an immediate error response. Don't let the request proceed to the controller.

### **📂 src/controllers/**

* **When to use:** You need to extract incoming HTTP data (request body, query parameters, URL params) or return a JSON response to the client.  
* **Your files:**  
  * AdminController.js — Handles incoming requests for user management, role updates, and system configuration.  
  * DevController.js — Handles incoming requests for health metrics, system logs, database tables, and backups.  
* **Action item:** Keep these classes **stateless and thin**. Read req.body or req.query, pass the raw data into your service, wrap the execution in catchAsync, and respond with res.status().json(). Do not write business logic or database queries here.

### **📂 src/services/**

* **When to use:** You are writing the actual core "brains" of the application, calculations, data validation checks, or security conditions.  
* **Your files:**  
  * AdminService.js — Logic for business rules (e.g., verifying if a user is already banned before processing a ban, formatting audit logs).  
  * DevService.js — Logic for developer infrastructure operations (e.g., triggering a system backup, reading hardware/OS performance memory, pulling error logs).  
* **Action item:** Instantiate this class with dependency injection (pass required repositories into its constructor). If a business rule fails, throw a custom error using AppError(message, statusCode).

### **📂 src/repositories/**

* **When to use:** You need to read, write, update, or delete data from your Supabase / PostgreSQL database tables.  
* **Your files:**  
  * UserRepository.js — Extends BaseRepository. Used by AdminService to execute updates like .update(userId, { is\_banned: true }).  
  * VendorRepository.js — Extends BaseRepository. Used by AdminService to handle vendor approvals.  
* **Action item:** This is the **only layer allowed to touch the Supabase client**. Write clean queries or raw SQL here, and return raw data objects back to the services.

### **📂 src/models/**

* **When to use:** You need to define the schema, "shape", or static validation structure of an entity.  
* **Your files:**  
  * BaseModel.js — Base abstract class containing common fields (id, created\_at).  
  * UserModel.js / VendorModel.js — Contains the explicit JavaScript object blueprint representing your DB rows.  
* **Action item:** Use these as plain classes with static validate(data) methods. When a service or repository receives database payloads, it uses the model to ensure data structural integrity.

### **📂 src/config/**

* **When to use:** You need to instantiate or configure core system singletons, like database clients or third-party connections.  
* **Your files:**  
  * db.js — Initializes the Supabase client utilizing process.env.SUPABASE\_URL and SUPABASE\_SERVICE\_KEY.  
* **Action item:** You rarely need to touch this folder once it's set up. The initialized DB client is automatically passed down to your BaseRepository so all repositories can access it.

### **📂 src/utils/**

* **When to use:** You need access to reusable global utilities, wrappers, or custom error shapes.  
* **Your files:**  
  * AppError.js — Your operational error blueprint class.  
  * catchAsync.js — The wrapper used in routes/controllers to seamlessly pass async exceptions to the global error middleware.

## 

## 

## 

## 

## **3\. Practical Task Matrix Mapping**

Use this reference table to see exactly how your typical admin features slice horizontally across the entire architecture:

| Domain | Feature / Task | Route File | Middleware Used | Controller File | Service File | Repository / Model Used |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| **Global Admin** | Ban or Unban a User | adminRoutes.js | authMiddleware, restrictToRoles("GLOBAL\_ADMIN") | AdminController.js | AdminService.js | UserRepository.js (uses UserModel) |
| **Global Admin** | Change a User's RBAC Role | adminRoutes.js | authMiddleware, restrictToRoles("GLOBAL\_ADMIN") | AdminController.js | AdminService.js | UserRepository.js (uses UserModel) |
| **Global Admin** | Approve a New Vendor | adminRoutes.js | authMiddleware, restrictToRoles("GLOBAL\_ADMIN") | AdminController.js | AdminService.js | VendorRepository.js (uses VendorModel) |
| **Developer** | Trigger Database Backup | devRoutes.js | authMiddleware, restrictToRoles("DEVELOPER\_ADMIN") | DevController.js | DevService.js | Direct script execution via Node / BaseRepository |
| **Developer** | Read System Error Logs | devRoutes.js | authMiddleware, restrictToRoles("DEVELOPER\_ADMIN") | DevController.js | DevService.js | Node fs (file system) read or specialized System DB table |

## **4\. Key Rules of Engagement**

1. **Follow the Blueprints:** Look at the authRoutes.js and AuthController.js files built by Keo Seavpav. Use them as a matching style guide for your code.  
2. **Axios vs. Repositories:** Never use Axios to talk to Supabase. Database actions must go through the Supabase client managed in your repositories (src/config/db.js powers this behind the scenes). Axios is strictly reserved if DevService or AdminService needs to ping external 3rd-party mapping (OSRM) or payment servers.  
3. **HTTP Status Codes:** Match your controller responses to the architecture standard:  
   * 200 for general success (fetching logs, loading user lists).  
   * 201 when creating resources (triggering a new backup record).  
   * 403 is handled automatically by your rbacGuard.js middleware if an unauthorized user tries to sneak into your endpoints.

## **Quick Tips:**

* **Look at existing code:** check authRoutes.js and AuthController.js (built by Keo Seavpav) as a reference blueprint. They should copy that exact code style.  
* **Don't use Axios for DB:**If we need to fetch database logs, use the Supabase client in a repository. Axios is *only* for non-Supabase external APIs.  
* **Document as they go:** Every time we create a route in adminRoutes.js or devRoutes.js, we should add the @swagger JSDoc comment right above it so the API documentation updates automatically.