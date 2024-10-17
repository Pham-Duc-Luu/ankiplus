export interface IShortCollectionDto {
  _id: string;
  name: string;
  createdAt?: string;
}

export interface IListResponseDto<T = unknown> {
  total?: number;
  skip?: number;
  limit?: number;
  data?: T[];
}

export interface IUserProfileDto {
  _id: string;

  email: string;
  username: string;
  collections?: IListResponseDto<IShortCollectionDto>;
}

export interface IQueryOptions {
  limit?: number;
  skip?: number;
  sort?: "asc" | "desc";
  selects?: string;
}
