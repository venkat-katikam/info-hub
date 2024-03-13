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
import { default as ImageNext } from "next/image";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useUploadThing } from "@/lib/uploadthing";
import { isBase64Image } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useUserContext } from "@/context/UserContext";
import { fetchUser } from "@/helpers/fetchUser";
import { LoadingDots } from "../shared/LoadingDots";
interface Props {
  btnTitle: string;
}

const AccountProfile = ({ btnTitle }: Props) => {
  const { userData, setUserData } = useUserContext();
  const [userLoading, setUserLoading] = useState(false);
  const [userUpdateLoading, setUserUpdateLoading] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [errorFound, setErrorFound] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [redirectToError, setRedirectToError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [files, setFiles] = useState<File[]>([]);

  const { startUpload } = useUploadThing("media");

  const router = useRouter();
  const pathname = usePathname();

  if (redirectToError) {
    router.push("/error");
  }

  async function imageUrlToFile(
    imageUrl: string,
    fileName: string
  ): Promise<File> {
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    return new File([blob], fileName, { type: blob.type });
  }

  const handleImage = (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) => {
    e.preventDefault();

    const fileReader = new FileReader();

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      if (!file.type.includes("image")) return;

      fileReader.onload = function (event) {
        const img = new Image();
        img.src = event.target?.result?.toString() || "";

        // compressing images to 2mb and making it square ie same height and width

        img.onload = async function () {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d")!;

          // Calculate the new dimensions to make it square
          const squareSize = Math.min(img.width, img.height);
          canvas.width = squareSize;
          canvas.height = squareSize;

          // Draw the image on the canvas with the new dimensions
          ctx.drawImage(
            img,
            (img.width - squareSize) / 2,
            (img.height - squareSize) / 2,
            squareSize,
            squareSize,
            0,
            0,
            squareSize,
            squareSize
          );

          // Convert the canvas content to a base64-encoded JPEG image with a quality of 0.9
          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.9);
          fieldChange(compressedDataUrl);

          // Convert the compressedDataUrl to a File
          const compressedImageFile = await imageUrlToFile(
            compressedDataUrl,
            "compressed-image.jpg"
          );

          // Create a FileList with a single file
          const compressedImageFiles: File[] = [compressedImageFile];

          setFiles(compressedImageFiles);
        };
      };

      fileReader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (!userData._id) {
      fetchUser(setUserData, setUserLoading, setRedirectToError);
    }
  }, []);

  const { reset, ...form } = useForm({
    resolver: zodResolver(UserValidationSchema),
    defaultValues: useMemo(() => {
      return {
        image: userData?.image || "",
        name: userData?.name || "",
        password: "",
        email: userData?.email || "",
        bio: userData?.bio || "",
      };
    }, [userData]),
  });

  useEffect(() => {
    reset(userData);
  }, [userData]);

  const onSubmit = async (values: z.infer<typeof UserValidationSchema>) => {
    setErrorFound(false);
    setErrorMessage("");
    setUserUpdateLoading(true);
    const blob = values.image;

    const hasImageChanged = isBase64Image(blob);
    if (hasImageChanged) {
      const imgRes: any = await startUpload(files);

      if (imgRes && imgRes[0].fileUrl) {
        values.image = imgRes[0].fileUrl;
      }
    }

    try {
      setUserUpdateLoading(true);
      const response = await fetch(`/api/user`, {
        method: "PUT",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          userId: userData._id,
          email: values.email,
          name: values.name,
          bio: values.bio,
          image: values.image,
          password: changePassword ? values.password : undefined,
        }),
      });

      if (!response.ok) {
        setErrorFound(true);
        setErrorMessage("Failed to update user");
        setUserUpdateLoading(false);
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
      });
      if (pathname === "/update-profile") {
        router.push(`/profile/${userData._id}`);
      } else {
        router.push("/home");
      }
    } catch (error: any) {
      console.log("Some error in updating user", error.errorMessage);
      setErrorFound(true);
      setErrorMessage(
        "Something went wrong in updating the user, please try uploading a photo of 3MB or below"
      );
      setUserUpdateLoading(false);
    }
  };

  return (
    <>
      {userLoading && <LoadingDots />}
      {userUpdateLoading && <LoadingDots />}
      <Form {...{ reset, ...form }}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col justify-start gap-10"
        >
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <>
                <FormItem className="flex items-center gap-4">
                  <FormLabel className="account-form_image-label">
                    {field.value ? (
                      <ImageNext
                        src={field.value}
                        alt="profile photo"
                        width={96}
                        height={96}
                        priority
                        className="rounded-full object-contain"
                      />
                    ) : (
                      <ImageNext
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
                <FormMessage />
              </>
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
          {pathname === "/update-profile" && (
            <>
              {changePassword && (
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
              )}

              <p
                className="font-medium text-primary-500 dark:text-blue-500 underline cursor-pointer text-right text-small-regular"
                onClick={() => setChangePassword(!changePassword)}
              >
                {!changePassword
                  ? "Update Password Also"
                  : "Dont Update Password"}
              </p>
            </>
          )}

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
          {errorFound && (
            <p className="text-red-600 text-base-semibold">{errorMessage}</p>
          )}
          <Button type="submit">{btnTitle}</Button>
        </form>
      </Form>
    </>
  );
};

export default AccountProfile;
