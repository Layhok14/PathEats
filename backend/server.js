import app from "./src/app.js";

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`\n🚀 PathEat API running on port ${PORT}`);
  console.log(`📘 Swagger UI: http://localhost:${PORT}/api-docs`);
  console.log(`🏥 Health:      http://localhost:${PORT}/api/health\n`);
});
