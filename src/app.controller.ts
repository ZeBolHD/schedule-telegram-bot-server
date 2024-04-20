import { Injectable, Logger } from "@nestjs/common";
import { Ctx, Sender, Start, Update } from "nestjs-telegraf";
import * as locale from "@/assets/locale.json";
import { Context } from "telegraf";

import { UserService } from "./user/user.service";

import { TelegramMessageSender } from "./types";

@Injectable()
@Update()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly userService: UserService) {}

  @Start()
  async start(@Sender() sender: TelegramMessageSender, @Ctx() context: Context) {
    this.logger.log(
      `User with id:${sender.id}, username:${sender.username}, name:${sender.first_name} ${sender.last_name || ""} started bot`,
    );

    const user = await this.userService.findUser(sender.id);

    if (user) {
      context.reply(locale.start.user_exists);
      return;
    }

    const newUser = await this.userService.registerUser(sender);

    if (!newUser) {
      context.reply(locale.error);

      return;
    }

    context.reply(locale.start.user_registered);
  }
}
