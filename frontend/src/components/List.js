import React, { useEffect,useState,useRef } from 'react'
import './main.css';
import {
  Link,
  useLocation
} from "react-router-dom";
import axios from 'axios';


export function List ()
{
    const [api_data,setData] = useState()
    
    const apiURL = 'http://localhost:8000/api/task'

    let location = useLocation();

    useEffect(() =>{
      console.log(apiURL)
      let mounted = true
      
      async function fetchList() {
        const request = await axios.get(apiURL) 
        if(mounted){
          console.log("execute")
          await setData({api_data:request.data})
        }
      }
      fetchList()
      return () => {
        mounted = false
      }
    },[location])
      
    if (api_data) {
      return(
        <>
          <div id = "main">
            <div id = "List">
            <div id = "TagList">
                  {api_data.api_data.tags.map((tag)=>
                    <Link to = {`/tag/${tag.id}`} className = "TextLink" key = {tag.id}>
                      <div className = "Tag" style = {{ display:"flex" }} >
                      <p>{tag.title}</p>
                    </div>
                    </Link>
                  )}

              </div>
              
              {/* Tasks */}
              <div id = "TaskList">
                {api_data.api_data.tasks.map((task)=>
                  <div className = "Task" style = {{ display:"flex" }}  key = {task.id} >
                      <Link to = {`/update-task/${task.id}`} className = "TextLink">
                      <p style = {{margin:"10px",paddingRight:"90%"}} >{task.title}</p>
                      </Link>   
                      <div className = "Buttons">
                        <Link to = {`/delete-task/${task.id}`}>
                          <button style = {{ margin:"10px"}} className="btn btn-outline-danger">Delete</button>
                        </Link>
                        <button  style = {{ margin:"10px"}} className="btn btn-outline-success">Complete</button>
                      </div>
                  </div>
                )}
              </div>
            </div>
            <div className = "Add">
            <Link to = {"/create-tag/"}><button className="btn btn-outline-dark" style = {{width:"170px"}} >+ Add Tag</button></Link>
            <Link to = {"/create-task/"}><button className="btn btn-outline-dark" style = {{width:"830px"}} >+ Add Task</button></Link>
            </div>

          </div>     
          </>
      )
    
  }
  else{
    return <div />
    
  }
}
  