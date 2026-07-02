import React from "react";
import { Redirect, Route } from "react-router-dom";
type Props = {
  [x: string]: any;
  isAuthenficated: boolean;
  Children: any;
};

export function PrivateRoute({ Children, isAuthenficated, ...rest }: Props) {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        isAuthenficated ? (
          <Children />
        ) : (
          <Redirect
            to={{
              pathname: "/auth/login",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}
