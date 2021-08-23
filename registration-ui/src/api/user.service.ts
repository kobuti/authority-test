import axios from "axios";
import { Config } from '../configs/config';

export class UserAddress {
  userAddressId: string | undefined;
  zipCode: string | undefined;
  streetAddress: string | undefined;
  buildNumber: string | undefined;
  neighborhood: string | undefined;
  city: string | undefined;
  state: string | undefined;

  constructor(partial: Partial<UserAddress>) {
    Object.assign(this, partial);
  }
}
export class User {
    userId: string | undefined;
    name: string | undefined;
    email: string | undefined
    password: string | undefined
    passwordConfirmation: string | undefined
    userAddress: UserAddress | undefined

    constructor(partial: Partial<User>){ 
      if (!partial.userAddress) {
        this.userAddress = new UserAddress({});
      }

      Object.assign(this, partial);
    }
}

export class UserService {
  async getUsers(token: string): Promise<User[]> {
      try {
        const { data } = await axios.get(`${Config.baseUrl}/users/`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${token}`
          }
        });
    
        return data;
      } catch(e) {
        throw new Error(e.message);
      }
  }

  async getUser(token: string, email: string): Promise<User> {
    try {
        const { data } = await axios.get(`${Config.baseUrl}/users/${email}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${token}`
          }
        });
    
        return data;
      } catch(e) {
        throw new Error(e.message);
      }
  }

  validatePassword(user: User): boolean {
    return (user.password === user.passwordConfirmation) ;
  }

  async createUser(user: User) {

    if (this.validatePassword(user)) {
      const { data } = await axios.post(`${Config.baseUrl}/users`, user, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return [data, null];
    } else {
      return [null, 'The password field did not match with confirmation'];
    }
  }

  async updateUser(userToken: string, user: User) {
    const { data } = await axios.patch(`${Config.baseUrl}/users`, user, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${userToken}`
        }
      });

    return data;
  }
}