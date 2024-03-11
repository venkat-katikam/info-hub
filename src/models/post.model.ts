import mongoose, { Schema } from "mongoose";

interface Likes {
  userId: string;
  createdAt: Date;
}

const likesSchema = new Schema<Likes>({
  userId: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const postSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    parentId: {
      type: String,
    },
    likes: [likesSchema],
    children: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
  },
  { timestamps: true }
);

const Post = mongoose.models.Post || mongoose.model("Post", postSchema);

export default Post;
