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

    const userPostsWithLikes = userPosts.filter(
      (post) => post.likes.length > 0
    );

    // collect all the child posts ids (replies) from 'children' field
    const childPostIds = userPosts.reduce((acc, userPost) => {
      return acc.concat(userPost.children);
    }, []);

    let allLikesActivity = await Promise.all(
      userPostsWithLikes.map(async (post) => {
        const parentId = post._id;

        const eachPostLikesActivity = await Promise.all(
          post.likes.map(async (like: any) => {
            if (id !== like.userId) {
              const author = await User.findById(like.userId).select(
                "name image _id"
              );

              return {
                author,
                parentId,
                createdAt: like.createdAt,
                isLike: true,
              };
            } else {
              // Return an empty array if the condition is not met
              return [];
            }
          })
        );
        return eachPostLikesActivity;
      })
    );

    const flattenedLikesActivity = allLikesActivity.flat(Infinity);

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
        message: "Replies and Likes found",
        data: [...replies, ...flattenedLikesActivity],
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ errorMessage: error.message }, { status: 400 });
  }
}
