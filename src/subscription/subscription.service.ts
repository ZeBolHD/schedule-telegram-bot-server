import { PrismaService } from "@/prisma/prisma.service";

import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class SubscriptionService {
  private readonly logger = new Logger(SubscriptionService.name);
  constructor(private readonly prismaService: PrismaService) {}

  async getUserSubscriptions(userId: number) {
    this.logger.log(`Finding all subscriptions for user with id:${userId}`);
    const userWithSubscriptions = await this.prismaService.userWithSubscription.findMany({
      where: {
        userId: String(userId),
      },
    });

    return userWithSubscriptions;
  }

  async subscribe(userId: number, subscriptionId: number) {
    this.logger.log(
      `Creating new subscription for user with id:${userId} and subscription with id:${subscriptionId}`,
    );
    const userWithSubscription = await this.prismaService.userWithSubscription
      .create({
        data: {
          userId: String(userId),
          subscriptionId: Number(subscriptionId),
        },
      })
      .catch((e) => {
        this.logger.error(`Failed to create subscription for user with id:${userId}`);
        this.logger.error(e);
      });

    this.logger.log(`Created new subscription for user with id:${userId}`);
    return userWithSubscription;
  }

  async unsubscribe(userId: number, subscriptionId: number) {
    this.logger.log(
      `Deleting subscription for user with id:${userId} and subscription with id:${subscriptionId}`,
    );
    const userWithSubscription = await this.prismaService.userWithSubscription
      .delete({
        where: {
          userId_subscriptionId: {
            userId: String(userId),
            subscriptionId: subscriptionId,
          },
        },
      })
      .catch((e) => {
        this.logger.error(`Failed to delete subscription for user with id:${userId}`);
        this.logger.error(e);
      });

    this.logger.log(`Deleted new subscription for user with id:${userId}`);
    return userWithSubscription;
  }
}
