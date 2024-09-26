import { IProfile } from '@/hooks/useProfile';
import axios, { AxiosInstance } from 'axios';

export class UserAxios {
  private axiosInstance: AxiosInstance;
  constructor(private baseUrl: string) {
    this.axiosInstance = axios.create({
      baseURL: baseUrl + '/user', // Change base URL accordingly
      timeout: 5000, // Optional timeout
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
      },
    });
  }

  async getProfile() {
    return this.axiosInstance.get<IProfile>('/profile');
  }
}
