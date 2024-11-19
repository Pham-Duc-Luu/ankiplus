import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsStrongPassword } from 'class-validator';
import { IListResponseDto } from './ListResponse.dto';

export class CreateUserDto {
    @ApiProperty()
    @IsEmail()
    email: string;
    @ApiProperty()
    @IsStrongPassword()
    password: string;
    @ApiProperty()
    username: string;
}

export class LoginUserDto {
    @ApiProperty()
    @IsEmail()
    email: string;

    // @IsStrongPassword()
    @ApiProperty()
    @IsStrongPassword()
    password: string;
}

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

export interface IOAuthGoogleUser {
    provider: string;
    providerId: string;
    email: string;
    name: string;
    picture: string;
}

export class SendOtpDto {
    @ApiProperty()
    @IsEmail()
    email: string;
}

export class ResetPasswordDto extends LoginUserDto {
    @ApiProperty()
    otp: string;
}
