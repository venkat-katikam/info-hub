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
import { MessagesSkeleton } from "../shared/Skeletons";
import Link from "next/link";
import io from "socket.io-client";

const ENDPOINT = "https://info-hub-peach.vercel.app";
let socket: any, selectedChatCompare: IndividualChat;

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
  const [fetchChatAgain, setFetchChatAgain] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  if (redirectToError) {
    router.push("/error");
  }

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", userData);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

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
        socket.emit("join chat", chatId);
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
    }
  }, [userData._id, chatId, fetchChatAgain]);

  useEffect(() => {
    if (userData._id && chatId) {
      fetchMessages();
      selectedChatCompare = chat;
    }
  }, [userData._id, chatId, chat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved: Message) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        // if (!chatData.notification.includes(newMessageRecieved)) {
        //   setChatData({
        //     notification: [newMessageRecieved, ...chatData.notification],
        //   });
        //   setFetchChatAgain(!fetchChatAgain);
        // }
      } else {
        setAllMessages([...allMessages, newMessageRecieved]);
      }
    });
  });

  const sendMessage = async () => {
    // if(message && e.key==="Enter")
    if (message === "") {
      return;
    }
    socket.emit("stop typing", chat._id);
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
        socket.emit("new message", responseData?.data);
        setAllMessages([...allMessages, responseData?.data]);
      } else {
        const responseData = await response.json();
        router.push("/error");
        setSendMessageLoading(false);
      }
    } catch (error: any) {
      console.log("Error during sending message", error);
      router.push("/error");
      setSendMessageLoading(false);
    } finally {
      setSendMessageLoading(false);
    }
  };

  const getChatName = () => {
    if (!chat.isGroupChat) {
      const user = chat?.users?.filter((user) => user._id !== userData._id);
      return user[0]?.name;
    } else {
      return chat?.chatName;
    }
  };

  const getChatDp = () => {
    if (!chat.isGroupChat) {
      const user = chat?.users?.filter((user) => user._id !== userData._id);
      return user[0]?.image;
    } else {
      return "/assets/group-chat-dp.JPG";
    }
  };

  const getChatUserId = () => {
    if (!chat.isGroupChat) {
      const user = chat?.users?.filter((user) => user._id !== userData._id);
      return user[0]?._id;
    } else {
      return "";
    }
  };

  const typingHandler = (e: any) => {
    setMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", chat._id);
    }
    let lastTypingTime = new Date().getTime();
    let timerLength = 3000;
    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", chat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <>
      {(userLoading || chatLoading) && <LoadingDots />}
      {messagesLoading && <MessagesSkeleton count={1} />}

      <div className="relative">
        <div className="flex items-center fixed bg-dark-1 w-full top-[54px] py-3">
          <Image
            src="/assets/back.svg"
            alt="back"
            width={40}
            height={40}
            className="cursor-pointer object-contain ml-1"
            onClick={() => router.push("/chats")}
          />
          <Link
            href={`/profile/${getChatUserId()}`}
            className="flex items-center"
          >
            <div className="relative h-11 w-11 ml-2 cursor-pointer">
              {getChatDp() && (
                <Image
                  src={getChatDp()}
                  alt="Profile picture"
                  fill
                  className="rounded-full object-cover"
                />
              )}
            </div>
          </Link>
          <h4 className="text-white text-heading4-medium ml-3 max-md:w-[160px] max-md:truncate">
            {getChatName()}
          </h4>
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
          {isTyping ? (
            <div className="flex space-x-2 items-center mt-6 bg-dark-4 rounded-3xl px-4 py-3 w-fit">
              <div
                className={`h-3 w-3 bg-white rounded-full animate-bounce [animation-delay:-0.3s]`}
              ></div>
              <div
                className={`h-3 w-3 bg-white rounded-full animate-bounce [animation-delay:-0.15s]`}
              ></div>
              <div
                className={`h-3 w-3 bg-white rounded-full animate-bounce`}
              ></div>
            </div>
          ) : (
            <></>
          )}
        </div>

        <div className="flex items-center fixed md:bottom-0 md:w-[80%] lg:w-[75%] xl:w-[64%] bg-dark-1  py-3 w-11/12 bottom-[90px] mr-2">
          <Input
            type="text"
            placeholder="Type message here ..."
            className="no-focus text-light-1 outline-none bg-dark-2"
            value={message}
            onChange={typingHandler}
          />
          {!sendMessageLoading ? (
            <Button className="ml-2 p-2" onClick={sendMessage}>
              <Image
                src="/assets/share.svg"
                alt="send"
                width={40}
                height={40}
                className="cursor-pointer object-contain rotate-45"
              />
            </Button>
          ) : (
            <Button className="ml-2 p-2">
              <svg
                aria-hidden="true"
                className="inline w-7 h-7 text-gray-200 animate-spin dark:text-gray-600 fill-purple-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
