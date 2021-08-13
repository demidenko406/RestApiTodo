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

class TagList extends Component{
  constructor(props){
    super(props)

    this.state = {
      tags:[
        {
          "id": 1,
          "title": "Tag1",
        },        
        {
          "id": 2,
          "title": "Tag2",
        },
      ]
    }
  }
  render(){
    return(
      <div>
        {this.state.tags.map((tag)=>
          <h1 style = {{padding:"1em",margin:"0em 0em 0em 10em", border:"solid",borderWidth:"1px 0px 1px 0px",}}>{tag.title}</h1>
        )}
      </div>
    )
  }
}

function App() {
  return (
    <div className="App">
      <div style = {{display:"flex"}}>
        <TagList />
        <div style = {{margin:"0 0 0 60em"}}><TaskList /></div>
      </div>
    </div>
  );
}

export default App;
