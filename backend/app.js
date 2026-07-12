import app from "./src/server.js";
import { startBackupScheduler, stopBackupScheduler } from "./src/services/backupScheduler.js";

const PORT = process.env.PORT || 4000;

// ── Startup validation ─────────────────────────────────────────────────────
function validateEnv() {
  const required = [
    "DATABASE_URL",
    "JWT_ACCESS_SECRET",
    "JWT_REFRESH_SECRET",
  ];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.error(`[FATAL] Missing required environment variables: ${missing.join(", ")}`);
    process.exit(1);
  }
}
validateEnv();

process.on("unhandledRejection", (reason) => {
  console.error("[FATAL] Unhandled Rejection:", reason instanceof Error ? reason.message : reason);
  if (process.env.NODE_ENV === "production") {
    process.exit(1);
  }
});

process.on("uncaughtException", (err) => {
  console.error("[FATAL] Uncaught Exception:", err.message, err.stack);
  if (process.env.NODE_ENV === "production") {
    process.exit(1);
  }
});

const server = app.listen(PORT, () => {
  console.log(`\nPathEat API running on port ${PORT}`);
  console.log(`Swagger UI: http://localhost:${PORT}/api-docs`);
  console.log(`Health: http://localhost:${PORT}/api/health\n`);
  startBackupScheduler();
});

function gracefulShutdown(signal) {
  console.log(`\n[${signal}] Shutting down gracefully...`);
  stopBackupScheduler();
  server.close(() => {
    console.log("HTTP server closed.");
    process.exit(0);
  });
  setTimeout(() => {
    console.error("Forced shutdown after timeout.");
    process.exit(1);
  }, 10000);
}

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
