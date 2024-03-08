import LoginPage from "@/components/forms/Login";

export default function Page() {
  return (
    <div className="flex flex-col justify-center mt-20">
      <h1 className="head-text flex justify-center m-3">Login page</h1>
      <div className="flex justify-center">
        <section className="p-2 w-2/3">
          <LoginPage />
        </section>
      </div>
    </div>
  );
}
