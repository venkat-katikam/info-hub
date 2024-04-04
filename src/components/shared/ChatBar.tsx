import Image from "next/image";
import Link from "next/link";
import React from "react";

interface ChatUser {
  _id: string;
  name: string;
  email: string;
  image: string;
}

interface Chat {
  _id: string;
  chatName: string;
  isGroupChat: boolean;
  users: ChatUser[];
  groupAdmin: ChatUser;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export default function ChatBar({
  chat,
  currentUserId,
}: {
  chat: Chat;
  currentUserId: string;
}) {
  const updatedChatUsers = chat?.users.filter(
    (user) => user._id !== currentUserId
  );

  return (
    <>
      <Link key={chat._id} href={`/chat/${chat._id}`}>
        <article className="chat-card my-2">
          <div className="relative h-11 w-11">
            <Image
              src={
                updatedChatUsers.length === 1
                  ? updatedChatUsers[0].image
                  : "/assets/group-chat-dp.JPG"
              }
              alt="Profile picture"
              fill
              className="rounded-full object-cover"
            />
          </div>

          <h4 className="ml-2 cursor-pointer text-base-semibold text-light-1 max-md:w-[160px] max-md:truncate">
            {chat?.isGroupChat ? chat?.chatName : updatedChatUsers[0].name}
          </h4>
        </article>
      </Link>
    </>
  );
}
