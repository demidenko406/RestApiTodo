import React, { useEffect, useRef } from "react";
import axios from "axios";
import { Redirect, Link } from "react-router-dom";
import { useState } from "react";
import "./styles/Forms.css";

export function Register() {
  const firstUpdate = useRef(true);
  const [toAdd, setToAdd] = useState(false);
  const [toRedirect, setToRedirect] = useState(false);
  const [passwordError, setPasswordError] = useState(" ");
  const [emailError, setEmailError] = useState(" ");
  const [usernameError, setUsernameError] = useState(" ");

  const [user, setUser] = useState({
    username: " ",
    password: " ",
    email: " ",
  });


  
 function handlePassword(){
    if (user.password.length < 8) {
      setPasswordError("Password should be at least 8 symbols");
      return false
    } else {
      return true
    }
  };

  function handleEmail(){
    if (user.email.length < 5 || !user.email.includes("@")) {
      setEmailError("Email should be at least 5 symbols and contain '@' sign");
      return false
    } else {
      return true
    }
  };

  function handleUsername(){
    if (user.username.length < 5) {
      setUsernameError("Username should be at least 5 symbols");
      return false
    } else {
      return true
    }
  };

  function isValid(){
    let validPass = handlePassword()
    let validName = handleUsername()
    let validMail = handleEmail()

    if (
      validName === true &&
      validPass === true &&
      validMail === true
    ) {
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
          const res = await axios.post(
            "http://127.0.0.1:8000/api/register/",
            user
          );
          if (res.statusText == "Created") setToRedirect(true);
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
    return <Redirect to="/login/" />;
  }

  return (
    <div className="form">
      <Link className="GoBack" to="/login">
        Login
      </Link>
      <div className="formAdd">
        <h1 style={{ margin: "1em auto " }}>Register</h1>
        <form>
          <div className="mb-3">
            <label className="form-label">Email address</label>
            <input
              type="text"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              onChange={(e) => {
                setUser({ ...user, email: e.target.value });
              }}
            />
          </div>
          <div
            className="error"
            style={{ color: "red", fontWeight: "350", fontSize: "0.8em" }}
          >
            {" "}
            {emailError}
          </div>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              className="form-control"
              type="text"
              onChange={(e) => {
                setUser({ ...user, username: e.target.value });
              }}
            />
          </div>
          <div
            className="error"
            style={{ color: "red", fontWeight: "350", fontSize: "0.8em" }}
          >
            {" "}
            {usernameError}
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              onChange={(e) => {
                setUser({ ...user, password: e.target.value });
              }}
            />
          </div>
          <div
            className="error"
            style={{ color: "red", fontWeight: "350", fontSize: "0.8em" }}
          >
            {" "}
            {passwordError}
          </div>
          <input
            type="submit"
            value="Submit"
            className="btn btn-success btn-lg"
            style={{ margin: "1em" }}
            onClick={(e) => {
              e.preventDefault(setToAdd(!toAdd));
            }}
          />
        </form>
      </div>
    </div>
  );
}
