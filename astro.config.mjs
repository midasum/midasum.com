// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';
import remarkMath from 'remark-math';
import remarkMermaid from 'remark-mermaid';
import rehypeKatex from 'rehype-katex';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeMermaid from 'rehype-mermaid';

// https://astro.build/config
export default defineConfig({
  integrations: [
    mdx({
      syntaxHighlight: false,
      remarkPlugins: [remarkMath, remarkMermaid],
      rehypePlugins: [
        rehypeKatex,
        [rehypeMermaid, { strategy: 'img-svg', dark: true }],
        [
          rehypePrettyCode,
          {
            theme: 'github-dark',
            keepBackground: false,
          },
        ],
      ],
    }),
    tailwind(),
  ],
});
