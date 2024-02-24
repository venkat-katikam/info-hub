import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user.model";
import Post from "@/models/post.model";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // find all post authrized by user with given userId
  //TODO: populate community
  const { id } = params;
  try {
    const posts = await User.findOne({ _id: id }).populate({
      path: "posts",
      model: Post,
      populate: {
        path: "children",
        model: Post,
        populate: {
          path: "author",
          model: User,
          select: "name image id",
        },
      },
    });
    return NextResponse.json(
      {
        message: "User Posts found",
        data: posts,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ errorMessage: error.message }, { status: 400 });
  }
}
