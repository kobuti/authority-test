import { MutableRefObject, useRef, useState } from 'react';
import { Zipcode, ZipcodeService } from '../api/zip.code.service';
import { User, UserService } from '../api/user.service';
import setProp from 'nested-property';

const Register = () => {
  const inputZipcode = useRef<HTMLInputElement>() as MutableRefObject<HTMLInputElement>;
  const inputStreetAddress = useRef<HTMLInputElement>() as MutableRefObject<HTMLInputElement>;
  const inputNeighborhood = useRef<HTMLInputElement>() as MutableRefObject<HTMLInputElement>;
  const inputCity = useRef<HTMLInputElement>() as MutableRefObject<HTMLInputElement>;
  const inputState = useRef<HTMLInputElement>() as MutableRefObject<HTMLInputElement>;
  
  const [registrationObject, setRegistrationObject] = useState(new User({}));

  const handleInputChange = (e: any) => {
    typeof e.preventDefault === 'string' && e.preventDefault();
    
    if (e.target.name === 'userAddress.zipCode') {
      e.target.value = e.target.value.replace(/[^\d]/gm, '');
    }
    
    setRegistrationObject((inputs: User) => {
      setProp.set(inputs, e.target.name, e.target.value)
      return inputs;
    });
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
      setErrorMessage(e.response?.data?.message);
    }
  }

  const errorStyle = {
    color: 'red'
  };

  const lookupAddress = async (e: any) => {
    if (/^[0-9]*$/gm.test(e.target.value)) {

      const service = new ZipcodeService();

      service.getZipcode(e.target.value)
        .then((result: Zipcode) => {
          inputZipcode.current.value = result.zipCode;
          handleInputChange({ target: inputZipcode.current });
          inputStreetAddress.current.value = result.streetAddress;
          handleInputChange({ target: inputStreetAddress.current });
          inputNeighborhood.current.value = result.neighborhood;
          handleInputChange({ target: inputNeighborhood.current });
          inputCity.current.value = result.city;
          handleInputChange({ target: inputCity.current });
          inputState.current.value = result.state;
          handleInputChange({ target: inputState.current });
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
              <input required type="text" name='name'
                     onChange={handleInputChange}/>
            </label>
            <label>
              <p>E-mail</p>
              <input required type="text" name='email' onChange={handleInputChange}/>
            </label>
            <label>
              <p>Zip code</p>
              <input required type="text" value={registrationObject?.userAddress?.zipCode} 
                              ref={inputZipcode}
                              name='userAddress.zipCode' 
                              onChange={handleInputChange}
                              onBlur={lookupAddress}
                              maxLength={8}
                              minLength={8}/>
            </label>
            <label>
              <p>Street Address</p>
              <input type="text" name='userAddress.streetAddress' ref={inputStreetAddress}
                     value={registrationObject?.userAddress?.streetAddress}/>
            </label>
            <label>
              <p>Build no</p>
              <input required type="text" name='userAddress.buildNumber'
                     onChange={handleInputChange}/>
            </label>
            <label>
              <p>Neighborhood</p>
              <input type="text" name='userAddress.neighborhood' ref={inputNeighborhood}
                     value={registrationObject?.userAddress?.neighborhood}/>
            </label>
            <label>
              <p>City</p>
              <input type="text" name='userAddress.city' ref={inputCity}
                     value={registrationObject?.userAddress?.city}/>
            </label>
            <label>
              <p>State</p>
              <input type="text" name='userAddress.state' ref={inputState}
                     value={registrationObject?.userAddress?.state}/>
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