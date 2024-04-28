import { Module } from "@nestjs/common";
import { ScheduleController } from "./schedule.controller";
import { ScheduleService } from "./schedule.service";

@Module({
  providers: [ScheduleController, ScheduleService],
})
export class ScheduleModule {}
