import ChatPage from "@/components/screens/ChatPage";

const Page = async () => {
  return (
    <section>
      <h1 className="head-text mb-10 ml-6">Chats</h1>
      {/* <ChatPage /> */}
      <div className="ml-6">
        <p className="no-result text-left">
          <div className="flex">
            <div>Chat feature coming very soon... </div>{" "}
            <div className="animate-bounce"> ⏳</div>
          </div>
          <br></br>Stay connected and chat with friends individually or in
          groups, right within our app!
        </p>
      </div>
    </section>
  );
};

export default Page;
