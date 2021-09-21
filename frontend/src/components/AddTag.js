import React, { useEffect, useRef } from "react";
import axios from "../axios";
import { Redirect, Link } from "react-router-dom";
import { useState } from "react";
import "./styles/Forms.css";

export function TagCreate() {
  const firstUpdate = useRef(true);
  const [toAdd, setToAdd] = useState(false);
  const [toRedirect, setToRedirect] = useState(false);
  const [post, setPost] = useState({
    title: "",
    user: "",
  });

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
    } else {
      async function HandleAdd() {
        try {
          await axios.post("http://0.0.0.0/api/tag/", post);
          setToRedirect(true);
        } catch (error) {
          console.log(error);
        }
      }
      HandleAdd();
    }
  }, [toAdd]);

  if (toRedirect === true) {
    return <Redirect to="/" />;
  }

  return (
    <div className="form">
      <Link className="GoBack" to="/">
        Go back
      </Link>
      <div className="formAdd">
        <div className="mb-3">
          <label className="form-label">Tag</label>
          <input
            type="name"
            className="form-control"
            id="exampleFormControlInput1"
            onChange={(e) => {
              setPost({ ...post, title: e.target.value });
            }}
          />
        </div>
        <input
          type="submit"
          value="Submit"
          className="btn btn-success btn-lg"
          style={{ margin: "2em" }}
          onClick={() => setToAdd(true)}
        />
      </div>
    </div>
  );
}
