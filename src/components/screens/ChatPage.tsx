"use client";

import React, { useEffect, useState } from "react";
import { useUserContext } from "@/context/UserContext";
import { fetchUser } from "@/helpers/fetchUser";
import { LoadingDots } from "../shared/LoadingDots";
import { useRouter } from "next/navigation";

interface User {
  _id: string;
  name: string;
  email: string;
  bio: string;
  image: string;
  onboarded: boolean;
  posts: string[];
}

const ChatPage = () => {
  const router = useRouter();
  const { userData, setUserData } = useUserContext();
  const [userLoading, setUserLoading] = useState(false);
  const [redirectToError, setRedirectToError] = useState(false);

  if (redirectToError) {
    router.push("/error");
  }

  useEffect(() => {
    if (!userData._id) {
      fetchUser(setUserData, setUserLoading, setRedirectToError);
    }
  }, []);

  return (
    <section>
      {userLoading && <LoadingDots />}
      <p className="!text-base-regular text-light-3">No chats yet</p>
    </section>
  );
};

export default ChatPage;
