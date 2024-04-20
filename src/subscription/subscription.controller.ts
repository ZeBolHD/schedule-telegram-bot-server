import { Logger } from "@nestjs/common";
import { Action, Command, Ctx, Sender, Update } from "nestjs-telegraf";
import { SubscriptionService } from "./subscription.service";
import { subscriptions } from "@/common/constants";
import { Context } from "telegraf";

import * as locales from "@/assets/locale.json";
import { getParamFromCallbackQuery } from "@/lib";
import { CallbackQuery } from "telegraf/typings/core/types/typegram";

@Update()
export class SubscriptionController {
  private readonly logger = new Logger(SubscriptionController.name);
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Command("my_subscriptions")
  @Action("my_subscriptions")
  async mySubscriptions(@Sender("id") senderId: number, @Ctx() context: Context) {
    this.logger.log(`Received command /my_subscriptions from user with id:${senderId}`);

    const userSubscriptions = await this.subscriptionService.getUserSubscriptions(senderId);
    const userSubscriptionsIds = userSubscriptions.map(
      (subscription) => subscription.subscriptionId,
    );

    const reply_markup = {
      inline_keyboard: subscriptions.map((subscription) => {
        const isSelected = userSubscriptionsIds.includes(subscription.id);

        const text = `${subscription.name}   ${isSelected ? "✅" : "❌"}`;

        const query = isSelected
          ? `unsubscribe.${subscription.id}`
          : `subscribe.${subscription.id}`;

        return [
          {
            text: text,
            callback_data: query,
          },
        ];
      }),
    };

    if (context.callbackQuery) {
      await context.editMessageText(locales.subscriptions.my_subscriptions, {
        reply_markup,
      });
      return;
    }

    context.reply(locales.subscriptions.my_subscriptions, {
      reply_markup,
    });
  }

  @Action(/unsubscribe.*/)
  async unsubscribe(@Ctx() context: Context) {
    const data = (context.callbackQuery as CallbackQuery.DataQuery).data;
    const subscriptionId = Number(getParamFromCallbackQuery(data, "unsubscribe"));

    const userId = context.from.id;

    this.logger.log(
      `Received action unsubscribe.subscription.${subscriptionId} from user with id:${context.from.id}`,
    );

    await this.subscriptionService.unsubscribe(userId, subscriptionId);
    await this.mySubscriptions(userId, context);
  }

  @Action(/subscribe.*/)
  async subscribe(@Ctx() context: Context) {
    const data = (context.callbackQuery as CallbackQuery.DataQuery).data;
    const subscriptionId = Number(getParamFromCallbackQuery(data, "subscribe"));

    const userId = context.from.id;

    this.logger.log(
      `Received action subscribe.subscription.${subscriptionId} from user with id:${context.from.id}`,
    );

    await this.subscriptionService.subscribe(userId, subscriptionId);
    await this.mySubscriptions(userId, context);
  }
}
