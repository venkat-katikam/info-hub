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
    const [prefix, domain] = email.split("@");
    const maskedPrefix =
      prefix.substring(0, 2) + "*".repeat(Math.max(0, prefix.length - 2));
    return `${maskedPrefix}@${domain}`;
  }

  return (
    <article className="user-card">
      <div className="user-card_avatar">
        <Link href={`/profile/${id}`} className="relative h-11 w-11">
          <Image
            src={image}
            alt="logo"
            fill
            className="curson-pointer rounded-full"
          />{" "}
        </Link>
        <div className="flex-1 text-ellipsis">
          <h4 className="text-base-semibold text-light-1">{name}</h4>
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
