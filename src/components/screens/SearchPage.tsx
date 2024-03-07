"use client";

import React, { useEffect, useState } from "react";
import { useUserContext } from "@/context/UserContext";
import { fetchUser } from "@/helpers/fetchUser";
import UserCard from "../cards/UserCard";
import Image from "next/image";
import { Input } from "../ui/input";
import { SearchUserSkeleton } from "../shared/Skeletons";
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

const SearchPage = () => {
  const router = useRouter();
  const { userData, setUserData } = useUserContext();
  const [users, setUsers] = useState<Array<User>>([]);
  const [search, setSearch] = useState("");
  const [userLoading, setUserLoading] = useState(false);
  const [allUserLoading, setAllUserLoading] = useState(false);
  const [redirectToError, setRedirectToError] = useState(false);

  if (redirectToError) {
    router.push("/error");
  }

  useEffect(() => {
    if (!userData._id) {
      fetchUser(setUserData, setUserLoading, setRedirectToError);
    }
  }, []);

  // fetch all users
  const fetchAllUsers = async () => {
    try {
      setAllUserLoading(true);
      const response = await fetch(
        `/api/all-users?userId=&${
          userData._id
        }&searchString=${""}&pageNumber=${1}&pageSize=${25}`,
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch a user");
      }
      const responseData = await response.json();
      setUsers([...responseData.data.users]);
    } catch (error: any) {
      console.log("Error during fetching users", error);
      router.push("/error");
    } finally {
      setAllUserLoading(false);
    }
  };
  useEffect(() => {
    fetchAllUsers();
  }, []);

  return (
    <section>
      <h1>Search page</h1>
      {userLoading && <LoadingDots />}
      <div className="searchbar">
        <Image
          src="/assets/search-gray.svg"
          alt="search"
          width={24}
          height={24}
          className="object-contain"
        />
        <Input
          id="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={"Search the user name here ..."}
          className="no-focus searchbar_input"
        />
      </div>
      <div className="mt-14 flex flex-col gap-9">
        {allUserLoading && <SearchUserSkeleton count={10} />}
        {!allUserLoading && users.length === 0 ? (
          <p className="no-result">No Result</p>
        ) : (
          <>
            {users
              .filter((filteredUser) =>
                filteredUser.name.toLowerCase().includes(search.toLowerCase())
              )
              .map((person) => (
                <UserCard
                  key={person._id}
                  id={person._id}
                  name={person.name}
                  email={person.email}
                  image={person.image}
                  personType="User"
                />
              ))}
          </>
        )}
      </div>
    </section>
  );
};

export default SearchPage;
