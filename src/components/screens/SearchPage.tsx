"use client";

import React, { useEffect, useState } from "react";
import { useUserContext } from "@/context/UserContext";
import { fetchUser } from "@/helpers/fetchUser";
import UserCard from "../cards/UserCard";

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

const SearchPage = () => {
  const { userData, setUserData } = useUserContext();
  const [users, setUsers] = useState<Array<User>>([]);

  useEffect(() => {
    if (!userData._id) {
      fetchUser(setUserData);
    }
  }, []);

  // fetch all users
  const fetchAllUsers = async () => {
    try {
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
      return { errorMessage: "Some error in fetching a user", error };
    }
  };
  useEffect(() => {
    fetchAllUsers();
  }, []);

  return (
    <section>
      <h1>Search page</h1>
      <div className="mt-14 flex flex-col gap-9">
        {users.length === 0 ? (
          <p className="no-result">No Result</p>
        ) : (
          <>
            {users.map((person) => (
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
