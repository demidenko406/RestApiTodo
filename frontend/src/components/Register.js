import React, { useEffect,useRef } from 'react'
import axios from '../axios'
import { Redirect,Link} from 'react-router-dom'
import { useState } from 'react'
import './styles/Forms.css'

export function Register()
{
    
    const firstUpdate = useRef(true);
    const [toAdd,setToAdd] = useState(false)
    const [toRedirect,setToRedirect] = useState(false)
    const [userError,setUserError] = useState({
        username: " ",
        password: " ",
        email: " "
    })
    const [user,setUser] = useState({
        username: " ",
        password: " ",
        email: " "
    })

    const handlePassword = (userInstance) => {
        if(userInstance.password.length < 8){
            return "Password should be at least 8 symbols"
        }
        else{
            return ""
        }
    }
    
    const handleEmail = (userInstance) => {
        if(userInstance.email.length < 5 || !user.email.includes('@')){
            return "Email should be at least 5 symbols and contain '@' sign"
        }
        else{
            return ""
        }
    }

    const handleUsername = (userInstance) => {
        if(userInstance.username.length < 5){
            return "Username should be at least 5 symbols"
        }
        else{
            return ""        
        }
    }


    const isValid = (userInstance)=> {
        setUserError({password:handlePassword(userInstance),email:handleEmail(userInstance),username:handleUsername(userInstance)})
        console.log(userError)
        if(userError.email === "" && userError.password === "" && userError.username === "")
        {
            console.log("Validation",true)
            return true
        }
        else{
            console.log("Validation",false)
            return false
        }

    }

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
                    const res = await axios.post(`http://127.0.0.1:8000/api/register/`,user)
                    console.log(res)
                    if(res.statusText == "Created")
                    setToRedirect(true)

                }
                catch(error)
                {
                    console.log(error)
                }
                
            }

            if(isValid(user)){
                HandleAdd()
            }

        }
    },[toAdd])

    if(toRedirect === true){
        return <Redirect to = "/login/" />
    }
    
    return(
        <div className = "form">
        <Link className = "GoBack" to = '/login'>Login</Link>
        <div className = "formAdd">


        <h1 style = {{margin:"1em auto " }}>Register</h1>
        <form>
            <div className="mb-3" >
                <label 
                className="form-label">
                    Email address</label>
                <input type="text"
                       className="form-control"
                       id="exampleInputEmail1" 
                       aria-describedby="emailHelp"  
                       onChange = {e=>{setUser({...user,email:e.target.value})}} />
            </div>
            <div className="error" style = {{color:"red",fontWeight:"350",fontSize:"0.8em"}}> {userError.email}</div>
            <div className="mb-3" >
                <label className="form-label">Username</label>
                <input className="form-control" type="text"  onChange = {e=>{setUser({...user,username:e.target.value})}}/>
            </div>
            <div className="error" style = {{color:"red",fontWeight:"350",fontSize:"0.8em"}}> {userError.username}</div>
            <div className="mb-3" >
                <label className="form-label">Password</label>
                <input type="password"
                       className="form-control" 
                       onChange = {e=>{setUser({...user,password:e.target.value})}} />
            </div>
            <div className="error" style = {{color:"red",fontWeight:"350",fontSize:"0.8em"}}> {userError.password}</div>
            <input type="submit" 
                   value="Submit" 
                   className="btn btn-success btn-lg" 
                   style = {{margin:"1em"}} onClick = {(e)=>{
                                                            e.preventDefault(setToAdd(!toAdd))
                                                            }}/>
        </form> 
        </div>
        </div>
    )
}