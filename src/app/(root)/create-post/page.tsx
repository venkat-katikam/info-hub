"use client";
import CreatePost from "@/components/forms/CreatePost";
import { getDataFromToken } from "@/helpers/getUserFromToken";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

function Page() {
  const [user, setUser] = useState({});

  const fetchUser = async () => {
    try {
      const response = await fetch(`/api/user`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch a user");
      }
      const responseData = await response.json();
      setUser(responseData?.data);
    } catch (error) {
      console.log("Some error in fetching a user", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // if (!user) return <h1>loading</h1>;

  return (
    <>
      <h1 className="head-text">Create Post</h1>

      {user?._id && <CreatePost userId={user?._id} />}
    </>
  );
}

export default Page;
