import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <div className="mt-20 flex flex-col justify-center">
      <div className=" flex justify-center">
        <p className="text-heading1-bold text-light-1 p-5">
          Ready to amplify your social experience?
        </p>
      </div>
      <div className=" flex justify-center">
        <p className="text-base-semibold text-light-1 p-5 text-justify">
          Join InfoHub and discover a world where connections thrive.
          What&apos;s your next story?
        </p>
      </div>
      <div className=" flex justify-center">
        <p className="text-small-regular text-light-1 px-5 text-justify">
          Empower your connections, stay informed, and ignite conversations with
          InfoHub – where social networking meets knowledge sharing.
        </p>
      </div>

      <div className="mt-5 flex justify-center">
        <Button className="m-5 w-1/3">
          <Link className="w-full" href="/login">
            Login
          </Link>
        </Button>
        <Button className="m-5 w-1/3 bg-light-2 text-slate-900 hover:text-light-1">
          <Link className="w-full" href="/register">
            Register
          </Link>
        </Button>
      </div>
    </div>
  );
}
