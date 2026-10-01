import { db } from "../../lib/db";
import { experiences } from "../../db/schema/experiences";
import { experienceSkills } from "../../db/schema/experience-skills";
import { experienceMedia } from "../../db/schema/experience-media";
import { experienceTranslations } from "../../db/schema/experience-translations";
import { eq } from "drizzle-orm";

export class ExperiencesRepository {
  async findAll(locale: string = 'id') {
    return await db.query.experiences.findMany({
      with: {
        experienceSkills: {
          with: {
            skill: true,
          },
        },
        translations: {
          where: {
            locale: { eq: locale },
          },
        },
        media: {
          orderBy: {
            sortOrder: 'asc',
          },
        },
      },
      orderBy: {
        startYear: 'desc',
      },
    });
  }

  async findById(id: string) {
    return await db.query.experiences.findFirst({
      where: {
        id: id,
      },
      with: {
        user: true,
        translations: true,
        experienceSkills: {
          with: {
            skill: true,
          },
        },
        media: {
          orderBy: {
            sortOrder: 'asc',
          },
        },
      },
    });
  }

  async create(data: any) {
    return await db.insert(experiences).values(data).returning();
  }

  async createTranslations(data: any[]) {
    return await db.insert(experienceTranslations).values(data);
  }

  async createSkills(data: any[]) {
    return await db.insert(experienceSkills).values(data);
  }

  async createMedia(data: any[]) {
    return await db.insert(experienceMedia).values(data);
  }

  async update(id: string, data: any) {
    return await db.update(experiences).set(data).where(eq(experiences.id, id)).returning();
  }

  async deleteTranslationsByExperienceId(id: string) {
    return await db.delete(experienceTranslations).where(eq(experienceTranslations.experienceId, id));
  }

  async deleteSkillsByExperienceId(id: string) {
    return await db.delete(experienceSkills).where(eq(experienceSkills.experienceId, id));
  }

  async deleteMediaByExperienceId(id: string) {
    return await db.delete(experienceMedia).where(eq(experienceMedia.experienceId, id));
  }

  async delete(id: string) {
    return await db.delete(experiences).where(eq(experiences.id, id)).returning();
  }
}
