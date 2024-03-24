"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { fetchUser } from "@/helpers/fetchUser";
import { useUserContext } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { LoadingDots } from "../shared/LoadingDots";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "@/helpers/ChatHelper";

interface Sender {
  _id: string;
  name: string;
  email: string;
  image: string;
}

interface Chat {
  _id: string;
  chatName: string;
  isGroupChat: boolean;
  users: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  latestMessage: string;
}

interface IndividualChat {
  _id: string;
  chatName: string;
  isGroupChat: boolean;
  users: Sender[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  latestMessage: string;
  groupAdmin: Sender;
}

interface Message {
  _id: string;
  sender: Sender;
  content: string;
  chat: Chat;
  readBy: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export default function IndividualChatPage({ chatId }: { chatId: string }) {
  const router = useRouter();
  const { userData, setUserData } = useUserContext();
  const [userLoading, setUserLoading] = useState(false);
  const [redirectToError, setRedirectToError] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<IndividualChat>({
    _id: "",
    chatName: "",
    isGroupChat: false,
    users: [],
    createdAt: "",
    updatedAt: "",
    latestMessage: "",
    groupAdmin: {
      _id: "",
      name: "",
      email: "",
      image: "",
    },
    __v: 0,
  });
  const [allMessages, setAllMessages] = useState<Array<Message>>([]);
  const [sendMessageLoading, setSendMessageLoading] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);

  if (redirectToError) {
    router.push("/error");
  }

  useEffect(() => {
    if (!userData._id) {
      fetchUser(setUserData, setUserLoading, setRedirectToError);
    }
  }, []);

  const fetchMessages = async () => {
    try {
      setMessagesLoading(true);

      const response = await fetch(`/api/messages/${chatId}`);

      if (response.ok) {
        const responseData = await response.json();
        console.log("responseData", responseData);
        setAllMessages(responseData.data);
      } else {
        router.push("/error");
        throw new Error("Failed to fetch messages");
      }
    } catch (error: any) {
      setRedirectToError(true);
      console.log("Some error in fetching messags", error);
    } finally {
      setMessagesLoading(false);
    }
  };

  const fetchChat = async () => {
    try {
      setChatLoading(true);

      const response = await fetch(`/api/chat/${chatId}`);

      if (response.ok) {
        const responseData = await response.json();
        console.log("responseData", responseData);
        setChat(responseData.chat);
      } else {
        router.push("/error");
        throw new Error("Failed to fetch chat");
      }
    } catch (error: any) {
      setRedirectToError(true);
      console.log("Some error in fetching chat", error);
    } finally {
      setChatLoading(false);
    }
  };

  useEffect(() => {
    if (userData._id && chatId) {
      fetchChat();
      fetchMessages();
    }
  }, [userData._id, chatId]);

  const sendMessage = async () => {
    if (message === "") {
      return;
    }
    try {
      setSendMessageLoading(true);
      setMessage("");

      const response = await fetch(`/api/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: message,
          chatId: chatId,
          userId: userData._id,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
      } else {
        const responseData = await response.json();
        router.push("/error");
        setSendMessageLoading(false);
      }
    } catch (error: any) {
      console.log("Error during sending message", error);
      router.push("/error");
      setSendMessageLoading(false);
    }
  };

  return (
    <>
      {(userLoading || chatLoading) && <LoadingDots />}
      <div className="relative">
        <div className="flex items-center fixed bg-dark-1 w-full top-[54px] py-3">
          <Image
            src="/assets/back.svg"
            alt="delete"
            width={40}
            height={40}
            className="cursor-pointer object-contain ml-1"
            onClick={() => router.back()}
          />
          <div className="relative h-11 w-11 ml-2 cursor-pointer">
            <Image
              src="/assets/default-profile.jpg"
              alt="Profile picture"
              fill
              className="rounded-full object-cover"
            />
          </div>
          <p className="text-white text-heading4-medium ml-3">
            {chat?.chatName}
          </p>
        </div>
        <div className="mt-12 mb-10">
          {allMessages &&
            allMessages.map((m, i) => (
              <div className="flex items-center" key={m._id}>
                {chat.isGroupChat &&
                  (isSameSender(allMessages, m, i, userData._id) ||
                    isLastMessage(allMessages, i, userData._id)) && (
                    <div className="relative h-9 w-9 ml-2 mr-[10px] cursor-pointer mt-2">
                      <Image
                        src={m.sender.image}
                        alt="Profile picture"
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                  )}
                <span
                  className={`${
                    m.sender._id === userData._id
                      ? "bg-primary-500"
                      : "bg-dark-4"
                  } ${isSameSenderMargin(
                    allMessages,
                    m,
                    i,
                    userData._id,
                    chat.isGroupChat
                  )} ${
                    isSameUser(allMessages, m, i) ? "mt-2" : "mt-4"
                  } rounded-3xl px-4 py-2 max-w-[75%] text-white`}
                >
                  {m.content}
                </span>
              </div>
            ))}
        </div>
        <div className="flex items-center fixed bg-dark-1 bottom-0 py-3 ">
          <Input
            type="text"
            placeholder="Type message here ..."
            className="no-focus text-light-1 outline-none bg-dark-2"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
          />
          <Button className="ml-2" onClick={sendMessage}>
            Send
          </Button>
        </div>
      </div>
    </>
  );
}
