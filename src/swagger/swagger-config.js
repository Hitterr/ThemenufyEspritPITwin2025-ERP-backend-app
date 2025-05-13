const swaggerJsdoc = require("swagger-jsdoc");
const path = require("path");
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Modular API",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:5000/",
        description: "Local server",
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
  },
  apis: [
    path.join(__dirname, "../modules/**/routes/*.js"),
    path.join(__dirname, "../modules/**/*.routes.js"), // Common alternative pattern
    path.join(__dirname, "../routes/*.js"),
  ],
};

const specs = swaggerJsdoc(options);
module.exports = specs;
