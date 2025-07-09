import type { MenuDataType } from '$lib/utils/contentSchema';
import { generateMenuConfig, getAllCourses } from '$lib/utils/contentService';
import type { LayoutLoad } from './$types';

// Enable prerendering for the entire site
export const prerender = true;

/**
 * Get list of available course IDs from menu configuration
 */
function getAvailableCourses(menuData: MenuDataType): string[] {
  return Object.keys(menuData);
}

export const load: LayoutLoad = async () => {
  // Generate the menu from content files using the unified content service
  const menuData = generateMenuConfig();
  
  // Get course IDs from menu
  const availableCourses = getAvailableCourses(menuData);
  
  // Get full course metadata
  const coursesWithMetadata = getAllCourses();
  
  return {
    menuData,
    availableCourses,
    coursesWithMetadata
  };
} 