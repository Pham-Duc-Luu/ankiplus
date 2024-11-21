import { ApiBody, ApiProperty } from '@nestjs/swagger';
import { Collection, CollectionDocument } from 'schemas/collection.schema';
import { QueryOptionDto } from './query-option.dto';
import { ListResponseDto } from './ListResponse.dto';
import { IsArray, IsBoolean, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';

export class flashCardDto {
    @ApiProperty()
    @IsString()
    front: string;
    @ApiProperty()
    @IsString()
    back: string;
}

export class PutFlashCardDto extends flashCardDto {
    @ApiProperty()
    @IsString()
    @IsOptional()
    id?: string;
}

export class FullUpdateFlashcardBodyDto {
    @ApiProperty({ type: [PutFlashCardDto] }) // Swagger metadata
    @IsArray() // Validates that this property is an array
    @ValidateNested({ each: true }) // Validates each item in the array
    @Type(() => PutFlashCardDto) // Transform each array element to `PutFlashCardDto` class
    flashCards: PutFlashCardDto[];
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

@ObjectType()
export class CollectionQueryGQLObject extends ListResponseDto<CollectionGQLObject> {
    @Field((type) => Int)
    total: number;
    @Field((type) => Int)
    skip: number;
    @Field((type) => Int)
    limit: number;

    @Field((type) => [CollectionGQLObject])
    data: CollectionGQLObject[];
}

@ObjectType()
export class CollectionGQLObject extends Collection {
    @Field((type) => String)
    _id: string;

    @Field((type) => String)
    name: string;

    @Field((type) => String, { nullable: true })
    description?: string;

    @Field((type) => String, { nullable: true })
    thumbnail?: string;

    @Field((type) => String, { nullable: true })
    icon: string;

    @Field((type) => Boolean, { nullable: true })
    isPublic: boolean = true;

    @Field((type) => String, { nullable: true })
    language: string;

    @Field((type) => [String], { nullable: true }) // Reference to the FlashCard schema (in the form of string IDs)
    cards?: string[];

    @Field((type) => String)
    owner: string; // Reference to the User schema

    @Field((type) => Date)
    createdAt: Date;

    @Field((type) => Date)
    updatedAt: Date;
}
