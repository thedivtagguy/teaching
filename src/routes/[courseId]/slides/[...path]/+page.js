/** @type {import('./$types').PageLoad} */
export const load = async ({ params }) => {
  // Extract the course ID and path from the params
  const { courseId, path } = params;
  
  // Use the course ID as provided
  const folderName = courseId;
  
  // Construct the URL to the static slide content
  const slideUrl = `/slides/${folderName}/${path}/index.html`;
  
  return {
    courseId,
    slidePath: path,
    slideUrl
  };
}; 