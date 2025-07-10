import type { ContentFrontmatter } from './contentSchema';

export interface SEOData {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  author?: string;
  canonical?: string;
  type?: 'website' | 'article';
  date?: string;
  courseId?: string;
  contentType?: 'page' | 'assignment' | 'day' | 'article';
}

export function extractSEOData(
  frontmatter: ContentFrontmatter,
  options: {
    courseId?: string;
    contentType?: 'page' | 'assignment' | 'day' | 'article';
    fallbackTitle?: string;
    fallbackDescription?: string;
  } = {}
): SEOData {
  const { courseId, contentType = 'page', fallbackTitle, fallbackDescription } = options;
  
  return {
    title: frontmatter.seo_title || frontmatter.title || fallbackTitle || 'Learning Resources',
    description: frontmatter.seo_description || frontmatter.description || fallbackDescription || `${contentType === 'assignment' ? 'Assignment' : contentType === 'day' ? 'Course material' : 'Course page'} for ${courseId || 'Learning Resources'}`,
    keywords: frontmatter.seo_keywords,
    image: frontmatter.seo_image,
    author: frontmatter.seo_author,
    canonical: frontmatter.seo_canonical,
    type: frontmatter.seo_type,
    date: frontmatter.date,
    courseId,
    contentType
  };
}