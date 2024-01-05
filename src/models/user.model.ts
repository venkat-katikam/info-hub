import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      // required: [true, "please provide name to DB"]
    },
    email: {
      type: String,
      required: [true, "please provide email to DB"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "please provide password to DB"],
    },
    image: { type: String },
    bio: { type: String },
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    onboarded: { type: Boolean, default: false },
    communities: [
      {
        type: Schema.Types.ObjectId,
        ref: "Community",
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
