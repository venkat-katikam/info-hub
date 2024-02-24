"use client";

import React, { useEffect, useState } from "react";
import ProfileHeader from "../shared/ProfileHeader";
import { useUserContext } from "@/context/UserContext";
import { fetchUser } from "@/helpers/fetchUser";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { profileTabs } from "@/constants";
import Image from "next/image";
import PostsTab from "../shared/PostsTab";

interface User {
  _id: string;
  name: string;
  email: string;
  bio: string;
  image: string;
  onboarded: boolean;
  posts: string[];
  // communities: responseData?.data?.communities,
}

const ProfilePage = ({ userId }: { userId: string }) => {
  const { userData, setUserData } = useUserContext();
  const [accountUser, setAccountUser] = useState<User>({
    _id: "",
    name: "",
    email: "",
    bio: "",
    image: "",
    onboarded: false,
    posts: [],
  });

  useEffect(() => {
    if (!userData._id) {
      fetchUser(setUserData);
    }
  }, []);

  const fetchUserById = async (userId: string) => {
    try {
      const response = await fetch(`/api/user/${userId}`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch a user");
      }
      const responseData = await response.json();
      setAccountUser({
        _id: responseData?.data?._id,
        name: responseData?.data?.name,
        email: responseData?.data?.email,
        bio: responseData?.data?.bio,
        image: responseData?.data?.image,
        onboarded: responseData?.data?.onboarded,
        posts: responseData?.data?.posts,
        // communities: responseData?.data?.communities,
      });
      return responseData?.data;
    } catch (error: any) {
      return { errorMessage: "Some error in fetching a user", error };
    }
  };
  useEffect(() => {
    if (userId) {
      fetchUserById(userId);
    }
  }, [userId]);
  return (
    <section>
      <ProfileHeader
        accountId={accountUser._id}
        authUserId={userData._id}
        name={accountUser.name}
        email={accountUser.email}
        image={accountUser.image}
        bio={accountUser.bio}
      />
      <div className="mt-9">
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="tab">
            {profileTabs.map((tab) => (
              <TabsTrigger key={tab.label} value={tab.value} className="tab">
                <Image
                  src={tab.icon}
                  alt={tab.label}
                  width={24}
                  height={24}
                  className="object-contain"
                />
                <p className="max-sm:hidden">{tab.label}</p>

                {tab.label === "Posts" && (
                  <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                    {accountUser?.posts?.length}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          {profileTabs.map((tab) => (
            <TabsContent
              key={`content-${tab.label}`}
              value={tab.value}
              className="w-full text-light-1"
            >
              <PostsTab
                currentUserId={userData._id}
                accountId={accountUser._id}
                accountType="User"
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default ProfilePage;
