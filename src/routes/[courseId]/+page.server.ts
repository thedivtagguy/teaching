import { error } from '@sveltejs/kit';
import { getCourseData } from '$lib/utils/contentService';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, depends }) => {
  const { courseId } = params;
  
  // Add content dependency to trigger reloads when content changes
  depends('content');
  
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