import ProfilePage from "@/components/screens/ProfilePage";

const Page = ({ params }: { params: { id: string } }) => {
  if (!params.id) return null;

  return (
    <>
      <h1 className="head-text">Profile</h1>
      <ProfilePage userId={params.id} />
    </>
  );
};

export default Page;
