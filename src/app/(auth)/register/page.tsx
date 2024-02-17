import RegisterPage from "@/components/forms/Register";

export default function Page() {
  return (
    <div className="flex flex-col justify-center mt-20">
      <h1 className="head-text flex justify-center m-3">Sign up page</h1>
      <div className="flex justify-center">
        <section className=" p-4 w-2/3">
          <RegisterPage />
        </section>
      </div>
    </div>
  );
}
