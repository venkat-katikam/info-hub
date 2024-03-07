"use client";

import * as React from "react";

export function ErrorPage() {
  return (
    <div className="fixed top-0 left-0 bg-dark-1 bg-opacity-90 z-10 h-full w-full flex items-center justify-center">
      <div className="flex flex-col space-x-2 justify-center items-center">
        <div className="text-white text-heading1-bold">Oops! &#x1F613;</div>
        <div className="text-white">Something went wrong</div>
        <div className="text-white">Please try refreshing the page</div>
      </div>
    </div>
  );
}
