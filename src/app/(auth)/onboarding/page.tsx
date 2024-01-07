"use client";
import AccountProfile from "@/components/forms/AccountProfile";
import { useEffect, useState } from "react";

export default function Page() {
  const [userInfo, setUserInfo] = useState({});
  const fetchUser = async () => {
    try {
      const response = await fetch(`/api/user`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch a user");
      }
      const responseData = await response.json();
      setUserInfo(responseData?.data);
    } catch (error) {
      console.log("Some error in fetching a user", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const userData = {
    id: userInfo?._id,
    email: userInfo?.email,
    name: userInfo?.name,
    bio: userInfo?.bio,
    image: userInfo.image,
  };
  return (
    <main className="mx-auto flex max-w-3xl flex-col justify-start px-10 py-20">
      <h1 className="head-text">Onboarding</h1>
      <p className="mt-3 text-base-regular text-light-2">
        You are just few steps away from using InfoHub app &#129395;
        <br />
        Please fill the below details to start
      </p>
      <section className="mt-9 bg-dark-2 p-10">
        {userData?.id && <AccountProfile user={userData} btnTitle="Continue" />}
      </section>
    </main>
  );
}
