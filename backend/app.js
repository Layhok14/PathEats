import app from "./src/server.js";

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
  console.error("[FATAL] Uncaught Exception:", err.message);
  if (process.env.NODE_ENV === "production") {
    process.exit(1);
  }
});

app.listen(PORT, () => {
  console.log(`\nPathEat API running on port ${PORT}`);
  console.log(`Swagger UI: http://localhost:${PORT}/api-docs`);
  console.log(`Health: http://localhost:${PORT}/api/health\n`);
});
