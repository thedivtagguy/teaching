import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, parent }) {
  const { courseId } = params;
  
  // Get parent data
  const parentData = await parent();
  
  // Log the structure of parentData to see what's available
  console.log('Parent data structure:', Object.keys(parentData));
  
  // Extract data we need - checking which properties actually exist
  const assignments = [];
  
  // First check if assignments exist directly in the menu data
  if (parentData.menuData?.[courseId]?.assignments) {
    console.log(`Found ${parentData.menuData[courseId].assignments.length} assignments in menu data for course: ${courseId}`);
    
    // Add course-level assignments from menu data
    for (const assignment of parentData.menuData[courseId].assignments) {
      assignments.push({
        ...assignment,
        source: assignment.source || 'Course'
      });
    }
  }
  
  // Get course content metadata if available
  const courseMetadata = parentData.coursesWithMetadata?.find(c => c.id === courseId);
  
  // If we have course metadata, extract assignments from content items
  if (courseMetadata?.days) {
    console.log(`Looking for assignments in ${courseMetadata.days.length} days for course: ${courseId}`);
    
    for (const day of courseMetadata.days) {
      if (day.metadata?.assignments) {
        // Add each assignment with source information
        for (const assignment of day.metadata.assignments) {
          assignments.push({
            ...assignment,
            source: day.metadata.title || day.id
          });
        }
      }
    }
  }
  
  console.log(`Found ${assignments.length} assignments for course: ${courseId}`);
  
  return {
    assignments
  };
} 