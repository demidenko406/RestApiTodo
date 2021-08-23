

import React, { useEffect,useRef } from 'react'
import axios from 'axios'
import { Redirect} from 'react-router-dom'
import { useState } from 'react'
import './Form.css'

export function Register()
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
        else{
                
            async function HandleAdd()
            {
                try
                {
                await axios.post(`http://127.0.0.1:8000/api/task/`,post)
                setToRedirect(true)
                }
                catch(error)
                {
                    console.log(error);
                }
                
            }
            HandleAdd()

        }
    },[toAdd])

    if(toRedirect===true){
        return <Redirect to = "/" />
    }
    
    return(
        <>
        <h1 style = {{margin:"auto"}}>Register</h1>
        <form>
            <div className="mb-3" style = {{width:"800px",margin:"auto",marginTop:"20em"}}>
                <label for="exampleInputEmail1" className="form-label">Email address</label>
                <input type="email" className="form-control" id="exampleInputEmail1" ariaDescribedby="emailHelp" />
                <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
            </div>
            <div className="mb-3" style = {{width:"800px",margin:"auto"}}>
                <label className="form-label">Username</label>
                <input className="form-control" type="text" />
            </div>
            <div class="mb-3" style = {{width:"800px",margin:"auto"}}>
                <label for="exampleInputPassword1" className="form-label">Password</label>
                <input type="password" class="form-control" id="exampleInputPassword1" />
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
        </form> 
        </>
    )
}