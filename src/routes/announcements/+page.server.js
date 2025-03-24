import { getAnnouncements } from '$lib/utils/announcements';

export async function load() {
  const announcements = await getAnnouncements();
  
  return {
    announcements
  };
} 