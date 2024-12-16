import { validationResult } from "express-validator";

export const handelInputErrors = (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    res.status(400).json({ errors: result.array() });
  } else {
    next();
  }
};
