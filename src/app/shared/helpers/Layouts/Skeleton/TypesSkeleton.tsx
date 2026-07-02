import React from "react";
import { Skeleton } from "@mui/material";

export function TypesSkeleton() {
  const SkeletonGeneric = () => {
    return (
      <>
        <div className="flex flex-col items-center gap-2">
          <Skeleton animation="wave" variant="rounded" sx={{ width: "100%", height: "5rem" }} />
          <Skeleton animation="wave" variant="rounded" sx={{ width: "10%", height: "2rem" }} />
          <Skeleton animation="wave" variant="rounded" sx={{ width: "100%", height: "15rem", marginTop: "2rem" }} />
        </div>
      </>
    );
  };

  const SkeletonListElements = () => {
    return (
      <>
        <div className="flex flex-col items-center gap-2">
          <Skeleton animation="wave" variant="rounded" sx={{ width: "100%", height: "2rem" }} />
          <Skeleton animation="wave" variant="rounded" sx={{ width: "100%", height: "2rem" }} />
          <Skeleton animation="wave" variant="rounded" sx={{ width: "100%", height: "2rem" }} />
        </div>
      </>
    );
  };

  return {
    SkeletonGeneric,
    SkeletonListElements
  };
}
