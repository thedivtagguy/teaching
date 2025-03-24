import { dev } from '$app/environment';
import fs from 'fs';
import path from 'path';
import { marked } from 'marked';

const ANNOUNCEMENTS_DIR = 'src/content/announcements';

export async function getAnnouncements() {
  try {
    // Ensure the announcements directory exists
    if (!fs.existsSync(ANNOUNCEMENTS_DIR)) {
      fs.mkdirSync(ANNOUNCEMENTS_DIR, { recursive: true });
      return [];
    }

    // Read all markdown files from the announcements directory
    const files = fs.readdirSync(ANNOUNCEMENTS_DIR)
      .filter(file => file.endsWith('.md'))
      .map(file => {
        const content = fs.readFileSync(path.join(ANNOUNCEMENTS_DIR, file), 'utf-8');
        const lines = content.split('\n');
        const title = lines[0].replace('#', '').trim();
        const date = lines[1].replace('Date:', '').trim();
        const contentHtml = marked(lines.slice(2).join('\n'));

        return {
          title,
          date,
          content: contentHtml,
          slug: file.replace('.md', '')
        };
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date, newest first

    return files;
  } catch (error) {
    console.error('Error loading announcements:', error);
    return [];
  }
} 