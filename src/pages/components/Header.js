import React from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import axios from "axios";

import logo from "../img/edusify-logo.png";
import logout from "../img/logout.png";

const Header = () => {
  let serverApi = "";

  if (process.env.REACT_APP_MODE == "production") {
    serverApi = process.env.REACT_APP_SERVER_API
  } else {
    serverApi = process.env.REACT_APP_DEV_SERVER_API
  }

  const { auth, setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const signOut = () => {
    axios
      .get(`${serverApi}/auth/logout`, { withCredentials: true })
      .then(() => {
        setAuth({
          id: 0,
          name: "",
          surname: "",
          username: "",
          email: "",
          status: false,
        });
        navigate("/login");
        window.scrollTo(0, 0);
      });
  };

  return (
    <header className="navbar">
      <div className="container">
        <div className="navbar-wrapper">
          <div className="brand">
            <div className="brand-wrapper">
              <a
                className="nav-name"
                onClick={() => {
                  navigate("/");
                  window.scrollTo(0, 0);
                }}
              >
                <img className="nav-logo" src={logo} />
                <h5>Edusify</h5>
              </a>
            </div>
          </div>
          <div className="nav-menu">
            <a
              className="nav-link"
              onClick={() => {
                navigate("/");
                window.scrollTo(0, 0);
              }}
            >
              <div>Početna</div>
            </a>
            <a
              className="nav-link"
              onClick={() => {
                navigate("/learn");
                window.scrollTo(0, 0);
              }}
            >
              <div>Učenje</div>
            </a>
            <a
              className="nav-link"
              onClick={() => {
                navigate("/about");
                window.scrollTo(0, 0);
              }}
            >
              <div>O nama</div>
            </a>
          </div>
          {!auth.status ? (
            <div className="nav-menu-login">
              <a
                className="nav-link-login"
                onClick={() => {
                  navigate("/login");
                  window.scrollTo(0, 0);
                }}
              >
                <div>Prijavi se</div>
              </a>
              <a
                className="nav-link-registration"
                onClick={() => {
                  navigate("/signup");
                  window.scrollTo(0, 0);
                }}
              >
                <div>Registriraj se</div>
              </a>
            </div>
          ) : (
            <div className="nav-menu-profile">
              <a
                className="nav-link-profile"
                onClick={() => {
                  navigate("/profile");
                  window.scrollTo(0, 0);
                }}
              >
                <div>{auth.username}</div>
              </a>
              <a className="nav-link-logout" onClick={signOut}>
                <img className="nav-logout-img" src={logout} />
                <div>Odjavi se</div>
              </a>
            </div>
          )}
          <div className="menu-button"></div>
        </div>
      </div>
    </header>
  );
};

export default Header;
