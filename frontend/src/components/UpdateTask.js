import React, { useEffect, useRef, useState } from "react";
import axios from "../axios";
import { Redirect, useParams, Link } from "react-router-dom";

export function TaskUpdate() {
  const { id } = useParams();
  const [data, setData] = useState();
  const [toAdd, setToAdd] = useState(false);
  const [toRedirect, setToRedirect] = useState(false);
  const [intial, setInitial] = useState();
  const firstUpdate = useRef(true);

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
    } else {
      async function HandleAdd() {
        try {
          await axios.put(`http://0.0.0.0/api/task/${id}/`, data);
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
      const request = await axios.get(`http://0.0.0.0/api/task/${id}/`);
      if (mounted) {
        setData(request.data.task);
        setInitial(request.data.tags);
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

  if (intial) {
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
              defaultValue={data.title}
              onChange={(e) => {
                setData({ ...data, title: e.target.value });
              }}
            ></input>
          </div>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              id="exampleFormControlTextarea1"
              rows="3"
              defaultValue={data.description}
              onChange={(e) => {
                setData({ ...data, description: e.target.value });
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
              defaultValue={data.due_date}
              onChange={(e) => {
                setData({ ...data, due_date: e.target.value });
              }}
            />
          </div>

          <label className="form-label" placeholder="MM-DD-YY">
            Tags
          </label>

          <select
            className="form-select"
            multiple
            value={data.tag}
            onChange={(e) => {
              setData({
                ...data,
                tag: Array.from(
                  e.target.selectedOptions,
                  (option) => option.value
                ),
              });
            }}
          >
            {intial.map((tag) => {
              if (data.tag.includes(tag.id)) {
                return (
                  <option key={tag.id} value={parseInt(tag.id)}>
                    {tag.title}
                  </option>
                );
              } else {
                return (
                  <option key={tag.id} value={parseInt(tag.id)}>
                    {tag.title}
                  </option>
                );
              }
            })}
          </select>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              checked={data.complete}
              id="defaultCheck1"
              onChange={(e) => {
                setData({ ...data, complete: e.target.checked });
              }}
            />
            <label className="form-check-label">Complete</label>
          </div>
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
  } else {
    return <div />;
  }
}
