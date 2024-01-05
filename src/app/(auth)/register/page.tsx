import RegisterPage from "@/components/forms/Register";

export default function Page() {
  return (
    <div className=" mt-10 flex flex-col justify-center">
      <h1 className="head-text">Sign up page</h1>
      <section className=" bg-dark-2 p-1">
        <RegisterPage />
      </section>
    </div>
  );
}
