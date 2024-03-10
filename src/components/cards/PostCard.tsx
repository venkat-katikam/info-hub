"use-client";
import { useState } from "react";
import { formatDateString } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { LoadingDots } from "../shared/LoadingDots";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DeleteDialogBox } from "../shared/DeleteDialogBox";

interface Props {
  id: string;
  currentUserId: string;
  accountId?: string;
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
}

const PostCard = ({
  id,
  currentUserId,
  accountId,
  parentId,
  content,
  author,
  createdAt,
  comments,
  isComment,
  likes,
}: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const [likeClicked, setLikeClicked] = useState(likes.includes(currentUserId));
  const [noOfLikes, setNoOfLikes] = useState(likes.length);
  const [deletePostLoading, setDeletePostLoading] = useState(false);
  const [redirectToError, setRedirectToError] = useState(false);
  const searchParams = useSearchParams();
  const postsDeleted = searchParams.get("postsDeleted");

  const deletePostHandler = async () => {
    try {
      setDeletePostLoading(true);
      const response = await fetch(`/api/post/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author: currentUserId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete the post");
      }
      const responseData = await response.json();

      router.push(
        `${pathname}?postsDeleted=${
          postsDeleted ? Number(postsDeleted) + 1 : 1
        }`
      );
    } catch (error) {
      setRedirectToError(true);
      console.log("Some error in deleting the post", error);
    } finally {
      setDeletePostLoading(false);
    }
  };

  const addLikeHandler = async () => {
    try {
      const response = await fetch(`/api/likes/${id}`, {
        method: "PUT",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          userId: currentUserId,
        }),
      });

      if (!response.ok) {
        console.log("Some error in updating likes");
      }

      const responseData = await response.json();
    } catch (error: any) {
      console.log("Some error in updating likes", error.errorMessage);
    }
  };

  if (redirectToError) {
    router.push("/error");
  }
  return (
    <>
      {deletePostLoading && <LoadingDots />}
      <article
        className={`flex w-full flex-col rounded-xl ${
          isComment ? "px-0 xs:px-7 my-5" : "bg-dark-2 p-7"
        } `}
      >
        <div className="flex items-start justify-between">
          <div className="flex w-full flex-1 flex-grow gap-4">
            <div className="flex flex-col items-center">
              <Link
                href={`/profile/${author._id}`}
                className="relative h-11 w-11"
              >
                <Image
                  src={author.image}
                  alt="Profile Image"
                  fill
                  className="curson-pointer rounded-full"
                />
              </Link>
              <div className="post-card_bar" />
            </div>

            <div>
              <Link href={`/profile/${author._id}`} className="w-fit">
                <h4 className="cursor-pointer text-base-semibold text-light-1">
                  {author.name}
                </h4>
              </Link>
              <p className="mt-2 text-small-regular text-light-2">{content}</p>
              <div className="mt-5 flex flex-col gap-3">
                <div className="flex gap-3.5">
                  <Image
                    src={`${
                      likeClicked
                        ? "/assets/heart-filled.svg"
                        : "/assets/heart-gray.svg"
                    }`}
                    alt="heart"
                    width={24}
                    height={24}
                    className="cursor-pointer object-contain"
                    onClick={() => {
                      setLikeClicked(!likeClicked);
                      setNoOfLikes(
                        !likeClicked ? noOfLikes + 1 : noOfLikes - 1
                      );
                      addLikeHandler();
                    }}
                  />
                  <Link href={`/post/${id}`}>
                    <Image
                      src="/assets/reply.svg"
                      alt="reply"
                      width={24}
                      height={24}
                      className="cursor-pointer object-contain"
                    />
                  </Link>
                  {!isComment && (
                    <Image
                      src="/assets/repost.svg"
                      alt="repost"
                      width={24}
                      height={24}
                      className="cursor-pointer object-contain"
                    />
                  )}

                  {accountId === currentUserId && (
                    <>
                      {!isComment && (
                        <Link
                          href={`/update-post/${id}`}
                          className="flex items-center"
                        >
                          <Image
                            src="/assets/edit.svg"
                            alt="edit"
                            width={20}
                            height={20}
                            className="cursor-pointer object-contain "
                          />
                        </Link>
                      )}
                      <DeleteDialogBox deletePostHandler={deletePostHandler} />
                    </>
                  )}
                </div>

                <Link href={`/post/${id}`}>
                  <p className="text-subtle-medium text-gray-1">
                    {noOfLikes} likes & {comments.length} replies
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-5 flex items-center">
          <p className="text-subtle-medium text-gray-1">
            {formatDateString(createdAt)}
          </p>
        </div>
      </article>
    </>
  );
};

export default PostCard;
