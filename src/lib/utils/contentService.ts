import fs from 'fs';
import path from 'path';
import * as yaml from 'js-yaml';
import grayMatter from 'gray-matter';
import type { 
  MenuDataType, 
  CourseMenu, 
  MenuSection, 
  MenuItem, 
  CourseMeta,
  ContentFrontmatter,
  CourseData
} from './contentSchema';

// Get the project root directory
const rootDir = process.cwd();
const contentDir = path.join(rootDir, 'src/content');

// Cache for course content to improve performance
interface ContentCache {
  menus: Map<string, CourseMenu>;
  metadata: Map<string, CourseMeta>;
  lastUpdated: Map<string, number>;
}

const contentCache: ContentCache = {
  menus: new Map(),
  metadata: new Map(),
  lastUpdated: new Map()
};

/**
 * Read and parse a YAML file
 */
function readYamlFile(filePath: string): any {
  try {
    if (!fs.existsSync(filePath)) return null;
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return yaml.load(fileContents);
  } catch (error) {
    console.error(`Error reading YAML file ${filePath}:`, error);
    return null;
  }
}

/**
 * Check if a file has been modified since last cache update
 */
function hasContentChanged(courseId: string): boolean {
  const lastUpdated = contentCache.lastUpdated.get(courseId) || 0;
  const courseDir = path.join(contentDir, courseId);
  
  if (!fs.existsSync(courseDir)) return false;
  
  // Check if meta.yaml has changed
  const metaPath = path.join(courseDir, 'meta.yaml');
  if (fs.existsSync(metaPath)) {
    const metaStat = fs.statSync(metaPath);
    if (metaStat.mtimeMs > lastUpdated) return true;
  }
  
  // Check if any content file has changed
  const files = fs.readdirSync(courseDir, { withFileTypes: true });
  for (const file of files) {
    if (file.isFile() && file.name.endsWith('.svx')) {
      const filePath = path.join(courseDir, file.name);
      const fileStat = fs.statSync(filePath);
      if (fileStat.mtimeMs > lastUpdated) return true;
    } else if (file.isDirectory()) {
      // Check subdirectories like assignments/
      const subDir = path.join(courseDir, file.name);
      const subFiles = fs.readdirSync(subDir, { withFileTypes: true });
      for (const subFile of subFiles) {
        if (subFile.isFile() && subFile.name.endsWith('.svx')) {
          const subFilePath = path.join(subDir, subFile.name);
          const subFileStat = fs.statSync(subFilePath);
          if (subFileStat.mtimeMs > lastUpdated) return true;
        }
      }
    }
  }
  
  return false;
}

/**
 * Get course metadata from meta.yaml
 */
export function getCourseMetadata(courseId: string): CourseMeta | null {
  // Check cache first if content hasn't changed
  if (contentCache.metadata.has(courseId) && !hasContentChanged(courseId)) {
    return contentCache.metadata.get(courseId) || null;
  }
  
  // Read from file
  const metaPath = path.join(contentDir, courseId, 'meta.yaml');
  const metadata = readYamlFile(metaPath) as CourseMeta | null;
  
  // Cache the result
  if (metadata) {
    contentCache.metadata.set(courseId, metadata);
  }
  
  return metadata;
}

/**
 * Get a list of all available courses with their metadata
 */
export function getAllCourses(): Array<CourseMeta & { id: string }> {
  try {
    const courseDirs = fs.readdirSync(contentDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    
    return courseDirs.map(courseId => {
      const metadata = getCourseMetadata(courseId);
      return {
        id: courseId,
        ...(metadata || { title: courseId, code: courseId }),
      };
    }).filter(course => course);
  } catch (error) {
    console.error('Error getting courses:', error);
    return [];
  }
}

/**
 * Gets the course title from the syllabus or first available file
 */
function getCourseTitle(courseId: string, files: string[], courseDir: string): string {
  // Try to find syllabus first
  if (files.includes('outline.svx')) {
    const syllabusPath = path.join(courseDir, 'outline.svx');
    const content = fs.readFileSync(syllabusPath, 'utf8');
    const { data } = grayMatter(content) as { data: ContentFrontmatter };
    if (data.courseTitle) return data.courseTitle;
  }
  
  // Fall back to first file
  if (files.length > 0) {
    const firstFilePath = path.join(courseDir, files[0]);
    const content = fs.readFileSync(firstFilePath, 'utf8');
    const { data } = grayMatter(content) as { data: ContentFrontmatter };
    if (data.courseTitle) return data.courseTitle;
  }
  
  // Default to course ID if no title found
  return `Course: ${courseId}`;
}

/**
 * Extract order value from filename if it starts with a number pattern
 * Examples: "01-introduction.svx" -> 1, "2_basics.svx" -> 2
 */
function getOrderFromFilename(filename: string): number | null {
  const match = filename.match(/^(\d+)[_\-\s]/);
  if (match && match[1]) {
    return parseInt(match[1], 10);
  }
  return null;
}

/**
 * Extracts the order field from a file frontmatter
 */
function getOrderFromContent(courseDir: string, fileName: string): number {
  try {
    const filePath = path.join(courseDir, `${fileName}.svx`);
    
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      const { data } = grayMatter(content) as { data: ContentFrontmatter };
      
      // Try to get order from frontmatter
      if (typeof data.order === 'number') {
        return data.order;
      }
      
      // Try to get order from filename pattern
      const filenameOrder = getOrderFromFilename(fileName);
      if (filenameOrder !== null) {
        return filenameOrder;
      }
    }
    return 999; // Default high value for unordered items
  } catch (error) {
    console.error('Error getting order:', error);
    return 999;
  }
}

/**
 * Generate menu structure for a specific course
 */
export function generateCourseMenu(courseId: string): CourseMenu | null {
  // Check cache first if content hasn't changed
  if (contentCache.menus.has(courseId) && !hasContentChanged(courseId)) {
    return contentCache.menus.get(courseId) || null;
  }
  
  try {
    const courseDir = path.join(contentDir, courseId);
    if (!fs.existsSync(courseDir)) return null;
    
    // Get course content files
    const entries = fs.readdirSync(courseDir, { withFileTypes: true });
    const contentFiles = entries
      .filter(entry => entry.isFile() && entry.name.endsWith('.svx'))
      .map(entry => entry.name);
    
    // Get course metadata
    const metadata = getCourseMetadata(courseId);
    
    // Create course menu structure
    const courseMenu: CourseMenu = {
      title: metadata?.title || getCourseTitle(courseId, contentFiles, courseDir),
      sections: [],
      readings: [],
      assignments: [],
      collapsibleSections: metadata?.navigation?.collapsibleSections,
      showSections: metadata?.navigation?.showSections !== false // Default to true unless explicitly set to false
    };
    
    // Track sections to avoid duplicates
    const sectionMap: Record<string, MenuSection> = {};
    
    // If metadata has section definitions, initialize them first to maintain order
    if (metadata?.navigation?.sections && Array.isArray(metadata.navigation.sections)) {
      metadata.navigation.sections.forEach((sectionDef: any) => {
        if (sectionDef.title && sectionDef.title !== 'Assignments') { // Skip Assignments section
          sectionMap[sectionDef.title] = { 
            title: sectionDef.title, 
            items: [],
            order: sectionDef.order 
          };
          courseMenu.sections.push(sectionMap[sectionDef.title]);
        }
      });
    }
    
    // Process each content file
    for (const file of contentFiles) {
      const filePath = path.join(courseDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      const { data } = grayMatter(content) as { data: ContentFrontmatter };
      
      // Skip if not published
      if (data.published === false) {
        continue;
      }
      
      // Get file basename without extension (e.g., 'day1' from 'day1.svx')
      const basename = path.basename(file, '.svx');
      const pagePath = `/${courseId}/${basename}`;
      
      // Extract metadata
      const title = data.title || basename;
      const section = data.section || 'General';
      const order = data.order !== undefined ? data.order : getOrderFromFilename(file) || 999;
      
      // Skip adding outline.svx to the menu sections
      if (basename === 'outline') {
        continue;
      }
      
      // Force "notices" into the "Appendix" section
      let effectiveSection = section;
      if (section.toLowerCase().includes('notice')) {
        effectiveSection = 'Appendix';
      }
      
      // Create or get section (if not already created from metadata)
      if (!sectionMap[effectiveSection]) {
        sectionMap[effectiveSection] = { title: effectiveSection, items: [] };
        courseMenu.sections.push(sectionMap[effectiveSection]);
      }
      
      // Add menu item to section
      const menuItem: MenuItem = {
        title,
        path: pagePath,
        order
      };
      
      sectionMap[effectiveSection].items.push(menuItem);
      
      // Process readings
      if (data.readings && Array.isArray(data.readings)) {
        for (const reading of data.readings) {
          if (reading.title) {
            if (courseMenu.readings) {
              courseMenu.readings.push({
                ...reading,
                path: reading.path || pagePath,
                source: reading.source || basename
              });
            }
          }
        }
      }
      
      // Process assignments
      if (data.assignments && Array.isArray(data.assignments)) {
        for (const assignment of data.assignments) {
          if (assignment.title) {
            if (courseMenu.assignments) {
              courseMenu.assignments.push({
                ...assignment,
                path: assignment.path || pagePath,
                source: assignment.source || basename
              });
            }
          }
        }
      }
    }
    
    // Process assignments directory if it exists
    const assignmentsDir = path.join(courseDir, 'assignments');
    if (fs.existsSync(assignmentsDir) && fs.statSync(assignmentsDir).isDirectory()) {
      const assignmentFiles = fs.readdirSync(assignmentsDir)
        .filter(file => file.endsWith('.svx'));
      
      // Process each assignment file
      for (const file of assignmentFiles) {
        const filePath = path.join(assignmentsDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const { data } = grayMatter(content) as { data: ContentFrontmatter };
        
        // Skip if not published
        if (data.published === false) {
          continue;
        }
        
        const basename = path.basename(file, '.svx');
        const pagePath = `/${courseId}/assignments/${basename}`;
        const title = data.title || basename;
        const order = data.order !== undefined ? data.order : getOrderFromFilename(file) || 999;
        
        // Add to assignments list only (not to menu sections)
        if (courseMenu.assignments) {
          courseMenu.assignments.push({
            title,
            path: pagePath,
            due: data.due,
            description: data.description,
            source: basename
          });
        }
      }
    }
    
    // Sort sections
    courseMenu.sections.sort((a, b) => {
      // Use explicit order if available
      const orderA = a.order !== undefined ? a.order : 999;
      const orderB = b.order !== undefined ? b.order : 999;
      return orderA - orderB;
    });
    
    // Sort items within sections
    courseMenu.sections.forEach(section => {
      section.items.sort((a, b) => {
        const orderA = a.order !== undefined ? a.order : 999;
        const orderB = b.order !== undefined ? b.order : 999;
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
    
    // Sort readings and assignments by title
    if (courseMenu.readings) {
      courseMenu.readings.sort((a, b) => a.title.localeCompare(b.title));
    }
    
    if (courseMenu.assignments) {
      courseMenu.assignments.sort((a, b) => {
        // Sort by due date if available
        if (a.due && b.due) {
          return new Date(a.due).getTime() - new Date(b.due).getTime();
        }
        return a.title.localeCompare(b.title);
      });
    }
    
    // Update cache and cache timestamp
    contentCache.menus.set(courseId, courseMenu);
    contentCache.lastUpdated.set(courseId, Date.now());
    
    return courseMenu;
  } catch (error) {
    console.error(`Error generating menu for course ${courseId}:`, error);
    return null;
  }
}

/**
 * Generate menu configuration for all courses
 */
export function generateMenuConfig(): MenuDataType {
  const menuData: MenuDataType = {};
  
  try {
    // Get course directories
    const courseDirs = fs.readdirSync(contentDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    
    // Process each course
    for (const courseId of courseDirs) {
      const courseMenu = generateCourseMenu(courseId);
      
      // Add course to menu data if menu was generated successfully
      if (courseMenu && courseMenu.sections.length > 0) {
        menuData[courseId] = courseMenu;
      }
    }
  } catch (error) {
    console.error('Error generating menu configuration:', error);
  }
  
  return menuData;
}

/**
 * Get complete course data including metadata and menu
 */
export function getCourseData(courseId: string): CourseData | null {
  const metadata = getCourseMetadata(courseId);
  const menu = generateCourseMenu(courseId);
  
  if (!metadata || !menu) return null;
  
  return {
    metadata,
    menu
  };
}

/**
 * Reset content cache (useful for development/testing)
 */
export function resetContentCache(): void {
  contentCache.menus.clear();
  contentCache.metadata.clear();
  contentCache.lastUpdated.clear();
}