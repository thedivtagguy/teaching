import { json } from '@sveltejs/kit';
import { resetMetadataCache } from '$lib/utils/courseMetadata';

/**
 * Endpoint to reset content cache
 * This can be called manually to refresh content after edits
 */
export async function GET() {
  resetMetadataCache();
  
  return json({
    success: true,
    message: 'Content cache reset successfully',
    timestamp: new Date().toISOString()
  });
} 