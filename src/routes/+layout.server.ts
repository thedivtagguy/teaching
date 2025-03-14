import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';
import type { MenuDataType } from '$lib/utils/menu';
import { generateMenuConfig } from '$lib/utils/menuGenerator';
import { getAllCourses, resetMetadataCache } from '$lib/utils/courseMetadata';
import type { LayoutServerLoad } from './$types';
import { dev } from '$app/environment';

// Get the directory path for the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');

/**
 * Load menu configuration from YAML file
 * This is a fallback if dynamic generation fails
 */
function loadMenuConfigFromFile(): MenuDataType {
  try {
    // Use the correct path to the menu.yaml file in the src directory
    const configPath = path.resolve(rootDir, 'src/config/menu.yaml');
    console.log('Looking for menu file at:', configPath);
    const fileContents = fs.readFileSync(configPath, 'utf8');
    const parsedConfig = yaml.load(fileContents) as MenuDataType;
    return parsedConfig;
  } catch (error) {
    console.error('Error loading menu configuration:', error);
    return {};
  }
}

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
    resetMetadataCache();
  }
  
  // Try to dynamically generate the menu from content files
  let menuData: MenuDataType;
  try {
    menuData = await generateMenuConfig();
    
    // Optionally, write the generated config to disk for inspection
    // This is useful for debugging but can be removed in production
    const configPath = path.resolve(rootDir, 'src/config/menu.generated.yaml');
    const yamlContent = yaml.dump(menuData, { lineWidth: 100 });
    fs.writeFileSync(configPath, yamlContent, 'utf8');
    
  } catch (error) {
    console.error('Error generating menu configuration, falling back to static file:', error);
    // Fallback to reading the static file
    menuData = loadMenuConfigFromFile();
  }
  
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