"use client";
import Image from "next/image";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { LoadingDots } from "../shared/LoadingDots";

interface Props {
  id: string;
  name: string;
  email: string;
  image: string;
  personType: string;
  currentUserId: string;
}

const UserCard = ({
  id,
  name,
  email,
  image,
  personType,
  currentUserId,
}: Props) => {
  const router = useRouter();
  const [createChatLoding, setCreateChatLoading] = useState(false);

  const createChat = async (chatUserId: string) => {
    try {
      setCreateChatLoading(true);
      const response = await fetch(`/api/chats/${currentUserId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatUserId: chatUserId,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("responseData", responseData);
        router.push(`/chats/${chatUserId}`);
      } else {
        const responseData = await response.json();
        router.push("/error");
      }
    } catch (error: any) {
      console.log("Error during creating chat", error);
      router.push("/error");
    } finally {
      setCreateChatLoading(false);
    }
  };

  function maskEmail(email: string) {
    const firstTwoLetters = email.slice(0, 2); // Get the first two letters
    const lastTenLetters = email.slice(-10); // Get the last ten letters
    return firstTwoLetters + "*****" + lastTenLetters; // Concatenate the masked string
  }

  return (
    <>
      {createChatLoding && <LoadingDots />}
      <article className="user-card">
        <div className="user-card_avatar">
          <Link href={`/profile/${id}`}>
            <div className="relative h-11 w-11">
              <Image
                src={image ? image : "/assets/default-profile.jpg"}
                alt="logo"
                fill
                className="curson-pointer rounded-full"
              />
            </div>{" "}
          </Link>
          <div className="flex-1 text-ellipsis">
            <h4 className="text-base-semibold text-light-1 max-md:w-[160px] max-md:truncate">
              {name}
            </h4>
            <p className="text-small-medium text-gray-1">
              <span className="text-small-medium text-primary-500">@</span>{" "}
              {maskEmail(email)}
            </p>
          </div>
        </div>
        <Button
          className="user-card_btn"
          onClick={() => {
            router.push(`/profile/${id}`);
          }}
        >
          View
        </Button>
        <Button className="user-card_btn" onClick={() => createChat(id)}>
          Message
        </Button>
      </article>
    </>
  );
};

export default UserCard;
