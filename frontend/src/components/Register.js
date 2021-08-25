import React, { useEffect,useRef } from 'react'
import axios from '../axios'
import { Redirect} from 'react-router-dom'
import { useState } from 'react'
import './Form.css'

export function Register()
{
    const firstUpdate = useRef(true);
    const [toAdd,setToAdd] = useState(false)
    const [toRedirect,setToRedirect] = useState(false)
    const [user,setUser] = useState({
        username: "",
        password: "",
        email: ""
    })

    useEffect(()=>{
        if(firstUpdate.current)
        {
            firstUpdate.current=false
        }
        else{
            console.log("Request")
                
            async function HandleAdd()
            {
                try
                {
                    const res = await axios.post(`http://127.0.0.1:8000/api/register/`,user)
                    console.log(res)

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

    if(toRedirect === true){
        return <Redirect to = "/login/" />
    }
    
    return(
        <>
        <h1 style = {{margin:"auto"}}>Register</h1>
        <form>
            <div className="mb-3" style = {{width:"800px",margin:"auto",marginTop:"20em"}}>
                <label className="form-label">Email address</label>
                <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"  onChange = {e=>{setUser({...user,email:e.target.value})}} />
                <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
            </div>
            <div className="mb-3" style = {{width:"800px",margin:"auto"}}>
                <label className="form-label">Username</label>
                <input className="form-control" type="text" onChange = {e=>{setUser({...user,username:e.target.value})}}/>
            </div>
            <div className="mb-3" style = {{width:"800px",margin:"auto"}}>
                <label className="form-label">Password</label>
                <input type="password" className="form-control" id="exampleInputPassword1" onChange = {e=>{setUser({...user,password:e.target.value})}} />
            </div>
            <input type="submit" value="Submit" className="btn btn-primary btn-lg" onClick = {(e)=>{e.preventDefault
                                                                                                (setToAdd(true))}}/>
        </form> 
        </>
    )
}