import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
    Contains,
    IsEmail,
    IsNotEmpty,
    IsNumber,
    IsNumberString,
    IsOptional,
    isString,
    IsString,
    Min,
} from 'class-validator';
import { CollectionDocument } from 'schemas/collection.schema';
export class QueryOptionDto {
    @ApiProperty({ default: 30, required: false })
    @IsOptional() // Marks the property as optional
    @Type(() => Number) // Transforms the value to a number
    @IsNumber()
    @Min(0) // Ensures the number is non-negative
    limit?: number = 10;

    @ApiProperty({ default: 0 })
    @IsOptional() // Marks the property as optional
    @Type(() => Number) // Transforms the value to a number
    @IsNumber()
    @Min(0)
    skip?: number;

    @ApiProperty({ default: 'asc' })
    @IsString()
    order?: 'asc' | 'desc' = 'asc';

    @ApiProperty()
    @IsOptional()
    @IsString()
    select?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    sortBy?: string;
}

export type TSelectCollection = CollectionDocument;
export class CollectionQueryOptionDto extends QueryOptionDto {
    select?: keyof CollectionDocument;

    sortBy?: keyof CollectionDocument;
}
