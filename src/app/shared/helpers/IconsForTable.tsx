/* eslint-disable react/display-name */
//import * as React from "react";
import { forwardRef } from "react";
import { ArrowDownward, Search, FirstPage, ChevronLeft, ChevronRight, LastPage, FilterList } from "@mui/icons-material";
import React from "react";

export const materialTableIcons = {
  FirstPage: forwardRef<SVGSVGElement>((props, ref) => <FirstPage {...props} ref={ref} />),
  SortArrow: forwardRef<SVGSVGElement>((props, ref) => <ArrowDownward {...props} ref={ref} />),
  LastPage: forwardRef<SVGSVGElement>((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef<SVGSVGElement>((props, ref) => <ChevronRight {...props} ref={ref} />),
  OpenInfo: forwardRef<SVGSVGElement>((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef<SVGSVGElement>((props, ref) => <ChevronLeft {...props} ref={ref} />),
  Search: forwardRef<SVGSVGElement>((props, ref) => <Search {...props} ref={ref} />),
  ClearSearch: forwardRef<SVGSVGElement>((props, ref) => <Search {...props} ref={ref} />),
  Filter: forwardRef<SVGSVGElement>((props, ref) => <FilterList {...props} ref={ref} />)
};
export const tabledivActions =
  "w-full py-2 sm:col-span-1 items-center grid grid-cols-3 sm:grid-cols-2 sm:border-2 sm:content-center border-gray-500 rounded-md px-0 sm:px-4 gap-2 sm:gap-4";
