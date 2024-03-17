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
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useUserContext } from "@/context/UserContext";
import { fetchUser } from "@/helpers/fetchUser";
import { CreatePostSkeleton } from "../shared/Skeletons";
import { LoadingDots } from "../shared/LoadingDots";
import { usePostContext } from "@/context/PostContext";

interface PostText {
  post: string;
}

function CreatePost() {
  const { userData, setUserData } = useUserContext();
  const [userLoading, setUserLoading] = useState(false);
  const { setPostsData } = usePostContext();
  const [fetchPostLoading, setFetchPostLoading] = useState(false);
  const [createPostLoading, setCreatePostLoading] = useState(false);
  const [redirectToError, setRedirectToError] = useState(false);
  const [postResponse, setPostResponse] = useState<PostText>({ post: "" });

  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const postId = params?.id;

  if (redirectToError) {
    router.push("/error");
  }

  useEffect(() => {
    if (!userData._id) {
      fetchUser(setUserData, setUserLoading, setRedirectToError);
    }
  }, []);

  useEffect(() => {
    if (userData._id && pathname === `/update-post/${postId}`) {
      if (!userData.posts.includes(postId)) {
        setRedirectToError(true);
      }
    }
  }, [userData._id]);

  const fetchPostById = async () => {
    try {
      setFetchPostLoading(true);
      const response = await fetch(`/api/post/${postId}`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch a posts");
      }
      const responseData = await response.json();

      setPostResponse({ post: responseData?.post?.text });
    } catch (error) {
      console.log("Error during fetching post", error);
      router.push("/error");
    } finally {
      setFetchPostLoading(false);
    }
  };

  useEffect(() => {
    if (postId) {
      fetchPostById();
    }
  }, [postId]);

  const { reset, ...form } = useForm({
    resolver: zodResolver(PostValidationSchema),
    defaultValues: useMemo(() => {
      return {
        post: postResponse?.post || "",
      };
    }, [postResponse]),
  });

  useEffect(() => {
    reset(postResponse);
  }, [postResponse]);

  const onSubmit = async (values: z.infer<typeof PostValidationSchema>) => {
    try {
      setCreatePostLoading(true);

      if (pathname === "/create-post") {
        const response = await fetch("/api/post", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: values.post,
            author: userData._id,
          }),
        });

        if (response.ok) {
          const responseData = await response.json();
          setPostsData([]);
          router.push("/home");
        } else {
          const responseData = await response.json();
          router.push("/error");
          setCreatePostLoading(false);
        }
      } else {
        const response = await fetch(`/api/post/${postId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: values.post,
          }),
        });

        if (response.ok) {
          const responseData = await response.json();
          router.back();
        } else {
          const responseData = await response.json();
          router.push("/error");
          setCreatePostLoading(false);
        }
      }
    } catch (error: any) {
      console.log("Error during uploading post", error);
      router.push("/error");
      setCreatePostLoading(false);
    }
  };

  return (
    <>
      {createPostLoading && <LoadingDots />}
      {userLoading || fetchPostLoading ? (
        <CreatePostSkeleton />
      ) : (
        <Form {...{ reset, ...form }}>
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
              {pathname === "/create-post" ? "Post" : "Update"}
            </Button>
          </form>
        </Form>
      )}
    </>
  );
}

export default CreatePost;
