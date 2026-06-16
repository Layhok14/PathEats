# PathEat Supabase Connection Guide

> **Rule of thumb**: All database writes and complex queries go through the backend's repository layer. Supabase client is used directly from the frontend only for real-time subscriptions, storage uploads, and auth helper methods.

---

## 1. When to Use Supabase Directly (Frontend)

| Feature | Method | Why Frontend Direct |
|---------|--------|-------------------|
| Real-time vendor location updates | `supabase.channel("vendors").on("postgres_changes", ...)` | Low-latency push, no backend polling needed |
| Image uploads | `supabase.storage.from("vendor-photos").upload(...)` | Large binary payloads don't need backend proxy |
| Auth password reset email | `supabase.auth.resetPasswordForEmail()` | Supabase handles email delivery natively |
| Simple public reads (no auth needed) | `supabase.from("cuisines").select("*")` | Read-only static lookup tables |

## 2. When to Always Go Through Backend

| Feature | Reason |
|---------|--------|
| Any INSERT, UPDATE, DELETE | Backend validates permissions, sanitizes input, and enforces business rules |
| Spatial PostGIS queries | Backend runs the gold-standard `ST_DWithin` query with LIMIT 10 |
| JWT-authenticated user data | Backend verifies the token and applies RBAC before returning data |
| Payment or order operations | Financial operations need server-side atomicity |
| Admin operations (ban, role change) | Must be logged in audit trail — never expose to client-side Supabase |

## 3. Supabase Client Setup

### 3.1 Backend Client (`backend/src/config/db.js`)

```javascript
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY; // service_role key for admin

if (!supabaseUrl || !supabaseKey) {
  throw new Error("SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in .env");
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export default supabase;
```

**Why service_role key?** The backend needs to bypass Row Level Security (RLS) since it handles authorization itself via JWT + RBAC middleware. The frontend uses the anon key with RLS policies.

### 3.2 Frontend Client

```javascript
// frontend/src/shared/services/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

## 4. Repository Pattern Example

Every repository extends `BaseRepository` and is the **only** code that calls `supabase`:

```javascript
// backend/src/repositories/UserRepository.js
import BaseRepository from "./BaseRepository.js";

class UserRepository extends BaseRepository {
  constructor() {
    super("users"); // table name
  }

  async findByEmail(email) {
    const { data, error } = await this.supabase
      .from(this.table)
      .select("*")
      .eq("email", email.toLowerCase().trim())
      .single();
    if (error && error.code !== "PGRST116") throw error; // PGRST116 = not found
    return data;
  }

  async findById(id) {
    const { data, error } = await this.supabase
      .from(this.table)
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  }

  async create(userData) {
    const { data, error } = await this.supabase
      .from(this.table)
      .insert([{ ...userData, created_at: new Date().toISOString() }])
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async update(id, updates) {
    const { data, error } = await this.supabase
      .from(this.table)
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}

export default UserRepository;
```

## 5. Database Schema (PostgreSQL + PostGIS)

Run this in Supabase SQL Editor **once** before development:

```sql
-- Enable PostGIS
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  role_scope TEXT NOT NULL DEFAULT 'CONSUMER'
    CHECK (role_scope IN ('CONSUMER', 'VENDOR', 'GLOBAL_ADMIN', 'CUSTOMER_SERVICE_ADMIN', 'DEVELOPER_ADMIN')),
  is_banned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vendors table
CREATE TABLE vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT,
  location GEOGRAPHY(POINT, 4326),
  rating REAL DEFAULT 0,
  wait_time_est INTEGER DEFAULT 5,
  open_now BOOLEAN DEFAULT TRUE,
  hours TEXT,
  address TEXT,
  photo_url TEXT,
  description TEXT,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Menu items table
CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category TEXT,
  image_url TEXT,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID REFERENCES vendors(id),
  user_id UUID REFERENCES users(id),
  items JSONB NOT NULL,
  status TEXT DEFAULT 'pending'
    CHECK (status IN ('pending', 'received', 'cooking', 'ready', 'delivered', 'cancelled')),
  total DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  user_name TEXT NOT NULL,
  stars INTEGER NOT NULL CHECK (stars BETWEEN 1 AND 5),
  body TEXT,
  is_moderated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Saved routes (user route history)
CREATE TABLE saved_routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  label TEXT,
  origin JSONB,
  destination JSONB,
  points JSONB,
  saved_at TIMESTAMPTZ DEFAULT NOW()
);

-- Support tickets
CREATE TABLE tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  vendor_id UUID REFERENCES vendors(id),
  subject TEXT NOT NULL,
  description TEXT,
  priority TEXT DEFAULT 'medium'
    CHECK (priority IN ('critical', 'high', 'medium', 'low')),
  status TEXT DEFAULT 'open'
    CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  assigned_to UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit logs
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  target_type TEXT,
  target_id TEXT,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Spatial index
CREATE INDEX idx_vendors_location ON vendors USING GIST (location::geography);

-- Update trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_vendors_updated_at BEFORE UPDATE ON vendors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_tickets_updated_at BEFORE UPDATE ON tickets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## 6. Row Level Security (RLS) for Direct Frontend Access

For tables the frontend queries directly (e.g., public vendor search), enable RLS:

```sql
-- Vendor profiles are publicly readable (for map markers)
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Vendors are publicly readable" ON vendors
  FOR SELECT USING (is_approved = TRUE);

-- Storage bucket for vendor photos
INSERT INTO storage.buckets (id, name, public) VALUES ('vendor-photos', 'vendor-photos', true);

CREATE POLICY "Anyone can view vendor photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'vendor-photos');

CREATE POLICY "Vendors can upload their own photos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'vendor-photos'
    AND auth.role() = 'authenticated'
  );
```

## 7. Checking Connection

```bash
# Via backend health endpoint
curl http://localhost:4000/api/health

# Expected:
# { "success": true, "message": "PathEat API running", "supabase": "connected", "timestamp": "..." }
```

## 8. Common Pitfalls

| Problem | Solution |
|---------|----------|
| `select().single()` throws when no rows found | Check for `error.code === "PGRST116"` before throwing |
| Service key exposed in frontend | Never use `SUPABASE_SERVICE_KEY` in frontend — use `SUPABASE_ANON_KEY` with RLS |
| PostGIS queries slow on Supabase free tier | Always include `LIMIT 10` and use `ST_DWithin` with indexed geography column |
| Migration conflicts between team members | Use `npx supabase db pull` to sync, then `npx supabase db push` |
