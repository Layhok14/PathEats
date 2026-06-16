import app from "./src/server.js";

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`\nPathEat API running on port ${PORT}`);
  console.log(`Swagger UI: http://localhost:${PORT}/api-docs`);
  console.log(`Health: http://localhost:${PORT}/api/health\n`);
});
