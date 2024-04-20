import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Command, Sender, Update } from "nestjs-telegraf";
import { TelegramMessageFromUser } from "./types";
import { BotService } from "./bot/bot.service";

@Injectable()
@Update()
export class AppService {
  private _token: string;
  private readonly logger = new Logger(AppService.name);

  constructor(
    private readonly config: ConfigService,
    private readonly botService: BotService,
  ) {
    this._token = config.get<string>("BOT_TOKEN");
    botService.sendMessage();
  }

  @Command("test")
  async hi(@Sender() user: TelegramMessageFromUser) {
    // const from = ctx.from as TelegramMessageFromUser;

    console.log(user.id);

    // this.logger.log(`Message from ${from.username}: ${ctx}`);

    // ctx.reply("Hi!");
  }

  getHello(): string {
    return "Hello World!";
  }
}
