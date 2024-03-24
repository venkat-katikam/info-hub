"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Input } from "../ui/input";
import { useInView } from "react-intersection-observer";
import useDebounce from "@/helpers/useDebounce";
import { useRouter } from "next/navigation";
import { ChatUsersSkeleton } from "./Skeletons";
import { LoadingDots } from "./LoadingDots";

interface User {
  _id: string;
  name: string;
  email: string;
  bio: string;
  image: string;
  onboarded: boolean;
  posts: string[];
}

interface SelectedUser {
  id: string;
  name: string;
}

export function CreateGroupChatPopUp({
  currentUserId,
  setNewGrpCreated,
}: {
  currentUserId: string;
  setNewGrpCreated: any;
}) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<Array<User>>([]);
  const [isFetchedAllUsers, setIsFetchedAllUsers] = useState(false);
  const [allUserLoading, setAllUserLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [ref, inView] = useInView();
  const [fetchingUsers, setFetchingUsers] = useState(false); // this is to wait until the previous fetch users to complete
  const [selectedUsers, setSelectedUsers] = useState<Array<SelectedUser>>([]);
  const [grpChatName, setGrpChatName] = useState("");
  const [createGrpLoading, setCreateGrpLoading] = useState(false);
  const [grpNameError, setGrpNameError] = useState("");
  const [grpMembersError, setGrpMembersError] = useState("");
  const [open, setOpen] = useState(false);

  // Using the useDebounce hook for search input
  const debouncedSearch = useDebounce(search, 500);

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
          `/api/all-users?userId=&${currentUserId}&searchString=${searchString}&pageNumber=${pageNumber}&pageSize=5`,
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
    if (currentUserId && debouncedSearch === "") {
      fetchAllUsers("");
    }
  }, [currentUserId, inView, debouncedSearch]);

  useEffect(() => {
    // Perform search when debounced value changes
    if (currentUserId && debouncedSearch) {
      fetchAllUsers(debouncedSearch);
    }
  }, [debouncedSearch, inView]);

  const userSelected = (id: string, name: string) => {
    setGrpMembersError("");
    const isUserIdExists = selectedUsers.some((user) => user.id === id);

    // If userId doesn't exist, add the new user
    if (!isUserIdExists) {
      setSelectedUsers([...selectedUsers, { id, name }]);
    }
  };

  const userDeSelected = (id: string) => {
    setGrpMembersError("");
    const updatedUsers = selectedUsers.filter((user) => user.id !== id);
    setSelectedUsers(updatedUsers);
  };

  const createGroupChat = async () => {
    const userIds = selectedUsers.map((user) => user.id);

    if (grpChatName.length < 3 || userIds.length < 2) {
      setOpen(true);
      if (grpChatName.length < 3) {
        setGrpNameError("Group name should be more than 3 letters");
      }
      if (userIds.length < 2) {
        setGrpMembersError("Please select 2 or more members");
      }

      return;
    }

    try {
      setCreateGrpLoading(true);
      setOpen(false);
      const response = await fetch(`/api/chats/create-group`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          groupName: grpChatName,
          groupUsers: userIds,
          currentUser: currentUserId,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();

        setNewGrpCreated((prev: number) => prev + 1);
        router.push("/chats");
      } else {
        const responseData = await response.json();
        router.push("/error");
      }
    } catch (error: any) {
      console.log("Error during creating group chat", error);
      router.push("/error");
      setCreateGrpLoading(false);
    } finally {
      setGrpChatName("");
      setSelectedUsers([]);
      setCreateGrpLoading(false);
    }
  };

  return (
    <>
      {createGrpLoading && <LoadingDots />}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Create New Group +</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md w-5/6">
          <DialogHeader>
            <DialogTitle>Create New Chat Group</DialogTitle>
          </DialogHeader>
          <div className="flex gap-1 rounded-lg bg-grey px-2 py-1 border-primary-500 border-2">
            <Input
              id="text"
              value={grpChatName}
              onChange={(e) => {
                setGrpChatName(e.target.value);
                setGrpNameError("");
              }}
              placeholder={"Group chat name ..."}
              className="no-focus  border-none bg-grey text-base-regular text-dark outline-none !important"
            />
          </div>
          {grpNameError && (
            <DialogDescription className="text-red-500">
              {grpNameError}
            </DialogDescription>
          )}

          <div className="flex gap-1 rounded-lg bg-grey px-2 py-1 border-primary-500 border-2">
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
              className="no-focus  border-none bg-grey text-base-regular text-dark outline-none !important"
            />
          </div>
          <div
            className="flex flex-wrap"
            style={{ maxHeight: "75px", overflowY: "auto" }}
          >
            {selectedUsers.map((user: { id: string; name: string }) => (
              <div className="flex border-2 m-1 p-1 rounded" key={user.id}>
                <p className="text-primary-500">{user.name}</p>
                <Image
                  src="/assets/delete.svg"
                  alt="delete"
                  width={18}
                  height={18}
                  className="cursor-pointer object-contain ml-1"
                  onClick={() => userDeSelected(user.id)}
                />
              </div>
            ))}
          </div>
          {grpMembersError && (
            <DialogDescription className="text-red-500">
              {grpMembersError}
            </DialogDescription>
          )}
          <div
            className="mt-5 flex flex-col gap-3"
            style={{ maxHeight: "200px", overflowY: "auto" }}
          >
            {allUserLoading && <ChatUsersSkeleton count={2} />}
            {!allUserLoading && users.length === 0 ? (
              <p className="no-result">No Result</p>
            ) : (
              <>
                {users.map((person) => (
                  <div
                    key={person._id}
                    className=" border-2 p-1 flex items-center cursor-pointer rounded"
                    onClick={() => userSelected(person._id, person.name)}
                  >
                    <div className="relative h-6 w-6">
                      <Image
                        src={
                          person.image
                            ? person.image
                            : "/assets/default-profile.jpg"
                        }
                        alt="logo"
                        fill
                        className="curson-pointer rounded-full"
                      />
                    </div>{" "}
                    <h4 className="ml-2 cursor-pointer text-base-semibold text-primary-500 max-md:w-[160px] max-md:truncate">
                      {person.name}
                    </h4>
                  </div>
                ))}
                {users.length > 0 && !isFetchedAllUsers && (
                  <ChatUsersSkeleton count={1} myRef={ref} />
                )}
              </>
            )}
          </div>

          {/* <DialogClose asChild> */}
          <Button
            type="button"
            variant="secondary"
            className="bg-primary-500 text-white m-3 hover:bg-primary-500"
            onClick={createGroupChat}
          >
            Create Group
          </Button>
          {/* </DialogClose> */}
        </DialogContent>
      </Dialog>
    </>
  );
}
