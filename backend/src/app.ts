import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import listingRoutes from "./routes/listing.routes.js";

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/listings", listingRoutes);

export default app;