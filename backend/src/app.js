import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import apiRouter from "./routes/api.js";
import { errorHandler } from "./middlewares/errorMiddleware.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRouter);

app.use(errorHandler);

export default app;
