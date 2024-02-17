"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { UserValidationSchema } from "@/lib/validations/user";
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
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useUploadThing } from "@/lib/uploadthing";
import { isBase64Image } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useUserContext } from "@/context/UserContext";
import { fetchUser } from "@/helpers/fetchUser";
interface Props {
  btnTitle: string;
}

const AccountProfile = ({ btnTitle }: Props) => {
  const { userData, setUserData } = useUserContext();

  const [files, setFiles] = useState<File[]>([]);

  const { startUpload } = useUploadThing("media");

  const router = useRouter();
  const pathname = usePathname();

  const handleImage = (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) => {
    e.preventDefault();

    const fileReader = new FileReader();

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFiles(Array.from(e.target.files));

      if (!file.type.includes("image")) return;

      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || "";
        fieldChange(imageDataUrl);
      };

      fileReader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (!userData._id) {
      fetchUser(setUserData);
    }
  }, []);

  const { reset, ...form } = useForm({
    resolver: zodResolver(UserValidationSchema),
    defaultValues: useMemo(() => {
      return {
        profile_photo: userData?.image || "",
        name: userData?.name || "",
        email: userData?.email || "",
        bio: userData?.bio || "",
      };
    }, [userData]),
  });

  useEffect(() => {
    reset(userData);
  }, [userData]);

  const onSubmit = async (values: z.infer<typeof UserValidationSchema>) => {
    const blob = values.profile_photo;

    const hasImageChanged = isBase64Image(blob);
    if (hasImageChanged) {
      const imgRes: any = await startUpload(files);

      if (imgRes && imgRes[0].fileUrl) {
        values.profile_photo = imgRes[0].fileUrl;
      }
    }

    try {
      const response = await fetch(`api/user`, {
        method: "PUT",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          userId: userData._id,
          email: values.email,
          name: values.name,
          bio: values.bio,
          image: values.profile_photo,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      const responseData = await response.json();

      setUserData({
        _id: responseData?.data?._id,
        name: responseData?.data?.name,
        email: responseData?.data?.email,
        bio: responseData?.data?.bio,
        image: responseData?.data?.image,
        onboarded: responseData?.data?.onboarded,
        posts: responseData?.data?.posts,
        communities: responseData?.data?.communities,
      });
      if (pathname === "/profile/edit") {
        router.back();
      } else {
        router.push("/");
      }
    } catch (error) {
      console.log("Some error in updating user", error);
    }
  };

  return (
    <Form {...{ reset, ...form }}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col justify-start gap-10"
      >
        <FormField
          control={form.control}
          name="profile_photo"
          render={({ field }) => (
            <FormItem className="flex items-center gap-4">
              <FormLabel className="account-form_image-label">
                {field.value ? (
                  <Image
                    src={field.value}
                    alt="profile photo"
                    width={96}
                    height={96}
                    priority
                    className="rounded-full object-contain"
                  />
                ) : (
                  <Image
                    src="/assets/profile.svg"
                    alt="profile photo"
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                )}
              </FormLabel>
              <FormControl className="flex-1 text-base-semibold text-gray-200">
                <Input
                  type="file"
                  accept="image/*"
                  placeholder="Upload your photo"
                  className="account-form_image-input"
                  onChange={(e) => handleImage(e, field.onChange)}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3 w-full">
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
            <FormItem className="flex flex-col gap-3 w-full">
              <FormLabel className="text-base-semibold text-light-2">
                Email
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
          name="bio"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3 w-full">
              <FormLabel className="text-base-semibold text-light-2 ">
                Bio
              </FormLabel>
              <FormControl className="flex-1 text-base-semibold text-gray-200">
                <Textarea
                  rows={10}
                  className="account-form_input no-focus"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">{btnTitle}</Button>
      </form>
    </Form>
  );
};

export default AccountProfile;
