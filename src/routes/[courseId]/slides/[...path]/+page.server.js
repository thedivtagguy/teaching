/** @type {import('./$types').PageServerLoad} */
export const load = async ({ params }) => {
  // Extract the course ID and path from the params
  const { courseId, path } = params;
  
  // Special case for cdv2025 which is actually stored as cdv20205 in the static folder
  const folderName = courseId;
  
  // Construct the URL to the static slide content
  const slideUrl = `/slides/${folderName}/${path}/index.html`;
  
  return {
    courseId,
    slidePath: path,
    slideUrl
  };
}; 