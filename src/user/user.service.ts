import { PrismaService } from "@/prisma/prisma.service";

import { TelegramUser } from "@/types";
import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async registerUser(user: TelegramUser) {
    this.logger.log(`Registering user with id:${user.id}`);

    const _user = await this.prismaService.telegramUser
      .create({
        data: {
          id: String(user.id),
          username: user.username,
          firstName: user.first_name,
        },
      })
      .catch((error) => {
        this.logger.error(`User not registered in database  with id:${user.id}`);
        this.logger.debug(error);
        return null;
      });

    this.logger.log(`User registered in database with id:${user.id}`);

    return _user;
  }

  async findUser(id: number) {
    this.logger.log(`Finding user with id:${id}`);

    const user = await this.prismaService.telegramUser
      .findUnique({
        where: {
          id: String(id),
        },
      })
      .catch((error) => {
        this.logger.debug(error);
        return null;
      });

    if (!user) {
      this.logger.log(`User not found in database with id:${id}`);
      return null;
    }

    this.logger.log(`User found in database with id:${id}`);

    return user;
  }
}
