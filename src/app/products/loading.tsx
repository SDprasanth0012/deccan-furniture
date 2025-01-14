import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function Loading() {
  return (
    <div className="container mx-auto px-4">
      {/* Category Section Skeleton */}
      <div className="bg-transparent mb-4 py-4">
        <div className="mb-4 text-center">
          <Skeleton
            height={50}
            width={300}
            className="mx-auto"
            baseColor="#e8e0d4"
            highlightColor="#f4f0ea"
          />
        </div>
        <div className="flex flex-wrap justify-start space-x-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton
              key={index}
              height={40}
              width={100}
              className="rounded-full"
              baseColor="#e8e0d4"
              borderRadius={80}
              highlightColor="#f4f0ea"
            />
          ))}
        </div>
      </div>

  




     

      {/* Product List Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 12 }).map((_, index) => (
          <div
            key={index}
            className="p-4 border rounded"
            style={{ backgroundColor: "#e8e0d4" }}
          >
            <Skeleton
              height={250}
              baseColor="#e8e0d4"
              highlightColor="#f4f0ea"
            />
            <Skeleton
              height={20}
              className="mt-2"
              baseColor="#e8e0d4"
              highlightColor="#f4f0ea"
            />
            <Skeleton
              height={20}
              width="40%"
              className="mt-2"
              baseColor="#e8e0d4"
              highlightColor="#f4f0ea"
            />
            <Skeleton
              height={20}
              width="40%"
              className="mt-2"
              baseColor="#e8e0d4"
              highlightColor="#f4f0ea"
            />
            <Skeleton
              height={20}
              width="40%"
              className="mt-2"
              baseColor="#e8e0d4"
              highlightColor="#f4f0ea"
            />
            <Skeleton
              height={30}
              className="mt-2"
              baseColor="#e8e0d4"
              highlightColor="#f4f0ea"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
