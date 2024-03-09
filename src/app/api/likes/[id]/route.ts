import { NextRequest, NextResponse } from "next/server";
import Post from "@/models/post.model";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { userId } = await request.json();

    // Find the original Post
    const originalPost = await Post.findById(id);

    if (!originalPost) {
      throw new Error("Post not found");
    }

    let newLikes;
    const addLike = originalPost.likes.includes(userId) ? false : true;

    if (addLike) {
      newLikes = [...originalPost.likes, userId];
    } else {
      newLikes = originalPost.likes.filter((elem: any) => elem !== userId);
    }

    const post = await Post.findOneAndUpdate({ _id: id }, { likes: newLikes });

    return NextResponse.json(
      {
        message: "Likes Updated",
        post,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ errorMessage: error.message }, { status: 500 });
  }
}
