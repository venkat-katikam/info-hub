"use client";
import CreatePost from "@/components/forms/CreatePost";
import { getDataFromToken } from "@/helpers/getUserFromToken";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

function Page() {
  return (
    <>
      <h1 className="head-text">Create Post</h1>

      <CreatePost />
    </>
  );
}

export default Page;
