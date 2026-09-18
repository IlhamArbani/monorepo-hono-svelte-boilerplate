import { HTTPException } from "hono/http-exception";
import { ExperiencesRepository } from "./experiences.repository";

export class ExperiencesService {
  constructor(private readonly repository: ExperiencesRepository) {}

  async findAll() {
    const allExperiences = await this.repository.findAll();
    return allExperiences.map((exp: any) => {
      if (exp.user) {
        const { password: _, ...userWithoutPassword } = exp.user;
        return { ...exp, user: userWithoutPassword };
      }
      return exp;
    });
  }

  async findById(id: string) {
    const experience: any = await this.repository.findById(id);
    if (!experience) {
      throw new HTTPException(404, { message: "Experience not found" });
    }

    let data = experience;
    if (experience.user) {
      const { password: _, ...userWithoutPassword } = experience.user;
      data = { ...experience, user: userWithoutPassword };
    }
    return data;
  }

  async create(userId: string, body: any) {
    const {
      jobTitle,
      organization,
      highlights,
      location,
      locationType,
      employmentType,
      startMonth,
      startYear,
      endMonth,
      endYear,
      isCurrentlyWork,
      skillIds,
      media,
    } = body;

    const [newExperience] = await this.repository.create({
      userId,
      jobTitle,
      organization,
      highlights,
      location,
      locationType,
      employmentType,
      startMonth,
      startYear,
      endMonth,
      endYear,
      isCurrentlyWork,
    });

    if (skillIds && skillIds.length > 0) {
      await this.repository.createSkills(
        skillIds.map((skillId: string) => ({
          experienceId: newExperience.id,
          skillId,
        }))
      );
    }

    if (media && media.length > 0) {
      await this.repository.createMedia(
        media.map((item: { url: string; alt?: string | null; sortOrder?: number | null }) => ({
          experienceId: newExperience.id,
          url: item.url,
          alt: item.alt ?? undefined,
          sortOrder: item.sortOrder ?? undefined,
        }))
      );
    }

    return newExperience;
  }

  async update(id: string, body: any) {
    const {
      jobTitle,
      organization,
      highlights,
      location,
      locationType,
      employmentType,
      startMonth,
      startYear,
      endMonth,
      endYear,
      isCurrentlyWork,
      skillIds,
      media,
    } = body;

    const [updated] = await this.repository.update(id, {
      jobTitle,
      organization,
      highlights,
      location,
      locationType,
      employmentType,
      startMonth,
      startYear,
      endMonth,
      endYear,
      isCurrentlyWork,
    });

    if (!updated) {
      throw new HTTPException(404, { message: "Experience not found" });
    }

    if (skillIds !== undefined) {
      await this.repository.deleteSkillsByExperienceId(id);

      if (skillIds.length > 0) {
        await this.repository.createSkills(
          skillIds.map((skillId: string) => ({
            experienceId: id,
            skillId,
          }))
        );
      }
    }

    if (media !== undefined) {
      await this.repository.deleteMediaByExperienceId(id);

      if (media.length > 0) {
        await this.repository.createMedia(
          media.map((item: { url: string; alt?: string | null; sortOrder?: number | null }) => ({
            experienceId: id,
            url: item.url,
            alt: item.alt ?? undefined,
            sortOrder: item.sortOrder ?? undefined,
          }))
        );
      }
    }

    return updated;
  }

  async delete(id: string) {
    const [deleted] = await this.repository.delete(id);
    if (!deleted) {
      throw new HTTPException(404, { message: "Experience not found" });
    }
    return deleted;
  }
}
