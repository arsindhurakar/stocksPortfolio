import React from "react";
import { Switch, Route } from "react-router-dom";
import { Login, Dashboard, PortfolioMain, NotFound } from "../pages";

const Router = () => {
  const ROUTES = [
    {
      path: "/",
      component: Login,
    },
    {
      path: "/dashboard",
      component: Dashboard,
    },
    {
      path: "/portfolio",
      component: PortfolioMain,
    },
    {
      path: "*",
      component: NotFound,
    },
  ];

  return (
    <Switch>
      {ROUTES.map((route, index) => (
        <Route
          key={index}
          exact
          path={route.path}
          component={route.component}
        />
      ))}
    </Switch>
  );
};

export default Router;
