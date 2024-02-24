import { connectMongoDB } from "@/dbConfig/dbConfig";
import Post from "@/models/post.model";
import { NextRequest, NextResponse } from "next/server";

connectMongoDB();

export async function POST(req: NextRequest) {
  try {
    const { postId, commentText, userId } = await req.json();

    // Find the original Post
    const originalPost = await Post.findById(postId);

    if (!originalPost) {
      throw new Error("Post not found");
    }

    // Create new Post with comment text
    const commentPost = new Post({
      text: commentText,
      author: userId,
      parentId: postId,
    });

    // Save the new Post
    const savedCommentPost = await commentPost.save();

    // Update the original post to include the new comment
    originalPost.children.push(savedCommentPost._id);

    // Save the original Post
    await originalPost.save();

    return NextResponse.json(
      { message: "Comment Added", data: { originalPost } },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        errorMessage: `An error occured while uploading post ${error.message}`,
      },
      { status: 500 }
    );
  }
}
