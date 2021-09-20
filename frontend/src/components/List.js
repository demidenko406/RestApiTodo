import React, { useEffect, useState, useRef } from "react";
import NavBar from "./NavBar";
import "./styles/List.css";
import { Link, useLocation } from "react-router-dom";
import HandleDayTask from "./DayTask";
import axios from "../axios";

export function List() {
  const firstUpdate = useRef(true);
  const [api_data, setData] = useState();
  const [completeTask, setComplete] = useState();
  const [toRerender, setRerender] = useState(false);

  const apiURL = "http://0.0.0.0/api/task";

  let location = useLocation();

  useEffect(() => {
    let mounted = true;

    async function fetchList() {
      try {
        const request = await axios.get(apiURL);
        if (mounted) {
          setData(request.data);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchList();
    setRerender(false);
    return () => {
      mounted = false;
    };
  }, [location, toRerender]);

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
    } else {
      async function HandleAdd() {
        try {
          await axios.put(
            `http://0.0.0.0/api/task/${completeTask.id}/`,
            completeTask
          );
        } catch (error) {
          console.log(error);
        }
      }
      HandleAdd();
      setRerender(true);
    }
  }, [completeTask]);

  if (api_data) {
    return (
      <>
        <NavBar user={api_data.user.username} />
        <div id="main">
          <div className="DayTask" style={{ margin: "auto", width: "1000px" }}>
            <HandleDayTask
              tasks={api_data.tasks}
              day_task={api_data.day_task}
              onChange={(value) => setRerender(value)}
            />
          </div>

          <div id="List">
            <div id="TagList">
              {api_data.tags.map((tag) => (
                <Link to={`/tag/${tag.id}`} className="TextLink" key={tag.id}>
                  <div className="Tag" style={{ display: "flex" }}>
                    <p>{tag.title}</p>
                  </div>
                </Link>
              ))}
            </div>

            <div id="menu">
              <div id="TaskList">
                {api_data.tasks.map((task) => {
                  if (!task.complete) {
                    return (
                      <div style={{ display: "inline" }} key={task.id}>
                        <div className="Task" style={{ display: "flex" }}>
                          <Link
                            to={`/update-task/${task.id}`}
                            className="TextLink"
                          >
                            <p style={{ margin: "10px" }}>{task.title}</p>
                          </Link>
                          <div style={{ padding: "1px" }}></div>
                          <div className="Buttons">
                            <button
                              style={{ margin: "10px" }}
                              className="btn btn-outline-success"
                              onClick={() => {
                                let tags = task.tag.map((tag) => {
                                  return tag.id;
                                });
                                setComplete({
                                  ...task,
                                  tag: tags,
                                  complete: !task.complete,
                                });
                              }}
                            >
                              Complete
                            </button>
                            <Link to={`/delete-task/${task.id}`}>
                              <button
                                style={{ margin: "10px" }}
                                className="btn btn-outline-danger"
                              >
                                Delete
                              </button>
                            </Link>
                          </div>
                        </div>

                        <div className="TagBlock">
                          {task.tag.map((tag) => {
                            return (
                              <div className="TagTask" key={tag.id}>
                                <p style={{ fontSize: "0.7em" }}>{tag.title}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  } else {
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
                          <p
                            style={{
                              margin: "10px",
                              textDecoration: "line-through",
                              color: "grey",
                            }}
                          >
                            {task.title}
                          </p>
                        </Link>
                        <div className="Buttons">
                          <button
                            style={{ margin: "10px" }}
                            className="btn btn-outline-primary"
                            onClick={() => {
                              let _tags = task.tag.map((tag) => {
                                return tag.id;
                              });
                              setComplete({
                                ...task,
                                tag: _tags,
                                complete: !task.complete,
                              });
                            }}
                          >
                            unComplete
                          </button>

                          <Link to={`/delete-task/${task.id}`}>
                            <button
                              style={{ margin: "10px" }}
                              className="btn btn-outline-danger"
                            >
                              Delete
                            </button>
                          </Link>
                        </div>
                        <li style={{ display: "inline" }}></li>
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          </div>
          <div className="Add">
            <Link to={"/create-tag/"}>
              <button
                className="btn btn-outline-dark"
                style={{ width: "170px" }}
              >
                + Add Tag
              </button>
            </Link>
            <Link to={"/create-task/"}>
              <button
                className="btn btn-outline-dark"
                style={{ width: "830px" }}
              >
                + Add Task
              </button>
            </Link>
          </div>
        </div>
      </>
    );
  } else {
    return <div />;
  }
}
