import { error } from '@sveltejs/kit';
import { generateCourseMenu } from '$lib/utils/contentService';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, parent, depends }) {
  const { courseId } = params;
  
  // Add dependency on content to ensure refreshes when content changes
  depends('content');
  
  // Generate course menu directly from our content service
  const courseMenu = generateCourseMenu(courseId);
  
  if (!courseMenu) {
    throw error(404, `Course ${courseId} not found`);
  }
  
  // Get assignments directly from the course menu
  const assignments = (courseMenu.assignments || []).map(assignment => ({
    ...assignment,
    source: assignment.source || 'Course'
  }));
  
  return {
    assignments
  };
} 