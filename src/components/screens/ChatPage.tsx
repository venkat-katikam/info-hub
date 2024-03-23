"use client";

import React, { useEffect, useState } from "react";
import { useUserContext } from "@/context/UserContext";
import { fetchUser } from "@/helpers/fetchUser";
import { LoadingDots } from "../shared/LoadingDots";
import { useRouter } from "next/navigation";
import ChatBar from "../shared/ChatBar";
import { ActivitySkeleton } from "../shared/Skeletons";
import { CreateGroupChatPopUp } from "../shared/CreateGroupChatPopUp";

interface User {
  _id: string;
  name: string;
  email: string;
  bio: string;
  image: string;
  onboarded: boolean;
  posts: string[];
}

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

const ChatPage = () => {
  const router = useRouter();
  const { userData, setUserData } = useUserContext();
  const [userLoading, setUserLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [redirectToError, setRedirectToError] = useState(false);
  const [chats, setChats] = useState([]);
  const [newGrpCreated, setNewGrpCreated] = useState(0);

  if (redirectToError) {
    router.push("/error");
  }

  useEffect(() => {
    if (!userData._id) {
      fetchUser(setUserData, setUserLoading, setRedirectToError);
    }
  }, []);

  const fetchChats = async () => {
    try {
      setChatLoading(true);

      const response = await fetch(`/api/chats/${userData._id}`);

      if (response.ok) {
        const responseData = await response.json();
        console.log("responseData", responseData);
        setChats(responseData.chats);
      } else {
        router.push("/error");
        throw new Error("Failed to fetch chats");
      }
    } catch (error: any) {
      setRedirectToError(true);
      console.log("Some error in fetching a chats", error);
    } finally {
      setChatLoading(false);
    }
  };

  useEffect(() => {
    if (userData._id) {
      fetchChats();
    }
  }, [userData._id, newGrpCreated]);

  const renameGroupChat = async () => {
    try {
      const response = await fetch(`/api/chats/group-rename`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatId: "65fc11a9f5a8775cf42a7997",
          chatName: "Bye123",
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("responseData", responseData);
        // setPostsData([]);
        // router.push("/home");
      } else {
        const responseData = await response.json();
        router.push("/error");
        // setCreatePostLoading(false);
      }
    } catch (error: any) {
      console.log("Error during updating group chat", error);
      router.push("/error");
      // setCreatePostLoading(false);
    }
  };

  const addUserToGroup = async () => {
    try {
      const response = await fetch(`/api/chats/group-add-user`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatId: "65fc11a9f5a8775cf42a7997",
          userId: "65f05e60fae6d75c6f9b68be",
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("responseData", responseData);
        // setPostsData([]);
        // router.push("/home");
      } else {
        const responseData = await response.json();
        router.push("/error");
        // setCreatePostLoading(false);
      }
    } catch (error: any) {
      console.log("Error during updating group chat", error);
      router.push("/error");
      // setCreatePostLoading(false);
    }
  };

  const removeUserFromGroup = async () => {
    try {
      const response = await fetch(`/api/chats/group-remove-user`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatId: "65fc11a9f5a8775cf42a7997",
          userId: "65f05e60fae6d75c6f9b68be",
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("responseData", responseData);
        // setPostsData([]);
        // router.push("/home");
      } else {
        const responseData = await response.json();
        router.push("/error");
        // setCreatePostLoading(false);
      }
    } catch (error: any) {
      console.log("Error during updating group chat", error);
      router.push("/error");
      // setCreatePostLoading(false);
    }
  };

  return (
    <section>
      {userLoading && <LoadingDots />}
      {!chatLoading && (
        <div className="flex justify-end mb-3">
          <CreateGroupChatPopUp
            currentUserId={userData._id}
            setNewGrpCreated={setNewGrpCreated}
          />
        </div>
      )}
      {chatLoading && <ActivitySkeleton count={5} isChat={true} />}

      {!chatLoading && chats.length === 0 && (
        <p className="!text-base-regular text-light-3">No Chats Yet</p>
      )}
      <div>
        {chats.map((chat: Chat) => (
          <ChatBar chat={chat} key={chat._id} currentUserId={userData._id} />
        ))}
      </div>

      <br />
      <button
        className="text-white bg-gray-700 mt-10"
        onClick={renameGroupChat}
      >
        Rename Group Chat
      </button>
      <br />
      <button className="text-white bg-gray-700 mt-10" onClick={addUserToGroup}>
        Add user to Group Chat
      </button>
      <br />
      <button
        className="text-white bg-gray-700 mt-10"
        onClick={removeUserFromGroup}
      >
        Remove user from Group Chat
      </button>
    </section>
  );
};

export default ChatPage;
