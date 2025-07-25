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

// Announcement item with metadata
export type Announcement = {
  title: string;
  date: string;
  content: string;
  slug: string;
};

// Complete menu structure for a course
export type CourseMenu = {
  title: string;
  sections: MenuSection[];
  readings?: Reading[];
  assignments?: Assignment[];
  announcements?: Announcement[];
  collapsibleSections?: boolean;
  showSections?: boolean;
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
    collapsibleSections?: boolean;
    showSections?: boolean;
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
  devnotes?: string;
  // SEO-specific fields (flat structure)
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  seo_image?: string;
  seo_author?: string;
  seo_canonical?: string;
  seo_type?: 'website' | 'article';
};

// Complete course data including metadata and content
export type CourseData = {
  metadata: CourseMeta;
  menu: CourseMenu;
};