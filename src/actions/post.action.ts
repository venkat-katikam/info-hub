"use server";
import { connectMongoDB } from "@/dbConfig/dbConfig";
import Post from "@/models/post.model";
import User from "@/models/user.model";
import { revalidatePath } from "next/cache";

interface Params {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}

export async function createPost({ text, author, communityId, path }: Params) {
  try {
    connectMongoDB();

    const createdPost = await Post.create({
      text,
      author,
      community: null,
    });

    // update the User Model

    await User.findByIdAndUpdate(author, {
      $push: { posts: createdPost._id },
    });

    revalidatePath(path);
  } catch (error) {
    throw new Error(`Error creating Post:${error.message}`);
  }
}
