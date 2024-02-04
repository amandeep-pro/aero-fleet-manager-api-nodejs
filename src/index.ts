import express from "express";
import dotenv from "dotenv";
import routes from "./routes";
import swaggerUi from "swagger-ui-express";
import { join } from "path";
import SwaggerParser from "@apidevtools/swagger-parser";
import { OpenAPIV3 } from "openapi-types";
import rateLimit from "express-rate-limit";
import cors, { CorsOptions } from "cors";
import helmet from "helmet";
import expressWinston from "express-winston";
import logger from "./utils/logger"; 

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// List of allowed origins
const allowedOrigins = [
  'http://localhost:3000',
];

// CORS configuration
const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, callback: (error: Error | null, allowed: boolean) => void) => {
    if (!origin || allowedOrigins.includes(origin)) {
      // Allow requests with no origin or those with allowed origins
      callback(null, true);
    } else {
      // Disallow requests with other origins
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow these methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
};

// Rate limiter middleware
const apiRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 1000, // Limit each IP to 1000 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});

// Apply middleware
app.use(express.json());
app.use(cors(corsOptions)); // Enable CORS with specific options
app.use(helmet()); // Set various HTTP headers for security

// Setup logging with the custom logger
app.use(expressWinston.logger({
  transports: logger.transports,
  format: logger.format,
}));

// Define a variable for the OpenAPI specification
let openApiSpec: OpenAPIV3.Document | null = null;

// Load and resolve OpenAPI JSON
const loadOpenApiSpec = async () => {
  try {
    // Bundle and resolve all $refs in the OpenAPI document
    openApiSpec = await SwaggerParser.bundle(join(__dirname, "../specs/openapi.json")) as OpenAPIV3.Document;

    if (openApiSpec) {
      // Pass the fully resolved specification to Swagger UI
      app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));
    } else {
      throw new Error("Failed to load OpenAPI specification.");
    }
  } catch (err) {
    console.error("Failed to resolve OpenAPI specification", err);
    process.exit(1);
  }
};

// Call loadOpenApiSpec and then start the server
loadOpenApiSpec().then(() => {
  app.get("/", (req, res) => {
    res.send("Server is up");
  });

  // Apply rate limiter to all API routes
  app.use("/", apiRateLimiter);
  app.use("/", routes);

  // Setup error logging with the custom logger
  app.use(expressWinston.errorLogger({
    transports: logger.transports,
    format: logger.format,
  }));

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
});
