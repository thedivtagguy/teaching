import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as yaml from 'js-yaml';
import grayMatter from 'gray-matter';
import type { MenuDataType, CourseMenu, MenuSection, MenuItem, Reading, Assignment } from './menu';

// Define rootDir directly using a relative path instead of import.meta
// This assumes menuGenerator.ts is in src/lib/utils
const rootDir = path.resolve(path.join(process.cwd(), 'src/content')).replace('/src/content', '');

/**
 * Reads and parses a YAML file
 */
function readYamlFile(filePath: string): any {
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return yaml.load(fileContents);
  } catch (error) {
    console.error(`Error reading YAML file ${filePath}:`, error);
    return null;
  }
}

/**
 * Gets course metadata from meta.yaml or falls back to values from content files
 */
function getCourseMetadata(courseId: string, courseDir: string): any {
  const metaPath = path.join(courseDir, 'meta.yaml');
  
  if (fs.existsSync(metaPath)) {
    return readYamlFile(metaPath);
  }
  
  return null;
}

/**
 * Generate menu configuration from content files
 */
export async function generateMenuConfig(): Promise<MenuDataType> {
  const contentDir = path.join(rootDir, 'src/content');
  const menuData: MenuDataType = {};
  
  try {
    // Get course directories
    const courseDirs = fs.readdirSync(contentDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    
    // Process each course
    for (const courseId of courseDirs) {
      const courseDir = path.join(contentDir, courseId);
      const courseFiles = fs.readdirSync(courseDir)
        .filter(file => file.endsWith('.svx'));
      
      // Get course metadata
      const metadata = getCourseMetadata(courseId, courseDir);
      
      // Create course menu structure with empty arrays for readings and assignments
      const courseMenu: CourseMenu = {
        title: metadata?.title || getCourseTitle(courseId, courseFiles, courseDir),
        sections: [],
        readings: [],
        assignments: []
      };
      
      // Track sections to avoid duplicates
      const sectionMap: Record<string, MenuSection> = {};
      
      // If metadata has section definitions, initialize them first to maintain order
      if (metadata?.navigation?.sections && Array.isArray(metadata.navigation.sections)) {
        metadata.navigation.sections.forEach((sectionDef: any) => {
          if (sectionDef.title) {
            sectionMap[sectionDef.title] = { title: sectionDef.title, items: [] };
            courseMenu.sections.push(sectionMap[sectionDef.title]);
          }
        });
      }
      
      // Process each content file
      for (const file of courseFiles) {
        const filePath = path.join(courseDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const { data } = grayMatter(content);
        
        // Skip if not published
        if (data.published === false) {
          continue;
        }
        
        // Get file basename without extension (e.g., 'day1' from 'day1.svx')
        const pagePath = `/${courseId}/${path.basename(file, '.svx')}`;
        
        // Extract metadata
        const title = data.title || path.basename(file, '.svx');
        const section = data.section || 'General';
        const order = data.order || 0;
        
        // Create or get section (if not already created from metadata)
        if (!sectionMap[section]) {
          sectionMap[section] = { title: section, items: [] };
          courseMenu.sections.push(sectionMap[section]);
        }
        
        // Add menu item to section
        const menuItem: MenuItem = {
          title,
          path: pagePath
        };
        
        sectionMap[section].items.push(menuItem);
        
        // Check for readings in the content file
        if (data.readings && Array.isArray(data.readings)) {
          for (const reading of data.readings) {
            if (reading.title) {
              // Add file path to link readings to their source
              if (courseMenu.readings) {
                courseMenu.readings.push({
                  ...reading,
                  path: pagePath
                });
              }
            }
          }
        }
        
        // Check for assignments in the content file
        if (data.assignments && Array.isArray(data.assignments)) {
          for (const assignment of data.assignments) {
            if (assignment.title) {
              // Add file path to link assignments to their source
              if (courseMenu.assignments) {
                courseMenu.assignments.push({
                  ...assignment,
                  path: pagePath
                });
              }
            }
          }
        }
      }
      
      // Sort sections based on metadata order if available
      if (metadata?.navigation?.sections && Array.isArray(metadata.navigation.sections)) {
        const sectionOrderMap = new Map<string, number>();
        metadata.navigation.sections.forEach((sectionDef: any, index: number) => {
          sectionOrderMap.set(sectionDef.title, sectionDef.order || index);
        });
        
        courseMenu.sections.sort((a, b) => {
          const orderA = sectionOrderMap.get(a.title) || 999;
          const orderB = sectionOrderMap.get(b.title) || 999;
          return orderA - orderB;
        });
      }
      
      // Sort items within sections
      courseMenu.sections.forEach(section => {
        section.items.sort((a, b) => {
          // Try to get the order from file content (this is simplified)
          const orderA = getOrderFromPath(courseDir, a.path) || 0;
          const orderB = getOrderFromPath(courseDir, b.path) || 0;
          return orderA - orderB;
        });
      });
      
      // Include course-level readings and assignments from metadata if available
      if (metadata?.readings && Array.isArray(metadata.readings) && courseMenu.readings) {
        courseMenu.readings.push(...metadata.readings);
      }
      
      if (metadata?.assignments && Array.isArray(metadata.assignments) && courseMenu.assignments) {
        courseMenu.assignments.push(...metadata.assignments);
      }
      
      // Add course to menu data
      if (courseMenu.sections.length > 0) {
        menuData[courseId] = courseMenu;
      }
    }
  } catch (error) {
    console.error('Error scanning content directory:', error);
  }
  
  return menuData;
}

/**
 * Extracts the order field from a file
 */
function getOrderFromPath(courseDir: string, itemPath: string): number {
  try {
    const fileName = path.basename(itemPath);
    const filePath = path.join(courseDir, `${fileName}.svx`);
    
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      const { data } = grayMatter(content);
      return data.order || 0;
    }
    return 0;
  } catch (error) {
    console.error('Error getting order:', error);
    return 0;
  }
}

/**
 * Gets the course title from the syllabus or first available file
 */
function getCourseTitle(courseId: string, files: string[], courseDir: string): string {
  // Try to find syllabus first
  if (files.indexOf('syllabus.svx') !== -1) { // Use indexOf instead of includes for broader compatibility
    const syllabusPath = path.join(courseDir, 'syllabus.svx');
    const content = fs.readFileSync(syllabusPath, 'utf8');
    const { data } = grayMatter(content);
    if (data.courseTitle) return data.courseTitle;
  }
  
  // Fall back to first file
  if (files.length > 0) {
    const firstFilePath = path.join(courseDir, files[0]);
    const content = fs.readFileSync(firstFilePath, 'utf8');
    const { data } = grayMatter(content);
    if (data.courseTitle) return data.courseTitle;
  }
  
  // Default to course ID if no title found
  return `Course: ${courseId}`;
}

/**
 * Generate and write menu configuration to file
 */
export async function writeMenuConfig(): Promise<void> {
  try {
    const menuData = await generateMenuConfig();
    const configPath = path.resolve(rootDir, 'src/config/menu.yaml');
    const yamlContent = yaml.dump(menuData, { lineWidth: 100 });
    fs.writeFileSync(configPath, yamlContent, 'utf8');
    console.log('Menu configuration generated successfully at:', configPath);
  } catch (error) {
    console.error('Error generating menu configuration:', error);
  }
}

// Remove the check for direct execution since we'll handle that differently
// We'll rely on the scripts/generate-menu.js to run this code 