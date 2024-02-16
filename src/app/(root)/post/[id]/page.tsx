import PostPage from "@/components/screens/PostPage";

const Page = ({ params }: { params: { id: string } }) => {
  if (!params.id) return null;

  return (
    <>
      <PostPage id={params.id} />
    </>
  );
};

export default Page;
