import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Sender, Start, Update } from "nestjs-telegraf";
import { TelegramMessageSender } from "./types";
import { BotService } from "./bot/bot.service";
import { UserService } from "./user/user.service";

import * as locale from "@/assets/locale.json";

@Injectable()
@Update()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(
    private readonly botService: BotService,
    private readonly userService: UserService,
  ) {}

  @Start()
  async start(@Sender() sender: TelegramMessageSender) {
    this.logger.log(
      `User with id:${sender.id}, username:${sender.username}, name:${sender.first_name} ${sender.last_name || ""} started bot`,
    );

    const user = await this.userService.findUser(sender.id);

    if (user) {
      this.botService.sendMessage(sender.id, locale.start.user_exists);
      return;
    }

    const newUser = await this.userService.registerUser(sender);

    if (!newUser) {
      this.botService.sendMessage(sender.id, locale.error);

      return;
    }

    this.botService.sendMessage(sender.id, locale.start.user_registered);
  }
}
