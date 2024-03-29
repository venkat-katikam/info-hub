"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { RegisterValidationSchema } from "@/lib/validations/user";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { LoadingDots } from "../shared/LoadingDots";

const RegisterPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorFound, setErrorFound] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    resolver: zodResolver(RegisterValidationSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof RegisterValidationSchema>) => {
    setErrorFound(false);
    setErrorMessage("");
    try {
      setLoading(true);
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();

        router.push("/login");
      } else {
        const responseData = await response.json();
        setErrorFound(true);
        setErrorMessage(responseData?.errorMessage);
        setLoading(false);
      }
    } catch (error: any) {
      console.log("Error during registration", error);
      setErrorFound(true);
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <LoadingDots />}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col justify-center items-center gap-10 mt-10"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex flex-col justify-center gap-3 w-full">
                <FormLabel className="text-base-semibold text-light-2">
                  Name
                </FormLabel>
                <FormControl className="flex-1 text-base-semibold text-gray-200">
                  <Input
                    type="text"
                    className="account-form_input no-focus"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex flex-col justify-center gap-3 w-full">
                <FormLabel className="text-base-semibold text-light-2">
                  Email
                </FormLabel>
                <FormControl className="flex-1 text-base-semibold text-gray-200">
                  <Input
                    type="email"
                    className="account-form_input no-focus"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-3 w-full">
                <FormLabel className="text-base-semibold text-light-2">
                  Password
                </FormLabel>
                <FormControl className="flex-1 text-base-semibold text-gray-200">
                  <Input
                    type={showPassword ? "text" : "password"}
                    className="account-form_input no-focus"
                    {...field}
                  />
                </FormControl>
                <p
                  className="font-medium text-primary-500 dark:text-blue-500 underline cursor-pointer text-right text-small-regular"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide password" : "Show password"}
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

          {errorFound && (
            <p className="text-red-600 text-base-semibold">{errorMessage}</p>
          )}

          <Button type="submit">Register</Button>
          <p className="text-light-2">
            Already Registered?{" "}
            <Link href="/login" className="underline text-primary-500">
              Login here
            </Link>
          </p>
        </form>
      </Form>
    </>
  );
};

export default RegisterPage;
