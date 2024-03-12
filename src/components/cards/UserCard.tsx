"use client";
import Image from "next/image";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Props {
  id: string;
  name: string;
  email: string;
  image: string;
  personType: string;
}

const UserCard = ({ id, name, email, image, personType }: Props) => {
  const router = useRouter();

  function maskEmail(email: string) {
    const firstTwoLetters = email.slice(0, 2); // Get the first two letters
    const lastTenLetters = email.slice(-10); // Get the last ten letters
    return firstTwoLetters + "*****" + lastTenLetters; // Concatenate the masked string
  }

  return (
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
    </article>
  );
};

export default UserCard;
