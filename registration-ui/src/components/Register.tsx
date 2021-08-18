import React, { useState, FC } from 'react';
import axios from 'axios';

const ListUsers = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const handleRegister = async (e: any) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:8081/users', { 
        name,
        email, 
        password,
        passwordConfirmation
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setRegistrationSuccess(true);
      setErrorMessage('');
    } catch(e) {
      setErrorMessage(e.response.data.message);
    }
  }

  const errorStyle = {
    color: 'red'
  };

  return(  
    <div className="signup-wrapper">
      <h2>Join us!</h2>
      {
        !registrationSuccess ?
          (<form onSubmit={handleRegister}>
            <label>
              <p>Name</p>
              <input type="text" onChange={e => setName(e.target.value)}/>
            </label>
            <label>
              <p>E-mail</p>
              <input type="text" onChange={e => setEmail(e.target.value)}/>
            </label>
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
            { errorMessage ? <div style={errorStyle}>{errorMessage}</div> : null }
          </form>
          ) : (
            <div>
              <p>Registered successfully</p>
              <p>You can now <a href='/login'>login</a> into your account</p>
            </div>
          )
      }
    </div>
  ) ;
}

export default ListUsers;