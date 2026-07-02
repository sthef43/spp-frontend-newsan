import React from "react";
import { SelectedEppList } from "./SelectedEppList";

export const SelectedEppListContainer = () => {
  return (
    <div className="w-full">
      <h1 className="border-b-[1px] border-blue-300 mb-2 p-4 text-center">Faltante de EPP</h1>
      <div className="p-4">
        <SelectedEppList />
      </div>
    </div>
  );
};
