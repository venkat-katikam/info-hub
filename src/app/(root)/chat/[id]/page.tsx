import IndividualChatPage from "@/components/screens/IndividualChatPage";

const Page = async ({ params }: { params: { id: string } }) => {
  if (!params.id) return null;
  return (
    <section>
      <IndividualChatPage chatId={params.id} />
    </section>
  );
};

export default Page;
