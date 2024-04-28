import { PrismaService } from "@/prisma/prisma.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ScheduleService {
  constructor(private readonly prismaService: PrismaService) {}

  async getScheduleFiles(userId: number) {
    const groups = await this.prismaService.userWithGroup.findMany({
      where: { userId: String(userId) },
      include: { group: true },
    });

    const scheduleFilesWithGroups = groups.map((group) => {
      return {
        fileId: group.group.fileId,
        groupCode: group.group.code,
      };
    });

    return scheduleFilesWithGroups;
  }
}
