import { CollectionApi } from './collection.api';
import { UserApi } from './User.api';

export class ApiService {
  private static baseUrl: string = 'http://localhost:5000';
  private static instance: ApiService; // Static variable to hold the single instance
  public collections: CollectionApi = new CollectionApi(ApiService.baseUrl);
  public users: UserApi = new UserApi(ApiService.baseUrl);

  constructor() {}
  public getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService(); // Create the instance if it doesn't exist
    }
    return ApiService.instance; // Return the same instance
  }
}
const api = new ApiService();
export { api };
