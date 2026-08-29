import type { Faq } from "./skin-profile-content";

export interface ProductContent {
  howToUse: string;
  skinTypeNotes: string;
  mistakes: string[];
  faqs: Faq[];
}

// Cleansers, toners, moisturizers, oils, and SPF are formulated differently
// per skin type (see skinTypeProfiles / spfStep in generate-routine.ts).
// Serums and eye creams are chosen by concern instead (see concernProfiles).
export const skinTypeDrivenProducts = [
  "cleansers",
  "oil-cleansers",
  "toners",
  "moisturizers",
  "facial-oils",
  "spf",
];

export const concernDrivenProducts = [
  "essences",
  "serums-treatments",
  "spot-treatments",
  "eye-creams",
];

export const productTitles: Record<string, string> = {
  cleansers: "Cleansers",
  "oil-cleansers": "Oil cleansers",
  toners: "Toners",
  essences: "Essences",
  "serums-treatments": "Serums & treatments",
  "spot-treatments": "Spot treatments",
  "eye-creams": "Eye creams",
  moisturizers: "Moisturizers",
  "facial-oils": "Facial oils",
  spf: "SPF",
};

export const productImageAlt: Record<string, string> = {
  cleansers: "A cleanser bottle styled with laboratory glassware on a pink background.",
  "oil-cleansers": "Two glass bottles of cleansing oil on a clean white surface.",
  toners: "A toner bottle resting on cotton pads with aloe vera leaves.",
  essences: "A toner bottle resting on cotton pads with aloe vera leaves.",
  "serums-treatments": "A serum bottle with dropper casting a soft shadow.",
  "spot-treatments": "A serum bottle with dropper casting a soft shadow.",
  "eye-creams": "An eye cream jar styled with pearls and leaves.",
  moisturizers: "Hands applying moisturizer from a pink jar.",
  "facial-oils": "An amber glass dropper bottle of facial oil on soft fabric.",
  spf: "A sunscreen bottle styled with laboratory glassware on a yellow background.",
};

export const productContent: Record<string, ProductContent> = {
  cleansers: {
    howToUse:
      "Use morning and night, massaging into damp skin for 30–60 seconds before rinsing with lukewarm water.",
    skinTypeNotes:
      "Oily and combination skin do well with gel or foaming formulas. Dry and sensitive skin do better with cream or milk cleansers that don't strip.",
    mistakes: [
      "Over-washing more than twice a day",
      "Using hot water, which strips natural oils",
      "Choosing a formula that leaves skin feeling tight or \"squeaky clean\"",
    ],
    faqs: [
      {
        q: "Do I need a different cleanser for morning and night?",
        a: "Not necessarily — the same gentle cleanser can work for both, though some people prefer a lighter rinse in the morning.",
      },
      {
        q: "Should I double cleanse every night?",
        a: "Only if you're wearing sunscreen or makeup — otherwise a single cleanse is enough.",
      },
    ],
  },
  "oil-cleansers": {
    howToUse:
      "Use in the evening only, before your regular cleanser. Massage onto dry skin to dissolve sunscreen and makeup, then emulsify with water and rinse.",
    skinTypeNotes:
      "All skin types benefit when wearing SPF or makeup — even oily skin, since oil dissolves oil more effectively than a water-based cleanser alone.",
    mistakes: [
      "Skipping it on sunscreen days — a regular cleanser alone often can't fully remove SPF",
      "Using it in the morning, when it's not needed",
    ],
    faqs: [
      {
        q: "Will an oil cleanser make oily skin worse?",
        a: "No — oil dissolves oil, and it's rinsed away afterward, so it doesn't leave residue behind.",
      },
      {
        q: "Is this a step everyone needs?",
        a: "Only if you wear sunscreen, makeup, or heavy products during the day. Otherwise your regular cleanser is enough.",
      },
    ],
  },
  toners: {
    howToUse:
      "Apply after cleansing, morning and night, patted or swept onto skin before serums and treatments.",
    skinTypeNotes:
      "Oily and combination skin benefit from balancing, alcohol-free toners. Dry and sensitive skin should look for hydrating, essence-like formulas.",
    mistakes: [
      "Using alcohol-based toners that strip the skin barrier",
      "Treating toner as optional rather than a prep step for the treatments that follow",
    ],
    faqs: [
      {
        q: "Is toner actually necessary?",
        a: "Not essential, but it helps treatments absorb better and removes any residue left after cleansing.",
      },
      {
        q: "Can toner replace moisturizer?",
        a: "No — toner preps skin, but it doesn't lock in hydration the way a moisturizer does.",
      },
    ],
  },
  essences: {
    howToUse:
      "Apply after toner and before serums, patting a few drops into skin morning and/or night — it absorbs quickly and doesn't need to be rubbed in.",
    skinTypeNotes:
      "Most worth adding for dullness, where a hydrating essence boosts glow, or aging, where a firming essence supports elasticity. It's optional for other concerns — skip it if your routine already feels complete after toner.",
    mistakes: [
      "Treating it as a required step for every routine",
      "Applying too much — a few drops is enough, unlike a moisturizer",
      "Using it in place of a toner instead of layering it after one",
    ],
    faqs: [
      {
        q: "Is an essence the same as a toner?",
        a: "No — toner preps skin and removes residue, while an essence adds an extra layer of hydration or active ingredients on top.",
      },
      {
        q: "Do I need an essence in my routine?",
        a: "It's optional. It's most worth adding if you want extra hydration or a boost tailored to a concern like dullness or aging.",
      },
    ],
  },
  "serums-treatments": {
    howToUse:
      "Apply after toner and before moisturizer. Antioxidant serums like vitamin C work best in the morning; actives like retinol or AHA/BHA belong in the evening, usually starting 2–3 nights a week.",
    skinTypeNotes:
      "Which serum matters most depends on your main concern — niacinamide for acne, vitamin C for dullness or dark spots, retinol for aging, azelaic acid for redness.",
    mistakes: [
      "Introducing multiple new actives at once",
      "Layering incompatible actives, like retinol and AHA, on the same night",
      "Expecting results before 6–8 weeks of consistent use",
    ],
    faqs: [
      {
        q: "Can I use more than one serum?",
        a: "Yes, but layer thinnest to thickest, and avoid combining strong actives on the same night.",
      },
      {
        q: "How fast do serums work?",
        a: "Most active ingredients take 4–8 weeks of consistent use before showing visible results.",
      },
    ],
  },
  "spot-treatments": {
    howToUse:
      "Apply a small amount directly onto the area of concern after your serum or treatment step, letting it absorb before moisturizer.",
    skinTypeNotes:
      "Most useful for acne, where a benzoyl peroxide or sulfur spot treatment targets active breakouts, and for dark spots, where a concentrated brightening gel speeds up fading. Not needed if you don't have an isolated problem area.",
    mistakes: [
      "Applying it all over the face instead of just the affected spot",
      "Layering it with other strong actives on the same area, which can cause irritation",
      "Expecting overnight results — most spot treatments need consistent use over days to weeks",
    ],
    faqs: [
      {
        q: "Can I use a spot treatment every day?",
        a: "Yes, but only on the specific area — daily all-over use of strong actives can irritate skin.",
      },
      {
        q: "Do I still need my regular serum if I use a spot treatment?",
        a: "Yes — a spot treatment targets one area; your regular serum or treatment still addresses your whole face.",
      },
    ],
  },
  "eye-creams": {
    howToUse:
      "Apply morning and/or night with your ring finger, gently patting a small amount around the orbital bone — never dragging or rubbing.",
    skinTypeNotes:
      "The delicate eye area needs a lighter formula than the rest of your face — oil-free for acne-prone skin, richer for dryness, fragrance-free for sensitive skin.",
    mistakes: [
      "Applying too close to the lash line, which can cause irritation or milia",
      "Rubbing instead of patting the product in",
      "Using the same rich moisturizer meant for the rest of your face",
    ],
    faqs: [
      {
        q: "Is eye cream necessary?",
        a: "Optional but helpful — the skin around the eyes is thinner and tends to show dehydration and fine lines first.",
      },
      {
        q: "Can I just use my regular moisturizer instead?",
        a: "You can, but a dedicated eye cream is formulated specifically for the area's sensitivity.",
      },
    ],
  },
  moisturizers: {
    howToUse:
      "Apply as the last hydrating step morning and night, after serums and treatments, while skin is still slightly damp to help lock in the products underneath.",
    skinTypeNotes:
      "Oily and combination skin do best with lightweight gels or lotions. Dry and sensitive skin need richer creams with ceramides.",
    mistakes: [
      "Skipping moisturizer on oily skin, which triggers more oil production",
      "Using a rich cream that's too heavy for your skin type",
      "Applying to fully dry skin instead of slightly damp skin",
    ],
    faqs: [
      {
        q: "Do I need a different moisturizer for morning and night?",
        a: "Not required, though some people prefer a lighter formula under SPF in the morning and a richer one at night.",
      },
      {
        q: "Can oily skin skip moisturizer?",
        a: "No — skipping it usually backfires and increases oil production as skin tries to compensate.",
      },
    ],
  },
  "facial-oils": {
    howToUse:
      "Apply as the very last step at night, after moisturizer, pressing a few drops into skin to seal everything in.",
    skinTypeNotes:
      "A light layer works even for oily skin, like squalane. Dry and sensitive skin can use a slightly heavier nourishing oil.",
    mistakes: [
      "Applying oil before moisturizer instead of after — oil should seal, not hydrate",
      "Using too much — a few drops is enough",
      "Treating it as a required step when it's actually optional",
    ],
    faqs: [
      {
        q: "Is facial oil essential?",
        a: "No — it's an optional finishing layer, most useful for dry or very dehydrated skin.",
      },
      {
        q: "Will facial oil cause breakouts?",
        a: "A lightweight, non-comedogenic oil like squalane is safe for most skin types, including acne-prone skin.",
      },
    ],
  },
  spf: {
    howToUse:
      "Apply as the final morning step, every day regardless of weather or indoor plans, and reapply every 2 hours with prolonged sun exposure.",
    skinTypeNotes:
      "Oily and combination skin do best with mattifying, oil-free formulas. Sensitive skin should look for mineral SPF with zinc oxide to reduce irritation.",
    mistakes: [
      "Skipping SPF on cloudy or indoor days — UV still reaches skin through windows and clouds",
      "Applying too little product — most people apply about half the amount needed for full protection",
      "Skipping reapplication during extended sun exposure",
    ],
    faqs: [
      {
        q: "Do I need SPF if I'm indoors all day?",
        a: "Yes — UVA rays penetrate windows and contribute to skin aging over time even without direct sun exposure.",
      },
      {
        q: "Does makeup with SPF count?",
        a: "Usually not enough on its own — most people don't apply enough to reach the protection level listed on the label.",
      },
    ],
  },
};
