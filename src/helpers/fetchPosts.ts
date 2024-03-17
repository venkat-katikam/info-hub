export const fetchPosts = async (
  postsData: any,
  setPostsData: any,
  setPostLoading: any,
  setRedirectToError: any,
  pageNumber: number,
  setIsFetchedAllPosts: any
) => {
  try {
    if (pageNumber === 1) {
      setPostLoading(true);
    }
    const response = await fetch(
      `/api/post?pageNumber=${pageNumber}&pageSize=5`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch a posts");
    }
    const responseData = await response.json();

    if (responseData.posts.length < 5) {
      setIsFetchedAllPosts(true);
    }

    setPostsData([...postsData, ...responseData.posts]);
  } catch (error) {
    setRedirectToError(true);
    console.log("Some error in fetching a posts", error);
  } finally {
    setPostLoading(false);
  }
};
