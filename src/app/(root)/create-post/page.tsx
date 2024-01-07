import { fetchUser } from "@/actions/user.action";
import CreatePost from "@/components/forms/CreatePost";
import { getDataFromToken } from "@/helpers/getUserFromToken";
import { redirect } from "next/navigation";

async function Page() {
  const user = getDataFromToken();

  if (!user) return null;

  const userInfo = await fetchUser(user.id);

  if (!userInfo?.onboarded) redirect("/onboarding");

  return (
    <>
      <h1 className="head-text">Create Post</h1>

      <CreatePost userId={userInfo._id} />
    </>
  );
}

export default Page;
