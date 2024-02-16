"use client";
import { createContext, useContext, useState } from "react";
// Creating the post context
const PostContext = createContext();

// Making the function which will wrap the whole app using Context Provider
export default function PostStore({ children }) {
  const [postsData, setPostsData] = useState([]);

  return (
    <PostContext.Provider value={{ postsData, setPostsData }}>
      {children}
    </PostContext.Provider>
  );
}

// Make usePostContext Hook to easily use our context throughout the application
export function usePostContext() {
  return useContext(PostContext);
}
