# PathEat Role Permissions Matrix
## Rigorous Role-Based Access Control (RBAC) Governance Map

This specification outlines the permission layers for PathEat. It establishes security rule targets that backend authorization middleware frameworks and conditional UI layout handlers must implement.

---

## 1. System Role Definitions

### 1.1 CONSUMER
* **Context**: Phnom Penh commuting students and local working professionals trying to discover cost-effective food stalls located along their daily travel trajectories.
* **Capabilities**: Operational bounds are confined to private client records. Read access is granted for global spatial geometry and registered merchant menus.

### 1.2 VENDOR
* **Context**: Roadside food carts, market stalls, and independent street merchants.
* **Capabilities**: Full operational autonomy over their specific business profile registry, coordinate pins, operating hours, and active product inventory listings.

### 1.3 GLOBAL_ADMIN
* **Context**: Master platform supervisors managing corporate governance, platform-wide rules, system-wide rates, and user status lifecycles.
* **Capabilities**: Comprehensive management oversight over users, vendors, and lower tier administrative roles. They lack clearance to run infrastructure-level data recovery operations or shell procedures directly.

### 1.4 CUSTOMER_SERVICE_ADMIN
* **Context**: Operational support personnel resolving user friction, managing ticket lifecycles, and checking system feedback.
* **Capabilities**: Dedicated read/write access to dispute queues, support logs, merchant registration packets, and review moderation interfaces.

### 1.5 DEVELOPER_ADMIN
* **Context**: Structural software operators tracking telemetry, postGIS index efficiency, microservice up-times, and data integrity routines.
* **Capabilities**: Structural administrative control over platform assets: manual database seeding, triggering shell data utilities (`pg_dump`/`pg_restore`), inspecting error traces, and analyzing live logs.

---

## 2. Granular Operations Access Mapping

| System Operation / Feature Block Context | CONSUMER | VENDOR | GLOBAL_ADMIN | CUSTOMER_SERVICE | DEVELOPER_ADMIN |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Calculate Commuter Spatial Route Vectors** | ✓ ALLOW | ✓ ALLOW | ✓ ALLOW | ✓ ALLOW | ✓ ALLOW |
| **Manage Profile / Edit Personal Favorites** | ✓ ALLOW | ✕ DENY | ✕ DENY | ✕ DENY | ✕ DENY |
| **Write/Delete Private Culinary Review Entries**| ✓ ALLOW | ✕ DENY | ✕ DENY | ✕ DENY | ✕ DENY |
| **Register New Vendor Geolocation Map Pin** | ✕ DENY | ✓ ALLOW | ✕ DENY | ✕ DENY | ✕ DENY |
| **Modify Menu Product Pricing Matrices** | ✕ DENY | ✓ ALLOW | ✕ DENY | ✕ DENY | ✕ DENY |
| **Toggle Active Operational State Indicators** | ✕ DENY | ✓ ALLOW | ✕ DENY | ✕ DENY | ✕ DENY |
| **Issue Platform Account Token Bans / Unbans** | ✕ DENY | ✕ DENY | ✓ ALLOW | ✕ DENY | ✕ DENY |
| **Mutate Structural Multi-Role Access Scopes** | ✕ DENY | ✕ DENY | ✓ ALLOW | ✕ DENY | ✕ DENY |
| **Re-adjust Platform Multi-Tier Billing Rules** | ✕ DENY | ✕ DENY | ✓ ALLOW | ✕ DENY | ✕ DENY |
| **Claim, Reply, and Close Customer Tickets** | ✕ DENY | ✕ DENY | ✓ ALLOW | ✓ ALLOW | ✕ DENY |
| **Approve Vendor Market Onboarding Packets** | ✕ DENY | ✕ DENY | ✓ ALLOW | ✓ ALLOW | ✕ DENY |
| **Trigger High-Speed Shell Backups (pg_dump)** | ✕ DENY | ✕ DENY | ✓ ALLOW | ✕ DENY | ✓ ALLOW |
| **Execute Disruptive Schema Recoveries (pg_restore)**| ✕ DENY | ✕ DENY | ✕ DENY | ✕ DENY | ✓ ALLOW |
| **Execute Seed Scripts via Automated Generator**| ✕ DENY | ✕ DENY | ✕ DENY | ✕ DENY | ✓ ALLOW |
| **Inspect Server Raw Logging Output Streams** | ✕ DENY | ✕ DENY | ✕ DENY | ✕ DENY | ✓ ALLOW |

---

## 3. Reference Implementation Patterns for Code Integrity

### 3.1 Express Backend Role Middleware Blueprint
```javascript
// middleware/rbacGuard.js
export const restrictToRoles = (...permittedRoles) => {
  return (req, res, next) => {
    // req.user payload injected upstream by JWT token verifying interceptor
    const activeRole = req.user?.role_scope;
    
    if (!activeRole || !permittedRoles.includes(activeRole)) {
      return res.status(403).json({
        success: false,
        message: `RBAC Restriction Exception: Access Denied. Required: [${permittedRoles.join(', ')}]. Context: ${activeRole || 'Unauthenticated'}`
      });
    }
    next();
  };
};
```

### 3.2 Frontend UI Component Layer Protection Blueprint
```jsx
// components/shared/RBACContainer.jsx
import React from 'react';
import useAuth from '../../shared/hooks/useAuth';

export const RBACContainer = ({ allowedRoles, children, fallback = null }) => {
  const { user } = useAuth();
  
  if (!user || !allowedRoles.includes(user.role_scope)) {
    return fallback; // Gracefully strip interface options without crashing page layout
  }
  
  return <>{children}</>;
};
```