export const fetchUser = async (
  setUserData: any,
  setUserLoading: any,
  setRedirectToError: any
) => {
  try {
    setUserLoading(true);
    const response = await fetch(`/api/user`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch a user");
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
    return responseData?.data;
  } catch (error: any) {
    setRedirectToError(true);
    console.log("Some error in fetching a user", error);
  } finally {
    setUserLoading(false);
  }
};
