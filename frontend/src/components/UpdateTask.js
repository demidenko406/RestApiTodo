import React, { useEffect,useRef } from 'react'
import axios from 'axios'
import { Redirect,useParams,useLocation} from 'react-router-dom'
import { useState } from 'react'



export function TaskUpdate(props)
{
    const location = useLocation()
    const { tasks,tags } = location.state
    // const { tags } = location.state.tags
    const [data,setData] = useState(tasks)
    const [toAdd,setToAdd] = useState(false)
    const [toRedirect,setToRedirect] = useState(false)
    const firstUpdate = useRef(true);

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
                await axios.put(`http://127.0.0.1:8000/api/task/${data.id}/`,data)
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
        <div className="formAdd">
            <div className="mb-3">
            <label  className="form-label">TaskName</label>
            <input type="name" className="form-control" id="exampleFormControlInput1" defaultValue = {data.title} onChange = {(e) => {setData({...data,title:e.target.value})}} ></input>
            </div>
            <div className="mb-3">
            <label className="form-label" >Description</label>
            <textarea className="form-control" id="exampleFormControlTextarea1" rows="3" defaultValue = {data.description} onChange = {(e) => {setData({...data,description:e.target.value})}}></textarea>
            </div>
            <div className="mb-3">
            <label className="form-label" placeholder="MM-DD-YY" >Date</label>
            <input type="date" className="form-control" id="exampleFormControlInput1" defaultValue = {data.due_date} onChange = {(e) => {setData({...data,due_date:e.target.value})}}/>
            </div>
            <input type="submit" value="Submit" className="btn btn-primary btn-lg" onClick = {()=>(setToAdd(true))}/>
            <select className="form-select" multiple onChange = {(e) => {setData({...data,tag:Array.from(e.target.selectedOptions,option => option.value)})}}>
                {tags.map((tag)=>{
                    if(data.tag.includes(tag.id)){
                        return <option key = {tag.id} value = {parseInt(tag.id)} selected = {true}>{tag.title}</option>
                    }
                    else{
                        return <option key = {tag.id} value = {parseInt(tag.id)}>{tag.title}</option>
                    }
                })}
                
            </select>
      </div>
    )
}