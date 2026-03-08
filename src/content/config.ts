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
    assetsPattern: '**/*.{svg,png,jpg,jpeg,avif,webp,gif,tiff,ico}',
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

const artifactsCollection = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    description: z.string(),
    pubDate: z.coerce.date(),
    upDate: z.coerce.date().optional(),
    image: image().optional(),
    backgroundImages: z.array(image()).optional(),
    draft: z.boolean().optional().default(false),
  }),
});

export const collections = {
  'blog': blogCollection,
  'notes': notesCollection,
  'artifacts': artifactsCollection,
};



