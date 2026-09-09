import type { Concern, SkinType } from "./types";

export interface BlogFaq {
  q: string;
  a: string;
}

export interface BlogSection {
  heading: string;
  body: string;
  list?: string[];
}

export interface RelatedProductLink {
  slug: string;
  label: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  category: string;
  description: string;
  tagline: string;
  publishedAt: string;
  updatedAt?: string;
  intro: string;
  sections: BlogSection[];
  faqs: BlogFaq[];
  relatedProducts?: RelatedProductLink[];
  relatedSkinTypes?: SkinType[];
  relatedConcerns?: Concern[];
}

// Ordered newest-first — this order drives both the /blog listing and the
// "More from the blog" links on post pages.
export const blogPosts: BlogPost[] = [
  {
    slug: "how-to-build-a-skincare-routine",
    title: "How to Build a Skincare Routine From Scratch",
    category: "Routine Basics",
    description:
      "A step-by-step guide to building a skincare routine from scratch — what's essential, what order to apply products in, and what you can skip when you're starting out.",
    tagline:
      "You don't need ten products. You need the right four or five, in the right order.",
    publishedAt: "2026-01-12",
    intro:
      "Most people overcomplicate their first routine — or give up because they don't know where to start. A real skincare routine only needs a handful of steps done consistently: cleanse, treat, moisturize, and protect. Everything else is optional, and what's actually right for you depends on your skin type and main concern.",
    sections: [
      {
        heading: "Start with the non-negotiables",
        body: "Before adding anything else, get these four steps right. They apply to almost every skin type and form the base you build everything else on top of.",
        list: [
          "A cleanser suited to your skin type, used morning and night",
          "A moisturizer that matches how much oil your skin naturally produces",
          "SPF every morning, rain or shine — the single most effective anti-aging step",
          "One targeted treatment for your main concern, introduced slowly",
        ],
      },
      {
        heading: "Add products one at a time",
        body: "New routine, new products, all at once is how skin gets irritated and you never find out what actually worked. Introduce one new product every one to two weeks and watch how your skin responds before adding the next.",
      },
      {
        heading: "Apply in the right order",
        body: "As a rule, go thinnest to thickest texture: cleanser, then any toner or essence, then serums and treatments, then moisturizer, then SPF in the morning or a facial oil at night to seal everything in. Applying a heavy cream before a lightweight serum stops the serum from absorbing properly.",
      },
      {
        heading: "Match it to your skin, not a trend",
        body: "A ten-step routine built for dry skin can make oily skin worse, and a stripped-back oily-skin routine can leave dry skin flaking. Your skin type and main concern should decide what's in your routine — not what's trending.",
      },
    ],
    faqs: [
      {
        q: "How many products should a beginner routine have?",
        a: "Four is enough to start: cleanser, moisturizer, SPF, and one treatment for your main concern. You can build up from there once you know how your skin responds.",
      },
      {
        q: "Do I need different products for morning and night?",
        a: "Not always. SPF is AM-only and stronger treatments like retinoids are usually PM-only, but your cleanser and moisturizer can often stay the same both times.",
      },
      {
        q: "How long before a new routine actually works?",
        a: "Most people notice initial changes in two to four weeks, with the full effect of a new routine visible around eight to twelve weeks — skin cell turnover just takes time.",
      },
    ],
    relatedProducts: [
      { slug: "cleansers", label: "Cleansers" },
      { slug: "moisturizers", label: "Moisturizers" },
      { slug: "spf", label: "SPF" },
      { slug: "serums-treatments", label: "Serums & treatments" },
    ],
  },
  {
    slug: "am-vs-pm-skincare-routine",
    title: "AM vs PM Skincare Routine: What's the Difference and Why Order Matters",
    category: "Routine Basics",
    description:
      "Why your morning and evening skincare routines shouldn't be identical, what belongs in each one, and why product order changes how well everything works.",
    tagline: "Your skin has different jobs to do in daylight than it does overnight.",
    publishedAt: "2026-02-03",
    intro:
      "During the day, skin is in defense mode — fending off UV, pollution, and moisture loss. Overnight, it shifts into repair mode, which is when it's most receptive to active ingredients. That's why a well-built routine treats AM and PM differently instead of repeating the same steps twice.",
    sections: [
      {
        heading: "Morning: protect first, treat lightly",
        body: "Your AM routine should prioritize defense. Keep actives light — think antioxidants like vitamin C — and always finish with SPF, which is the one step that shouldn't be skipped even on cloudy days.",
        list: [
          "Cleanser (or just a rinse if skin isn't oily overnight)",
          "A lightweight antioxidant serum, if you use one",
          "Moisturizer suited to your skin type",
          "SPF — always the last step",
        ],
      },
      {
        heading: "Evening: cleanse thoroughly, treat properly",
        body: "Night is when you remove the day's buildup and let stronger treatments do their work without SPF or makeup interfering. This is when ingredients like retinoids, AHAs/BHAs, or richer facial oils are best used.",
        list: [
          "Double cleanse if you wore SPF or makeup",
          "Your main treatment step — this is where actives for your concern go",
          "A richer moisturizer or facial oil to support overnight repair",
        ],
      },
      {
        heading: "Why the order still matters both times",
        body: "Regardless of AM or PM, apply from thinnest to thickest texture so each layer can actually absorb: cleanser, treatments, moisturizer, then SPF (AM) or facial oil (PM) to seal it in. Reversing the order — say, oil before serum — blocks the serum from reaching skin at all.",
      },
    ],
    faqs: [
      {
        q: "Can I use the same moisturizer morning and night?",
        a: "Yes, if it suits your skin type. Many people use one moisturizer both times and simply add SPF on top in the morning.",
      },
      {
        q: "Do I need a separate night cream?",
        a: "Not necessarily — a good moisturizer or facial oil can work for both. A dedicated night cream helps most for dry or mature skin that needs extra richness overnight.",
      },
      {
        q: "Is it bad to skip cleansing in the morning?",
        a: "For dry or normal skin, a water-only rinse is often enough in the morning. Oily and combination skin usually still benefit from a gentle morning cleanse.",
      },
    ],
    relatedProducts: [
      { slug: "spf", label: "SPF" },
      { slug: "facial-oils", label: "Facial oils" },
      { slug: "serums-treatments", label: "Serums & treatments" },
    ],
  },
  {
    slug: "how-long-to-see-skincare-results",
    title: "How Long Does It Take to See Results From a New Skincare Routine?",
    category: "Expectations",
    description:
      "A realistic timeline for when to expect results from a new skincare routine, by concern — plus why switching too early is the most common reason routines seem to fail.",
    tagline: "Skin runs on its own clock — usually slower than the ads suggest.",
    publishedAt: "2026-02-24",
    intro:
      "The most common reason a skincare routine gets abandoned isn't that it doesn't work — it's that it gets replaced before it had time to. Skin cell turnover takes weeks, not days, so results from a genuinely well-matched routine build gradually rather than overnight.",
    sections: [
      {
        heading: "A general timeline",
        body: "Most people notice their skin feeling and looking different within two to four weeks — less tightness, less shine, more even texture. Visible change in specific concerns takes longer, and full results from any given routine usually take eight to twelve weeks to show.",
      },
      {
        heading: "Timelines by concern",
        body: "Different concerns respond on different schedules, since they're driven by different processes in the skin.",
        list: [
          "Acne: 4–8 weeks for a noticeable reduction in new breakouts",
          "Dullness: 2–4 weeks, often the fastest to visibly improve",
          "Dark spots: 8–12+ weeks, since pigment fades gradually",
          "Fine lines and aging: 12+ weeks for measurable change",
          "Redness and sensitivity: 2–6 weeks once the barrier stabilizes",
        ],
      },
      {
        heading: "Why switching too soon backfires",
        body: "Changing products every week or two doesn't just delay results — it also makes it harder to tell what's actually causing irritation if something goes wrong. Give a new routine a full cycle before judging it, and only change one variable at a time.",
      },
      {
        heading: "When it's worth reconsidering sooner",
        body: "The exception is irritation: stinging, redness, or breakouts that appear within days usually mean a product doesn't suit your skin, not that it needs more time. In that case, stop the product rather than waiting it out.",
      },
    ],
    faqs: [
      {
        q: "Why does my skin look worse before it gets better?",
        a: "Some actives, particularly retinoids and exfoliating acids, cause an initial adjustment period often called 'purging' as skin turnover speeds up. This typically settles within two to four weeks.",
      },
      {
        q: "Should I change my routine with the seasons?",
        a: "Often, yes — skin tends to need lighter formulas in summer and richer ones in winter. It's still worth giving each version several weeks before judging it.",
      },
      {
        q: "How do I know if a product isn't working versus needing more time?",
        a: "If skin is calm but unchanged, give it more time. If you see new irritation, redness, or breakouts that weren't there before, that's a sign to stop rather than wait.",
      },
    ],
    relatedConcerns: ["acne", "dullness", "dark-spots", "aging"],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}
