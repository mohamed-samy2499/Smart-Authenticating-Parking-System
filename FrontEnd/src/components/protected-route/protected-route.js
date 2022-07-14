import React from "react";
import { Route, Redirect } from "react-router-dom";
// import auth from "../../services/authService";
import { useStores } from "../../hooks/useStores";
export const ProtectedRoute = ({
  path,
  component: Component,
  render,
  ...rest
}) => {
  const { authStore } = useStores();
  const { isUserLoggedIn } = authStore;
  return (
    <Route
      {...rest}
      render={props => {
        if (!isUserLoggedIn())
          // if (false)
          return (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: props.location }
              }}
            />
          );
        return Component ? <Component {...props} /> : render(props);
      }}
    />
  );
};
