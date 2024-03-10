import Image from "next/image";
import { useRouter } from "next/navigation";

interface Props {
  accountId: string;
  authUserId: string;
  name: string;
  email: string;
  image: string;
  bio: string;
}

const ProfileHeader = ({
  accountId,
  authUserId,
  name,
  email,
  image,
  bio,
}: Props) => {
  const router = useRouter();
  return (
    <div className="flex w-full flex-col justify-start">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative h-20 w-20 object-cover">
            <Image
              src={image}
              alt="ProfileImage"
              fill
              className="rounded-full object-cover shadow-2xl"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-left text-heading3-bold text-light-1">
              {name}
            </h2>
            <p className="text-base-medium text-gray-1">@{email}</p>
          </div>
        </div>
      </div>
      <p className="mt-6 max-w-lg text-base-regular text-light-2">{bio}</p>
      {accountId === authUserId && (
        <div className="flex  mt-5">
          <p
            className=" font-medium text-primary-500 dark:text-blue-500 underline cursor-pointer text-medium-regular"
            onClick={() => {
              router.push("/update-profile");
            }}
          >
            Update my user details
          </p>
          <Image
            src="/assets/edit.svg"
            alt="edit"
            width={20}
            height={20}
            className="cursor-pointer object-contain ml-1"
            onClick={() => {
              router.push("/update-profile");
            }}
          />
        </div>
      )}
      <div className="mt-12 h-0.5 w-full bg-dark-3" />
    </div>
  );
};

export default ProfileHeader;
