"use client";

import React, { useEffect, useState } from "react";
import { useUserContext } from "@/context/UserContext";
import { fetchUser } from "@/helpers/fetchUser";
import Link from "next/link";
import Image from "next/image";
import { formatDateString } from "@/lib/utils";
import { ActivitySkeleton } from "../shared/Skeletons";
import { LoadingDots } from "../shared/LoadingDots";
import { useRouter } from "next/navigation";

interface Author {
  _id: string;
  name: string;
  image: string;
}

interface Activity {
  _id: string;
  author: Author;
  parentId: string;
  text: string;
  createdAt: string;
  isLike?: boolean;
}

const ActivityPage = () => {
  const router = useRouter();
  const { userData, setUserData } = useUserContext();
  const [activity, setActivity] = useState<Array<Activity>>([]);
  const [activityLoading, setActivityLoading] = useState(false);
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

  // fetch activity
  const fetchActivity = async () => {
    try {
      setActivityLoading(true);
      const response = await fetch(`/api/activity/${userData._id}`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch a user");
      }
      const responseData = await response.json();
      setActivity([...responseData.data]);
    } catch (error: any) {
      console.log("Error during loading activity", error);
      router.push("/error");
    } finally {
      setActivityLoading(false);
    }
  };
  useEffect(() => {
    if (userData._id) {
      fetchActivity();
    }
  }, [userData._id]);

  return (
    <section className="mt-10 flex flex-col gap-5">
      {userLoading && <LoadingDots />}

      {activityLoading && <ActivitySkeleton count={3} />}
      {!activityLoading && activity.length === 0 ? (
        <p className="!text-base-regular text-light-3 ">No activity yet</p>
      ) : (
        <>
          {!activityLoading && activity.length > 0 && (
            <p className="!text-base-regular text-light-3 mb-5">
              Click on the notification to view the post
            </p>
          )}
          {activity
            .sort((a, b) => {
              const dateA = new Date(a.createdAt);
              const dateB = new Date(b.createdAt);

              return dateB.getTime() - dateA.getTime();
            })
            .map((activity) => (
              <Link key={activity._id} href={`/post/${activity.parentId}`}>
                <article className="activity-card">
                  <div className="relative h-11 w-11">
                    <Image
                      src={activity.author.image}
                      alt="Profile picture"
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <p className="!text-small-regular text-light-1 ml-5">
                    <span className="mr-1 text-primary-500">
                      {activity.author.name}
                    </span>{" "}
                    {activity.isLike ? "liked" : "commented on"} your post at{" "}
                    {formatDateString(activity.createdAt)}
                  </p>
                </article>
              </Link>
            ))}
        </>
      )}
    </section>
  );
};

export default ActivityPage;
