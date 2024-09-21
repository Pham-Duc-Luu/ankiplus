import { ApiProperty } from '@nestjs/swagger';

export class CreateFlashCardDto {
    @ApiProperty()
    front: any;
    @ApiProperty()
    back: any;
}
