import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { LoginScreen } from "app/features/cuenta/components/LoginScreen";
import { SignInUser } from "app/features/cuenta/components/SignInUser.page";

const AuthRouter = (props: any) => {
  return (
    <div className="auth__main">
      <div className="auth__box-container">
        <Switch>
          <Route path="/auth/login">
            <div className="z-0 bg-nws-image filter brightness-50 bg-no-repeat bg-cover fixed h-screen w-screen "></div>
            <LoginScreen />
          </Route>
          <Route path="/auth/register">
            <div className="z-0 bg-nws-image filter brightness-50 bg-no-repeat bg-cover fixed h-screen w-screen "></div>
            <SignInUser />
          </Route>
        </Switch>
        {props?.authenficate == true && <Redirect to="/main" />}
      </div>
    </div>
  );
};

export default AuthRouter;
