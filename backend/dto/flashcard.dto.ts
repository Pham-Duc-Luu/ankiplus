import { ApiProperty } from '@nestjs/swagger';
import { QueryOptionDto } from './query-option.dto';
import { FlashCardDocument } from 'schemas/flashCard.schema';
import { IsOptional, IsString } from 'class-validator';

export class CreateFlashCardDto {
    @ApiProperty()
    @IsString()
    front: any;
    @ApiProperty()
    @IsString()
    back: any;
}

export class FlashCardQueryOptionDto extends QueryOptionDto {
    select?: (keyof FlashCardDocument)[];

    sortBy?: keyof FlashCardDocument;
}

export class EditFlashCardDto {
    @ApiProperty()
    @IsString()
    @IsOptional()
    front?: string;
    @ApiProperty()
    @IsString()
    @IsOptional()
    back?: string;
}
