import { useState, FC, useEffect } from 'react';
import { ZipcodeService } from '../api/zip.code.service';
import { User, UserService } from '../api/user.service';
import PropTypes from 'prop-types';
import { useRouteMatch } from 'react-router-dom';
import setProp from 'nested-property';
import { Config } from '../configs/config';

interface Props {
  userToken: string
}

const EditUser: FC<Props> = ({ userToken }) => {  
  const service = new UserService();
  const match: any = useRouteMatch("/users/edit/:id");
  const [finished, setFinished] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [editingObject, setEditingObject] = useState(new User({}));

  const getUser = () => {
    service.getUser(userToken, String(match?.params.id))
      .then(result => {
        setEditingObject(result);
        setFinished(true);
      });
  }

  useEffect(() => getUser(), [finished]);

  const handleInputChange = (e: any) => {
    e.preventDefault();
    
    if (e.target.name === 'userAddress.zipCode') {
      e.target.value = e.target.value.replace(/[^\d]/gm, '');
    }
    
    setEditingObject((inputs: User) => {
      setProp.set(inputs, e.target.name, e.target.value);
      return {
        ...inputs
      };
    });
  }

  const lookupAddress = async (e: any) => {
    if (/^[0-9]*$/gm.test(e.target.value)) {

        const service = new ZipcodeService();
        
        service.getZipcode(e.target.value)
          .then(result => {
            
            const newObj = { ...editingObject};
        
            newObj.userAddress = {
              ...result,
              userAddressId: newObj.userAddress?.userAddressId,
              buildNumber: ''
            };

            setEditingObject(newObj);
          });
    }
  }

  const handleEditUser = async (e: any) => {
    e.preventDefault();
    try {
      const service = new UserService();
      await service.updateUser(userToken, editingObject);
      
      window.location.href = `/users`;
    } catch(e) {
      setErrorMessage(e.response?.data?.message);
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
                 value={editingObject.name}
                 onChange={handleInputChange}/>
        </label>
        <label>
          <p>E-mail</p>
          <input required type="text" name='email' value={editingObject.email}
                 readOnly={true} />
        </label>
        <label>
          <p>Zip code</p>
          <input required type="text" name='userAddress.zipCode' 
                          value={editingObject?.userAddress?.zipCode}
                          onChange={handleInputChange}
                          onBlur={lookupAddress}
                          maxLength={8}
                          minLength={8}/>
        </label>
        <label>
          <p>Street Address</p>
          <input type="text" name="userAddress.streetAddress"
                 value={editingObject?.userAddress?.streetAddress}/>
        </label>
        <label>
          <p>Build no</p>
          <input required type="text" name="userAddress.buildNumber"
                 value={editingObject?.userAddress?.buildNumber}
                 onChange={handleInputChange}/>
        </label>
        <label>
          <p>Neighborhood</p>
          <input type="text" name="userAddress.neighborhood"
                 value={editingObject?.userAddress?.neighborhood}/>
        </label>
        <label>
          <p>City</p>
          <input type="text" name="userAddress.city"
                 value={editingObject?.userAddress?.city}/>
        </label>
        <label>
          <p>State</p>
          <input type="text"  name="userAddress.state"
                 value={editingObject.userAddress?.state}/>
        </label>
        
        <label>
          <p>Password</p>
          <input type="password" name='password' onChange={handleInputChange}/>
        </label>
        <label>
          <p>Password Confirmation</p>
          <input type="password" name='passwordConfirmation' onChange={handleInputChange}/>
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