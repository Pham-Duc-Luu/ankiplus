import { IProfile } from '@/hooks/useProfile';
import axios, { AxiosInstance } from 'axios';
import { CollectionUserAxios } from './collection.user.axios';

export class UserAxios {
  private axiosInstance: AxiosInstance;
  private baseUrl = '';
  constructor(public url: string) {
    this.baseUrl = url + '/user';
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl, // Change base URL accordingly
      timeout: 5000, // Optional timeout
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
      },
    });
  }
  public collection = new CollectionUserAxios(this.baseUrl);

  async getProfile() {
    return this.axiosInstance.get<IProfile>('profile');
  }
}
