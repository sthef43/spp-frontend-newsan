import { useEffect, useState } from "react";
import { unwrapResult } from "@reduxjs/toolkit";
import { useAppDispatch } from "app/core/store/store";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
interface props {
  func: any;
}
export default function useFetchApi<T>(func: any, args?: any, secondFunction?: any) {
  const dispatch = useAppDispatch();

  const [State, setState] = useState<T | null>(null);
  const init = async () => {
    let fetchResult;
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen());
      fetchResult = unwrapResult(await dispatch(func(args)));
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (error) {
      fetchResult = null;
    }
    if (fetchResult) {
      if (secondFunction) {
        fetchResult = secondFunction(fetchResult);
      }
      setState(fetchResult);
    }
  };

  useEffect(() => {
    init();
  }, [func]);
  return {
    State,
    setState
  };
}
