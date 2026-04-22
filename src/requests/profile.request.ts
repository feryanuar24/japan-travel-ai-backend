import { z } from "zod";

export const updateProfileValidator = z.object({
  body: z.object({
    name: z.string().min(1, "Nama tidak boleh kosong").optional(),
    email: z.email("Email tidak valid").optional(),
    password: z
      .string()
      .min(8)
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")
      .optional(),
  }),
});
