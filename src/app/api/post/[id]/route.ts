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
        path: "author",
        model: User,
        select: "_id id name image",
      }) // Populate the author field with _id and username
      //   .populate({
      //     path: "community",
      //     model: Community,
      //     select: "_id id name image",
      //   }) // Populate the community field with _id and name
      .populate({
        path: "children", // Populate the children field
        populate: [
          {
            path: "author", // Populate the author field within children
            model: User,
            select: "_id id name parentId image", // Select only _id and username fields of the author
          },
          {
            path: "children", // Populate the children field within children
            model: Post, // The model of the nested children (assuming it's the same "Post" model)
            populate: {
              path: "author", // Populate the author field within nested children
              model: User,
              select: "_id id name parentId image", // Select only _id and username fields of the author
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
