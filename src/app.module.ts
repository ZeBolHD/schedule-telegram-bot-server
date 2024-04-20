import { Module } from "@nestjs/common";
import { AppService } from "./app.service";
import { TelegrafModule } from "nestjs-telegraf";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { PrismaModule } from "@/prisma/prisma.module";
import { BotModule } from "@/bot/bot.module";
import { UserModule } from "@/user/user.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    TelegrafModule.forRootAsync({
      botName: "ScheduleBot",
      useFactory: (config: ConfigService) => ({
        token: config.get("BOT_TOKEN"),
      }),
      inject: [ConfigService],
    }),
    BotModule,
    UserModule,
  ],
  providers: [AppService],
})
export class AppModule {}
