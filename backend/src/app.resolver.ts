import configuration from ' config/configuration';
import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'graphql/models/user.modal';
import { Model } from 'mongoose';

@Resolver(() => User)
export class AppResolver {
    constructor() {}
    @Query(() => User)
    async user(@Args('id', { type: () => Int }) id: number) {
        return id;
    }
}
