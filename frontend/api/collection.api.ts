import axios, { AxiosInstance } from 'axios';

export class CollectionApi {
  private static api: AxiosInstance;
  constructor(baseUrl: string) {
    CollectionApi.api = axios.create({ baseURL: baseUrl });
  }
}
