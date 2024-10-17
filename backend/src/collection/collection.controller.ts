import {
    BadRequestException,
    Body,
    Controller,
    Get,
    InternalServerErrorException,
    Logger,
    NotAcceptableException,
    Param,
    Patch,
    Post,
    Query,
    Req,
    Request,
    UseGuards,
} from '@nestjs/common';
import { User } from 'schemas/user.schema';
import { AuthGuard } from 'src/guard/auth.guard';
import { CreateCollectionDto } from 'dto/create-collection.dto';
import { jwtPayloadDto } from 'dto/jwt-payload.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Collection } from 'schemas/collection.schema';
import { UpdateCollectionDto } from 'dto/update-collection.dto';
import { FlashCard } from 'schemas/flashCard.schema';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { QueryOptionDto } from 'dto/query-option.dto';

@ApiTags('Collections')
@Controller('collections')
export class CollectionController {
    constructor(
        @InjectModel(FlashCard.name) private flashCardModel: Model<FlashCard>,

        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Collection.name) private collectionModel: Model<Collection>,
    ) {}

    @Get(':id?')
    @ApiOperation({ summary: 'Get a list of general collection' })
    async findAllCollection(@Query() query?: QueryOptionDto, @Param() param?: { id: string }) {
        if (param?.id) {
            try {
                if (param?.id) {
                    return await this.collectionModel
                        .find({ _id: param.id, isPublic: true })
                        .populate('owner', 'id username')
                        .select('id name')
                        .sort({ name: query.order === 'asc' ? 1 : -1 });
                }
            } catch (error) {
                Logger.error(error);
                throw new BadRequestException(`Collection with id : ${param.id} is not found`);
            }
        }

        try {
            return await this.collectionModel
                .find({ isPublic: true }) // Find all users
                .populate('owner', 'id username')
                .select('id name')
                .sort({ name: query.order === 'asc' ? 1 : -1 })
                .limit(query.limit || 30)
                .skip(query.skip || 0)
                .lean();
        } catch (error) {
            Logger.error(error);
            throw new InternalServerErrorException();
        }
    }

    @Get('')
    @ApiOperation({ summary: 'Search for collections by name' })
    async searchForCollection(@Query() query: QueryOptionDto, @Param() param: { name: string }) {
        if (!param?.name) {
            return new BadRequestException();
        }
        Logger.debug(param.name);
        try {
            return await this.collectionModel
                .find({ name: { $regex: `/${param.name}/i`, $options: 'i' } })
                .populate('owner', 'id username')
                .select('id name')
                .sort({ name: query.order === 'asc' ? 1 : -1 })
                .limit(query.limit || 30)
                .skip(query.skip || 0)
                .lean();
        } catch (error) {
            Logger.error(error);
            throw new InternalServerErrorException();
        }
    }
}
