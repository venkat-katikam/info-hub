"use client";

import * as React from "react";

export function LoadingDots() {
  return (
    <div className="absolute top-0 left-0 bg-dark-1 bg-opacity-60 z-10 h-full w-full flex items-center justify-center">
      <div className="flex space-x-2 justify-center items-center">
        <div
          className={`h-3 w-3 bg-white rounded-full animate-bounce [animation-delay:-0.3s]`}
        ></div>
        <div
          className={`h-3 w-3 bg-white rounded-full animate-bounce [animation-delay:-0.15s]`}
        ></div>
        <div className={`h-3 w-3 bg-white rounded-full animate-bounce`}></div>
      </div>
    </div>
  );
}
