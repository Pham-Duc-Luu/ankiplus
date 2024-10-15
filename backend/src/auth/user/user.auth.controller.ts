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
import mongoose, { Model } from 'mongoose';
import { jwtPayloadDto } from 'dto/jwt-payload.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateCollectionDto } from 'dto/create-collection.dto';
import { FlashCard } from 'schemas/flashCard.schema';
import { Collection, CollectionDocument } from 'schemas/collection.schema';
import { UtilService } from 'src/util/util.service';
import { IUserProfileDto, UserProfileDto } from 'dto/userProflieDto';
import { ObjectId } from 'mongodb';
import { ListResponseDto } from 'dto/ListResponse.dto';
import { pickFields } from 'utils/utils';
import { UserAuthService } from './user.auth.service';

@ApiTags('Users')
@UseGuards(AuthGuard)
@Controller('user')
export class UserAuthController {
    constructor(
        private util: UtilService,
        private jwtService: JwtService,
        private userAuthService: UserAuthService,
        @InjectModel(FlashCard.name) private flashCardModel: Model<FlashCard>,

        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Collection.name) private collectionModel: Model<Collection>,
    ) {}

    // * get user details profile
    @Get('/profile')
    async getProfile(
        @Request() request: { user: jwtPayloadDto },
    ): Promise<UserProfileDto<Pick<CollectionDocument, '_id' | 'name'>>> {
        const user = await this.userModel
            .findById({ _id: request.user.sub })
            .populate({
                path: 'collections', // Populate the `collections` field
                model: Collection.name, // Specify the model to populate from
                // select: 'id name createdAt',
                options: {
                    limit: 30,

                    sort: { createdAt: -1 }, // Sort by `createdAt` in descending order (newest first)
                },
            })
            .select('email username');

        return new UserProfileDto<Pick<CollectionDocument, '_id' | 'name'>>({
            _id: user._id.toString(),
            email: user.email,
            username: user.username,
            collections: new ListResponseDto({
                data: await Promise.all(
                    user.collections.map(async (collectionId) => {
                        return pickFields(await this.collectionModel.findById(collectionId), ['_id', 'name']);
                    }),
                ),
                total: await this.userAuthService.getCollectionsLength(user._id.toString()),
                skip: 0,
                limit: 30,
            }),
        });
    }
}
