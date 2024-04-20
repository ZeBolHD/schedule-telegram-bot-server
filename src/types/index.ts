import { Context } from "telegraf";

export type TelegramMessage = Context["message"];

export type TelegramMessageSender = TelegramMessage["from"];

export type TelegramUser = Pick<TelegramMessageSender, "id" | "username" | "first_name">;

export type Subscription = {
  id: number;
  name: string;
};
