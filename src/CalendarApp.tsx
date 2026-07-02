import React from "react";
import { Provider } from "react-redux";
import { store } from "app/core/store/store";
import { AppRouter } from "app/core/router/AppRouter";

export const CalendarApp = (): JSX.Element => {
  return (
    <Provider store={store}>
      <AppRouter />
    </Provider>
  );
};
