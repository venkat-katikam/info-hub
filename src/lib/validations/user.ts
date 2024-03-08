import * as z from "zod";

export const UserValidationSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: "Name must be at least 3 characters.",
    })
    .max(30),
  email: z
    .string()
    .min(1, { message: "Please provide your email id." })
    .email("This is not a valid email."),
  bio: z
    .string()
    .min(3, {
      message: "Bio must be at least 3 characters.",
    })
    .max(1000),
  image: z
    .string()
    .min(3, {
      message: "Please uplaod a valid photo.",
    })
    .url()
    .nonempty(),
  password: z
    .union([
      z.string().length(0, {
        message: "Password must be at least 3 characters.",
      }),
      z.string().min(3, {
        message: "Password must be at least 3 characters.",
      }),
    ])
    .optional()
    .transform((e) => (e === "" ? undefined : e)),
});

export const LoginValidationSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Please provide your email id." })
    .email("This is not a valid email."),
  password: z
    .string()
    .min(3, {
      message: "Password must be at least 3 characters.",
    })
    .max(30),
});

export const RegisterValidationSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: "Name must be at least 3 characters.",
    })
    .max(30),
  email: z
    .string()
    .min(1, { message: "Please provide your email id." })
    .email("This is not a valid email."),
  password: z
    .string()
    .min(3, {
      message: "Password must be at least 3 characters.",
    })
    .max(30),
});
