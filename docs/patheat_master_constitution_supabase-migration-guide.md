# PathEat Supabase Migration & Backend Configuration
## Migrating from Local PostgreSQL to Cloud-Hosted Supabase

Moving your database to Supabase is an excellent choice for a 4-week academic project as it removes the burden of managing server infrastructure and provides immediate, robust tools for authentication, API generation, and database management.

---

## 1. Architectural Impact
The core **Route-Controller-Service-Repository** pattern remains **unchanged**. The only file that needs modification is your database connection configuration.

### What Stays the Same
* **Repository Layer**: Your SQL queries (using standard PostgreSQL/PostGIS) remain identical. Supabase is native PostgreSQL.
* **Service Layer**: Your business logic is agnostic to where the database lives.

### What Changes
* **Database Connection**: You will move from a local `postgres://localhost` string to a secure, remote connection string provided by Supabase.
* **Initialization**: Instead of running `init.sql` locally, you will run your migration scripts directly via the **Supabase SQL Editor** in their web dashboard.
* **Supabase Features**: You can now leverage **Supabase Auth** (optional) and their built-in **Auto-generated API** if you wish to bypass some custom controller work (though I recommend keeping your custom controllers for academic rigor).

---

## 2. Updated Setup & Configuration

### 2.1 Backend Connection Configuration
Update your `backend/config/db.js` (or equivalent) to use an environment variable that references the Supabase connection string.

```javascript
// backend/config/db.js
import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

// Supabase provides this connection string in Project Settings -> Database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for Supabase cloud connections
  }
});

export default pool;
```

### 2.2 Environment Variables (`.env`)
Your `.env` file will now point to the cloud instead of `localhost`.

```text
# Example .env file for Supabase
DATABASE_URL=postgres://postgres.<your-project-id>:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
JWT_SECRET=your_secret_here
```

### 2.3 PostGIS Enablement
Supabase supports PostGIS, but it is not enabled by default. 
1. Log into your Supabase Dashboard.
2. Go to the **SQL Editor**.
3. Run this command to enable the spatial engine:
   ```sql
   CREATE EXTENSION IF NOT EXISTS "postgis";
   ```
4. Then, run your project's table initialization scripts directly in that same editor.
VITE_MAP_API_KEY=your_openfreemap_key

Note: Ensure .env is explicitly listed in your .gitignore file.
## 3. Configure the Connection Pool (SSL Required)

Supabase requires secure connections. Ensure your backend/config/db.js file establishes the pool with SSL rejections bypassed for cloud environments.
JavaScript

// backend/config/db.js
import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false 
  }
});

export default pool;

## 4. Database Schema Synchronization

Since we share a cloud database, only one person needs to run the initial migration. If you are setting up the tables for the first time, or resetting the schema, follow this procedure:

    Log into your team's Supabase Dashboard.

    Navigate to the SQL Editor.

    Enable the Spatial Engine: You must manually run this command first to support PathEat's routing features:
    SQL

    CREATE EXTENSION IF NOT EXISTS "postgis";

    Deploy Tables: Paste the contents of backend/scripts/init.sql (which contains your CREATE TABLE, CREATE INDEX, etc.) into the SQL Editor and execute it.

Once executed, every teammate pointing to that DATABASE_URL will instantly have the correct table schema.
"""

with open(os.path.join(output_dir, "project-setup-guide.md"), "w") as f:
f.write(setup_guide_content.strip())

print("Successfully written updated resolution files.")
---

## 5. Impact on Documentation
* **`project-setup-guide.md`**: Update the "Sync" step. Instead of running a local `init.sql`, instruct teammates to login to the Supabase Dashboard, open the SQL Editor, and paste the `init.sql` contents there.
* **`engineering-convention.md`**: No change needed, as your repository layer remains PostgreSQL/PostGIS compliant.
* **`workflow.md`**: You now have a **Cloud Database Source of Truth**. Teammates will no longer have "different" local databases; everyone will query the same cloud instance. This actually *improves* integration quality.