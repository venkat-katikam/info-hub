function RightSidebar() {
  return (
    <section className="custom-scrollbar rightsidebar">
      <div className="flex flex-1 flex-col flex-start">
        <h3 className="text-heading4-medium text-light-1">Suggested Users</h3>
      </div>
      <div className="flex flex-1 flex-col flex-start">
        <h3 className="text-heading4-medium text-light-1">Latest Chats</h3>
        <p className="!text-base-regular text-light-3 mt-3">No chats yet</p>
      </div>
    </section>
  );
}

export default RightSidebar;
