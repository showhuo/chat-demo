import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "../pages/home";

export default function CoreRouter() {
  return (
    <Switch>
      <Route component={Home} path="/" />
      {/* <Redirect to="/" /> */}
    </Switch>
  );
}
