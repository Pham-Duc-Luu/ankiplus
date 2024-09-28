import { ApiProperty } from '@nestjs/swagger';

export class flashCardDto {
    @ApiProperty()
    front: string;
    @ApiProperty()
    back: string;
}
export class CreateCollectionDto {
    @ApiProperty()
    name: string;

    @ApiProperty()
    flashCards: flashCardDto[];
}
