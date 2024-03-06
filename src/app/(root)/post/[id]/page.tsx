import PostPage from "@/components/screens/PostPage";

const Page = ({ params }: { params: { id: string } }) => {
  if (!params.id) return null;

  return (
    <>
      <h1 className="head-text mb-5">Post Page</h1>
      <PostPage id={params.id} />
    </>
  );
};

export default Page;
