import React, { useEffect,useState,useRef } from 'react'
import './main.css';
import {
  Link,
  useParams
} from "react-router-dom";
import axios from '../axios'
import NavBar from './NavBar'


export function TagList ()
{
    const [api_data,setData] = useState()
    let { id } = useParams()
    const apiURL = `http://localhost:8000/api/tag/${id}`


    useEffect(() =>{
      console.log(apiURL)
      let mounted = true
      async function fetchList() {
        const request = await axios.get(apiURL) 
        if(mounted){
          console.log("execute")
          await setData(request.data)
        }
      }
      fetchList()
      return () => {
        mounted = false
      }
    },[])
      
    if (api_data) {
      return(
        <>
          <NavBar user = {api_data.user.username} />
          <div id = "main">
            <div id = "List">
            <div id = "TagList">
            <Link to = "/" className = "TextLink"><div className = "Tag" style = {{ display:"flex" }}>
                <p>All</p>
            </div>
            </Link>
            <div className = "Tag" style = {{ display:"flex" }}>
                <p>{api_data.tag.title}</p>
            </div>
            <Link to = {`/delete-tag/${id}`} className = "TextLink">
                <div className = "Tag" style = {{ display:"flex" }}>
                    <p>Delete Tag</p>
                </div>
            </Link>
              </div>
              
              {/* Tasks */}
              <div id = "TaskList">
                {api_data.tasks.map((task)=>
                  {if(!task.complete){                  
                  <div className = "Task" style = {{ display:"flex" }}  key = {task.id} >
                      <p style = {{margin:"10px",paddingRight:"90%"}} >{task.title}</p>
                      <Link to = {`/update-task/${task.id}`}>
                          <button style = {{ margin:"10px",float:"right"}} className="btn btn-outline-info">Update</button>
                      </Link>   
                    <Link to = {`/delete-task/${task.id}`}>
                      <button style = {{ margin:"10px",float:"right"}} className="btn btn-outline-danger">Delete</button>
                      </Link>
                    <button style = {{ margin:"10px",float:"right"}} className="btn btn-outline-success">Complete</button>
                  </div>
                  }}
                )}
              </div>
            </div>
  
            <Link to = {"/create-task/"}><button className="btn btn-outline-dark" style = {{width:"1000px"}} >+ Add Task</button></Link>
          </div>     
          </>
      )
    
  }
  else{
    return <div />
    
  }
}
  