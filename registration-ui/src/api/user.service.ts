import axios from "axios";

export class UserAddress {
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
    id: string | undefined;
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
        const { data } = await axios.get(`http://localhost:8081/users/`, {
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
        const { data } = await axios.get(`http://localhost:8081/users/${email}`, {
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
      const { data } = await axios.post('http://localhost:8081/users', user, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return [data, null];
    } else {
      return [null, 'The password field did not match with confirmation'];
    }
  }

  async editUser(user: User) {
    const { data } = await axios.patch(`http://localhost:8081/users/${user.email}`, user, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

    return data;
  }
}