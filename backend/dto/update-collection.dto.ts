import { ApiProperty } from '@nestjs/swagger';

export class UpdateCollectionDto {
    @ApiProperty()
    name: string;

    @ApiProperty()
    isPublic: boolean;
}
