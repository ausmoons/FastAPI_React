import React from "react";
import ReactDOM from "react-dom";

import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Start } from './pages/Start'
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import All from './pages/All';
import { ProtectedRoute } from './services/protectedRoute'


function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/" component={Start} />
        <Route exact path="/signin" component={Signin} />
        <Route exact path="/signup" component={Signup} />
        <ProtectedRoute exact path="/all" component={All} />
        <Route path="*" component={() => "404 NOT FOUND"} />

      </Switch>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  rootElement
);
