import React, { Component,useEffect,useState } from 'react'
import './main.css';
import {
  Link,
  useLocation
} from "react-router-dom";
import axios from 'axios';


export function List ()
{
    const [api_data,setData] = useState()
    let location = useLocation();


    useEffect(() =>{
      const apiUrl = 'http://localhost:8000/api/task'
      axios.get(apiUrl).then((receive_data) => {
        setData({api_data:receive_data.data})}
        )
    },[location,api_data])
      
    if (api_data) {

      return(
        <>
          <div id = "main">
  
            <div id = "List">
              {/* Tags */}
              <div id = "TagList">
                  {api_data.api_data.tags.map((tag)=>
                    <div className = "Tag" style = {{ display:"flex" }} key = {tag.id}  >
                      <p>{tag.title}</p>
                    </div>
                  )}

              </div>
              {/* Tasks */}
              <div id = "TaskList">
                {api_data.api_data.tasks.map((task)=>
                  <div className = "Task" style = {{ display:"flex" }}  key = {task.id} >
                    <p style = {{margin:"10px",paddingRight:"90%"}} >{task.title}</p>
                    <Link to = {`/delete-task/${task.id}`}>
                      <button style = {{ margin:"10px",float:"right"}} className="btn btn-outline-danger">Delete</button>
                      </Link>
                    <button style = {{ margin:"10px",float:"right"}} className="btn btn-outline-success">Complete</button>
                  </div>
                )}
              </div>
            </div>
  
            <Link to = {"/create-task/"}><button className="btn btn-outline-dark" style = {{width:"1000px"}} >+ Add Task</button></Link>
          </div>     
          </>
      )
    
  }
  else{
    return <h3>No data</h3>
    
  }
}
  