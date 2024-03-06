"use client";

import React, { useEffect, useState } from "react";
import { useUserContext } from "@/context/UserContext";
import { fetchUser } from "@/helpers/fetchUser";
import PostCard from "../cards/PostCard";
import { redirect } from "next/navigation";
import Comment from "../forms/Comment";
import { PostSkeleton, SearchUserSkeleton } from "../shared/Skeletons";
import { ProgressBar } from "../shared/Progressbar";

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
  children: {
    author: {
      image: string;
    };
  }[];
}

const PostPage = ({ id }: { id: string }) => {
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
    isComment: false,
    text: "",
    children: [],
  });

  const [postLoading, setPostLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(false);

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
      return { errorMessage: "Some error in fetching a post", error };
    } finally {
      setPostLoading(false);
    }
  };

  useEffect(() => {
    if (!userData._id) {
      fetchUser(setUserData, setUserLoading);
    }
  }, []);

  useEffect(() => {
    fetchPostById();
  }, [commentAdded]);

  return (
    <>
      {userLoading && <ProgressBar />}
      {Object.keys(post).length !== 0 && (
        <section className="relative">
          <div>
            {postLoading ? (
              <PostSkeleton />
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
            {post.children.length === 0 && <PostSkeleton count={2} />}
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
