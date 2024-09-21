import axios, { AxiosInstance } from 'axios';

export interface SignIn {
  email: string;
  password: string;
}

export class UserApi {
  private api: AxiosInstance;
  constructor(baseUrl: string) {
    this.api = axios.create({ baseURL: baseUrl });
  }

  signIn(data: Partial<SignIn>) {
    return this.api.post<string>(
      '/sign-in',
      data
    );
  }
}
