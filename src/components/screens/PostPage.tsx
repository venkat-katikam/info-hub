"use client";

import React, { useEffect, useState } from "react";
import { useUserContext } from "@/context/UserContext";
import { fetchUser } from "@/helpers/fetchUser";
import PostCard from "../cards/PostCard";
import { useSearchParams, useRouter } from "next/navigation";
import Comment from "../forms/Comment";
import { PostSkeleton, SearchUserSkeleton } from "../shared/Skeletons";
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
  likes: { userId: string; createdAt: string; _id: string }[];
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

const PostPage = ({ id }: { id: string }) => {
  const router = useRouter();
  const { userData, setUserData } = useUserContext();
  const [commentAdded, setCommentAdded] = useState(0);
  const [post, setPost] = useState<Post>({
    _id: "",
    currentUserId: "",
    parentId: null,
    content: "",
    author: {
      _id: "",
      name: "",
      image: "",
    },
    createdAt: "",
    comments: [],
    likes: [],
    isComment: false,
    text: "",
    children: [],
  });

  const [postLoading, setPostLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(false);
  const [redirectToError, setRedirectToError] = useState(false);

  const searchParams = useSearchParams();
  const postsDeleted = searchParams.get("postsDeleted");

  if (redirectToError) {
    router.push("/error");
  }

  const fetchPostById = async () => {
    try {
      setPostLoading(true);
      const response = await fetch(`/api/post/${id}`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch a posts");
      }
      const responseData = await response.json();

      setPost(responseData.post);
    } catch (error) {
      console.log("Error during fetching post", error);
      router.push("/error");
    } finally {
      setPostLoading(false);
    }
  };

  useEffect(() => {
    if (!userData._id) {
      fetchUser(setUserData, setUserLoading, setRedirectToError);
    }
  }, []);

  useEffect(() => {
    fetchPostById();
  }, [commentAdded, postsDeleted]);

  return (
    <>
      {userLoading && <LoadingDots />}
      {Object.keys(post).length !== 0 && (
        <section className="relative">
          <div>
            {postLoading ? (
              <PostSkeleton count={1} />
            ) : (
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
            )}
          </div>
          <div className="mt-7">
            <Comment
              postId={post._id}
              currentUserImg={userData.image}
              currentUserId={JSON.stringify(userData._id)}
              commentAdded={commentAdded}
              setCommentAdded={setCommentAdded}
            />
          </div>
          <div className="text-base-semibold text-light-2 mt-5">Comments</div>
          <div className="mt-10">
            {postLoading && <PostSkeleton count={2} />}
            {post.children.length === 0 && (
              <p className="no-result">No comments yet</p>
            )}
            {post.children.map((childItem: any) => (
              <PostCard
                key={childItem._id}
                id={childItem._id}
                currentUserId={userData._id || ""}
                parentId={childItem.parentId}
                content={childItem.text}
                author={childItem.author}
                createdAt={childItem.createdAt}
                comments={childItem.children}
                accountId={childItem.author._id}
                likes={childItem.likes}
                isComment
              />
            ))}
          </div>
        </section>
      )}
    </>
  );
};

export default PostPage;
