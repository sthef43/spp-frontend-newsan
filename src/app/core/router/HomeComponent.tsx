import * as React from "react";
import { Redirect } from "react-router";
export const HomeComponent = (): JSX.Element => {
  return <Redirect to="/main" />;
};
