"use client";
import { sidebarLinks } from "@/constants";
import { useUserContext } from "@/context/UserContext";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

function LeftSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { userData } = useUserContext();

  const logoutHandler = async () => {
    const response = await fetch("/api/logout");
    const responseData = await response.json();
    router.push("/login");
  };

  return (
    <section className="custom-scrollbar leftsidebar">
      <div className="flex w-full flex-1 flex-col gap-6 px-6">
        {sidebarLinks.map((link) => {
          const isActive =
            (pathname.includes(link.route) && link.route.length > 1) ||
            pathname === link.route;
          return (
            <Link
              href={link.route}
              key={link.label}
              className={`leftsidebar_link ${isActive && "bg-primary-500"}`}
            >
              <Image
                src={link.imgURL}
                alt={link.label}
                width={24}
                height={24}
              />
              <p className="text-light-1 max-lg:hidden">{link.label}</p>
            </Link>
          );
        })}
      </div>

      {/* logout button */}
      {userData._id && (
        <div className="mt-10 px-6">
          <div
            className="flex cursor-pointer gap-4 p-4"
            onClick={logoutHandler}
          >
            <Image
              src="assets/logout.svg"
              alt="logout"
              width={24}
              height={24}
            />
            <p className="text-light-2 max-lg:hidden">Logout</p>
          </div>
        </div>
      )}
    </section>
  );
}

export default LeftSidebar;
