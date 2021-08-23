

import React from 'react'
import './Form.css'

export function Login()
{
    return(
        <>
        <h1 style = {{margin:"auto"}}>Login</h1>
        <form>
            <div className="mb-3" style = {{width:"800px",margin:"auto",marginTop:"20em"}}>
                <label for="exampleInputEmail1" className="form-label">Email address</label>
                <input type="email" className="form-control" id="exampleInputEmail1" ariaDescribedby="emailHelp" />
                <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
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