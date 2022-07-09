import { Injectable, NestMiddleware } from "@nestjs/common";
import { verify } from "jsonwebtoken";
import { JWT_SECRET } from "src/config";
import { UsersService } from "../users.service";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private readonly usersService: UsersService) {}

    async use(req, res, next) {
        if (!req.headers.authorization) {
            req.user = null;
            next();
            return;
        }
        const token = req.headers.authorization.split(' ')[1];
        try {
            const decode: any = verify(token, JWT_SECRET);
            const user = await this.usersService.findById(decode.id);
            req.user = user;
            next();

        } catch (error) {
            req.user = null;
            next();
        }
    }
}