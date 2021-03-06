import { useState, FC } from 'react';
import { Config } from '../configs/config';
import PropTypes from 'prop-types';
import axios from 'axios';

interface IProps {
  setToken: Function
  shouldRedirect: Function
}

const Login: FC<IProps> = ({ setToken, shouldRedirect }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const errorStyle = {
    color: 'red'
  };

  const handleLogin = async (e: any) => {
    e.preventDefault();
    try {
      const authToken = Buffer.from(`${email}:${password}`).toString('base64');
      const { data } = await axios.post(`${Config.baseUrl}/users/login`, null, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${authToken}`
        }
      });

      setToken(data.token);
      shouldRedirect(true);
    } catch(e) {
      setErrorMessage(e.response?.data?.error || e.reponse?.data?.message);
    }
  }

  return(
      <div className="login-wrapper">
        <h1>Log In</h1>
        <form onSubmit={handleLogin}>
          <label>
            <p>E-mail</p>
            <input type="text" onChange={e => setEmail(e.target.value)}/>
          </label>
          <label>
            <p>Password</p>
            <input type="password" onChange={e => setPassword(e.target.value)}/>
          </label>
          <div>
            <button type="submit">Submit</button>
          </div>
        </form>
        { errorMessage ? <div style={errorStyle}>{errorMessage}</div> : null }
        <span>Not registered yet? <a href='/register'>Sign up</a></span>

      </div>
  );
}

Login.propTypes =  {
  setToken: PropTypes.func.isRequired,
  shouldRedirect: PropTypes.func.isRequired
}

export default Login;