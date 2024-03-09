"use client";
import { useEffect, useState } from "react";
import PostCard from "../cards/PostCard";
import { PostSkeleton } from "./Skeletons";
import { useRouter, useSearchParams } from "next/navigation";
interface Props {
  currentUserId: string;
  accountId: string;
  accountType: string;
}

interface Post {
  _id: string;
  currentUserId: string;
  parentId: string | null;
  content: string;
  author: {
    _id: string;
    name: string;
    image: string;
  };
  createdAt: string;
  likes: string[];
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
  const router = useRouter();
  const [userPosts, setUserPosts] = useState<Array<Post>>([]);
  const [userPostsData, setUserPostsData] = useState({
    name: "",
    image: "",
    _id: "",
  });
  const [postLoading, setPostLoading] = useState(false);

  const searchParams = useSearchParams();
  const postsDeleted = searchParams.get("postsDeleted");

  const fetchUserPosts = async (userId: string) => {
    try {
      setPostLoading(true);
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
      console.log("Error during fetching user post", error);
      router.push("/error");
    } finally {
      setPostLoading(false);
    }
  };

  useEffect(() => {
    if (accountId) {
      fetchUserPosts(accountId);
    }
  }, [accountId, postsDeleted]);

  return (
    <section className="mt-9 flex flex-col gap-10">
      {postLoading && <PostSkeleton count={4} />}
      {!postLoading &&
        userPosts.map((post: any) => (
          <PostCard
            key={post._id}
            id={post._id}
            currentUserId={currentUserId}
            accountId={accountId}
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
            createdAt={post.createdAt}
            comments={post.children}
            likes={post.likes}
          />
        ))}
      {userPosts.length === 0 && <p className="no-result">No posts yet</p>}
    </section>
  );
};

export default PostsTab;
