import './App.css';
import { useState } from 'react';
import { Route, Switch, Link, BrowserRouter } from 'react-router-dom';
import ListUsers from './components/ListUsers';
import EditUser from './components/EditUser';
import Login from './components/Login';
import Register from './components/Register';
import { Config } from './configs/config';

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
      window.location.href = `/users`;
  }

  const unsetToken = () => {
    sessionStorage.removeItem('token');
    window.location.reload();
  }

  if (/\/register$/.test(window.location.href)) {
    return <Register />
  }

  return !token ? (
    <Login setToken={setToken} shouldRedirect={setLogged}/>
  ) : (
    <div className="wrapper">
      <BrowserRouter>
        <ul>
          <li><Link to='/users'>List of users registered</Link></li>
          <li><Link to='#' onClick={unsetToken}>Logout</Link></li>
        </ul>
        
        <Switch>
          <Route exact path="/users">
            <ListUsers userToken={token}/>
          </Route>
          <Route exact path="/users/edit/:id">
            <EditUser userToken={token}/>
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}
export default App;
