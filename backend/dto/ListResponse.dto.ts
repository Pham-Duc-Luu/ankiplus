import { ApiProperty } from '@nestjs/swagger';

// export class ListResponseDto extends  {
//     @ApiProperty()
//     email: string;
//     @ApiProperty()
//     password: string;
//     @ApiProperty()
//     username: string;

//     'total': number;
//     'skip': number;
//     'limit': number;
// }

export interface IListResponseDto<T = unknown> {
    total?: number;
    skip?: number;
    limit: number;
    data?: T[];
}

export class ListResponseDto<T = unknown> implements IListResponseDto<T> {
    @ApiProperty()
    'total'?: number;
    @ApiProperty()
    'skip'?: number;
    @ApiProperty()
    'limit': number;
    @ApiProperty()
    data: T[];

    constructor({ total, skip = 0, limit = 30, data = [] }: IListResponseDto<T>) {
        this.total = total ? total : data.length;
        this.skip = skip;
        this.limit = limit;
        this.data = data;
    }
}
