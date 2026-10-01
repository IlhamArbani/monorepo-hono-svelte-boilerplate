import type { PageServerLoad } from './$types';
import { BASE_URL } from '$env/static/private';

export const load: PageServerLoad = async ({fetch}) => {
  const res = await fetch(`${BASE_URL}/api/experiences`);
  const data = await res.json();

  return {data};
}