import { connectMongoDB } from "@/dbConfig/dbConfig";
import Post from "@/models/post.model";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

connectMongoDB();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const post = await Post.findById(id)
      .populate({
        path: "author", // Populate the author field with _id and name
        model: User,
        select: "_id id name image",
      })
      .populate({
        path: "children", // Populate the children field
        populate: [
          {
            path: "author", // Populate the author field within children
            model: User,
            select: "_id id name parentId image", // Select only _id and name fields of the author
          },
          {
            path: "children", // Populate the children field within children
            model: Post, // The model of the nested children (assuming it's the same "Post" model)
            populate: {
              path: "author", // Populate the author field within nested children
              model: User,
              select: "_id id name parentId image", // Select only _id and name fields of the author
            },
          },
        ],
      })
      .exec();

    return NextResponse.json({ post }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ errorMessage: error.message }, { status: 400 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { text } = await request.json();

    const post = await Post.findOneAndUpdate({ _id: id }, { text: text });

    if (!post) {
      throw new Error("Post not found");
    }

    return NextResponse.json(
      {
        message: "Post Updated",
        post,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ errorMessage: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const { author } = await request.json();
  try {
    const post = await Post.findById(id);

    if (post) {
      await post.deleteOne();
      await User.findByIdAndUpdate(author, {
        $pull: { posts: id },
      });
      return NextResponse.json(
        { message: "Post deleted successfully", post },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { errorMessage: "Post not found" },
        { status: 404 }
      );
    }
  } catch (error: any) {
    return NextResponse.json({ errorMessage: error.message }, { status: 400 });
  }
}
