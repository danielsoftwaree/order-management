import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/services/user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
    ) { }

    async use(req: Request, res: Response, next: NextFunction) {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                next();
                return;
            }

            const token = authHeader.split(' ')[1];
            const decoded = this.jwtService.verify(token);

            const user = await this.userService.user({ id: decoded.sub });

            if (!user) {
                next();
                return;
            }

            // for CurrentUser decorator
            req['user'] = {
                id: user.id,
                email: user.email,
                name: user.name,
            };

            next();
        } catch (error) {
            next();
        }
    }
}
