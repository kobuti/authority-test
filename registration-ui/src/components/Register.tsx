import { useState } from 'react';
import { ZipcodeService } from '../api/zip.code.service';
import { User, UserService } from '../api/user.service';

const Register = () => {
  const [registrationObject, setRegistrationObject] = useState(new User({}));
  const [buildNumber, setBuildNumber] = useState('');

  const handleInputChange = (e: any) => {
    e.preventDefault();
    
    let value = e.target.value;

    if (e.target.name === 'zipcode' && !/^[0-9]*$/gm.test(e.target.value)) {
      const previousValue = registrationObject["userAddress"];
      
      if (previousValue != null)  {
        value = previousValue.zipCode;
      }
    }
    
    setRegistrationObject(inputs => ({
      ...inputs, 
      [e.target.name]: value
    }));
  }

  const [errorMessage, setErrorMessage] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const handleRegister = async (e: any) => {
    e.preventDefault();
    try {
      const service = new UserService();
      const [data, error] = await service.createUser(registrationObject);
      
      if (!error) {
        setRegistrationSuccess(true);
        setErrorMessage('');
      } else {
        setErrorMessage(error);
      }
      
    } catch(e) {
      setErrorMessage(e.response.data.message);
    }
  }

  const errorStyle = {
    color: 'red'
  };

  const lookupAddress = async (e: any) => {
    if (/^[0-9]*$/gm.test(e.target.value)) {

      const service = new ZipcodeService();

      service.getZipcode(e.target.value)
        .then(result => {
          handleRegister(result);
        });
    }
  }

  return(  
    <div className="signup-wrapper">
      <h2>Registration</h2>
      {
        !registrationSuccess ?
          (<form onSubmit={handleRegister}>
            <label>
              <p>Name</p>
              <input required type="text" name='name' onChange={handleInputChange}/>
            </label>
            <label>
              <p>E-mail</p>
              <input required type="text" name='email' onChange={handleInputChange}/>
            </label>
            <label>
              <p>Zip code</p>
              <input required type="text" value={registrationObject?.userAddress?.zipCode} name='zipCode' onChange={handleInputChange}
                                 onBlur={lookupAddress}
                                 maxLength={8}
                                 minLength={8}
                                 />
            </label>
            <label>
              <p>Street Address</p>
              <input type="text" value={registrationObject?.userAddress?.streetAddress}/>
            </label>
            <label>
              <p>Build no</p>
              <input required type="text" onChange={e => setBuildNumber(e.target.value)}/>
            </label>
            <label>
              <p>Neighborhood</p>
              <input type="text" value={registrationObject?.userAddress?.neighborhood}/>
            </label>
            <label>
              <p>City</p>
              <input type="text" value={registrationObject?.userAddress?.city}/>
            </label>
            <label>
              <p>State</p>
              <input type="text" value={registrationObject?.userAddress?.state}/>
            </label>
            
            <label>
              <p>Password</p>
              <input required type="password" name='password' onChange={handleInputChange}/>
            </label>
            <label>
              <p>Password Confirmation</p>
              <input required type="password" name='passwordConfirmation' onChange={handleInputChange}/>
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

export default Register;