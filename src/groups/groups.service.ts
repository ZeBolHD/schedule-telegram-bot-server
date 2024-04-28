import { PrismaService } from "@/prisma/prisma.service";
import { Injectable, Logger } from "@nestjs/common";
import { Group, UserWithGroup } from "@prisma/client";

@Injectable()
export class GroupsService {
  private readonly logger = new Logger(GroupsService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async getFaculties() {
    this.logger.log("Finding all faculties");
    const faculties = await this.prismaService.faculty.findMany({}).catch((e) => {
      this.logger.error("Failed to find all faculties");

      this.logger.error(e);

      return [];
    });

    return faculties;
  }

  async getGrades(facultyId: number) {
    this.logger.log(`Finding all grades by facultyId:${facultyId}`);
    const groups = await this.prismaService.group
      .findMany({
        where: { facultyId },
        distinct: ["grade"],
      })
      .catch((e) => {
        this.logger.error(`Failed to find all grades by facultyId:${facultyId}`);

        this.logger.error(e);

        return [];
      });

    const uniqueGrades = Array.from(new Set(groups.map((grade: Group) => grade.grade))).sort(
      (a, b) => a - b,
    );

    this.logger.log(`Found ${uniqueGrades.length} unique grades`);

    return uniqueGrades;
  }

  async getGroups(facultyId: number, grade: number) {
    this.logger.log(`Finding all groups by facultyId:${facultyId} and grade:${grade}`);
    const groups = await this.prismaService.group
      .findMany({
        where: { facultyId, grade },
      })
      .catch((e) => {
        this.logger.error(`Failed to find all groups by facultyId:${facultyId} and grade:${grade}`);
        this.logger.error(e);
        return [];
      });

    this.logger.log(`Found ${groups.length} groups`);

    return groups;
  }

  async setUserWithGroup(userId: number, groupId: number) {
    this.logger.log(`Adding user:${userId} to group:${groupId}`);

    const _userWithGroup = await this.prismaService.userWithGroup.findUnique({
      where: { userId_groupId: { userId: String(userId), groupId } },
      select: { group: true },
    });

    if (_userWithGroup) {
      this.logger.log(`User:${userId} already in group:${groupId}`);
      return _userWithGroup;
    }

    this.logger.log(`Adding user:${userId} to group:${groupId}`);

    const userWithGroup = await this.prismaService.userWithGroup
      .create({
        data: {
          userId: String(userId),
          groupId: groupId,
        },
        include: { group: true },
      })
      .catch((e) => {
        this.logger.error(`Failed to add user:${userId} to group:${groupId}`);
        this.logger.error(e);
        return {} as UserWithGroup & { group: { code: string } };
      });

    this.logger.log(`User:${userId} added to group:${groupId}`);

    return userWithGroup;
  }

  async getUserGroups(userId: number) {
    this.logger.log(`Finding user:${userId} groups`);
    const userGroups = await this.prismaService.userWithGroup
      .findMany({
        where: { userId: String(userId) },
        include: { group: true },
      })
      .catch((e) => {
        this.logger.error(`Failed to find user:${userId} groups`);
        this.logger.error(e);
        return [];
      });

    this.logger.log(`Found ${userGroups.length} groups for user:${userId}`);

    return userGroups;
  }
  async deleteUserWithGroup(userId: number, groupId: number) {
    this.logger.log(`Deleting user:${userId} from group:${groupId}`);

    await this.prismaService.userWithGroup
      .deleteMany({
        where: { userId: String(userId), groupId },
      })
      .catch((e) => {
        this.logger.error(`Failed to delete user:${userId} from group:${groupId}`);
        this.logger.error(e);
      });

    this.logger.log(`User:${userId} deleted from group:${groupId}`);
  }
}
