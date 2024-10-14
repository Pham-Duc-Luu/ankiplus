import {
    BadRequestException,
    Body,
    Controller,
    Get,
    InternalServerErrorException,
    Logger,
    Param,
    Post,
    Req,
    Request,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth.guard';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { User } from 'schemas/user.schema';
import { Model } from 'mongoose';
import { jwtPayloadDto } from 'dto/jwt-payload.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateCollectionDto } from 'dto/create-collection.dto';
import { FlashCard } from 'schemas/flashCard.schema';
import { Collection } from 'schemas/collection.schema';
import { UtilService } from 'src/util/util.service';

@ApiTags('Users')
@UseGuards(AuthGuard)
@Controller('user')
export class UserAuthController {
    constructor(
        private util: UtilService,
        private jwtService: JwtService,
        @InjectModel(FlashCard.name) private flashCardModel: Model<FlashCard>,

        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Collection.name) private collectionModel: Model<Collection>,
    ) {}

    // * get user details profile
    @Get('/profile')
    async getProfile(@Request() request: { user: jwtPayloadDto }) {
        const user = await this.userModel
            .findById({ _id: request.user.sub })
            .populate({
                path: 'collections', // Populate the `collections` field
                model: 'Collection', // Specify the model to populate from
                select: 'id name createdAt',
                options: {
                    limit: 30,

                    sort: { createdAt: -1 }, // Sort by `createdAt` in descending order (newest first)
                },
            })
            .select('email username');

        return user;
    }
}
