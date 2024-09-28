import axios, { AxiosInstance } from 'axios';

export interface ICollectionParmas {
  id?: string;
}
export interface flashCardDto {
  front: string;
  back: string;
}
export interface CreateCollectionBody {
  name: string;
  description?: string;
  flashCards: flashCardDto[];
}

export class CollectionUserAxios {
  private axiosInstance: AxiosInstance;
  private baseUrl = '';
  constructor(public url: string) {
    this.baseUrl = url + 'collections';

    this.axiosInstance = axios.create({
      baseURL: url + '/user', // Change base URL accordingly
      timeout: 5000, // Optional timeout
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
      },
    });
  }

  // TODO: get the collection by the id
  async getCollection({ id }: ICollectionParmas) {
    let url = '';
    if (id) {
      url = url + '/' + id;
    }
    return this.axiosInstance.get(url);
  }

  async createCollection(data: CreateCollectionBody) {
    return this.axiosInstance.post('', data);
  }
}
