import { Collection, CollectionDocument } from 'schemas/collection.schema';
import { IListResponseDto, ListResponseDto } from './ListResponse.dto';
import { ApiProperty } from '@nestjs/swagger';

export interface IUserProfileDto<T> {
    _id: string;
    email: string;
    username: string;
    collections?: IListResponseDto<T>;
}

export class UserProfileDto<D> implements IUserProfileDto<D> {
    @ApiProperty()
    _id: string;

    @ApiProperty()
    email: string;
    @ApiProperty()
    username: string;

    @ApiProperty()
    collections: IListResponseDto<D>;

    constructor({ _id, email, username, collections }: IUserProfileDto<D>) {
        this._id = _id;
        this.email = email;
        this.username = username;
        this.collections = collections;
    }
}
