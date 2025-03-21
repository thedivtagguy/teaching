import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { html as toReactNode } from 'satori-html';
import { readFileSync } from 'fs';
import { join } from 'path';

const width = 1200;
const height = 630;

// Font loading - using the local font file path
const fontPath = join(process.cwd(), 'src/lib/fonts/LibreCaslonCondensed-Bold.ttf');
let fontData = null;

try {
  fontData = readFileSync(fontPath);
} catch (error) {
  console.error('Error loading font file:', error);
  // Fallback to a system font or handle the error appropriately
}

/**
 * Generates HTML for a share card
 * @param {Object} options - Configuration options for the share card
 * @param {string} [options.title='Learning Resources by aman.bh'] - The card title
 * @param {string} [options.date] - The formatted date string
 * @param {string} [options.description=''] - Optional description text
 * @param {string} [options.courseId=''] - Optional course identifier
 * @param {string} [options.type='page'] - Content type: 'page', 'assignment', or 'day'
 * @returns {string} The generated HTML string
 */
function generateShareCardHTML(options) {
  const { 
    title = 'Learning Resources by aman.bh',
    date = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    description = '',
    courseId = '',
    type = 'page' // 'page', 'assignment', 'day'
  } = options;
  
  // Color theme based on content type
  const bgColor = type === 'assignment' ? '#4D80E6' : // blue
                 type === 'day' ? '#92DE86' : // green
                 '#F8FBF8'; // default light
  
  const textColor = (type === 'assignment' || type === 'day') ? 
                   '#FFFFFF' : '#2B2B2B'; // white or dark
  
  const accentColor = type === 'assignment' ? '#E8C85A' : // yellow
                     type === 'day' ? '#E8845A' : // orange
                     '#949B80'; // sage
  
  return `
    <div 
      style="
        width: 1200px;
        height: 630px;
        background-color: ${bgColor};
        color: ${textColor};
        font-family: 'LibreCaslonCondensed', serif;
        display: flex;
        flex-direction: column;
        padding: 60px;
        position: relative;
        overflow: hidden;
      "
    >
      <!-- Noise texture overlay -->
      <div 
        style="
          position: absolute; 
          inset: 0; 
          background: url('data:image/svg+xml,%3Csvg viewBox=%270 0 245 245%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27noiseFilter%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%278.51%27 numOctaves=%2710%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23noiseFilter)%27/%3E%3C/svg%3E');
          mix-blend-mode: overlay;
          opacity: 0.3;
          display: flex;
          width: 100%;
          height: 100%;
        "
      ></div>
      
      <!-- Content container -->
      <div style="display: flex; flex-direction: column; flex-grow: 1; z-index: 1;">
        <!-- Header area with course ID and accent element -->
        <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
          ${courseId ? `
            <div 
              style="
                font-size: 28px;
                font-weight: bold;
                letter-spacing: 1px;
                text-transform: uppercase;
                margin-bottom: 20px;
                color: ${accentColor};
                border-bottom: 3px solid ${accentColor};
                padding-bottom: 4px;
                display: flex;
              "
            >
              <span style="display: flex;">${courseId.toUpperCase()}</span>
            </div>
          ` : '<div style="display: flex;"></div>'}
        </div>

        <!-- Visual accent element for corner -->
        <div style="
          width: 120px;
          height: 120px;
          background-color: ${accentColor};
          opacity: 0.4;
          position: absolute;
          top: 0;
          right: 0;
          transform: translate(50%, -50%) rotate(45deg);
          display: flex;
        "></div>
        
        <!-- Content type indicator -->
        ${type !== 'page' ? `
          <div 
            style="
              font-size: 24px;
              font-weight: bold;
              text-transform: uppercase;
              display: flex;
              padding: 8px 16px;
              margin-bottom: 30px;
              background-color: #2B2B2B;
              color: #FFFFFF;
              border-radius: 1rem;
              letter-spacing: 0.5px;
              width: fit-content;
              box-shadow: 0 2px 0 0 rgba(43, 43, 43, 0.6);
            "
          >
            <span style="display: flex;">${type === 'assignment' ? 'Assignment' : 'Day'}</span>
          </div>
        ` : ''}
        
        <!-- Main title with highlight effect -->
        <div style="position: relative; z-index: 1; margin-top: auto; display: flex; flex-direction: column;">
          <h1 
            style="
              font-size: 80px;
              font-weight: bold;
              line-height: 1.1;
              margin-bottom: 32px;
              max-width: 90%;
              position: relative;
              display: flex;
              flex-direction: column;
            "
          >
            <span style="display: flex;">${title}</span>
            
            <!-- Decorative underline -->
            <div style="
              position: absolute;
              bottom: -15px;
              left: 0;
              width: 60%;
              height: 12px;
              background-color: ${accentColor};
              opacity: 0.6;
              transform: rotate(-0.5deg);
              display: flex;
            "></div>
          </h1>
          
          ${description ? `
            <p 
              style="
                font-size: 32px;
                line-height: 1.4;
                margin-bottom: auto;
                max-width: 80%;
                opacity: 0.9;
                display: flex;
                margin-top: 16px;
              "
            >
              <span style="display: flex;">${description}</span>
            </p>
          ` : ''}
        </div>
        
        <!-- Footer with date and branding -->
        <div 
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: auto;
            padding-top: 20px;
            border-top: 1px solid ${textColor === '#FFFFFF' ? 'rgba(255,255,255,0.2)' : 'rgba(43,43,43,0.2)'};
          "
        >
          <div style="font-size: 24px; display: flex;"><span style="display: flex;">${date}</span></div>
          <div style="
            font-weight: bold; 
            font-size: 28px; 
            display: flex;
            position: relative;
            padding: 6px 12px;
            border-radius: 6px;
            box-shadow: 0 2px 0 0 rgba(43, 43, 43, 0.6);
            background-color: ${accentColor};
            color: #2B2B2B;
          "><span style="display: flex;">teaching.aman.bh</span></div>
        </div>
      </div>
    </div>
  `;
}

/** @type {import('./$types').RequestHandler} */
export const GET = async ({ url }) => {
  try {
    // Get query parameters
    const title = url.searchParams.get('title') ?? 'Learning Resources by aman.bh';
    const date = url.searchParams.get('date') ?? new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    const description = url.searchParams.get('description') ?? '';
    const courseId = url.searchParams.get('courseId') ?? '';
    const type = url.searchParams.get('type') ?? 'page'; // page, assignment, day
    
    // Generate the HTML using our function
    const htmlContent = generateShareCardHTML({
      title,
      date,
      description,
      courseId,
      type
    });
    
    // Wrap the content in a flex wrapper to avoid Satori's "display: flex" requirement errors
    const wrappedHtml = `<div style="display: flex; width: 100%; height: 100%;">${htmlContent}</div>`;
    
    // Convert the HTML to a React node that satori can use
    const element = toReactNode(wrappedHtml);
    
    // Generate SVG using satori
    const svg = await satori(element, {
      width,
      height,
      fonts: fontData ? [
        {
          name: 'LibreCaslonCondensed',
          data: fontData,
          weight: 700,
          style: 'normal'
        }
      ] : []
    });
    
    // Convert SVG to PNG using resvg
    const resvg = new Resvg(svg, {
      fitTo: {
        mode: 'width',
        value: width
      }
    });
    
    // Render to PNG
    const image = resvg.render();
    const pngBuffer = image.asPng();
    
    // Return the PNG as the response
    return new Response(pngBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    });
  } catch (error) {
    console.error('Error generating OG image:', error);
    
    // Return a simple error response with type-safe error handling
    return new Response(`Error generating image: ${error instanceof Error ? error.message : 'Unknown error'}`, {
      status: 500
    });
  }
};