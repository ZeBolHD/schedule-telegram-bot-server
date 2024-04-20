import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectBot } from "nestjs-telegraf";
import { Telegraf } from "telegraf";

@Injectable()
export class BotService {
  constructor(
    private readonly config: ConfigService,
    @InjectBot("ScheduleBot") private readonly bot: Telegraf,
  ) {}

  sendMessage() {
    this.bot.telegram.sendMessage(721618175, "test");
  }
}
