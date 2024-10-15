export interface IShortCollectionDto {
  _id: string;
  name: string;
  createdAt: string;
}

export interface IUserProfileDto {
  _id: string;

  email: string;
  username: string;
  collections?: IShortCollectionDto[];
}
