import { Module } from '@nestjs/common';
import { UtilService } from './util.service';

@Module({
    imports: [],
    providers: [UtilService],
    exports: [UtilService],
})
export class UtilModule {}
