import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UtilService {
    private passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    private emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    private saltRounds = 10;

    validateEmail = (email: string): boolean => {
        return this.emailPattern.test(email);
    };

    validatePassword = (password: string): boolean => {
        return this.passwordPattern.test(password);
    };

    async hash(data: string, saltRounds = this.saltRounds) {
        return await bcrypt.hash(data, saltRounds);
    }

    hashSync(data: string, saltRounds = 10) {
        return bcrypt.hashSync(data, saltRounds);
    }

    compareSync(password: string, hash: string) {
        return bcrypt.compareSync(password, hash);
    }
}
