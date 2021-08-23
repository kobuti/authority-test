import axios from "axios";

export class Zipcode {
  streetAddress: string;
  neighborhood: string;
  city: string;
  state: string;

  constructor(partial: Partial<Zipcode>) {
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
            const { data } = await axios.get(`http://localhost:8081/zipcode/${zipCode}`, {
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