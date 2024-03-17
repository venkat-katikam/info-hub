"use client";

import React, { useEffect, useState } from "react";
import { useUserContext } from "@/context/UserContext";
import { fetchUser } from "@/helpers/fetchUser";
import { LoadingDots } from "../shared/LoadingDots";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function ErrorPage() {
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
    <div className="fixed top-0 left-0 bg-dark-1 bg-opacity-90 z-10 h-full w-full flex items-center justify-center">
      {userLoading && <LoadingDots />}
      <div className="flex flex-col space-x-2 justify-center items-center">
        <div className="text-white text-heading1-bold">Oops! &#x1F613;</div>
        <div className="text-white">Something went wrong</div>
        <Link href="/home" className="mt-5">
          <p className="bg-primary-500 text-white p-2 rounded-md">
            Go to home page
          </p>
        </Link>
      </div>
    </div>
  );
}
