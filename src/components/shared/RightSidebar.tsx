"use client";
import { useUserContext } from "@/context/UserContext";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SuggestedUsersSkeleton } from "./Skeletons";

interface User {
  _id: string;
  name: string;
  email: string;
  bio: string;
  image: string;
  onboarded: boolean;
  posts: string[];
}

function RightSidebar() {
  const router = useRouter();
  const { userData } = useUserContext();
  const [users, setUsers] = useState<Array<User>>([]);
  const [allUserLoading, setAllUserLoading] = useState(false);

  const fetchAllUsers = async () => {
    try {
      setAllUserLoading(true);
      const response = await fetch(
        `/api/all-users?userId=&${
          userData._id
        }&searchString=${""}&pageNumber=${1}&pageSize=${100}`,
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch a user");
      }
      const responseData = await response.json();
      setUsers([
        responseData.data.users[responseData.data.users.length - 1],
        responseData.data.users[responseData.data.users.length - 2],
        responseData.data.users[responseData.data.users.length - 3],
        responseData.data.users[responseData.data.users.length - 4],
      ]);
    } catch (error: any) {
      console.log("Error during fetching users", error);
      router.push("/error");
    } finally {
      setAllUserLoading(false);
    }
  };
  useEffect(() => {
    if (window.screen.width >= 1280) {
      fetchAllUsers();
    }
  }, []);
  return (
    <section className="custom-scrollbar rightsidebar">
      <div className="flex flex-1 flex-col flex-start">
        <h3 className="text-heading4-medium text-light-1 mb-5">
          Suggested Users
        </h3>
        {allUserLoading && <SuggestedUsersSkeleton count={4} />}
        {!allUserLoading &&
          users.length > 0 &&
          users.map((user) => (
            <div className="user-card_avatar" key={user?._id}>
              <Link
                href={`/profile/${user?._id}`}
                className="flex items-center"
              >
                <div className="relative h-8 w-8">
                  <Image
                    src={user?.image}
                    alt="logo"
                    fill
                    className="curson-pointer rounded-full"
                  />
                </div>
                <div className="flex-1 text-ellipsis">
                  <h4 className="!text-small-regular text-light-1 ml-3">
                    {user?.name}
                  </h4>
                </div>
              </Link>
            </div>
          ))}
      </div>
      <div className="flex flex-1 flex-col flex-start">
        <h3 className="text-heading4-medium text-light-1">Latest Chats</h3>
        <p className="!text-base-regular text-light-3 mt-3">No chats yet</p>
      </div>
    </section>
  );
}

export default RightSidebar;
