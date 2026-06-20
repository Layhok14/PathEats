# Merge & Integration Strategy

> **Purpose:** Prevent, detect, and resolve merge conflicts when integrating frontend, backend, and other domains.
> **Scope:** Any branch that combines work from two or more developers/domains.

---

## 1. Root Causes of Conflicts

| Cause | Example |
|-------|---------|
| Same file edited by two people | Both touch `vendorRoutes.js` |
| Shared constants drift | Frontend adds a cuisine type, backend enum doesn't match |
| Mixed concerns in a single file | One PR adds features + refactors the same file |
| Long-lived branches | A feature branch lives 5+ days without merging `main` |
| No communication on API contracts | Frontend expects `POST /api/vendor/search`, backend calls it `POST /api/vendor/find` |

---

## 2. Prevention Strategies

### 2.1 — Agree on API contracts first

Before anyone writes code:

```md
# Shared contract for /api/vendor/search

POST /api/vendor/search
Request:  { routePoints: [lat,lng][], radiusMetres, cuisine?, maxPrice?, openNow?, query? }
Response: { success, data: [{ id, name, lat, lng, cuisine, price_range, rating, ... }] }
```

Write the contract in a shared doc (or a `.ts` type file in `shared/types/`).  
Both sides implement against the same spec — no guesswork.

### 2.2 — Short-lived branches

- Rebase or merge `main` into your branch **daily**.
- Keep feature branches under 2 days. If larger, split into smaller PRs.

```bash
# Every morning
git checkout feat/my-feature
git fetch origin
git rebase origin/main
```

### 2.3 — Separate concerns by folder

This repo already separates domains by folder:

```
frontend/src/user/       → user owns this
frontend/src/vendor/     → vendor owns this
frontend/src/shared/     → shared constants/types/utils — any change here needs cross-team sync
```

**Rule:** `shared/` changes require a brief Slack/Discord message before committing.  
**Rule:** Never put domain logic in `shared/` — only truly shared constants, types, and pure utility functions.

### 2.4 — One thing per commit

Don't mix formatting, refactoring, and feature work in the same commit.  
Use separate commits so a conflict on a refactor doesn't block the feature.

```
❌ Bad:  "fix styling + add vendor search + clean exports"
✅ Good: "feat: add vendor search endpoint"
         "chore: fix lint in vendorRoutes.js"
         "style: format vendorRoutes.js"
```

### 2.5 — Use `git diff` before pushing

```bash
git diff main...HEAD   # See what you're about to introduce
```

If the diff touches files outside your domain, ask why.

---

## 3. When a Conflict Happens

### 3.1 — Stop and assess

```bash
git merge main
# or
git rebase main
# CONFLICT in frontend/src/shared/constants/appConfig.js
```

Ask:
- Did both sides change the same constant? → Keep the correct value, verify downstream.
- Did both sides add different exports? → Keep both.
- Did one side delete what the other changed? → Understand intent before choosing.

### 3.2 — Resolve with context

Never resolve purely based on "ours" or "theirs" blindly. Open the file, read the conflict:

```diff
<<<<<<< HEAD
export const VENDOR_RANGE_DEFAULT = 500;
=======
export const VENDOR_RANGE_DEFAULT = 300;
>>>>>>> feat/add-search
```

- If this is a UI default, the frontend developer's value wins (300).
- If the backend expects 500, sync with the backend dev.

### 3.3 — Use `git mergetool` for complex files

```bash
git mergetool
```

Configure with your editor of choice (VSCode, Vimdiff, etc.). Visual diff tools make 3-way merges far less error-prone.

### 3.4 — Test after resolving

After any merge conflict resolution:

```bash
npm run build        # Frontend
npm run dev          # Run the app briefly to smoke-test
```

A conflict resolved incorrectly can produce valid syntax but wrong logic.

---

## 4. Integration Workflow for This Project

### 4.1 — Integration branches

Use a dedicated `integration/` branch for combining domains when the regular merge into `main` is risky.

```
main                → Production-ready
  └─ dev            → Daily integration (optional: CI runs here)
      ├─ feat/user-search     → User domain
      ├─ feat/vendor-portal   → Vendor domain
      └─ feat/admin-panel     → Admin domain
```

When a feature is ready, merge it into `dev`, resolve conflicts there, then merge `dev` into `main`.

### 4.2 — Integration runbook

Phase 1 — Code freeze (30 min):
```
1. All devs push their latest to their feature branches
2. No new commits allowed until integration completes
```

Phase 2 — Merge order:
```
1. Merge shared/ changes first (constants, types, services)
2. Merge backend changes (API routes, controllers)
3. Merge frontend changes last (consumes the API)
```

Phase 3 — Smoke test:
```
1. `npm run build` (frontend)
2. Start backend, verify endpoints respond
3. Start frontend, verify it connects and renders
4. Run the core user flow: search → filter → select vendor
```

Phase 4 — Push:
```
git push origin dev
# or
git push origin main
```

---

## 5. Git Tools Reference

| Command | What it does |
|---------|-------------|
| `git merge --no-ff feature-branch` | Create a merge commit (preserves history) |
| `git rebase main` | Replay your commits on top of main (linear history) |
| `git rebase --continue` | Continue after fixing conflicts during rebase |
| `git rebase --abort` | Abort the rebase, go back to before |
| `git log --oneline --graph --all` | Visualise the commit tree |
| `git diff main...HEAD` | See changes on your branch vs main |
| `git merge --abort` | Cancel a merge with conflicts |

**Recommendation:** Prefer `merge --no-ff` over rebase for integration branches. Rebase is fine for personal feature branches.

---

## 6. Communication Protocol

| Situation | Action |
|-----------|--------|
| Changing a shared constant | Ping the team in Slack/Discord **before** merging |
| Adding a new API endpoint | Share the contract in the team channel **before** implementing |
| Refactoring a file others touch | Let people know, keep the refactor in a separate commit |
| Creating a large PR | Split it into multiple smaller PRs (max 200 lines changed) |
| Merge conflicts in `shared/` | Call a quick huddle — both devs resolve together |

---

## 7. Checklist Before Merging

```
[ ] Does the build pass?          (npm run build)
[ ] Does the app start?          (npm run dev)
[ ] Did I run the lint?          (npm run lint or equivalent)
[ ] Are there dead code / logs?  (console.log, commented-out code)
[ ] Did I test the integration?  (frontend + backend together)
[ ] Did I write the merge commit message? (describe *why* not just what)
```
