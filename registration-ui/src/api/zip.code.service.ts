import axios from "axios";
import { Config } from '../configs/config';

export class Zipcode {
  zipCode: string;
  streetAddress: string;
  neighborhood: string;
  city: string;
  state: string;

  constructor(partial: Partial<Zipcode>) {
    this.zipCode = '';
    this.streetAddress = '';
    this.neighborhood = '';
    this.city = '';
    this.state = '';
    Object.assign(this, partial);
  }
}

export class ZipcodeService {
    async getZipcode(zipCode: string): Promise<Zipcode> {
        try {
            const { data } = await axios.get(`${Config.baseUrl}/zipcode/${zipCode}`, {
              headers: {
                'Content-Type': 'application/json'
              }
            });
        
            return new Zipcode(data);
          } catch(e) {
            throw new Error(e.message);
          }
    }
}