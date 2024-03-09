"use client";
import { sidebarLinks } from "@/constants";
import { useUserContext } from "@/context/UserContext";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
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
import { useState } from "react";
import { LoadingDots } from "./LoadingDots";

function LeftSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { userData, setUserData } = useUserContext();
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [redirectToError, setRedirectToError] = useState(false);

  if (redirectToError) {
    router.push("/error");
  }

  const logoutHandler = async () => {
    try {
      setLogoutLoading(true);
      const response = await fetch("/api/logout");
      const responseData = await response.json();
      setUserData({});
      router.push("/login");
    } catch (error: any) {
      console.log("Somthing went wrong, Unable to logout", error.message);
      setRedirectToError(true);
    } finally {
      setLogoutLoading(false);
    }
  };

  return (
    <>
      {logoutLoading && <LoadingDots />}
      <section className="custom-scrollbar leftsidebar">
        <div className="flex w-full flex-1 flex-col gap-6 px-6">
          {sidebarLinks.map((link) => {
            const isActive =
              (pathname.includes(link.route) && link.route.length > 1) ||
              pathname === link.route;
            return (
              <Link
                href={
                  link.route === "/profile"
                    ? `/profile/${userData._id}`
                    : link.route
                }
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
          <div className="mt-9 px-6">
            <Dialog>
              <DialogTrigger asChild>
                <div className="flex cursor-pointer gap-4 p-4">
                  <Image
                    src="assets/logout.svg"
                    alt="logout"
                    width={24}
                    height={24}
                  />
                  <p className="text-light-2 max-lg:hidden">Logout</p>
                </div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md w-5/6">
                <DialogHeader>
                  <DialogTitle>
                    Are you sure you want to Logout of this account?
                  </DialogTitle>
                </DialogHeader>
                <DialogFooter className="sm:justify-between">
                  <DialogClose asChild>
                    <Button type="button" variant="secondary" className="m-3">
                      Back
                    </Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button
                      type="button"
                      variant="secondary"
                      className="bg-red-600 text-white m-3 hover:bg-red-600"
                      onClick={logoutHandler}
                    >
                      Logout
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </section>
    </>
  );
}

export default LeftSidebar;
