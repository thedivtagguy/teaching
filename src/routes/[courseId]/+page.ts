import { error } from '@sveltejs/kit';
import { getCourseData } from '$lib/utils/contentService';
import type { PageLoad } from './$types';

export const prerender = true;
export const load: PageLoad = async ({ params }) => {
  const { courseId } = params;

  // Get course data (includes both metadata and menu structure)
  const courseData = getCourseData(courseId);
  // If course doesn't exist, throw 404
  if (!courseData) {
    throw error(404, `Course ${courseId} not found`);
  }

  return {
    courseData: courseData
  };
}; 