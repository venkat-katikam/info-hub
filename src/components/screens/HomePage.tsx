"use client";

import React, { useEffect, useState } from "react";
import { useUserContext } from "@/context/UserContext";
import { usePostContext } from "@/context/PostContext";
import { fetchUser } from "@/helpers/fetchUser";
import PostCard from "../cards/PostCard";
import { fetchPosts } from "@/helpers/fetchPosts";
import { useSearchParams } from "next/navigation";

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
  // children: React.ReactNode;
}

const HomePage = () => {
  const { userData, setUserData } = useUserContext();
  const { postsData, setPostsData } = usePostContext();
  // const [posts, setPosts] = useState<Array<Post>>([]);

  const searchParams = useSearchParams();
  const postCreated = searchParams.get("postCreated");

  useEffect(() => {
    if (!userData._id) {
      fetchUser(setUserData);
    }
  }, []);

  useEffect(() => {
    if (postsData.length === 0 || postCreated === "true") {
      fetchPosts(setPostsData);
    }
  }, []);

  return (
    <>
      <section className="mt-9 flex flex-col gap-10">
        {postsData.length === 0 ? (
          <p className="no-result">No Posts</p>
        ) : (
          <>
            {postsData.map((post: any) => (
              <PostCard
                key={post._id}
                id={post._id}
                currentUserId={userData._id || ""}
                parentId={post.parentId}
                content={post.text}
                author={post.author}
                community={post.community}
                createdAt={post.createdAt}
                comments={post.children}
              />
            ))}
          </>
        )}
      </section>
    </>
  );
};

export default HomePage;
