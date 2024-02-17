export const fetchUser = async (setUserData: any) => {
  try {
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
      communities: responseData?.data?.communities,
    });
    return responseData?.data;
  } catch (error: any) {
    return { errorMessage: "Some error in fetching a user", error };
  }
};
