import type { PageServerLoad } from './$types';
import { BASE_URL } from '$env/static/private';
import type { Experience } from '@portfolio-cms/shared';

export const load: PageServerLoad = async ({fetch}) => {
  const experience = await fetch(`${BASE_URL}/api/experiences`);
  const lastPortfolios = await fetch(`${BASE_URL}/api/portfolios`);
  const lasArticles = await fetch(`${BASE_URL}/api/articles`);
  const experienceData = await experience.json();
  const lastPortfoliosData = await lastPortfolios.json();
  const lastArticlesData = await lasArticles.json();

  return {
    experiences: experienceData?.data as Experience[],
    portfolios: lastPortfoliosData?.data ?? null,
    articles: lastArticlesData?.data ?? null,
  };
}