import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User } from 'schemas/user.schema';
import { UtilService } from 'src/util/util.service';
import * as bcrypt from 'bcrypt';
import configuration from ' config/configuration';
import { Collection } from 'schemas/collection.schema';
import * as nodemailer from 'nodemailer';
@Injectable()
export class MailerService {
    constructor(
        @InjectModel(User.name, configuration().database.mongodb_main.name) private userModel: Model<User>,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {}

    private transporter = nodemailer.createTransport({
        // host: this.configService.get('mailer.host'),
        service: 'gmail',
        // port: this.configService.get('mailer.port'),
        // secure: this.configService.get('mailer.secure'), // true for port 465, false for other ports
        auth: {
            user: this.configService.get('mailer.auth.user'),
            pass: this.configService.get('mailer.auth.pass'),
        },
    });

    async sendEmail(options: { from: string; to: string; subject?: string; text?: string; html?: string }) {
        const info = await this.transporter.sendMail({ ...options });
    }
}
