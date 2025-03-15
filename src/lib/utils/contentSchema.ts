// Unified schema definitions for the course content system
// Centralizes all type definitions to avoid duplication

// Menu item representing a single page in navigation
export type MenuItem = {
  title: string;
  path: string;
  order?: number;
};

// Section in the course menu
export type MenuSection = {
  title: string;
  items: MenuItem[];
  order?: number;
};

// Reading item with metadata
export type Reading = {
  title: string;
  author?: string;
  url?: string;
  pages?: string;
  path?: string;
  source?: string;
};

// Assignment item with metadata
export type Assignment = {
  title: string;
  due?: string;
  description?: string;
  path?: string;
  source?: string;
};

// Complete menu structure for a course
export type CourseMenu = {
  title: string;
  sections: MenuSection[];
  readings?: Reading[];
  assignments?: Assignment[];
};

// Menu data for all courses
export type MenuDataType = Record<string, CourseMenu>;

// Course metadata from meta.yaml
export type CourseMeta = {
  title: string;
  code: string;
  description?: string;
  instructor?: {
    name: string;
    email?: string;
    hours?: string;
  };
  navigation?: {
    sections?: Array<{
      title: string;
      order?: number;
    }>;
  };
  readings?: Reading[];
  assignments?: Assignment[];
};

// Content file frontmatter structure
export type ContentFrontmatter = {
  title: string;
  date?: string;
  description?: string;
  published?: boolean;
  section?: string;
  order?: number;
  readings?: Reading[];
  assignments?: Assignment[];
  courseTitle?: string;
};

// Complete course data including metadata and content
export type CourseData = {
  metadata: CourseMeta;
  menu: CourseMenu;
};