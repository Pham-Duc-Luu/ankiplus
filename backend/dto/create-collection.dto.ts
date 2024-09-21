import { ApiProperty } from '@nestjs/swagger';

export class CreateCollectionDto {
    @ApiProperty()
    name: string;

    @ApiProperty()
    flashCards: {
        front: string;
        back: string;
    }[];
}
