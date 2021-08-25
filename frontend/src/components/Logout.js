import React, { useState, useEffect } from 'react';
import axiosInstance from '../axios';
import { useHistory,Redirect } from 'react-router-dom';

export function Logout() {
    const [toRedirect,setToRedirect] = useState(false)
	const history = useHistory();

	useEffect(() => {
		const response = axiosInstance.post('http://127.0.0.1:8000/api/logout/', {
			refresh_token: localStorage.getItem('refresh_token'),
		});
		localStorage.removeItem('access_token')
		localStorage.removeItem('refresh_token')
		axiosInstance.defaults.headers['Authorization'] = null
        setToRedirect(true)
	});

    if(toRedirect===true){
        return <Redirect to = "/login" />
    }
	return <div>Logout</div>;
}
