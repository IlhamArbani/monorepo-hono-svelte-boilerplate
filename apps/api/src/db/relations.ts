import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
  // --- Users ---
  users: {
    userRoles: r.many.userRoles(),
    articles: r.many.articles(),
    portfolios: r.many.portfolios(),
    experiences: r.many.experiences(),
  },

  // --- Roles ---
  roles: {
    userRoles: r.many.userRoles(),
    rolePermissions: r.many.rolePermissions(),
  },

  // --- Permissions ---
  permissions: {
    rolePermissions: r.many.rolePermissions(),
  },

  // --- User Roles (junction) ---
  userRoles: {
    user: r.one.users({
      from: r.userRoles.userId,
      to: r.users.id,
    }),
    role: r.one.roles({
      from: r.userRoles.roleId,
      to: r.roles.id,
    }),
  },

  // --- Role Permissions (junction) ---
  rolePermissions: {
    role: r.one.roles({
      from: r.rolePermissions.roleId,
      to: r.roles.id,
    }),
    permission: r.one.permissions({
      from: r.rolePermissions.permissionId,
      to: r.permissions.id,
    }),
  },

  // --- Articles ---
  articles: {
    author: r.one.users({
      from: r.articles.authorId,
      to: r.users.id,
    }),
    articleCategories: r.many.articleCategories(),
  },

  // --- Article Categories (junction) ---
  articleCategories: {
    article: r.one.articles({
      from: r.articleCategories.articleId,
      to: r.articles.id,
    }),
    category: r.one.categories({
      from: r.articleCategories.categoryId,
      to: r.categories.id,
    }),
  },

  // --- Portfolios ---
  portfolios: {
    author: r.one.users({
      from: r.portfolios.authorId,
      to: r.users.id,
    }),
    images: r.many.portfolioImages(),
    portfolioCategories: r.many.portfolioCategories(),
  },

  // --- Portfolio Images ---
  portfolioImages: {
    portfolio: r.one.portfolios({
      from: r.portfolioImages.portfolioId,
      to: r.portfolios.id,
    }),
  },

  // --- Portfolio Categories (junction) ---
  portfolioCategories: {
    portfolio: r.one.portfolios({
      from: r.portfolioCategories.portfolioId,
      to: r.portfolios.id,
    }),
    category: r.one.categories({
      from: r.portfolioCategories.categoryId,
      to: r.categories.id,
    }),
  },

  // --- Categories ---
  categories: {
    articleCategories: r.many.articleCategories(),
    portfolioCategories: r.many.portfolioCategories(),
  },

  // --- Experiences ---
  experiences: {
    user: r.one.users({
      from: r.experiences.userId,
      to: r.users.id,
    }),
    experienceSkills: r.many.experienceSkills(),
    media: r.many.experienceMedia(),
  },

  // --- Experience Skills (junction) ---
  experienceSkills: {
    experience: r.one.experiences({
      from: r.experienceSkills.experienceId,
      to: r.experiences.id,
    }),
    skill: r.one.skills({
      from: r.experienceSkills.skillId,
      to: r.skills.id,
    }),
  },

  // --- Experience Media ---
  experienceMedia: {
    experience: r.one.experiences({
      from: r.experienceMedia.experienceId,
      to: r.experiences.id,
    }),
  },

  // --- Skills ---
  skills: {
    experienceSkills: r.many.experienceSkills(),
  },
}));
