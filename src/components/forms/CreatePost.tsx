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
import { useUserContext } from "@/context/UserContext";
import { fetchUser } from "@/helpers/fetchUser";
import { CreatePostSkeleton } from "../shared/Skeletons";

function CreatePost() {
  const { userData, setUserData } = useUserContext();
  const [userLoading, setUserLoading] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!userData._id) {
      fetchUser(setUserData, setUserLoading);
    }
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
          author: userData._id,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        router.push("/home?postCreated=true");
      } else {
        const responseData = await response.json();
      }
    } catch (error: any) {
      console.log("Error during uploading post", error);
    }
  };

  return (
    <>
      {userLoading ? (
        <CreatePostSkeleton />
      ) : (
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
      )}
    </>
  );
}

export default CreatePost;
