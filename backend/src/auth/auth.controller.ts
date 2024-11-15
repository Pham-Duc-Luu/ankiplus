import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GoogleOauthGuard } from './guard/google-oauth.guard';
import { AuthService } from './auth.service';
import { Response } from 'express';
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    @Get('callback/google')
    @UseGuards(GoogleOauthGuard)
    async googleAuthCallback(@Req() req, @Res() res: Response) {
        try {
            console.log(req.user);

            const token = await this.authService.oAuthLogin(req.user);
            res.redirect(`${process.env.FRONTEND_URL}/oauth?token=${token.jwt}`);
        } catch (err) {
            res.status(500).send({ success: false, message: err.message });
        }
    }
}
