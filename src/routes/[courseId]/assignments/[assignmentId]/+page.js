/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
  const { courseId, assignmentId } = params;
  
  try {
    // Dynamically import the assignment content
    const module = await import(`../../../../content/${courseId}/assignments/${assignmentId}.svx`);
    
    return {
      assignment: module.default,
      meta: module.metadata || {}
    };
  } catch (error) {
    console.error(`Error loading assignment ${assignmentId}:`, error);
    return {
      error: `Could not load assignment: ${assignmentId}`
    };
  }
} 