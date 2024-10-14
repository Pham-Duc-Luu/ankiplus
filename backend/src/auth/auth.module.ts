import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'schemas/user.schema';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { UserAuthModule } from './user/user.auth.module';

@Module({
    imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), UserAuthModule],
    providers: [AuthService],
})
export class AuthModule {}
