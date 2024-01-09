"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
import { Textarea } from "@/components/ui/textarea";

import { PostValidationSchema } from "@/lib/validations/post";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function CreatePost() {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState({});

  const fetchUser = async () => {
    try {
      const response = await fetch(`/api/user`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch a user");
      }
      const responseData = await response.json();
      setUser(responseData?.data);
    } catch (error) {
      console.log("Some error in fetching a user", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const form = useForm({
    resolver: zodResolver(PostValidationSchema),
    defaultValues: {
      post: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof PostValidationSchema>) => {
    try {
      const response = await fetch("api/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: values.post,
          author: user._id,
          communityId: null,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();

        router.push("/");
      } else {
        const responseData = await response.json();
      }
    } catch (error: any) {
      console.log("Error during uploading post", error);
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-10 flex flex-col justify-start gap-10"
        >
          <FormField
            control={form.control}
            name="post"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-3 w-full">
                <FormLabel className="text-base-semibold text-light-2 ">
                  Content
                </FormLabel>
                <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1 ">
                  <Textarea rows={10} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="bg-primary-500">
            Post
          </Button>
        </form>
      </Form>
    </>
  );
}

export default CreatePost;
