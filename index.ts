import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { dbConnect } from "./configs/dbConnect";
import { startCoinSync } from "./utils/coinSync";
import userRouter from "./routes/userRouter";
import { errorHandler, notFound } from "./middlewares/error/errorHandler";
import { sanitizeInput } from "./middlewares/security/sanitize";
import coinRouter from "./routes/coinRouter";
import postRouter from "./routes/postRouter";
import newsRouter from "./routes/newsRouter";
import analyzeRouter from "./routes/analyzeRouter";
import commentRouter from "./routes/commentRouter";
import quizRouter from "./routes/quizRouter";
import journalRouter from "./routes/journalRouter";

dbConnect().then(() => startCoinSync());

const app = express();

// Hinter Nginx/Caddy: echte Client-IP für das Rate-Limit
app.set("trust proxy", 1);
app.disable("x-powered-by");

app.use(
  helmet({
    // Bilder (Cloudinary, CoinGecko) dürfen vom Frontend geladen werden
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// Erlaubte Frontend-Adressen: CLIENT_URL (kommagetrennt), sonst nur localhost
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:3000")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);
app.use(
  cors({
    credentials: true,
    origin: (origin, cb) =>
      !origin || allowedOrigins.includes(origin)
        ? cb(null, true)
        : cb(new Error("Not allowed by CORS")),
  })
);

app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());
app.use(sanitizeInput);

// Rate-Limits: Login/Registrierung/Passwort-Reset strenger als der Rest
const limiter = (max: number, minutes: number) =>
  rateLimit({
    windowMs: minutes * 60 * 1000,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many requests. Please try again later." },
  });
app.use("/api/", limiter(600, 15));
app.use(["/api/v1/login", "/api/v1/register"], limiter(10, 15));
app.use(
  [
    "/api/v1/users/confirmEmail",
    "/api/v1/users/confirmVerificationCode",
    "/api/v1/users/changePasswordWithotLogin",
    "/api/v1/generate-verify-email-token",
    "/api/v1/verify-account",
  ],
  limiter(8, 15)
);

app.use(userRouter);
app.use(coinRouter);
app.use(postRouter);
app.use(newsRouter);
app.use(analyzeRouter);
app.use(commentRouter);
app.use(quizRouter);
app.use(journalRouter);

// Hochgeladene Bilder (wenn kein Cloudinary genutzt wird)
app.use("/uploads", express.static("public/uploads", { maxAge: "7d" }));

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 3002;

app.listen(port, () => console.log(`Server is Running on Port: ${port}`));
