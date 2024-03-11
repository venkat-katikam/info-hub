import AccountProfile from "@/components/forms/AccountProfile";

export default function Page() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col justify-start px-3">
      <h1 className="head-text">Edit your profile</h1>

      <section className="mt-9 p-2 w-full">
        <AccountProfile btnTitle="Update" />
      </section>
    </main>
  );
}
