"use client";
import { useEffect, useState } from "react";
import PostCard from "../cards/PostCard";
interface Props {
  currentUserId: string;
  accountId: string;
  accountType: string;
}

interface Post {
  _id: string;
  currentUsedId: string;
  parentId: string | null;
  content: string;
  author: {
    _id: string;
    name: string;
    image: string;
  };
  community: {
    _id: string;
    name: string;
    image: string;
  } | null;
  createdAt: string;
  comments: {
    author: {
      image: string;
    };
  }[];
  isComment?: boolean;
  text: string;
  children: {
    author: {
      image: string;
    };
  }[];
}

const PostsTab = ({ currentUserId, accountId, accountType }: Props) => {
  const [userPosts, setUserPosts] = useState<Array<Post>>([]);
  const [userPostsData, setUserPostsData] = useState({
    name: "",
    image: "",
    _id: "",
  });

  const fetchUserPosts = async (userId: string) => {
    try {
      const response = await fetch(`/api/user-posts/${userId}`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch a user posts");
      }
      const responseData = await response.json();

      setUserPostsData({
        name: responseData?.data?.name,
        image: responseData?.data?.image,
        _id: responseData?.data?._id,
      });
      setUserPosts([...responseData?.data?.posts]);
    } catch (error: any) {
      return { errorMessage: "Some error in fetching a user", error };
    }
  };

  useEffect(() => {
    if (accountId) {
      fetchUserPosts(accountId);
    }
  }, [accountId]);

  return (
    <section className="mt-9 flex flex-col gap-10">
      {userPosts.map((post: any) => (
        <PostCard
          key={post._id}
          id={post._id}
          currentUsedId={currentUserId}
          parentId={post.parentId}
          content={post.text}
          author={
            accountType === "User"
              ? {
                  name: userPostsData.name,
                  image: userPostsData.image,
                  _id: userPostsData._id,
                }
              : {
                  name: post.author.name,
                  image: post.author.image,
                  _id: post.author._id,
                }
          }
          community={post.community}
          createdAt={post.createdAt}
          comments={post.children}
        />
      ))}
    </section>
  );
};

export default PostsTab;
