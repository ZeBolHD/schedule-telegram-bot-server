import { Context } from "telegraf";

export type TelegramMessage = Context["message"];

// {
//   message_id: number;
//   from: {
//     id: number;
//     is_bot: boolean;
//     first_name: string;
//     last_name: string;
//     username: string;
//     language_code: string;
//   };
//   chat: {
//     id: number;
//     first_name: string;
//     last_name: string;
//     username: string;
//     type: string;
//   };
//   date: number;
//   text: string;
// };

export type TelegramMessageFromUser = TelegramMessage["from"];
