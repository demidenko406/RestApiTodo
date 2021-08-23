import './App.css';
import { List } from './components/List';
import { NavBar } from './components/NavBar';
import { TaskDelete } from './components/DeleteTask';
import { TaskCreate } from './components/AddTask';
import { TaskUpdate } from './components/UpdateTask';
import { TagList } from './components/TagView';
import { TagCreate } from './components/AddTag';
import { TagDelete } from './components/DeleteTag';

import{
  BrowserRouter,
  Route,
} from "react-router-dom";
import { Register } from './components/Register';
import { Login } from './components/Login';


function App() {
  return (
    <BrowserRouter>
    <div className="App">
      <Route exact path="/">
        <>
          <NavBar />
          <List />
        </>
      </Route>
      <Route exact path="/tag/:id/">
      <>
          <NavBar />
          <TagList />
        </>
      </Route>
      <Route exact path="/delete-task/:id/">
        <TaskDelete />
      </Route>
      <Route exact path="/create-task/">
        <TaskCreate />
      </Route>
      <Route exact path="/update-task/:id/">
        <TaskUpdate />
      </Route>
      <Route exact path="/create-tag/">
        <TagCreate />
      </Route>
      <Route exact path="/delete-tag/:id/">
        <TagDelete/>
      </Route>
      <Route exact path="/register/">
        <Register/>
      </Route>
      <Route exact path="/login/">
        <Login/>
      </Route>
    </div> 
    </BrowserRouter>
  );
}

export default App;
