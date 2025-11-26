import { defineCollection, z } from 'astro:content';
import { ObsidianDocumentSchema, ObsidianMdLoader } from "astro-loader-obsidian";

const blogCollection = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    upDate: z.coerce.date().optional(),
    image: image().optional(),
    draft: z.boolean().optional().default(false),
  }),
});

const notesCollection = defineCollection({
  loader: ObsidianMdLoader({
    base: 'src/content/notes',
    url: 'notes',
  }),
  schema: () => ObsidianDocumentSchema.extend({
    title: z.string(),
    description: z.string().default(""),
    tags: z.array(z.string()).default([]),
    pubDate: z.coerce.date(),
    upDate: z.coerce.date().optional(),
    image: z.string().default(""),
    draft: z.boolean().default(false),
    modified: z.coerce.date().optional(),
  }),
});

export const collections = {
  'blog': blogCollection,
  'notes': notesCollection,
};



