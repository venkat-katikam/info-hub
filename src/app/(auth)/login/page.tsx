import LoginPage from "@/components/forms/Login";

export default function Page() {
  return (
    <div className=" mt-10 flex flex-col justify-center">
      <h1 className="head-text">Login page</h1>
      <section className=" bg-dark-2 p-1">
        <LoginPage />
      </section>
    </div>
  );
}
