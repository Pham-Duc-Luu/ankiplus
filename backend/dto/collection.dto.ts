import { ApiBody, ApiProperty } from '@nestjs/swagger';
import { Collection, CollectionDocument } from 'schemas/collection.schema';
import { QueryOptionDto } from './query-option.dto';
import { ListResponseDto } from './ListResponse.dto';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class flashCardDto {
    @ApiProperty()
    @IsString()
    front: string;
    @ApiProperty()
    @IsString()
    back: string;
}

export class CreateCollectionDto {
    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty()
    icon?: string;

    @ApiProperty()
    thumnail?: string;

    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    isPublic: boolean;

    @ApiProperty()
    @IsString()
    @IsOptional()
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
