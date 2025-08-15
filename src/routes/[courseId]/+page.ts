import { error } from '@sveltejs/kit';
import { getCourseData, getContentFile } from '$lib/utils/contentService';
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

  // Load outline content
  let outlineContent = null;
  try {
    const module = getContentFile(courseId, 'outline');
    if (module) {
      outlineContent = module.default;
      outlineContent.metadata = module.metadata;
    }
  } catch (err) {
    console.error(`Error loading outline for ${courseId}:`, err);
  }

  return {
    courseData: courseData,
    outlineContent: outlineContent
  };
}; 