import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/services/user.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) { }

    async login(loginDto: LoginDto) {
        const user = await this.userService.user({ email: loginDto.email });

        if (!user) {
            throw new UnauthorizedException('Wrong email or password');
        }

        const isPasswordValid = await bcrypt.compare(
            loginDto.password,
            user.password
        );

        if (!isPasswordValid) {
            throw new UnauthorizedException('Wrong email or password');
        }

        const payload = { sub: user.id, email: user.email };

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
            access_token: this.jwtService.sign(payload),
        };
    }

    async register(registerDto: RegisterDto) {
        const existingUser = await this.userService.user({ email: registerDto.email });

        if (existingUser) {
            throw new ConflictException('User with this email already exists');
        }

        const hashedPassword = await bcrypt.hash(registerDto.password, 10);

        const user = await this.userService.createUser({
            name: registerDto.name,
            email: registerDto.email,
            password: hashedPassword,
        });

        const payload = { sub: user.id, email: user.email };

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
            access_token: this.jwtService.sign(payload),
        };
    }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.userService.user({ email });

        if (user && await bcrypt.compare(pass, user.password)) {
            const { password, ...result } = user;
            return result;
        }

        return null;
    }
} 