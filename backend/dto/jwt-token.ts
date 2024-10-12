import { ApiProperty } from '@nestjs/swagger';

export class JWTTokenDto {
    @ApiProperty()
    access_token: string;
    @ApiProperty()
    refresh_token: string;
}
