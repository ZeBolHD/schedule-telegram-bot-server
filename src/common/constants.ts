import { Subscription } from "@/types";
import * as locales from "@/assets/locale.json";

export const subscriptions: Subscription[] = [
  {
    id: 1,
    name: locales.subscriptions.schedule,
  },
  {
    id: 2,
    name: locales.subscriptions.news,
  },
  {
    id: 3,
    name: locales.subscriptions.announcements,
  },
];
