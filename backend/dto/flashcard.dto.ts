import { ApiProperty } from '@nestjs/swagger';
import { QueryOptionDto } from './query-option.dto';
import { FlashCardDocument } from 'schemas/flashCard.schema';

export class CreateFlashCardDto {
    @ApiProperty()
    front: any;
    @ApiProperty()
    back: any;
}

export class FlashCardQueryOptionDto extends QueryOptionDto {
    select?: (keyof FlashCardDocument)[];

    sortBy?: keyof FlashCardDocument;
}
