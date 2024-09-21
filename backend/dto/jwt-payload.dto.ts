import { ApiProperty } from '@nestjs/swagger';

export class jwtPayloadDto {
    @ApiProperty()
    sub: string;
    @ApiProperty()
    email: string;
}
