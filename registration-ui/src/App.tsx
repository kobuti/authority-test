import './App.css';
import { useState } from 'react';
import { Route, Switch, BrowserRouter, Link, Router } from 'react-router-dom';
import ListUsers from './components/ListUsers';
import EditUser from './components/EditUser';
import Login from './components/Login';
import Register from './components/Register';
import { history } from './history/browser.history';

const setToken = (token: string): void => {
  sessionStorage.setItem('token', token);
}

const getToken = (): string | null => {
  const userToken: string = JSON.stringify(sessionStorage.getItem('token'));

  return userToken !== 'null' ? userToken : '';
}

const App = () => {
  const [token] = useState(getToken());

  const setLogged = (logged: boolean) => {
    if (logged)
      history.push('/users')
  }

  return !token ? (
    <Login setToken={setToken} shouldRedirect={setLogged}/>
  ) : (
    <div className="wrapper">
      <Router history={history}>
        <ul>
          <li><Link to='/users'>List of users registered</Link></li>
          <li><Link to='/users/edit'>Edit your info</Link></li>
        </ul>
        
        <Switch>
          <Route exact path="/users">
            <ListUsers userToken={token}/>
          </Route>
          <Route exact path="/users/edit">
            <EditUser userToken={token}/>
          </Route>
          <Route path="/register">
            <Register />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
