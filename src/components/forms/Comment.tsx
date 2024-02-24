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
import { Input } from "@/components/ui/input";

import { CommentValidationSchema } from "@/lib/validations/post";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUserContext } from "@/context/UserContext";
import { fetchUser } from "@/helpers/fetchUser";
import Image from "next/image";

interface Props {
  postId: string;
  currentUserImg: string;
  currentUserId: string;
  setCommentAdded: any;
}

const Comment = ({
  postId,
  currentUserImg,
  currentUserId,
  setCommentAdded,
}: Props) => {
  // const { userData, setUserData } = useUserContext();
  const router = useRouter();
  const pathname = usePathname();

  //   useEffect(() => {
  //     if (!userData._id) {
  //       fetchUser(setUserData);
  //     }
  //   }, []);

  const form = useForm({
    resolver: zodResolver(CommentValidationSchema),
    defaultValues: {
      post: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof CommentValidationSchema>) => {
    try {
      const response = await fetch("/api/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId: postId,
          commentText: values.post,
          userId: JSON.parse(currentUserId),
        }),
      });
      if (response.ok) {
        const responseData = await response.json();
        setCommentAdded(true);
        router.push(`/post/${postId}`);
      } else {
        const responseData = await response.json();
      }
      form.reset();
    } catch (error: any) {
      console.log("Error during commenting on a post", error);
    }
  };
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="comment-form">
          <FormField
            control={form.control}
            name="post"
            render={({ field }) => (
              <FormItem className="flex w-full items-center gap-3 ">
                <FormLabel>
                  <Image
                    src={currentUserImg}
                    alt="Profile Photo"
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                  />
                </FormLabel>
                <FormControl className="border-none bg-transparent">
                  <Input
                    type="text"
                    placeholder="Comment..."
                    className="no-focus text-light-1 outline-none"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit" className="comment-form_btn">
            Reply
          </Button>
        </form>
      </Form>
    </>
  );
};

export default Comment;
