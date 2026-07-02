// import { Button } from "@mui/material";
import React from "react";

interface Props {
  label: string;
  onSelect?: () => void;
  isSelected?: boolean;
}

export const ButtonEpp = ({ label, onSelect, isSelected }: Props) => {
  return (
    <button
      type="button"
      className={`capitalize w-full bg-btn-epp px-4 py-1 rounded-3xl ${isSelected ? "!bg-[#1E3688] text-white" : ""}`}
      onClick={onSelect}>
      {label}
    </button>
  );
};
