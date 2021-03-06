/* eslint-disable no-inner-declarations */
import React, { useEffect, useRef } from "react";
import axios from "../axios";
import { Redirect, Link } from "react-router-dom";
import { useState } from "react";
import "./styles/Forms.css";

export function TaskCreate() {
  const firstUpdate = useRef(true);
  const [toAdd, setToAdd] = useState(false);
  const [toRedirect, setToRedirect] = useState(false);
  const [intial, setInitial] = useState([]);
  const [post, setPost] = useState({
    title: "",
    description: "",
    complete: false,
    due_date: null,
    user: "",
    tag: [],
  });

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
    } else {
      async function HandleAdd() {
        try {
          await axios.post("http://0.0.0.0/api/task/", post);
          setToRedirect(true);
        } catch (error) {
          console.log(error);
        }
      }
      HandleAdd();
    }
  }, [toAdd]);

  useEffect(() => {
    let mounted = true;

    async function fetchList() {
      const request = await axios.get("http://0.0.0.0/api/tag/");
      if (mounted) {
        setInitial(request.data);
      }
    }
    fetchList();
    return () => {
      mounted = false;
    };
  }, []);

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
          <label className="form-label">TaskName</label>
          <input
            type="name"
            className="form-control"
            id="exampleFormControlInput1"
            onChange={(e) => {
              setPost({ ...post, title: e.target.value });
            }}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            id="exampleFormControlTextarea1"
            rows="3"
            onChange={(e) => {
              setPost({ ...post, description: e.target.value });
            }}
          ></textarea>
        </div>
        <div className="mb-3">
          <label className="form-label" placeholder="MM-DD-YY">
            Date
          </label>
          <input
            type="date"
            className="form-control"
            id="exampleFormControlInput1"
            onChange={(e) => {
              setPost({ ...post, due_date: e.target.value });
            }}
          />
        </div>
        <label className="form-label" placeholder="MM-DD-YY">
          Tags
        </label>
        <select
          className="form-select"
          multiple
          onChange={(e) => {
            setPost({
              ...post,
              tag: Array.from(
                e.target.selectedOptions,
                (option) => option.value
              ),
            });
          }}
        >
          {intial.map((tag) => {
            return (
              <option key={tag.id} value={parseInt(tag.id)}>
                {tag.title}
              </option>
            );
          })}
        </select>
        <input
          type="submit"
          value="Submit"
          style={{ margin: "2em" }}
          className="btn btn-success btn-lg"
          onClick={() => setToAdd(true)}
        />
      </div>
    </div>
  );
}
