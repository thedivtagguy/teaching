import { error } from '@sveltejs/kit';
import { generateCourseMenu } from '$lib/utils/contentService';

/** @type {import('./$types').PageLoad} */
export async function load({ params, parent }) {
  const { courseId } = params;
  
  // Generate course menu directly from our content service
  const courseMenu = generateCourseMenu(courseId);
  
  if (!courseMenu) {
    throw error(404, `Course ${courseId} not found`);
  }
  
  // Get readings directly from the course menu
  const readings = (courseMenu.readings || []).map(reading => ({
    ...reading,
    source: reading.source || 'Course'
  }));
  
  return {
    readings
  };
} 