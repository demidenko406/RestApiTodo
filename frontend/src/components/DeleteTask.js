import React from 'react'
import axios from 'axios'
import { Redirect,useParams} from 'react-router-dom'
import { useState,useEffect,useRef } from 'react'
import './delete-submit.css'

export function TaskDelete()
{
    let { id } = useParams()
    const firstUpdate = useRef(true);
    const [toDelete,setToDelete] = useState(false)
    const [toRedirect,setToRedirect] = useState(false)


    useEffect(()=>{
        if(firstUpdate.current)
        {
            firstUpdate.current=false
        }
        else{
                
            async function HandleDelete()
            {
                try
                {
                await axios.delete(`http://127.0.0.1:8000/api/task/${id}`)
                setToRedirect(true)
                }
                catch(error)
                {
                    console.log(error);
                }
                
            }
            HandleDelete()

        }
    },[toDelete])

    if(toRedirect===true){
        return <Redirect to = "/" />
    }

    return(
        <>
        <div id = "delete">
            <h3>Are you sure you want to delete this task?</h3>
            <button style = {{ margin:"10px",float:"right"}} className="btn btn-outline-success"onClick={()=>setToRedirect(true)}>No</button>
            <button style = {{ margin:"10px",float:"left"}} className="btn btn-outline-danger" onClick={()=>setToDelete(true)}>Yes</button>
        </div>
        </>
    )


}
