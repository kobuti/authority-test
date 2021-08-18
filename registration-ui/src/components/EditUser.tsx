import React, { useState, FC } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

interface Props {
  userToken: string
}

const EditUser: FC<Props> = (userToken) => {
  const [errorMessage, setErrorMessage] = useState('');

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  
  const handleEdit = async (e: any) => {
    e.preventDefault();
    try {
      const { data } = await axios.patch('http://localhost:8081/users', {
        name, password, passwordConfirmation
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${userToken}`
        }
      });

    } catch(e) {
      setErrorMessage(e.response.data.message);
    }
  }

  const getUser = async (userToken: string) => {
    try {
      const { data } = await axios.get('http://localhost:8081/users', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${userToken}`
        }
      });

      setEmail(data.email);
      setName(data.name);
    } catch(e) {
      setErrorMessage(e.response.data.message);
    }
  }

  getUser(userToken.userToken);

  const errorStyle = {
    color: 'red'
  };

  return(
    <div className="login-wrapper">
      <h2>Edit Personal Information</h2>
      <form onSubmit={handleEdit}>
        <label>
          <p>E-mail</p> 
          <input type="text" value={email} />
        </label>
        <label>
          <p>Name</p>
          <input type="text" onChange={e => setName(e.target.value)}/>
        </label>
        <div>
          <br />
          <hr/>
          <b>Change your password</b>
        </div>
        <label>
          <p>Password</p>
          <input type="password" onChange={e => setPassword(e.target.value)}/>
        </label>
        <label>
          <p>Password Confirmation</p>
          <input type="password" onChange={e => setPasswordConfirmation(e.target.value)}/>
        </label>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
      {
        errorMessage ? <div style={errorStyle}>{errorMessage}</div> : null
      }
    </div>
  );
}

EditUser.propTypes = {
  userToken: PropTypes.string.isRequired
}

export default EditUser;