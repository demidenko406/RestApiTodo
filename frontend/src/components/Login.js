import React, { useEffect,useRef } from 'react'
import axios from '../axios'
import { Redirect,Link} from 'react-router-dom'
import { useState } from 'react'
import './styles/Forms.css'


export function Login()
{
    const firstUpdate = useRef(true);
    const [toAdd,setToAdd] = useState(false)
    const [toRedirect,setToRedirect] = useState(false)
    const [loginData,setLoginData] = useState({
        email: "",
        password: ""
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
                    console.log(loginData)
                    await axios.post(`http://127.0.0.1:8000/token/`,loginData).then((res) => {
                        localStorage.setItem('access_token', res.data.access)
                        localStorage.setItem('refresh_token', res.data.refresh)
                        axios.defaults.headers['Authorization'] = 'Bearer ' + localStorage.getItem('access_token');

                    })
                    

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
        return <Redirect to = "/" />
    }
    return(
        <div className = "form">
        <Link class = "GoBack" to = '/register'>Register</Link>
        <div className = "formAdd">

        <h1 style = {{margin:"1em auto"}}>Login</h1>
        <form>
            <div className="mb-3" >
                <label className="form-label">Email address</label>
                <input type="email" className="form-control" id="exampleInputEmail1"  onChange = {e=>{setLoginData({...loginData,email:e.target.value})}}/>
            </div>
            <div className="mb-3" >
                <label className="form-label">Password</label>
                <input type="password" className="form-control" id="exampleInputPassword1" onChange = {e=>{setLoginData({...loginData,password:e.target.value})}}/>
            </div>
            <button type="submit" style ={{margin:"2em",fontSize:"0.8em"}} className="btn btn-success" onClick = {(e)=>{e.preventDefault
                                                                                    (setToAdd(true))}} >Login</button>
        </form> 
        </div>
        </div>
    )
}