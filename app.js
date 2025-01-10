import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import cron from "node-cron";
import globalErrorHandler from "./utils/errorHandler.js";
import bodyParser from "body-parser";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import { acquireLock, releaseLock } from "./utils/redis.js";
import { getStats } from "./controller/statsController.js";
import { getDeviation } from "./controller/deviationController.js";
import logger from "./utils/logger.js";
import { fetchCryptoData } from "./utils/dataFetcher.js";
import connectDB from "./config/db.js";

const app = express();

//Mongodb connection
connectDB();

//Middlewares
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(mongoSanitize());

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Cron Job to fetch crypto data every 2 hours
cron.schedule("0 */2 * * *", async () => {
  console.log("Cron job started");
  const lock = "cryptoDataFetched";
  const ttl = 1000 * 60 * 10; // 10 minutes
  try {
    const isLocked = await acquireLock(lock, ttl);
    if (!isLocked) {
      console.log("Instance already fetching. Skipping.");
      logger.info("Lock not acquired");
      return;
    }
    fetchCryptoData();
  } catch (error) {
    console.error("Fetch error", error);
    logger.error("Fetch error", error);
  } finally {
    await releaseLock(lock);
  }
});

//Routes
app.get("/", (req, res) => {
  res.send("Hello World");
});
app.get("/stats", getStats);
app.get("/deviation", getDeviation);

app.use(globalErrorHandler);

export default app;
