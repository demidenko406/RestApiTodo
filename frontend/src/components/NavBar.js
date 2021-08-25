import '../App.css';
import React from 'react'
import { Link,useParams} from 'react-router-dom'


export function NavBar({user}) {
  return (
    // {console.log(this.props)}
    <div className="navbar navbar-dark" style = 
    {{alignItems:"center",margin:"auto",marginTop:"3em",padding:"2em",textAlign:"center",backgroundColor:"#3d3d3d",width:"1000px",  borderRadius:"20px 20px 5px 5px"}}>
      <h1 style = {{textAlign:"left",color:"white"}}>Hello {user}</h1>
      <Link to ="/logout/" style = {{color:"white",textDecoration:"None",float:"right"}}>Logout</Link>
    </div>
  );
}

export default NavBar;
