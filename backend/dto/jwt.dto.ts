import { ApiProperty } from '@nestjs/swagger';

export class jwtPayloadDto {
    @ApiProperty()
    sub: string;
    @ApiProperty()
    email: string;
}

export class JWTTokenDto {
    @ApiProperty()
    access_token: string;
    @ApiProperty()
    refresh_token: string;

    constructor(access_token: string, refresh_token: string) {
        this.access_token = access_token;
        this.refresh_token = refresh_token;
    }
}
