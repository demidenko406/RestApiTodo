import React, { useEffect, useState } from "react";
import "./styles/List.css";
import { Link, useParams } from "react-router-dom";
import axios from "../axios";
import NavBar from "./NavBar";

export function TagList() {
  const [api_data, setData] = useState();
  let { id } = useParams();
  const apiURL = `http://localhost:8000/api/tag/${id}`;

  useEffect(() => {
    console.log(apiURL);
    let mounted = true;
    async function fetchList() {
      const request = await axios.get(apiURL);
      if (mounted) {
        await setData(request.data);
        console.log(api_data);
      }
    }
    fetchList();
    return () => {
      mounted = false;
    };
  }, []);

  if (api_data) {
    return (
      <>
        <NavBar user={api_data.user.username} />
        <div id="main">
          <div id="List">
            <div id="TagList">
              <Link to="/" className="TextLink">
                <div className="Tag" style={{ margin: "auto" }}>
                  <p>All</p>
                </div>
              </Link>
              <div className="Tag" style={{ margin: "auto" }}>
                <p>{api_data.tag.title}</p>
              </div>
              <Link to={`/delete-tag/${id}`} className="TextLink">
                <div className="Tag" style={{ margin: "auto" }}>
                  <p>Delete Tag</p>
                </div>
              </Link>
            </div>

            {/* Tasks */}
            <div id="menu">
              <div id="TaskList">
                {api_data.tasks.map((task) => {
                  if (!task.complete) {
                    return (
                      <div
                        className="Task"
                        style={{ display: "flex" }}
                        key={task.id}
                      >
                        <Link
                          to={`/update-task/${task.id}`}
                          className="TextLink"
                        >
                          <p style={{ margin: "10px" }}>{task.title}</p>
                        </Link>
                        <div className="Buttons">
                          <Link to={`/delete-task/${task.id}`}>
                            <button
                              style={{ margin: "10px", float: "right" }}
                              className="btn btn-outline-danger"
                            >
                              Delete
                            </button>
                          </Link>
                        </div>
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          </div>

          <Link to={"/create-task/"}>
            <button
              className="btn btn-outline-dark"
              style={{ width: "1000px" }}
            >
              + Add Task
            </button>
          </Link>
        </div>
      </>
    );
  } else {
    return <div />;
  }
}
