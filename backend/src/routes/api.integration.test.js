import http from "http";
import express from "express";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import apiRouter from "./api.js";
import { errorHandler, notFoundHandler } from "../middlewares/errorMiddleware.js";

describe("API routing and error integration", () => {
  let server;
  let baseUrl;

  beforeAll(async () => {
    const app = express();
    app.use(express.json());
    app.use("/api", apiRouter);
    app.use(notFoundHandler);
    app.use(errorHandler);
    server = http.createServer(app);
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    const address = server.address();
    baseUrl = `http://127.0.0.1:${address.port}`;
  });

  afterAll(async () => {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  });

  it("serves the public health route", async () => {
    const response = await fetch(`${baseUrl}/api/health`);
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
  });

  it("protects consumer and developer routes at the backend", async () => {
    for (const path of ["/api/user/profile", "/api/dev/health"]) {
      const response = await fetch(`${baseUrl}${path}`);
      const body = await response.json();
      expect(response.status).toBe(401);
      expect(body).toMatchObject({ success: false, code: "AUTH_REQUIRED" });
      expect(body.traceId).toBeTypeOf("string");
    }
  });

  it("uses the global error contract for request validation", async () => {
    const response = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body).toMatchObject({ success: false, message: "Email and password are required" });
    expect(body.code).toBeTypeOf("string");
    expect(body.traceId).toBeTypeOf("string");
  });

  it("rejects invalid routing coordinates before external communication", async () => {
    const response = await fetch(`${baseUrl}/api/places/route`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ origin: { lat: 999, lng: 0 }, destination: { lat: 0, lng: 0 } }),
    });
    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body.success).toBe(false);
  });
});
