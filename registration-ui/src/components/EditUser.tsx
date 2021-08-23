import { useState, FC, useEffect } from 'react';
import { ZipcodeService } from '../api/zip.code.service';
import { User, UserService } from '../api/user.service';
import PropTypes from 'prop-types';
import { useRouteMatch } from 'react-router-dom';

interface Props {
  userToken: string
}

const EditUser: FC<Props> = ({ userToken }) => {
  const service = new UserService();
  const match: any = useRouteMatch("/users/edit/:id");
  const [errorMessage, setErrorMessage] = useState('');
  const [editingObject, setEditingObject] = useState(new User({}));

  const getUser = () => {
    service.getUser(userToken, String(match?.params.id))
      .then(result => {
        setEditingObject(result);
      });
  }

  useEffect(() => getUser(), [editingObject.name]);

 
  const [buildNumber, setBuildNumber] = useState('');

  const handleInputChange = (e: any) => {
    e.preventDefault();
    
    let value = e.target.value;

    if (e.target.name === 'zipcode' && !/^[0-9]*$/gm.test(e.target.value)) {
      const previousValue = editingObject["userAddress"];

      if (previousValue != null)
      value = previousValue.zipCode;
    }
    
    setEditingObject(inputs => ({
      ...inputs, 
      [e.target.name]: value
    }));
  }

  const lookupAddress = async (e: any) => {
    if (/^[0-9]*$/gm.test(e.target.value)) {

        const service = new ZipcodeService();

        service.getZipcode(e.target.value)
          .then(result => {
            handleInputChange(result);
          });
    }
  }

  const handleEditUser = async (e: any) => {
    e.preventDefault();
    try {
      const service = new UserService();
      const [data, error] = await service.editUser({
        ...editingObject
      });
      
      if (!error) {
        window.location.href = '/users'
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

  return(  
    <div className="signup-wrapper">
      <h2>Edit your information</h2>
        <form onSubmit={handleEditUser}>
        <label>
          <p>Name</p>
          <input required type="text" name='name'
                 readOnly={true}
                 value={editingObject.name} onChange={handleInputChange}/>
        </label>
        <label>
          <p>E-mail</p>
          <input required type="text" name='email' value={editingObject.email}
                 readOnly={true} />
        </label>
        <label>
          <p>Zip code</p>
          <input required type="text" name='zipcode' value={editingObject?.userAddress?.zipCode}
                              onChange={handleInputChange}
                              onBlur={lookupAddress}
                              maxLength={8}
                              minLength={8}/>
        </label>
        <label>
          <p>Street Address</p>
          <input type="text" value={editingObject?.userAddress?.streetAddress}/>
        </label>
        <label>
          <p>Build no</p>
          <input required type="text" onChange={e => setBuildNumber(e.target.value)}/>
        </label>
        <label>
          <p>Neighborhood</p>
          <input type="text" value={editingObject?.userAddress?.neighborhood}/>
        </label>
        <label>
          <p>City</p>
          <input type="text" value={editingObject?.userAddress?.city}/>
        </label>
        <label>
          <p>State</p>
          <input type="text" value={editingObject.userAddress?.state}/>
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
      </form>
      { errorMessage ? <div style={errorStyle}>{errorMessage}</div> : null }
    </div>
  );
}

EditUser.propTypes = {
  userToken: PropTypes.string.isRequired
}

export default EditUser;