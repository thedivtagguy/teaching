import { getAssignmentContent } from '$lib/utils/contentService';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
  const { courseId, assignmentId } = params;
  
  try {
    // Use content service to get the assignment content
    const module = getAssignmentContent(courseId, assignmentId);
    
    if (module) {
      return {
        assignment: module.default,
        meta: module.metadata || {}
      };
    } else {
      console.error(`Error loading assignment ${assignmentId}: No supported file found`);
      return {
        error: `Could not load assignment: ${assignmentId}`
      };
    }
  } catch (error) {
    console.error(`Error loading assignment ${assignmentId}:`, error);
    return {
      error: `Could not load assignment: ${assignmentId}`
    };
  }
} 