"use client";
import { useUserContext } from "@/context/UserContext";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

function Topbar() {
  const { userData, setUserData } = useUserContext();
  const router = useRouter();

  const logoutHandler = async () => {
    const response = await fetch("/api/logout");
    const responseData = await response.json();
    setUserData({});
    router.push("/login");
  };
  return (
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
              <Image
                src="assets/logout.svg"
                alt="logout"
                width={24}
                height={24}
                onClick={logoutHandler}
              />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Topbar;
