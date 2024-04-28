import { Module } from "@nestjs/common";
import { session } from "telegraf";
import { TelegrafModule } from "nestjs-telegraf";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { PrismaModule } from "@/prisma/prisma.module";
import { BotModule } from "@/bot/bot.module";
import { UserModule } from "@/user/user.module";
import { GroupsModule } from "@/groups/groups.module";
import { SubscriptionModule } from "@/subscription/subscription.module";

import { AppController } from "./app.controller";
import { ScheduleModule } from "./schedule/schedule.module";

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
    SubscriptionModule,
    ScheduleModule,
  ],
  providers: [AppController],
})
export class AppModule {}
