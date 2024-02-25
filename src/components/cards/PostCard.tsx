import { formatDateString } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

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
}: Props) => {
  return (
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
          <div className="flex w-full flex-1 flex-grow justify-between">
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
                    src="/assets/heart-gray.svg"
                    alt="heart"
                    width={24}
                    height={24}
                    className="cursor-pointer object-contain"
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
                  <Image
                    src="/assets/repost.svg"
                    alt="repost"
                    width={24}
                    height={24}
                    className="cursor-pointer object-contain"
                  />
                  <Image
                    src="/assets/share.svg"
                    alt="share"
                    width={24}
                    height={24}
                    className="cursor-pointer object-contain"
                  />
                </div>

                <Link href={`/post/${id}`}>
                  <p className="text-subtle-medium text-gray-1">
                    {comments.length} likes & {comments.length} replies
                  </p>
                </Link>
              </div>
            </div>
            <div>
              {accountId === currentUserId && (
                <Image
                  src="/assets/delete.svg"
                  alt="delete"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                />
              )}
            </div>
          </div>
        </div>
        {/* TODO: Delete post */}
        {/* TODO: Show comment logos */}
      </div>
      <div className="mt-5 flex items-center">
        <p className="text-subtle-medium text-gray-1">
          {formatDateString(createdAt)}
        </p>
      </div>
    </article>
  );
};

export default PostCard;
