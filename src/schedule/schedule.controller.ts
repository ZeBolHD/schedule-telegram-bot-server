import { Action, Command, Ctx, Sender, Update } from "nestjs-telegraf";
import { ScheduleService } from "./schedule.service";

import * as locales from "@/assets/locale.json";
import { Context } from "telegraf";

@Update()
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Command("get_schedule")
  @Action("get_schedule")
  async getSchedule(@Ctx() context: Context, @Sender("id") senderId: number) {
    const scheduleFilesWithGroups = await this.scheduleService.getScheduleFiles(senderId);

    if (scheduleFilesWithGroups.length === 0) {
      await context.reply(locales.get_schedule.get_error);
    }

    for (const scheduleFileWithGroup of scheduleFilesWithGroups) {
      if (!scheduleFileWithGroup.fileId) {
        await context.reply(
          locales.get_schedule.no_schedule_start +
            scheduleFileWithGroup.groupCode +
            locales.get_schedule.no_schedule_end,
        );

        continue;
      }

      await context.replyWithDocument(scheduleFileWithGroup.fileId, {
        caption: locales.get_schedule.send_schedule + scheduleFileWithGroup.groupCode,
      });
    }
  }
}
