import { error } from '@sveltejs/kit';
import { getCourseMetadata } from '$lib/utils/courseMetadata';
import type { PageServerLoad } from './$types';
import { dev } from '$app/environment';

export const load: PageServerLoad = async ({ params, depends }) => {
  const { courseId } = params;
  
  // Add content dependency to trigger reloads when content changes
  depends('content');
  
  // Get course metadata
  const metadata = getCourseMetadata(courseId);
  
  // If course doesn't exist, throw 404
  if (!metadata) {
    throw error(404, `Course ${courseId} not found`);
  }
  
  return {
    courseMetadata: metadata
  };
}; 