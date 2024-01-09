import * as z from "zod";

export const PostValidationSchema = z.object({
  post: z.string().min(3, {
    message: "Post must contain at least 3 characters.",
  }),
});

export const CommentValidationSchema = z.object({
  post: z.string().min(3, {
    message: "Comment must contain at least 3 characters.",
  }),
});
