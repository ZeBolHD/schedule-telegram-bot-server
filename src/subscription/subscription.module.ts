import { Module } from "@nestjs/common";
import { SubscriptionService } from "./subscription.service";
import { SubscriptionController } from "./subscription.controller";

@Module({
  providers: [SubscriptionService, SubscriptionController],
})
export class SubscriptionModule {}
