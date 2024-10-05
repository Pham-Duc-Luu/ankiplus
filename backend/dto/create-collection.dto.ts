import { ApiProperty } from '@nestjs/swagger';
import { Collection } from 'schemas/collection.schema';

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
    description?: string;

    @ApiProperty()
    icon?: string;

    @ApiProperty()
    thumnail?: string;

    @ApiProperty()
    isPublic: boolean;

    @ApiProperty()
    language: string;

    @ApiProperty()
    flashCards: flashCardDto[];
}
