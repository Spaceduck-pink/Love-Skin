import { blogPosts } from "./blog-content";
import {
  concernContent,
  concernOrder,
  skinTypeContent,
  skinTypeOrder,
} from "./skin-profile-content";

export interface SearchItem {
  title: string;
  description: string;
  href: string;
}

const blogItems: SearchItem[] = blogPosts.map((post) => ({
  title: post.title,
  description: post.description,
  href: `/blog/${post.slug}`,
}));

const skinTypeItems: SearchItem[] = skinTypeOrder.map((slug) => {
  const content = skinTypeContent[slug];
  return {
    title: `${content.title} skin`,
    description: content.tagline,
    href: `/skin-profile/${slug}`,
  };
});

const concernItems: SearchItem[] = concernOrder.map((slug) => {
  const content = concernContent[slug];
  return {
    title: content.title,
    description: content.tagline,
    href: `/skin-profile/concerns/${slug}`,
  };
});

export const searchIndex: SearchItem[] = [
  {
    title: "Home",
    description: "Skincare, understood for you — start here.",
    href: "/",
  },
  {
    title: "Start the Quiz",
    description: "Answer 5 quick questions to get your personalized AM/PM routine.",
    href: "/quiz",
  },
  {
    title: "Skin Profile",
    description: "See how your quiz answers map to a skin profile.",
    href: "/skin-profile",
  },
  {
    title: "Products",
    description: "A guide to skincare product types — cleansers, toners, serums, and more.",
    href: "/products",
  },
  {
    title: "Blog",
    description: "Skincare guides on routine building, ingredients, and what to expect.",
    href: "/blog",
  },
  ...skinTypeItems,
  ...concernItems,
  ...blogItems,
  {
    title: "How it works",
    description: "Three steps to your personalized routine.",
    href: "/#how-it-works",
  },
  {
    title: "About LoveSkin",
    description: "Why LoveSkin is built simple, on purpose.",
    href: "/#about",
  },
  {
    title: "Newsletter",
    description: "Sign up for skincare tips and updates.",
    href: "#newsletter",
  },
];
