import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { applyRouteCatalog } from "./routeCatalog.js";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "PathEat API",
      version: "1.0.0",
      description:
        "Route-aware food discovery platform for Phnom Penh students.\n\n" +
        "## Authentication\n" +
        "Protected endpoints require a Bearer token. Click the **Authorize** button and paste:\n" +
        "```\nBearer <your-jwt-token>\n```\n" +
        "Get a token via `POST /api/auth/login` or `POST /api/auth/register`.",
      contact: {
        name: "PathEat Team",
      },
    },
    servers: [
      { url: "http://localhost:4000", description: "Development" },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Paste your JWT token here",
        },
      },
    },
    security: [{ BearerAuth: [] }],
    tags: [
      { name: "Auth", description: "Registration and login" },
      { name: "User", description: "Consumer profile and data" },
      { name: "Vendor", description: "Vendor operations" },
      { name: "Admin", description: "Global administration" },
      { name: "Customer Service", description: "Support and moderation" },
      { name: "Developer", description: "System operations" },
      { name: "Spatial", description: "Map and routing" },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = applyRouteCatalog(swaggerJsdoc(options));

export function setupSwagger(app) {
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      explorer: true,
      customCss: ".swagger-ui .topbar { display: none }",
      customSiteTitle: "PathEat API Docs",
    })
  );

  // Serve raw spec as JSON
  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  console.log("📘 Swagger UI: http://localhost:4000/api-docs");
}
