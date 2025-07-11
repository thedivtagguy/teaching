import * as yaml from 'js-yaml';
import type { 
  MenuDataType, 
  CourseMenu, 
  MenuSection, 
  MenuItem, 
  CourseMeta,
  ContentFrontmatter,
  CourseData
} from './contentSchema';

// Import all content files using Vite's import.meta.glob, excluding notes and templates folders
const contentFiles = import.meta.glob([
  '/src/content/**/*.svx',
  '/src/content/**/*.md',
  '!/src/content/**/notes/**',
  '!/src/content/**/templates/**'
], { 
  eager: true 
});

const yamlFiles = import.meta.glob('/src/content/**/meta.yaml', { 
  as: 'raw', 
  eager: true 
});

// Supported content file extensions
const SUPPORTED_EXTENSIONS = ['.svx', '.md'];

/**
 * Check if a file has a supported content extension
 */
function isSupportedContentFile(filename: string): boolean {
  return SUPPORTED_EXTENSIONS.some(ext => filename.endsWith(ext));
}

/**
 * Get the extension of a content file
 */
function getContentFileExtension(filename: string): string {
  const ext = SUPPORTED_EXTENSIONS.find(ext => filename.endsWith(ext));
  return ext || '.svx'; // Default to .svx for backwards compatibility
}

// Cache for course content to improve performance
interface ContentCache {
  menus: Map<string, CourseMenu>;
  metadata: Map<string, CourseMeta>;
}

const contentCache: ContentCache = {
  menus: new Map(),
  metadata: new Map()
};

/**
 * Parse a YAML string
 */
function parseYaml(content: string): any {
  try {
    return yaml.load(content);
  } catch (error) {
    console.error('Error parsing YAML:', error);
    return null;
  }
}

/**
 * Get course directories from available content
 */
function getCourseDirectories(): string[] {
  const courses = new Set<string>();
  
  // Extract course IDs from content file paths
  Object.keys(contentFiles).forEach(filePath => {
    const match = filePath.match(/^\/src\/content\/([^\/]+)/);
    if (match) {
      courses.add(match[1]);
    }
  });
  
  // Also check yaml files
  Object.keys(yamlFiles).forEach(filePath => {
    const match = filePath.match(/^\/src\/content\/([^\/]+)/);
    if (match) {
      courses.add(match[1]);
    }
  });
  
  return Array.from(courses);
}

/**
 * Get course metadata from meta.yaml
 */
export function getCourseMetadata(courseId: string): CourseMeta | null {
  // Check cache first
  if (contentCache.metadata.has(courseId)) {
    return contentCache.metadata.get(courseId) || null;
  }
  
  // Look for meta.yaml file
  const metaPath = `/src/content/${courseId}/meta.yaml`;
  const metaContent = yamlFiles[metaPath];
  
  if (!metaContent) {
    console.log(`No meta.yaml found for course ${courseId}`);
    return null;
  }
  
  const metadata = parseYaml(metaContent) as CourseMeta | null;
  
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
    const courseDirs = getCourseDirectories();
    
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
function getCourseTitle(courseId: string, files: string[]): string {
  // Try to find outline file first
  const outlineFiles = [
    `/src/content/${courseId}/outline.svx`,
    `/src/content/${courseId}/outline.md`
  ];
  
  for (const outlineFile of outlineFiles) {
    const module = contentFiles[outlineFile] as any;
    if (module && module.metadata) {
      const data = module.metadata as ContentFrontmatter;
      if (data.courseTitle) return data.courseTitle;
    }
  }
  
  // Fall back to first file
  if (files.length > 0) {
    const firstFilePath = files[0];
    const module = contentFiles[firstFilePath] as any;
    if (module && module.metadata) {
      const data = module.metadata as ContentFrontmatter;
      if (data.courseTitle) return data.courseTitle;
    }
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
function getOrderFromContent(courseId: string, fileName: string): number {
  try {
    const possiblePaths = [
      `/src/content/${courseId}/${fileName}.svx`,
      `/src/content/${courseId}/${fileName}.md`
    ];
    
    for (const filePath of possiblePaths) {
      const module = contentFiles[filePath] as any;
      if (module && module.metadata) {
        const data = module.metadata as ContentFrontmatter;
        
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
  // Check cache first
  if (contentCache.menus.has(courseId)) {
    return contentCache.menus.get(courseId) || null;
  }
  
  try {
    // Get course content files from imported files
    const courseContentFiles = Object.keys(contentFiles).filter(filePath => 
      filePath.startsWith(`/src/content/${courseId}/`) && 
      !filePath.includes('/assignments/') &&
      isSupportedContentFile(filePath)
    );
    
    if (courseContentFiles.length === 0) {
      console.log(`No supported file found for ${courseId}`);
      return null;
    }
    
    // Get course metadata
    const metadata = getCourseMetadata(courseId);
    
    // Create course menu structure
    const courseMenu: CourseMenu = {
      title: metadata?.title || getCourseTitle(courseId, courseContentFiles),
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
    for (const filePath of courseContentFiles) {
      const module = contentFiles[filePath] as any;
      if (!module || !module.metadata) {
        console.log(`No metadata found for ${filePath}`);
        continue;
      }
      
      const data = module.metadata as ContentFrontmatter;
      
      // Skip if not published
      if (data.published === false) {
        continue;
      }
      
      // Get file basename without extension (e.g., 'day1' from 'day1.svx' or 'day1.md')
      const fileName = filePath.split('/').pop() || '';
      const extension = getContentFileExtension(fileName);
      const basename = fileName.replace(extension, '');
      const pagePath = `/${courseId}/${basename}`;
      
      // Extract metadata
      const title = data.title || basename;
      const section = data.section || 'General';
      const order = data.order !== undefined ? data.order : getOrderFromFilename(fileName) || 999;
      
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
    const assignmentFiles = Object.keys(contentFiles).filter(filePath => 
      filePath.startsWith(`/src/content/${courseId}/assignments/`) &&
      isSupportedContentFile(filePath)
    );
    
    // Process each assignment file
    for (const filePath of assignmentFiles) {
      const module = contentFiles[filePath] as any;
      if (!module || !module.metadata) {
        console.log(`Error loading assignment ${filePath.split('/').pop()?.replace(/\.(svx|md)$/, '')}: No metadata found`);
        continue;
      }
      
      const data = module.metadata as ContentFrontmatter;
      
      // Skip if not published
      if (data.published === false) {
        continue;
      }
      
      const fileName = filePath.split('/').pop() || '';
      const extension = getContentFileExtension(fileName);
      const basename = fileName.replace(extension, '');
      const pagePath = `/${courseId}/assignments/${basename}`;
      const title = data.title || basename;
      const order = data.order !== undefined ? data.order : getOrderFromFilename(fileName) || 999;
      
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
    
    // Update cache
    contentCache.menus.set(courseId, courseMenu);
    
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
    const courseDirs = getCourseDirectories();
    
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
 * Get content file by course and filename
 */
export function getContentFile(courseId: string, fileName: string): any | null {
  const possiblePaths = [
    `/src/content/${courseId}/${fileName}.svx`,
    `/src/content/${courseId}/${fileName}.md`
  ];
  
  for (const filePath of possiblePaths) {
    const module = contentFiles[filePath] as any;
    if (module) {
      return module;
    }
  }
  
  return null;
}

/**
 * Get assignment content file by course and assignment ID
 */
export function getAssignmentContent(courseId: string, assignmentId: string): any | null {
  const possiblePaths = [
    `/src/content/${courseId}/assignments/${assignmentId}.svx`,
    `/src/content/${courseId}/assignments/${assignmentId}.md`
  ];
  
  for (const filePath of possiblePaths) {
    const module = contentFiles[filePath] as any;
    if (module) {
      return module;
    }
  }
  
  return null;
}

/**
 * Reset content cache (useful for development/testing)
 */
export function resetContentCache(): void {
  contentCache.menus.clear();
  contentCache.metadata.clear();
}