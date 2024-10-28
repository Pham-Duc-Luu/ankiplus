import { ApiBody, ApiProperty } from '@nestjs/swagger';
import { Collection, CollectionDocument } from 'schemas/collection.schema';
import { QueryOptionDto } from './query-option.dto';
import { ListResponseDto } from './ListResponse.dto';

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

export type TSelectCollection = CollectionDocument;
export class CollectionQueryOptionDto extends QueryOptionDto {
    select?: (keyof CollectionDocument)[];

    sortBy?: keyof CollectionDocument;
}

export class UpdateCollectionDto extends Collection {}

export class CollectionDetailQueryDto<T> {
    @ApiProperty()
    name: string;

    @ApiProperty({})
    description?: string;

    @ApiProperty({})
    thumnail?: string;

    @ApiProperty({})
    icon?: string;

    @ApiProperty()
    isPublic?: boolean = true;

    @ApiProperty()
    language?: string;

    @ApiProperty()
    cards?: ListResponseDto<T>;

    constructor(partial: Partial<CollectionDetailQueryDto<T>>) {
        Object.assign(this, partial); // Assign all properties in one step
    }
}
