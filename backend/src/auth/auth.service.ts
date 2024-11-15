import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService) {}
    async oAuthLogin(user) {
        if (!user) {
            throw new Error('User not found!!!');
        }

        //    .... your business logic

        //   .... add whatever payload you want to have
        const payload = {
            email: user.email,
            name: user.name,
        };

        const jwt = await this.jwtService.sign(payload);

        return { jwt };
    }
}
