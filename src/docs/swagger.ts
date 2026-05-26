import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Japan Travel AI - Backend",
      version: "1.0.0",
      description: "API documentation for Japan Travel AI Backend API",
      contact: {
        name: "Fery Anuar",
        email: "feryanuar24@gmail.com",
      },
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "JWT token for authentication",
        },
      },
    },
    tags: [
      {
        name: "Authentication",
        description:
          "Authentication endpoints for user registration, login, and password management",
      },
      {
        name: "Users",
        description: "User management endpoints (Admin only)",
      },
      {
        name: "Profile",
        description: "User profile management endpoints",
      },
      {
        name: "Itinerary",
        description: "Itinerary generation and management endpoints",
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJSDoc(options);
