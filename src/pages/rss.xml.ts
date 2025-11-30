import rss from "@astrojs/rss";
import { experimental_AstroContainer } from "astro/container";
import mdxRenderer from "@astrojs/mdx/server.js";

import { getNotes } from "@/lib/notes";

const container = await experimental_AstroContainer.create();
container.addServerRenderer({ renderer: mdxRenderer, name: 'mdx' });

export async function GET({ site }) {
  const notes = await getNotes();
  return rss({
    title: "eightharsh",
    description: "Chasing ideas, not applause",
    site,
    items: await Promise.all(
      notes.map(async (note) => {
        const { Content } = await note.render();
        const htmlContent = await container.renderToString(Content);

        return {
          link: `notes/${note.slug}`,
          title: note.data.title,
          description: note.data.description,
          pubDate: note.data.pubDate,
          content: htmlContent
        };
      })
    ),
  });
}
