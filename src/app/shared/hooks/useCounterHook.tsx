import { useState } from "react";

export const useCounterHook = (initialState = 0) => {
  const [counter, setCounter] = useState<number>(initialState); // 10

  const reset = () => {
    setCounter(initialState);
  };

  const increment = () => {
    setCounter(counter + 1);
  };
  const setCounterValue = (int: number) => {
    setCounter(int);
  };

  const decrement = () => {
    setCounter(counter - 1);
  };

  return {
    counter,
    increment,
    decrement,
    setCounterValue,
    reset
  };
};
