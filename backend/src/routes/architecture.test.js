import { readFile } from "fs/promises";
import { fileURLToPath } from "url";
import path from "path";
import { describe, expect, it } from "vitest";
import { routeCatalog } from "../swagger/routeCatalog.js";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const routePrefixes = {
  authRoutes: "/api/auth",
  storageRoutes: "/api/storage",
  userRoutes: "/api/user",
  vendorRoutes: "/api/vendor",
  adminRoutes: "/api/admin",
  devRoutes: "/api/dev",
  placesRoutes: "/api/places",
};

const toOpenApiPath = (routePath) => routePath.replace(/:([A-Za-z0-9_]+)/g, "{$1}");

describe("backend architecture", () => {
  it("keeps persistence and development bypasses out of route modules", async () => {
    for (const routeFile of Object.keys(routePrefixes)) {
      const source = await readFile(path.join(currentDirectory, `${routeFile}.js`), "utf8");
      expect(source).not.toMatch(/config\/db|\b(?:db|pool)\.query\s*\(/);
      expect(source).not.toMatch(/PATHEAT_(?:ADMIN|DEV)_BYPASS|hardcoded .*ADMIN session/i);
    }
  });

  it("keeps database access out of backup and recovery services", async () => {
    const serviceDirectory = path.join(currentDirectory, "../services");
    const serviceFiles = [
      "DeveloperBackupService.js",
      "backupService.js",
      "backupRecoveryService.js",
      "backupScheduler.js",
    ];
    for (const serviceFile of serviceFiles) {
      const source = await readFile(path.join(serviceDirectory, serviceFile), "utf8");
      expect(source).not.toMatch(/config\/db|\b(?:db|pool|client)\.query\s*\(|\bpool\.connect\s*\(/);
    }
  });

  it("documents every registered domain endpoint", async () => {
    const documented = new Set(routeCatalog.map(({ method, path: routePath }) => `${method.toUpperCase()} ${routePath}`));
    const missing = [];
    for (const [routeFile, prefix] of Object.entries(routePrefixes)) {
      const source = await readFile(path.join(currentDirectory, `${routeFile}.js`), "utf8");
      const routePattern = /router\.(get|post|put|patch|delete)\(\s*["']([^"']+)["']/g;
      for (const match of source.matchAll(routePattern)) {
        const routePath = match[2] === "/" ? prefix : `${prefix}${toOpenApiPath(match[2])}`;
        const key = `${match[1].toUpperCase()} ${routePath}`;
        if (!documented.has(key)) missing.push(key);
      }
    }
    expect(missing).toEqual([]);
  });
});
