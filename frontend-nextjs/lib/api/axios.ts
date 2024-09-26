import axios from 'axios';
import { UserAxios } from './user.axios';

export interface ISignInBody {
  email: string;
  password: string;
}

export interface JWTToken {
  access_token: string;
  refresh_token: string;
}

export class AxiosApi {
  private baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'localhost';
  private axiosInstance = axios.create({
    baseURL: this.baseURL, // Change base URL accordingly
    timeout: 5000, // Optional timeout
  });

  public userApi = new UserAxios(this.baseURL);
  async signIn(data: ISignInBody) {
    return this.axiosInstance.post<JWTToken>('sign-in', data);
  }
}

export const axiosApi = new AxiosApi();
