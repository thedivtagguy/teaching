import fs from 'fs';
import path from 'path';
import * as yaml from 'js-yaml';

// Get the project root directory
const rootDir = process.cwd();

/**
 * Cache for course metadata to avoid reading files repeatedly
 */
const metadataCache = new Map<string, any>();

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
 * Get metadata for a specific course
 */
export function getCourseMetadata(courseId: string): any {
  // Check cache first
  if (metadataCache.has(courseId)) {
    return metadataCache.get(courseId);
  }
  
  // Read from file
  const metaPath = path.join(rootDir, 'src/content', courseId, 'meta.yaml');
  const metadata = readYamlFile(metaPath);
  
  // Cache the result
  if (metadata) {
    metadataCache.set(courseId, metadata);
  }
  
  return metadata;
}

/**
 * Get a list of all available courses with their metadata
 */
export function getAllCourses(): any[] {
  try {
    const contentDir = path.join(rootDir, 'src/content');
    const courseDirs = fs.readdirSync(contentDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    
    return courseDirs.map(courseId => {
      const metadata = getCourseMetadata(courseId);
      return {
        id: courseId,
        ...metadata,
      };
    }).filter(course => course); // Filter out any null metadata
  } catch (error) {
    console.error('Error getting courses:', error);
    return [];
  }
}

/**
 * Reset the metadata cache (useful for development/testing)
 */
export function resetMetadataCache(): void {
  console.log('Resetting metadata cache');
  metadataCache.clear();
} 