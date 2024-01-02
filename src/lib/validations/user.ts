import * as z from "zod";

export const UserValidationSchema = z.object({
  // No validation for profile pic
  // profile_photo: z.string().url().nonempty(),
  name: z
    .string()
    .min(3, {
      message: "Name must be at least 3 characters.",
    })
    .max(30),
  username: z
    .string()
    .min(3, {
      message: "Username must be at least 3 characters.",
    })
    .max(30),
  bio: z
    .string()
    .min(3, {
      message: "Bio must be at least 3 characters.",
    })
    .max(1000),
});
