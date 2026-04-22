import { ZodError, type ZodType } from "zod";
import type { Request, Response, NextFunction } from "express";

const validate =
  (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (err) {
      if (!(err instanceof ZodError)) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
      }

      const errors = err.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      return res.status(400).json({
        message: "Validation error",
        errors,
      });
    }
  };

export default validate;
