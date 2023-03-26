import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Router, Switch, Route, Link } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import sv from "./img/Logo_secretVoldemort.png";

import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Match  from "./components/Match";
import Game from "./components/Game";
import ShowMatch from "./components/ShowMatch";

import { logout } from "./actions/auth";
import { clearMessage } from "./actions/message";

import { history } from "./helpers/history";

const App = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    history.listen((location) => {
      dispatch(clearMessage()); // clear message when changing location
    });
  }, [dispatch]);

  const logOut = () => {
    dispatch(logout());
  };

  return (
    <Router history={history}>
      <div>
        <nav className="navbar navbar-expand navbar-dark bg-dark">
            <Link to={"/"} className="navbar-brand">
              <img className="SV-title" src={sv} alt="title"/>
            </Link>
          
          {currentUser ? (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/profile"} className="nav-link tittle-nav">
                  {currentUser.user_name}
                </Link>
              </li>
              <li className="nav-item">
                <a href="/" className="nav-link tittle-nav" onClick={logOut}>
                  SignOut
                </a>
              </li>
            </div>
          ) : null }
        </nav>

        <div>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/match" component={Match} />
            <Route exact path="/game/:id" component={Game} />
            <Route exact path="/show_match" component={ShowMatch} />
          </Switch>
        </div>
      </div>
    </Router>
  );
};

export default App;
