import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, parent }) {
  const { courseId } = params;
  
  // Get parent data
  const parentData = await parent();
  
  // Extract data we need - checking which properties actually exist
  const readings = [];
  
  // First check if readings exist directly in the menu data
  if (parentData.menuData?.[courseId]?.readings) {
    console.log(`Found ${parentData.menuData[courseId].readings.length} readings in menu data for course: ${courseId}`);
    
    // Add course-level readings from menu data
    for (const reading of parentData.menuData[courseId].readings) {
      readings.push({
        ...reading,
        source: reading.source || 'Course'
      });
    }
  }
  
  // Get course content metadata if available
  const courseMetadata = parentData.coursesWithMetadata?.find(c => c.id === courseId);
  
  // If we have course metadata, extract readings from content items
  if (courseMetadata?.days) {
    console.log(`Looking for readings in ${courseMetadata.days.length} days for course: ${courseId}`);
    
    for (const day of courseMetadata.days) {
      if (day.metadata?.readings) {
        // Add each reading with source information
        for (const reading of day.metadata.readings) {
          readings.push({
            ...reading,
            source: day.metadata.title || day.id,
            // If the reading doesn't have a path but the day does,
            // use the day's path to link to the associated lesson
            path: reading.path || day.path
          });
        }
      }
    }
  }
  
  console.log(`Found ${readings.length} readings for course: ${courseId}`);
  
  return {
    readings
  };
} 