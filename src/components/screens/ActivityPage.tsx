"use client";

import React, { useEffect, useState } from "react";
import { useUserContext } from "@/context/UserContext";
import { fetchUser } from "@/helpers/fetchUser";
import Link from "next/link";
import Image from "next/image";

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
  createdAt: Date;
}

const ActivityPage = () => {
  const { userData, setUserData } = useUserContext();
  const [activity, setActivity] = useState<Array<Activity>>([]);

  useEffect(() => {
    if (!userData._id) {
      fetchUser(setUserData);
    }
  }, []);

  // fetch activity
  const fetchActivity = async () => {
    try {
      const response = await fetch(`/api/activity/${userData._id}`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch a user");
      }
      const responseData = await response.json();
      setActivity([...responseData.data]);
    } catch (error: any) {
      return { errorMessage: "Some error in fetching a user", error };
    }
  };
  useEffect(() => {
    if (userData._id) {
      fetchActivity();
    }
  }, [userData._id]);

  return (
    <section className="mt-10 flex flex-col gap-5">
      {activity.length > 0 ? (
        <>
          {activity.map((activity) => (
            <Link key={activity._id} href={`/post/${activity.parentId}`}>
              <article className="activity-card">
                <Image
                  src={activity.author.image}
                  alt="Profile picture"
                  width={20}
                  height={20}
                  className="rounded-full object-cover"
                />
                <p className="!text-small-regular text-light-1 ml-5">
                  <span className="mr-1 text-primary-500">
                    {activity.author.name}
                  </span>{" "}
                  replied to your post on{" "}
                  {new Date(activity.createdAt).toLocaleString(undefined, {
                    timeZone: "UTC",
                  })}
                </p>
              </article>
            </Link>
          ))}
        </>
      ) : (
        <p className="!text-base-regular text-light-3 ">No activity yet</p>
      )}
    </section>
  );
};

export default ActivityPage;
