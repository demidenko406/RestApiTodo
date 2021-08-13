import './App.css';
import React, { Component } from 'react'


class TaskList extends Component{
  constructor(props){
    super(props)

    this.state = {
      tasks:[
        {
          "id": 1,
          "title": "Task1",
          "description": "",
          "complete": false,
          "due_date": null,
          "user": 1,
        },        
        {
          "id": 2,
          "title": "Task2",
          "description": "",
          "complete": false,
          "due_date": null,
          "user": 1,
        },
      ]
    }
  }
  render(){
    return(
      <div style = {{display:"flex"}}>

        <div>
          {this.state.tasks.map((task)=>
            <div style = {{ display:"flex" }}  >
              <h1>{task.title}</h1>
              <button style = {{ margin:"10px"}}>Delete</button>
              <button style = {{ margin:"10px"}}>Complete</button>
            </div>
          )}
        </div>
      </div>
    )
  }
}


function NavBar() {
  return (
    <div className="NavBar" style = {{textAlign:"center"}}>
      <h1>Hello Kalacey</h1>
    </div>
  );
}

export default NavBar;
