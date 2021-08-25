import React, { useEffect,useState,useRef } from 'react'
import NavBar from './NavBar'
import './main.css';
import {
  Link,
  useLocation
} from "react-router-dom";
import axios from '../axios'


export function List ()
{
    const firstUpdate = useRef(true);
    const [api_data,setData] = useState()
    const [completeTask,setComplete] = useState()
    const [toRerender,setRerender] = useState(false)

    
    const apiURL = 'http://localhost:8000/api/task'

    let location = useLocation();

    useEffect(() =>{
      console.log(apiURL)
      let mounted = true
      
      async function fetchList() {
        try{
          const request = await axios.get(apiURL) 
          if(mounted){
            console.log("Response: ",request)
            setData(request.data)
          }
        }
        catch(error){
          console.log(error)
        }

      }
      fetchList()
      setRerender(false)
      return () => {
        mounted = false
      }
    },[location,toRerender])


    useEffect(()=>{
      if(firstUpdate.current)
      {
          firstUpdate.current=false
      }
      else{
              
          async function HandleAdd()
          {
              try
              {
                console.log(completeTask)
              await axios.put(`http://127.0.0.1:8000/api/task/${completeTask.id}/`,completeTask)
              }
              catch(error)
              {
                  console.log(error);
              }
              
          }
          HandleAdd()
          setRerender(true)
      }
  },[completeTask])



      
    if (api_data) {
      return(
        <>
          <NavBar user = {api_data.user.username} />
          <div id = "main">
            <div id = "List">
              <div id = "TagList">
                  {api_data.tags.map((tag)=>
                    <Link to = {`/tag/${tag.id}`} className = "TextLink" key = {tag.id}>
                      <div className = "Tag" style = {{ display:"flex" }} >
                        <p>{tag.title}</p>
                      </div>
                    </Link>
                  )}
              </div>
              
              {/* Tasks */}
              <div id = "TaskList">
                {api_data.tasks.map((task)=>
                {if(!task.complete){
                  return(         
                  <div className = "Task" style = {{ display:"flex" }}  key = {task.id} >
                  <Link to = {`/update-task/${task.id}`} className = "TextLink">
                    <p style = {{margin:"10px",paddingRight:"90%"}} >{task.title}</p>
                  </Link>  
                  <div style={{padding:'1px'}}></div>  
                  <div className = "Buttons">
                    <Link to = {`/delete-task/${task.id}`}>
                      <button style = {{ margin:"10px"}} className="btn btn-outline-danger">Delete</button>
                    </Link>
                    <button  style = {{ margin:"10px"}} className="btn btn-outline-success" onClick = {e=>{setComplete({...task,complete:true})}} >Complete</button>
                  </div>
                  <li style = {{display:"inline"}}>
                    {task.tag.map(tag => {
                      return <ul key = {tag}>{api_data.tags.find(x => x.id === tag).title}</ul>
                    })}
                    </li>
                </div>)

                }
                else{
                  return(         
                    <div className = "Task" style = {{ display:"flex" }}  key = {task.id} >
                    <Link to = {`/update-task/${task.id}`} className = "TextLink">
                      <p style = {{margin:"10px",paddingRight:"90%", textDecoration:"line-through",color:"grey"}} >{task.title}</p>
                    </Link>   
                    <div className = "Buttons">
                      <Link to = {`/delete-task/${task.id}`}>
                        <button style = {{ margin:"10px"}} className="btn btn-outline-danger">Delete</button>
                      </Link>
                    </div>
                    <li style = {{display:"inline"}}>
                      </li>
                  </div>)
                }
              }


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
  