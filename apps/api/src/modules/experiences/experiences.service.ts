import { HTTPException } from "hono/http-exception";
import { ExperiencesRepository } from "./experiences.repository";

export class ExperiencesService {
  constructor(private readonly repository: ExperiencesRepository) {}

  async findAll(lang?: string) {
    const allExperiences = await this.repository.findAll(lang);
    return allExperiences.map((exp: any) => {
      const {userId, ...data} = exp;
      
      return data;
    });
  }

  async findById(id: string, locale?: string) {
    const experience: any = await this.repository.findById(id);
    if (!experience) {
      throw new HTTPException(404, { message: "Experience not found" });
    }

    let data = { ...experience };
    if (data.user) {
      const { password: _, ...userWithoutPassword } = data.user;
      data.user = userWithoutPassword;
    }
    if (locale && data.translations) {
      data.translations = data.translations.filter((t: any) => t.locale === locale);
    }
    return data;
  }

  async create(userId: string, body: any) {
    const {
      organization,
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
      translations,
    } = body;

    const [newExperience] = await this.repository.create({
      userId,
      organization,
      location,
      locationType,
      employmentType,
      startMonth,
      startYear,
      endMonth,
      endYear,
      isCurrentlyWork,
    });

    if (translations && translations.length > 0) {
      await this.repository.createTranslations(
        translations.map((t: any) => ({
          experienceId: newExperience.id,
          locale: t.locale,
          jobTitle: t.jobTitle,
          highlights: t.highlights,
        }))
      );
    }

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
      organization,
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
      translations,
    } = body;

    const [updated] = await this.repository.update(id, {
      organization,
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

    if (translations !== undefined) {
      await this.repository.deleteTranslationsByExperienceId(id);

      if (translations.length > 0) {
        await this.repository.createTranslations(
          translations.map((t: any) => ({
            experienceId: id,
            locale: t.locale,
            jobTitle: t.jobTitle,
            highlights: t.highlights,
          }))
        );
      }
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
