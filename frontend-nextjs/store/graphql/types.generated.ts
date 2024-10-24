export type Maybe<T> = T;
export type InputMaybe<T> = T;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
};

export type CollectionGqlObject = {
  __typename?: 'CollectionGQLObject';
  _id: Scalars['String']['output'];
  cards?: Maybe<Array<Scalars['String']['output']>>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  icon?: Maybe<Scalars['String']['output']>;
  isPublic?: Maybe<Scalars['Boolean']['output']>;
  language?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  owner: Scalars['String']['output'];
  thumnail?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type CollectionQueryGqlObject = {
  __typename?: 'CollectionQueryGQLObject';
  data: Array<CollectionGqlObject>;
  limit: Scalars['Int']['output'];
  skip: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type FlashCardGqlObject = {
  __typename?: 'FlashCardGQLObject';
  SRS: SrsgqlObject;
  _id: Scalars['String']['output'];
  back: Scalars['String']['output'];
  front: Scalars['String']['output'];
  inCollection: Scalars['String']['output'];
};

export type FlashCardQueryGqlObject = {
  __typename?: 'FlashCardQueryGQLObject';
  data: Array<FlashCardGqlObject>;
  limit: Scalars['Int']['output'];
  skip: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type Query = {
  __typename?: 'Query';
  getCollectionFlashCards: FlashCardQueryGqlObject;
  getUserCollections: CollectionQueryGqlObject;
};


export type QueryGetCollectionFlashCardsArgs = {
  collection_id: Scalars['String']['input'];
  limit?: Scalars['Int']['input'];
  order?: Scalars['String']['input'];
  skip?: Scalars['Int']['input'];
  sortBy?: Scalars['String']['input'];
};


export type QueryGetUserCollectionsArgs = {
  limit?: Scalars['Int']['input'];
  order?: Scalars['String']['input'];
  skip?: Scalars['Int']['input'];
  sortBy?: Scalars['String']['input'];
};

export type SrsgqlObject = {
  __typename?: 'SRSGQLObject';
  _id: Scalars['String']['output'];
  efactor: Scalars['Float']['output'];
  interval: Scalars['Float']['output'];
  nextReviewDate: Scalars['DateTime']['output'];
};
