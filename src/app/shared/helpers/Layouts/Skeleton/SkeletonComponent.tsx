/* eslint-disable unused-imports/no-unused-vars */
import { useAppSelector } from "app/core/store/store";
import React from "react";
import { TypesSkeleton } from "./TypesSkeleton";

interface Props {
  typeSkeleton?: "Table" | "List" | "Card";
}

export const SkeletonComponent: React.FC<Props> = ({ typeSkeleton }) => {
  const estadoCargando = useAppSelector((state) => state.loadingUI);

  const { SkeletonGeneric, SkeletonListElements } = TypesSkeleton();

  const ChangeTypeSkeleton = (typeSkeleton: "Table" | "List" | "Card") => {
    switch (typeSkeleton) {
      case "Table":
        return <SkeletonGeneric />;
      case "List":
        return <SkeletonListElements />;
      case "Card":
        return <SkeletonGeneric />;
      default:
        return <SkeletonGeneric />;
    }
  };

  return <main className="w-full h-full">{estadoCargando.stateKeleton ? ChangeTypeSkeleton(typeSkeleton) : null}</main>;
};
