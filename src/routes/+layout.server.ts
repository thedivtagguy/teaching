import type { MenuDataType } from '$lib/utils/contentSchema';
import { generateMenuConfig, getAllCourses, resetContentCache } from '$lib/utils/contentService';
import type { LayoutServerLoad } from './$types';
import { dev } from '$app/environment';

// Enable prerendering for the entire site
export const prerender = true;

/**
 * Get list of available course IDs from menu configuration
 */
function getAvailableCourses(menuData: MenuDataType): string[] {
  return Object.keys(menuData);
}

export const load: LayoutServerLoad = async ({ depends }) => {
  // Add a dependency on 'content' - SvelteKit will invalidate this load function
  // when any route that includes 'content' in its path is requested
  depends('content');
  
  // In development, reset cache on each load to ensure fresh data
  if (dev) {
    resetContentCache();
  }
  
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