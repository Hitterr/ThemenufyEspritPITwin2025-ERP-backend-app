class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = 404;
  }
}

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = "ConflictError";
    this.statusCode = 409;
  }
}

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
    this.statusCode = 400;
  }
}

class CustomError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status || 500;
    this.name = 'CustomError';
  }
}


module.exports = {
  NotFoundError,
  ConflictError,
  ValidationError,
  CustomError,
};
