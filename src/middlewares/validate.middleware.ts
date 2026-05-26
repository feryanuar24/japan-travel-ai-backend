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
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        console.error(err);
        return res
          .status(500)
          .json({ 
            status: false,
            message: "Internal server error",
            data: errorMessage,
          });
      }

      const errors = err.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      return res.status(400).json({
        status: false,
        message: "Validation error",
        data: errors,
      });
    }
  };

export default validate;
