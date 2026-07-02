import { unwrapResult } from "@reduxjs/toolkit";
import { useAppDispatch } from "app/core/store/store";
interface props {
  func: any;
}
export default function useAwaitFetchApi(): { init: (func: any) => Promise<unknown> } {
  const dispatch = useAppDispatch();
  async function llamar(func) {
    return unwrapResult(await dispatch(func()));
  }
  const init = (func) => {
    return new Promise((resolve) => {
      resolve(llamar(func));
    });
  };
  return { init };
}
