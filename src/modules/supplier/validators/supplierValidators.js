const { body, param, validationResult } = require("express-validator");

const validateSupplier = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string")
    .trim()
    .isLength({ max: 100 })
    .withMessage("Name cannot exceed 100 characters"),
  body("contact.phone")
    .optional()
    .isString()
    .withMessage("Phone must be a string")
    .trim()
    .matches(/^\+?[1-9]\d{1,14}$/)
    .withMessage("Invalid phone number format"),
  body("contact.email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail()
    .trim(),
  body("contact.representative")
    .optional()
    .isString()
    .withMessage("Representative must be a string")
    .trim()
    .isLength({ max: 100 })
    .withMessage("Representative name cannot exceed 100 characters"),
  body("address.street")
    .optional()
    .isString()
    .withMessage("Street must be a string")
    .trim(),
  body("address.city")
    .optional()
    .isString()
    .withMessage("City must be a string")
    .trim(),
  body("address.state").optional().trim(),
  body("address.postalCode").optional().trim(),
  body("address.country").optional().trim().default("Canada"),
  body("contract.startDate")
    .notEmpty()
    .withMessage("Contract start date is required")
    .isISO8601()
    .withMessage("Invalid date format"),
  body("contract.endDate")
    .optional()
    .isISO8601()
    .withMessage("Invalid date format"),
  body("contract.terms")
    .optional()
    .isIn(["NET_30", "NET_60", "COD", "Custom"])
    .withMessage("Invalid contract terms"),
  body("contract.minimumOrder")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Minimum order must be a positive number"),
  body("status")
    .optional()
    .isIn(["active", "pending", "suspended", "inactive"])
    .withMessage("Invalid status"),
  body("payment.currency").optional().trim(),
  body("payment.preferredMethod")
    .optional()
    .isIn(["bank", "credit", "cash"])
    .withMessage("Invalid payment method"),
  body("notes")
    .optional()
    .isString()
    .withMessage("Notes must be a string")
    .isLength({ max: 500 })
    .withMessage("Notes cannot exceed 500 characters"),
  body("restaurantId")
    .optional()
    .isMongoId()
    .withMessage("Invalid restaurant ID"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        details: errors.array(),
      });
    }
    if (
      req.body.contract?.endDate &&
      new Date(req.body.contract.endDate) <
        new Date(req.body.contract.startDate)
    ) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        details: [
          {
            msg: "Contract end date must be after start date",
            param: "contract.endDate",
            location: "body",
          },
        ],
      });
    }
    next();
  },
];

const validateSupplierId = [
  param("supplierId").isMongoId().withMessage("Invalid supplier ID"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        details: errors.array(),
      });
    }
    next();
  },
];

const validateSupplierStock = [
  param("supplierId").isMongoId().withMessage("Invalid supplier ID"),
  body("stockId")
    .notEmpty()
    .withMessage("Stock ID is required")
    .isMongoId()
    .withMessage("Invalid stock ID"),
  body("pricePerUnit")
    .notEmpty()
    .withMessage("Price per unit is required")
    .isFloat({ min: 0 })
    .withMessage("Price per unit must be a positive number"),
  body("leadTimeDays")
    .notEmpty()
    .withMessage("Lead time is required")
    .isInt({ min: 1 })
    .withMessage("Lead time must be a positive integer"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        details: errors.array(),
      });
    }
    next();
  },
];

const validateStockId = [
  param("stockId").isMongoId().withMessage("Invalid stock ID"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        details: errors.array(),
      });
    }
    next();
  },
];

module.exports = {
  validateSupplier,
  validateSupplierId,
  validateSupplierStock,
  validateStockId,
};
