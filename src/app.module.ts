import { Module } from "@nestjs/common";
import { AppService } from "./app.service";
import { TelegrafModule } from "nestjs-telegraf";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { PrismaModule } from "@/prisma/prisma.module";
import { BotModule } from "@/bot/bot.module";
import { UserModule } from "@/user/user.module";
import { GroupsModule } from "./groups/groups.module";
import { session } from "telegraf";

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TelegrafModule.forRootAsync({
      botName: "ScheduleBot",
      useFactory: (config: ConfigService) => ({
        token: config.get("BOT_TOKEN"),
        middlewares: [session()],
      }),
      inject: [ConfigService],
    }),
    BotModule,
    UserModule,
    GroupsModule,
  ],
  providers: [AppService],
})
export class AppModule {}
