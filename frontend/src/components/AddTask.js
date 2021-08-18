import React, { useEffect,useRef } from 'react'
import axios from 'axios'
import { Redirect,useParams} from 'react-router-dom'
import { useState } from 'react'
import './AddTask.css'

export function TaskCreate(props)
{
    const firstUpdate = useRef(true);
    const [toAdd,setToAdd] = useState(false)
    const [toRedirect,setToRedirect] = useState(false)
    const [post,setPost] = useState({
        title: "",
        description: "",
        complete: false,
        due_date: null,
        user: 1,
        tag: []

    })

    useEffect(()=>{
        if(firstUpdate.current)
        {
            firstUpdate.current=false
        }
        else
        {
            axios.post('http://127.0.0.1:8000/api/task/', post).then(setToRedirect(true))
        }
    },[toAdd])

    if(toRedirect===true){
        return <Redirect to = "/" />
    }
    
    return(
        <div className="formAdd">

            <div className="mb-3">
            <label  className="form-label">TaskName</label>
            <input type="name" className="form-control" id="exampleFormControlInput1" onChange = {e=>{setPost({...post,title:e.target.value})}} />
            </div>
            <div className="mb-3">
            <label className="form-label" >Description</label>
            <textarea className="form-control" id="exampleFormControlTextarea1" rows="3" onChange = {e=>{setPost({...post,description:e.target.value})}}></textarea>
            </div>
            <div className="mb-3">
            <label className="form-label" placeholder="MM-DD-YY" >Date</label>
            <input type="date" className="form-control" id="exampleFormControlInput1" onChange = {e=>{setPost({...post,due_date:e.target.value})}} />
            </div>
            <input type="submit" value="Submit" className="btn btn-primary btn-lg" onClick = {()=>(setToAdd(true))}/>

      </div>
    )
}