import swaggerJsdoc from "swagger-jsdoc";
import env from "./env.js";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Peoples Priorities API",
      version: "1.0.0",
      description: "API Documentation for Peoples Priorities Backend",
    },
    servers: [
      {
        url: `https://dy-peoples-priorities.onrender.com`,
        description: "Development Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.ts"], // Path to the API routes
};

export const swaggerSpec = swaggerJsdoc(options);
