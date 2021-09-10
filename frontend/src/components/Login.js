import React, { useEffect, useRef } from "react";
import axios from "../axios";
import { Redirect, Link } from "react-router-dom";
import { useState } from "react";
import "./styles/Forms.css";

export function Login() {
  const firstUpdate = useRef(true);
  const [toAdd, setToAdd] = useState(false);
  const [toRedirect, setToRedirect] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [loginError, setLoginError] = useState({
    email: " ",
    password: " ",
  });

  const handlePassword = () => {
    if (loginData.password.length < 8) {
      return "Password should be at least 8 symbols";
    } else {
      return "";
    }
  };

  function handleEmail() {
    if (loginData.email.length < 5 || !loginData.email.includes("@")) {
      return "Email should be at least 5 symbols and contain '@' sign";
    } else {
      return "";
    }
  }

  const isValid = () => {
    setLoginError({ password: handlePassword(), email: handleEmail() });
    if (loginError.email === "" && loginError.password === "") {
      return true;
    } else {
      return false;
    }
  };
  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
    } else {
      async function HandleAdd() {
        try {
          await axios
            .post("http://127.0.0.1:8000/token/", loginData)
            .then((res) => {
              localStorage.setItem("access_token", res.data.access);
              localStorage.setItem("refresh_token", res.data.refresh);
              axios.defaults.headers["Authorization"] =
                "Bearer " + localStorage.getItem("access_token");
            });
          setToRedirect(true);
        } catch (error) {
          console.log(error);
        }
      }

      if (isValid()) {
        HandleAdd();
      }
    }
  }, [toAdd]);

  if (toRedirect === true) {
    return <Redirect to="/" />;
  }
  return (
    <div className="form">
      <Link className="GoBack" to="/register">
        Register
      </Link>
      <div className="formAdd">
        <h1 style={{ margin: "1em auto" }}>Login</h1>
        <form>
          <div className="mb-3">
            <label className="form-label">Email address</label>
            <input
              type="email"
              className="form-control"
              id="exampleInputEmail1"
              onChange={(e) => {
                setLoginData({ ...loginData, email: e.target.value });
              }}
            />
          </div>
          <div
            className="error"
            style={{ color: "red", fontWeight: "350", fontSize: "0.8em" }}
          >
            {" "}
            {loginError.email}
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="exampleInputPassword1"
              onChange={(e) => {
                setLoginData({ ...loginData, password: e.target.value });
              }}
            />
          </div>
          <div
            className="error"
            style={{ color: "red", fontWeight: "350", fontSize: "0.8em" }}
          >
            {" "}
            {loginError.password}
          </div>
          <button
            type="submit"
            style={{ margin: "2em", fontSize: "0.8em" }}
            className="btn btn-success"
            onClick={(e) => {
              e.preventDefault(setToAdd(!toAdd));
            }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
