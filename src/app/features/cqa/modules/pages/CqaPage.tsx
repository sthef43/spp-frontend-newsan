import { useAppDispatch } from "app/core/store/store";
import React, { useEffect } from "react";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";

export const CqaPage = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { TitleChanger } = useTitleOfApp();

  useEffect(() => {
    TitleChanger("CQA");
  }, []);

  return (
    <div>
      <h1>Módulo CQA</h1>
    </div>
  );
};
