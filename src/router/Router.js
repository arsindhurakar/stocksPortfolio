import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Login, Dashboard, PortfolioMain } from "../pages";

const Router = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          <Login />
        </Route>
        <Route exact path="/dashboard">
          <Dashboard />
        </Route>
        <Route exact path="/portfolio">
          <PortfolioMain />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

export default Router;
