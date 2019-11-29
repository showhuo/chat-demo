import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Home from "../pages/home";

export default function CoreRouter() {
  return (
    <Switch>
      <Route component={Home} path="/home" />
      <Redirect to="/home" />
    </Switch>
  );
}
