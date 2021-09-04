import React, { useEffect, useState, useRef } from "react";
import axios from "../axios";

export default function HandleDayTask(props) {
  const [data, setData] = useState(props.day_task[0]);
  const firstUpdate = useRef(true);

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
    } else {
      async function HandleAdd() {
        try {
          await axios.put(
            `http://127.0.0.1:8000/api/day-task/${props.day_task[0].id}/`,
            data
          );
        } catch (error) {
          console.log(error);
        }
      }
      HandleAdd();
    }
  }, [data]);
  if (
    props.day_task[0] &&
    props.tasks.find((x) => x.id === props.day_task[0].task)
  ) {
    return (
      <div className="Task" style={{ display: "flex", width: "1000px" }}>
        <p style={{ margin: "auto", fontSize: "1.3em", fontWeight: "bolder" }}>
          Task of the day:{" "}
          {props.tasks.find((x) => x.id === props.day_task[0].task).title}
        </p>
        <select
          value
          className="form-select"
          style={{ width: "30px" }}
          onChange={(e) => {
            setData({ ...data, task: e.target.value });
            {
              props.onChange(true);
            }
          }}
        >
          <option disabled value>
            Choose
          </option>
          {props.tasks.map((task) => {
            {
              if (!task.complete) {
                return (
                  <option value={task.id} key={task.id}>
                    {task.title}
                  </option>
                );
              }
            }
          })}
        </select>
      </div>
    );
  } else {
    return (
      <div className="Task" style={{ display: "flex" }}>
        <p style={{ margin: "auto" }}>No taks of the day</p>
        <select
          value
          className="form-select"
          style={{ width: "30px" }}
          onChange={(e) => {
            setData({ ...data, task: e.target.value });
            {
              props.onChange(true);
            }
          }}
        >
          <option disabled value>
            {" "}
            Choose{" "}
          </option>
          {props.tasks.map((task) => {
            {
              if (!task.complete) {
                return (
                  <option value={task.id} key={task.id}>
                    {task.title}
                  </option>
                );
              }
            }
          })}
        </select>
      </div>
    );
  }
}
