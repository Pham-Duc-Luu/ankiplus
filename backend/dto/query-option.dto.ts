import { ApiProperty } from '@nestjs/swagger';

export class QueryOptionDto {
    @ApiProperty({ default: 30, required: false })
    limit?: number = 30;
    @ApiProperty({ default: 0 })
    skip?: number = 0;
    @ApiProperty({ default: 'asc' })
    order?: 'asc' | 'desc' = 'asc';
}
