import { compile } from 'mdsvex';
import mdsvexConfig from '../../../mdsvex.config.js';
import grayMatter from 'gray-matter';

/**
 * Compile markdown content to HTML using mdsvex
 */
export async function compileMarkdownContent(content: string): Promise<{
  html: string;
  metadata: Record<string, any>;
}> {
  const { data, content: markdownContent } = grayMatter(content);
  
  try {
    const result = await compile(markdownContent, mdsvexConfig);
    
    if (result && result.code) {
      // Extract the HTML from the compiled result
      // The result is a Svelte component, but we need to process it further
      return {
        html: result.code,
        metadata: data
      };
    } else {
      throw new Error('Failed to compile markdown content');
    }
  } catch (error) {
    console.error('Error compiling markdown:', error);
    throw error;
  }
}