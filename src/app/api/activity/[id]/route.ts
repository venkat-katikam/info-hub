import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user.model";
import { connectMongoDB } from "@/dbConfig/dbConfig";
import Post from "@/models/post.model";

connectMongoDB();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    // find all posts created by user
    const userPosts = await Post.find({ author: id });

    // collect all the child posts ids (replies) from 'children' field
    const childPostIds = userPosts.reduce((acc, userPost) => {
      return acc.concat(userPost.children);
    }, []);

    const replies = await Post.find({
      _id: { $in: childPostIds },
      author: { $ne: id },
    }).populate({
      path: "author",
      model: User,
      select: "name image _id",
    });

    return NextResponse.json(
      {
        message: "Replies found",
        data: replies,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ errorMessage: error.message }, { status: 400 });
  }
}
