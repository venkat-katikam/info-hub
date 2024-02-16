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

export async function GET(req: NextRequest) {
  try {
    const pageNumber = Number(req.nextUrl.searchParams.get("pageNumber"));
    const pageSize = Number(req.nextUrl.searchParams.get("pageSize"));
    // Calculate the number of posts to skip based on the page number and page size.
    const skipAmount = (pageNumber - 1) * pageSize;

    // Create a query to fetch the posts that have no parent (top-level posts) (a post that is not a comment/reply).
    const postsQuery = Post.find({ parentId: { $in: [null, undefined] } })
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(pageSize)
      .populate({
        path: "author",
        model: User,
      })
      // .populate({
      //   path: "community",
      //   model: Community,
      // })
      .populate({
        path: "children", // Populate the children field
        populate: {
          path: "author", // Populate the author field within children
          model: User,
          select: "_id name parentId image", // Select only _id and username fields of the author
        },
      });

    // Count the total number of top-level posts (Posts) i.e., posts that are not comments.
    const totalPostsCount = await Post.countDocuments({
      parentId: { $in: [null, undefined] },
    }); // Get the total count of posts

    const posts = await postsQuery.exec();

    const isNext = totalPostsCount > skipAmount + posts.length;

    return NextResponse.json({ posts, isNext }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ errorMessage: error.message }, { status: 400 });
  }
}
