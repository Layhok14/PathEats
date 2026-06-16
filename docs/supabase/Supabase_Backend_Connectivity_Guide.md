# Supabase Backend Connectivity Guide

## Overview

This document summarizes key concepts for connecting a Node.js/Express backend to Supabase PostgreSQL and understanding the differences between Supabase APIs, direct database connections, and connection poolers.

---

# 1. Supabase API Client vs PostgreSQL Connection

## Using `supabase-js`

```js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_PUBLISHABLE_KEY
);
```

`createClient()` does **not** create a PostgreSQL connection.

Architecture:

```text
Express App
    ↓
supabase-js
    ↓ HTTPS
Supabase APIs
    ↓
PostgreSQL
```

Benefits:

- Auth integration
- Storage integration
- Realtime integration
- Row Level Security support

---

## Using PostgreSQL Directly

```js
import pg from 'pg';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL
});
```

Architecture:

```text
Express App
    ↓
pg Pool
    ↓
PostgreSQL
```

Benefits:

- Raw SQL
- Transactions
- Prepared statements
- Better control
- Connection pooling

---

# 2. Do You Need Both?

No.

## Option A: Only supabase-js

```text
Frontend
    ↓
supabase-js
    ↓
Supabase APIs
    ↓
PostgreSQL
```

Good for:

- Small projects
- Rapid development

---

## Option B: Only pg

```text
Frontend
    ↓
Express
    ↓
pg Pool
    ↓
PostgreSQL
```

Good for:

- Backend-centric applications
- SQL-heavy projects

---

## Option C: Both

```text
Frontend
    ↓
supabase-js

Backend
 ├─ pg Pool
 └─ supabase-js
```

Common usage:

- pg for SQL queries
- supabase-js for Auth, Storage, Realtime

---

# 3. Testing a PostgreSQL Connection

Example:

```js
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error(err);
  } else {
    console.log('Connected');
  }
});
```

Run:

```bash
node config/db.js
```

---

# 4. Understanding Connection Errors

Example:

```text
ETIMEDOUT 36.37.242.94:6543
```

A timeout means the connection was never established.

Typical causes:

- Wrong host
- Wrong port
- Firewall
- IPv4 / IPv6 incompatibility
- Network restrictions

This is different from:

```text
password authentication failed
```

which means the connection succeeded but authentication failed.

---

# 5. Direct Connection vs Poolers

Supabase provides three common connection methods.

---

## Direct Connection

Architecture:

```text
Your App
    ↓
PostgreSQL
```

Pros:

- Full PostgreSQL support
- No pooling layer
- Session state preserved

Cons:

- Consumes more database connections
- Often IPv6-only on Supabase
- Can hit connection limits

Best for:

- Development
- Low traffic workloads

---

## Session Pooler

Architecture:

```text
Your App
    ↓
PgBouncer
    ↓
PostgreSQL
```

Pros:

- IPv4 support
- Connection pooling
- Good compatibility
- Recommended for Express

Cons:

- Small extra network hop
- Minor PgBouncer limitations

Best for:

- Express
- NestJS
- Fastify
- Traditional backend servers

---

## Transaction Pooler

Architecture:

```text
Your App
    ↓
PgBouncer
    ↓
PostgreSQL
```

Connections are reassigned frequently.

Pros:

- Maximum scalability
- Lowest connection usage

Cons:

- Session state unavailable
- Temporary tables problematic
- Some prepared statement workflows break

Best for:

- Serverless functions
- AWS Lambda
- Vercel Functions

---

# 6. Why Does Session Pooler Support IPv4?

The pooler is not the database.

Architecture:

```text
Your App (IPv4)
      ↓
PgBouncer Pooler (IPv4)
      ↓
PostgreSQL (internal network)
```

Supabase exposes the pooler through IPv4.

The pooler then communicates internally with PostgreSQL.

This allows users on IPv4-only networks to connect successfully.

---

# 7. Understanding the IPv6 Message

Supabase may show:

```text
Direct connection endpoint and dedicated pooler are IPv6-only by default.
Shared pooler supports IPv4.
```

Meaning:

```text
Direct Connection
    ↓
Requires IPv6

Shared Pooler
    ↓
Supports IPv4
```

If your ISP or router lacks proper IPv6 support, direct connections may timeout while the shared pooler works immediately.

---

# 8. SSL Configuration

Recommended:

```js
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});
```

SSL encrypts traffic between your application and Supabase.

---

# 9. ORM Support in Supabase

Supabase supports ORMs such as:

- Prisma
- Drizzle
- TypeORM
- Sequelize

Architecture:

```text
Application
    ↓
ORM
    ↓
pg Driver
    ↓
Pooler
    ↓
PostgreSQL
```

The ORM is not a different database.

It is another abstraction layer on top of PostgreSQL.

---

## Raw SQL

```js
await pool.query(
  'SELECT * FROM users WHERE id = $1',
  [id]
);
```

---

## Prisma

```js
await prisma.user.findUnique({
  where: { id }
});
```

---

## Drizzle

```js
await db.select().from(users);
```

---

# 10. Recommended Setup for an Express Backend

For most Express applications:

```text
Frontend:
  supabase-js

Backend:
  pg Pool

Database:
  Session Pooler
```

Why:

- IPv4 support
- Connection pooling
- SQL flexibility
- Production-ready architecture

Only add supabase-js to the backend when you need:

- Auth administration
- Storage operations
- Realtime features
- Other Supabase-specific APIs

---

# Quick Decision Guide

| Situation | Recommendation |
|------------|---------------|
| React frontend | supabase-js |
| Express backend | pg |
| Production backend | Session Pooler |
| Serverless functions | Transaction Pooler |
| Need Auth/Storage APIs | supabase-js |
| Need SQL control | pg |
| IPv4-only network | Shared Session Pooler |
| Learning databases | Raw SQL + pg |
| Modern TypeScript ORM | Drizzle |

---

# Final Takeaway

For most student projects, capstones, MVPs, and startup prototypes:

```text
React
  ↓
supabase-js

Express
  ↓
pg Pool
  ↓
Session Pooler
  ↓
Supabase PostgreSQL
```

This provides the best balance of simplicity, performance, compatibility, and scalability.
