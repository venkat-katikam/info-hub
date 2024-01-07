import { connectMongoDB } from "@/dbConfig/dbConfig";
import Post from "@/models/post.model";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

connectMongoDB();

export async function POST(req: NextRequest) {
  try {
    const { text, author, communityId } = await req.json();

    const createdPost = await await Post.create({
      text,
      author,
      community: null,
    });

    await User.findByIdAndUpdate(author, {
      $push: { posts: createdPost._id },
    });

    return NextResponse.json({ message: "Post Uploaded" }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      {
        errorMessage: `An error occured while uploading post ${error.message}`,
      },
      { status: 500 }
    );
  }
}
