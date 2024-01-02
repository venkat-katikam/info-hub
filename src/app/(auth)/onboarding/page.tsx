import AccountProfile from "@/components/forms/AccountProfile";

export default function Page() {
  const userInfo = {
    id: "1",
    username: "venkyee",
    name: "venkat",
    bio: "Software developer",
    image: "",
  };

  const userData = {
    id: userInfo?.id,
    username: userInfo?.username,
    name: userInfo?.name,
    bio: userInfo?.bio,
    image: userInfo.image,
  };
  return (
    <main className="mx-auto flex max-w-3xl flex-col justify-start px-10 py-20">
      <h1 className="head-text">Onboarding</h1>
      <p className="mt-3 text-base-regular text-light-2">
        You are just few steps away from using InfoHub app &#129395;
        <br />
        Please fill the below details to start
      </p>
      <section className="mt-9 bg-dark-2 p-10">
        <AccountProfile user={userData} btnTitle="Continue" />
      </section>
    </main>
  );
}
