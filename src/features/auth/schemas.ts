import z from "zod";

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1, "Required"),
});

export const registerSchema = z.object({
  name: z.string().min(1, "Name required"),
  email: z.email(),
  password: z.string().min(1, "Required"),
});
