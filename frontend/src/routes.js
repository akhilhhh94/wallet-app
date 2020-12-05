import React, { Fragment } from "react";
import { Router, Route, Switch } from "react-router-dom";
import { createBrowserHistory } from "history";

const history = createBrowserHistory();

export const routes = () => {
  return (
    <Router history={history}>
      <Switch>
        {/* <Route path="/" component={Login} /> */}
        <Fragment>
          {/* <Header /> */}
          <div className="container pt-8 mx-auto">
            {/* <Route path="/" component={Login} /> */}
          </div>
        </Fragment>
      </Switch>
    </Router>
  );
};
