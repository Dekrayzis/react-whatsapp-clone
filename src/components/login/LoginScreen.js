/* eslint-disable no-empty-pattern */
import React from "react";
import logo from "../../assets/logo.svg";
import "./login.scss";

import { auth, provider } from "../../firebase";
import { useStateValue } from "./../../StateProvider";
import { actionTypes } from "../../store/Reducer";

const LoginScreen = () => {
  const [{}, dispatch] = useStateValue();
  const signIn = () => {
    auth
      .signInWithPopup(provider)
      .then((res) =>
        dispatch({
          type: actionTypes.SET_USER,
          user: res.user,
        })
      )
      .catch((err) => alert(err.message));
  };

  return (
    <div className="login">
      <div className="login__container">
        <img src={logo} alt="logo" />
        <div className="login__text">Sign in to CChat</div>
        <button onClick={signIn}>Sign in with Google</button>
      </div>
    </div>
  );
};

export default LoginScreen;
