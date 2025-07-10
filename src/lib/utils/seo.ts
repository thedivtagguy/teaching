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
  
  // Get SEO data from frontmatter.seo or fall back to main frontmatter fields
  const seoData = frontmatter.seo || {};
  
  return {
    title: seoData.title || frontmatter.title || fallbackTitle || 'Learning Resources',
    description: seoData.description || frontmatter.description || fallbackDescription || `${contentType === 'assignment' ? 'Assignment' : contentType === 'day' ? 'Course material' : 'Course page'} for ${courseId || 'Learning Resources'}`,
    keywords: seoData.keywords,
    image: seoData.image,
    author: seoData.author,
    canonical: seoData.canonical,
    type: seoData.type,
    date: frontmatter.date,
    courseId,
    contentType
  };
}