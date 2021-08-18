import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import NavBar from './components/NavBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter } from 'react-router-dom'
// import { BrowserRouter,Route,Switch } from "react-router-dom";


ReactDOM.render(
  
  <React.StrictMode>
      {/*   <NavBar /> */}
      <App />
  </React.StrictMode>,
  document.getElementById('root')
);

