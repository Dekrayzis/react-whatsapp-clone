import React, { useState } from "react";
import { Switch, Route } from "react-router-dom";
import SideBar from "./components/sidebar/SideBar";
import Chat from "./components/chatwindow/Chat";
import "./styles/app.scss";
import LoginScreen from "./components/login/LoginScreen";
import { useStateValue } from "./StateProvider";

function App() {
  const [{ user }, dispatch] = useStateValue();

  return (
    <div className="app">
      {!user ? (
        <LoginScreen />
      ) : (
        <div className="app__body">
          <SideBar />
          <Switch>
            <Route path={"/"} exact component={Chat} />
            <Route path={"/rooms/:roomId"} exact component={Chat} />
          </Switch>
        </div>
      )}
    </div>
  );
}

export default App;
