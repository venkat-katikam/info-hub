export const fetchPosts = async (setPostsData: any, setPostLoading: any) => {
  try {
    setPostLoading(true);
    const response = await fetch(`/api/post?pageNumber=1&pageSize=20`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch a posts");
    }
    const responseData = await response.json();

    setPostsData(responseData.posts);
  } catch (error) {
    return { errorMessage: "Some error in fetching a posts", error };
  } finally {
    setPostLoading(false);
  }
};
