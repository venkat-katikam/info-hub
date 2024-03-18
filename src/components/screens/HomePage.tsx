"use client";

import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useUserContext } from "@/context/UserContext";
import { usePostContext } from "@/context/PostContext";
import { fetchUser } from "@/helpers/fetchUser";
import PostCard from "../cards/PostCard";
import { fetchPosts } from "@/helpers/fetchPosts";
import { useRouter } from "next/navigation";
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
  const [isFetchedAllPosts, setIsFetchedAllPosts] = useState(false);
  const [redirectToError, setRedirectToError] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [ref, inView] = useInView();
  const [fetchingPosts, setFetchingPosts] = useState(false); // this is to wait until the previous fetch posts to complete

  if (redirectToError) {
    router.push("/error");
  }

  useEffect(() => {
    if (!userData._id) {
      fetchUser(setUserData, setUserLoading, setRedirectToError);
    }
  }, []);

  useEffect(() => {
    if (
      postsData.length === 0 ||
      (inView && !fetchingPosts && !isFetchedAllPosts)
    ) {
      setFetchingPosts(true); // this is to wait until the previous fetch posts to complete

      fetchPosts(
        postsData,
        setPostsData,
        setPostLoading,
        setRedirectToError,
        pageNumber,
        setIsFetchedAllPosts
      ).finally(() => {
        setFetchingPosts(false); // this is to wait until the previous fetch posts to complete
      });

      setPageNumber((prevState) => prevState + 1);
    }
  }, [inView]);

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
            {postsData.length > 0 && !isFetchedAllPosts && (
              <PostSkeleton count={1} myRef={ref} />
            )}
          </>
        )}
      </section>
    </>
  );
};

export default HomePage;
