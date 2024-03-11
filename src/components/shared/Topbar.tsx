"use client";
import { useUserContext } from "@/context/UserContext";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

function Topbar() {
  const { userData, setUserData } = useUserContext();
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [redirectToError, setRedirectToError] = useState(false);

  const router = useRouter();

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
      <nav className="topbar">
        <Link href="/" className="flex items-center gap-4">
          <Image src="/assets/logo.svg" alt="logo" width={28} height={28} />
          <p className="text-heading3-bold text-light-1 ">InfoHub</p>
        </Link>

        {/* logout button */}
        {userData._id && (
          <div className="flex items-center gap-1">
            <div className="block md:hidden">
              <div className="flex cursor-pointer">
                <Dialog>
                  <DialogTrigger asChild>
                    <Image
                      src="assets/logout.svg"
                      alt="logout"
                      width={24}
                      height={24}
                    />
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md w-5/6">
                    <DialogHeader>
                      <DialogTitle>
                        Are you sure you want to Logout of this account?
                      </DialogTitle>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-between">
                      <DialogClose asChild>
                        <Button
                          type="button"
                          variant="secondary"
                          className="m-3"
                        >
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
            </div>
          </div>
        )}
      </nav>
    </>
  );
}

export default Topbar;
