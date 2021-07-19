import axios from 'axios';

const API_URL = 'http://localhost:8080';

export default class Validator {
  static async requestOTP(phone: string): Promise<boolean> {
    try {
      const body = {
        phone
      };

      const {data: result} = await axios.post(`${API_URL}/users/generateOTP`, body);
      if (result.status === 'ok') {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log('Error in requestOTP');
      console.log(error);
      return false;
    }
  }

  static async validateOTP(phone: string, otp: string): Promise<boolean> {
    try {
      const body = {
        phone,
        otp
      };

      const {data: result} = await axios.post(`${API_URL}/users/validateOTP`, body);
      if (result.status === 'ok') {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log('Error in validateOTP');
      console.log(error);
      return false;
    }
  }
}