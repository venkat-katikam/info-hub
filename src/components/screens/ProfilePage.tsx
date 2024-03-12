"use client";

import React, { useEffect, useState } from "react";
import ProfileHeader from "../shared/ProfileHeader";
import { useUserContext } from "@/context/UserContext";
import { fetchUser } from "@/helpers/fetchUser";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { profileTabs } from "@/constants";
import Image from "next/image";
import PostsTab from "../shared/PostsTab";
import { ProfileSkeleton } from "../shared/Skeletons";
import { LoadingDots } from "../shared/LoadingDots";
import { useRouter, useSearchParams } from "next/navigation";

interface User {
  _id: string;
  name: string;
  email: string;
  bio: string;
  image: string;
  onboarded: boolean;
  posts: string[];
}

const ProfilePage = ({ userId }: { userId: string }) => {
  const router = useRouter();
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

  const [accountUserLoading, setAccountUserLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(false);
  const [redirectToError, setRedirectToError] = useState(false);
  const [userPostsLength, setUserPostsLength] = useState(0);

  const searchParams = useSearchParams();
  const postsDeleted = searchParams.get("postsDeleted");

  if (redirectToError) {
    router.push("/error");
  }

  useEffect(() => {
    // commented to fetching user again after creating a post, to fetch latest latest posts array
    // if (!userData._id) {
    fetchUser(setUserData, setUserLoading, setRedirectToError);
    // }
  }, []);

  const fetchUserById = async (userId: string) => {
    try {
      setAccountUserLoading(true);
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
      });
      return responseData?.data;
    } catch (error: any) {
      console.log("Error during fetching user", error);
      router.push("/error");
    } finally {
      setAccountUserLoading(false);
    }
  };
  useEffect(() => {
    if (userId) {
      fetchUserById(userId);
    }
  }, [userId, postsDeleted]);
  return (
    <section>
      {userLoading && (
        <div className="mb-5">
          <LoadingDots />
        </div>
      )}
      {accountUserLoading ? (
        <ProfileSkeleton />
      ) : (
        <ProfileHeader
          accountId={accountUser._id}
          authUserId={userData._id}
          name={accountUser.name}
          email={accountUser.email}
          image={accountUser.image}
          bio={accountUser.bio}
        />
      )}
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
                    {userPostsLength}
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
                setUserPostsLength={setUserPostsLength}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default ProfilePage;
