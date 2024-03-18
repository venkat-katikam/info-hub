"use client";

import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useUserContext } from "@/context/UserContext";
import { fetchUser } from "@/helpers/fetchUser";
import UserCard from "../cards/UserCard";
import Image from "next/image";
import { Input } from "../ui/input";
import { SearchUserSkeleton } from "../shared/Skeletons";
import { LoadingDots } from "../shared/LoadingDots";
import { useRouter } from "next/navigation";
import useDebounce from "@/helpers/useDebounce";

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
  const [isFetchedAllUsers, setIsFetchedAllUsers] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [ref, inView] = useInView();
  const [fetchingUsers, setFetchingUsers] = useState(false); // this is to wait until the previous fetch users to complete

  // Using the useDebounce hook for search input
  const debouncedSearch = useDebounce(search, 500);

  if (redirectToError) {
    router.push("/error");
  }

  useEffect(() => {
    if (!userData._id) {
      fetchUser(setUserData, setUserLoading, setRedirectToError);
    }
  }, []);

  // fetch all users
  const fetchAllUsers = async (searchString: string) => {
    const fetchedUsers = pageNumber === 1 ? [] : users;
    if (
      fetchedUsers.length === 0 ||
      ((inView || debouncedSearch) && !fetchingUsers && !isFetchedAllUsers)
    ) {
      setFetchingUsers(true); // this is to wait until the previous fetch users to complete

      try {
        if (pageNumber === 1) {
          setAllUserLoading(true);
        }

        const response = await fetch(
          `/api/all-users?userId=&${userData._id}&searchString=${searchString}&pageNumber=${pageNumber}&pageSize=5`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch a user");
        }
        const responseData = await response.json();
        setUsers([...fetchedUsers, ...responseData.data.users]);
        if (responseData.data.users.length < 5) {
          setIsFetchedAllUsers(true);
        }
      } catch (error: any) {
        console.log("Error during fetching users", error);
        router.push("/error");
      } finally {
        setFetchingUsers(false); // this is to wait until the previous fetch users to complete
        setAllUserLoading(false);
      }
      setPageNumber((prevState) => prevState + 1);
    }
  };

  useEffect(() => {
    if (userData._id && debouncedSearch === "") {
      fetchAllUsers("");
    }
  }, [userData._id, inView, debouncedSearch]);

  useEffect(() => {
    // Perform search when debounced value changes
    if (userData._id && debouncedSearch) {
      fetchAllUsers(debouncedSearch);
    }
  }, [debouncedSearch, inView]);

  return (
    <section>
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
          onChange={(e) => {
            setUsers([]);
            setIsFetchedAllUsers(false);
            setSearch(e.target.value);
            setPageNumber(1);
          }}
          placeholder={"Search the user name here ..."}
          className="no-focus searchbar_input"
        />
      </div>
      <div className="mt-14 flex flex-col gap-9">
        {allUserLoading && <SearchUserSkeleton count={5} />}
        {!allUserLoading && users.length === 0 ? (
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
            {users.length > 0 && !isFetchedAllUsers && (
              <SearchUserSkeleton count={1} myRef={ref} />
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default SearchPage;
