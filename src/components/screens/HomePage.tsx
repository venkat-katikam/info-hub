"use client";

import React, { useEffect, useState } from "react";
import { useUserContext } from "@/context/UserContext";
import { usePostContext } from "@/context/PostContext";
import { fetchUser } from "@/helpers/fetchUser";
import PostCard from "../cards/PostCard";
import { fetchPosts } from "@/helpers/fetchPosts";
import { useRouter, useSearchParams } from "next/navigation";
import { PostSkeleton } from "@/components/shared/Skeletons";
import { LoadingDots } from "../shared/LoadingDots";

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
  const router = useRouter();
  const { userData, setUserData } = useUserContext();
  const { postsData, setPostsData } = usePostContext();
  const [postLoading, setPostLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(false);
  const [redirectToError, setRedirectToError] = useState(false);

  if (redirectToError) {
    router.push("/error");
  }

  const searchParams = useSearchParams();
  const postCreated = searchParams.get("postCreated");

  useEffect(() => {
    if (!userData._id) {
      fetchUser(setUserData, setUserLoading, setRedirectToError);
    }
  }, []);

  useEffect(() => {
    if (postsData.length === 0 || postCreated === "true") {
      fetchPosts(setPostsData, setPostLoading, setRedirectToError);
    }
  }, []);

  return (
    <>
      <section className="mt-9 flex flex-col gap-10">
        {userLoading && <LoadingDots />}
        {postLoading && <PostSkeleton count={4} />}
        {!postLoading && postsData.length === 0 ? (
          <p className="no-result">No posts yet</p>
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
                createdAt={post.createdAt}
                comments={post.children}
                likes={post.likes}
              />
            ))}
          </>
        )}
      </section>
    </>
  );
};

export default HomePage;
