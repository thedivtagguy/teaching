import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { html as toReactNode } from 'satori-html';
import Card from '$lib/components/ShareCard.svelte';
import { render } from 'svelte/server';
const height = 800;
const width = 1200;

const fontFile = await fetch(
    'https://github.com/ertekinno/libre-caslon-condensed/raw/refs/heads/main/fonts/ttf/LibreCaslonCondensed-Bold.ttf'
);
const fontData = await fontFile.arrayBuffer();

/** @type {import('./$types').RequestHandler} */
export const GET = async ({ url }) => {
    const title = url.searchParams.get('title') ?? 'Data Visualization Course';
    const date = url.searchParams.get('date') ?? new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const description = url.searchParams.get('description') ?? '';
    const courseId = url.searchParams.get('courseId') ?? '';
    const type = url.searchParams.get('type') ?? 'page';

    const result = render(Card, { props: { title, date, description, courseId, type } });
    console.log('Rendered result:', result);

    // Include CSS as recommended by Geoff Rich's article
    const element = toReactNode(`${result.body}`);

    const svg = await satori(element, {
        fonts: [
            {
                name: 'Libre Caslon Condensed',
                data: fontData,
                style: 'normal'
            }
        ],
        height,
        width
    });

    const resvg = new Resvg(svg, {
        fitTo: {
            mode: 'width',
            value: width
        }
    });

    const image = resvg.render();
    return new Response(image.asPng(), {
        headers: {
            'content-type': 'image/png'
        }
    });
};