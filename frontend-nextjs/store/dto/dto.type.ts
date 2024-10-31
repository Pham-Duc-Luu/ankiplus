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

export interface CollectionType {
  _id: string;
  id: string;

  name: string;

  description?: string;

  thumnail?: string;

  icon?: string;

  isPublic: boolean;

  language: string;

  cards?: string[];

  owner: string; // Reference to the User schema
  createdAt: Date;
  updatedAt: Date;
}
export interface CollectionDto extends CollectionType {}
export interface UpdateCollectionDto
  extends Pick<
    CollectionType,
    "description" | "icon" | "isPublic" | "language" | "name" | "thumnail"
  > {}

export interface IFlashCardDto {
  _id: string;
  id: string;

  front: string;
  back: string;
}

export interface CreateCollectionDto {
  name: string;

  description?: string;

  icon?: string;

  thumnail?: string;

  isPublic?: boolean;

  language?: string;

  flashCards?: flashCardDto[];
}

export interface flashCardDto {
  front: string;
  back: string;
}
