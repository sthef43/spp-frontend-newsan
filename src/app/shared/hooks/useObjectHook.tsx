import { useState } from "react";
import _ from "lodash";
export function useObjectHook<T>(initialState: T): {
  values: T;
  setData: (name: string, model: any) => void;
  reset: () => void;
} {
  const [values, setValues] = useState<T>(initialState);

  const reset = () => {
    setValues(initialState);
  };

  const setData = (name: string, model: any) => {
    let newValue: any = { ...values };
    try {
      newValue = _.set(newValue, name, model);
      setValues(newValue);
    } catch (e) {
      console.error(e);
    }
  };
  return { values, setData, reset };
}
