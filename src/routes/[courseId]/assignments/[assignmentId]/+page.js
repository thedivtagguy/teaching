/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
  const { courseId, assignmentId } = params;
  
  // Try loading with different extensions
  const extensions = ['.svx', '.md'];
  
  for (const ext of extensions) {
    try {
      // Dynamically import the assignment content
      const module = await import(`../../../../content/${courseId}/assignments/${assignmentId}${ext}`);
      
      return {
        assignment: module.default,
        meta: module.metadata || {}
      };
    } catch (error) {
      // Continue to next extension if this one fails
      continue;
    }
  }
  
  // If we get here, none of the extensions worked
  console.error(`Error loading assignment ${assignmentId}: No supported file found`);
  return {
    error: `Could not load assignment: ${assignmentId}`
  };
} 