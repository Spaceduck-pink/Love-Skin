import type { Concern, SkinType } from "./types";

export interface Faq {
  q: string;
  a: string;
}

export interface SkinTypeContent {
  slug: SkinType;
  title: string;
  tagline: string;
  summary: string;
  signs: string[];
  causes: string;
  lookFor: string[];
  avoid: string[];
  mistakes: string[];
  faqs: Faq[];
}

export interface ConcernContent {
  slug: Concern;
  title: string;
  tagline: string;
  causes: string;
  whatHelps: { title: string; description: string }[];
  mistakes: string[];
  tip: string;
  faqs: Faq[];
}

export const skinTypeOrder: SkinType[] = ["oily", "dry", "combination", "normal", "sensitive"];

export const skinTypeImageAlt: Record<SkinType, string> = {
  oily: "A pink-toned gel cleanser bottle, the kind of lightweight formula recommended for oily skin.",
  dry: "Hands applying a rich moisturizing cream, the kind of hydration dry skin needs.",
  combination: "A woman smiling while cleansing her face with a cotton pad in the morning.",
  normal: "A woman with a radiant, healthy complexion applying skincare.",
  sensitive: "A gentle skincare moment set against a soft pink background.",
};

export const concernImageAlt: Record<Concern, string> = {
  acne: "A smiling woman holding a skincare product formulated for acne-prone skin.",
  dullness: "A serum bottle with dropper resting on a pink surface, used to brighten dull skin.",
  aging: "Anti-wrinkle cream jars on a pink background, used to support skin firmness.",
  "dark-spots": "A woman applying a brightening serum with a dropper to target dark spots.",
  redness: "A calm, natural portrait reflecting soothed, redness-free skin.",
};

export const skinTypeContent: Record<SkinType, SkinTypeContent> = {
  oily: {
    slug: "oily",
    title: "Oily",
    tagline: "Shiny most of the day and prone to enlarged pores.",
    summary:
      "Oily skin produces more sebum than it needs, which is why it looks shiny by midday and tends toward larger, more visible pores. The routine leans on lightweight, oil-free formulas that clear excess oil without stripping skin — stripping it only tells your skin to make more.",
    signs: [
      "Skin looks shiny by midday, especially through the T-zone",
      "Pores appear larger, especially on the nose and cheeks",
      "Makeup or SPF tends to slide off faster than expected",
      "Breakouts and blackheads show up more often than for other skin types",
    ],
    causes:
      "Oily skin comes down to overactive sebaceous glands — often genetic, but also influenced by hormones, humidity, and over-stripping the skin, which can trigger even more oil production as skin tries to compensate.",
    lookFor: [
      "Gel or foaming cleansers",
      "Oil-free, lightweight gel moisturizers",
      "Niacinamide to help regulate oil production",
      "Salicylic acid (BHA) to keep pores clear",
      "Mattifying, oil-free SPF",
    ],
    avoid: [
      "Heavy, occlusive creams and butters",
      "Alcohol-based toners that over-strip skin",
      "Skipping moisturizer to avoid shine",
    ],
    mistakes: [
      "Skipping moisturizer to avoid shine — this makes skin overcompensate with more oil",
      "Over-washing or scrubbing, which strips the barrier and triggers more oil production",
      "Using heavy, occlusive creams meant for dry skin",
    ],
    faqs: [
      {
        q: "Does oily skin still need moisturizer?",
        a: "Yes — skipping it triggers your skin to produce even more oil to compensate. Reach for an oil-free, lightweight gel formula instead of skipping the step.",
      },
      {
        q: "Can oily skin use facial oil?",
        a: "In small amounts, yes. A featherweight oil like squalane can round out a routine without adding grease, but it's optional, not essential.",
      },
      {
        q: "How often should I exfoliate oily skin?",
        a: "2–3 times a week with a BHA like salicylic acid is usually enough — daily exfoliation risks irritation and rebound oil.",
      },
    ],
  },
  dry: {
    slug: "dry",
    title: "Dry",
    tagline: "Feels tight, flaky, or rough.",
    summary:
      "Dry skin doesn't produce enough natural oil to stay comfortable on its own, which is why it can feel tight right after cleansing or show visible flaking. The routine focuses on rich, barrier-supporting hydration layered on to ease tightness and lock in moisture.",
    signs: [
      "Skin feels tight, especially right after cleansing",
      "Visible flaking or rough patches, particularly around the nose and cheeks",
      "Fine lines look more noticeable when skin is dehydrated",
      "Makeup can look patchy or cling to dry areas",
    ],
    causes:
      "Dry skin produces less natural oil than other types — sometimes genetic or age-related, and often worsened by cold weather, hot showers, and harsh cleansers that strip the skin barrier.",
    lookFor: [
      "Cream or milk cleansers that don't foam",
      "Hyaluronic acid for hydration",
      "Ceramides to support the skin barrier",
      "Rich cream moisturizers",
      "A nourishing facial oil to seal everything in",
    ],
    avoid: [
      "Foaming or sulfate-based cleansers",
      "Hot water, which strips natural oils further",
      "Alcohol-based toners",
    ],
    mistakes: [
      "Washing with hot water, which strips natural oils further",
      "Using a foaming cleanser that leaves skin feeling \"squeaky clean\" — a sign it's over-stripped",
      "Applying moisturizer to fully dry skin instead of slightly damp skin, which locks in less hydration",
    ],
    faqs: [
      {
        q: "Does dry skin need to exfoliate?",
        a: "Yes, but gently and less often — a mild exfoliant once or twice a week helps product absorb better, while daily exfoliation will worsen dryness.",
      },
      {
        q: "Is facial oil necessary for dry skin?",
        a: "It's optional but genuinely helpful — a nourishing oil applied after moisturizer seals in hydration and softens rough or flaky patches overnight.",
      },
      {
        q: "Does dry skin still need SPF?",
        a: "Yes — dry skin is not protected from UV damage, and daily SPF matters just as much regardless of skin type.",
      },
    ],
  },
  combination: {
    slug: "combination",
    title: "Combination",
    tagline: "An oily T-zone with drier cheeks.",
    summary:
      "Combination skin behaves differently across the face — an oilier T-zone (forehead, nose, chin) alongside cheeks that are normal or dry. The routine balances oil control with hydration, often by adjusting how much product goes where rather than picking one extreme.",
    signs: [
      "Shine concentrated in the T-zone by midday",
      "Cheeks that feel normal or dry in comparison",
      "Pores that look larger down the center of the face",
      "Products that work well on the T-zone can feel too heavy on the cheeks",
    ],
    causes:
      "Sebaceous glands are denser across the forehead, nose, and chin than on the cheeks, so oil production naturally varies across the face rather than staying even.",
    lookFor: [
      "Balancing, gel-based moisturizers",
      "A gentle gel cleanser that doesn't over-dry the cheeks",
      "Niacinamide to even out oil across zones",
    ],
    avoid: [
      "Applying one heavy product uniformly across the whole face",
      "Building a routine entirely around either the oily or dry parts",
    ],
    mistakes: [
      "Using the same amount of product across the whole face instead of adjusting by zone",
      "Picking a routine built entirely around either the oily T-zone or the drier cheeks",
      "Over-treating the T-zone with actives strong enough to irritate the cheeks",
    ],
    faqs: [
      {
        q: "Should I use two different moisturizers for combination skin?",
        a: "Some people do — a lighter gel on the T-zone and a richer cream on the cheeks — but a single balancing lotion works well for most combination skin.",
      },
      {
        q: "Can I use a facial oil with combination skin?",
        a: "Yes, applied only to the drier cheek areas, not the T-zone, works well as a light finishing layer.",
      },
      {
        q: "Is combination skin the same as oily skin?",
        a: "No — combination skin has a genuinely drier zone (usually the cheeks) that oily skin routines would over-dry, so the balance matters more than oil control alone.",
      },
    ],
  },
  normal: {
    slug: "normal",
    title: "Normal",
    tagline: "Fairly balanced and rarely irritated.",
    summary:
      "Normal skin has a well-functioning barrier and balanced oil production, so it rarely feels shiny, tight, or reactive. The routine keeps things simple and consistent — maintenance rather than correction.",
    signs: [
      "Rarely shiny or tight through the day",
      "Few breakouts and minimal sensitivity",
      "Pores are barely noticeable",
      "Skin tolerates most new products without reacting",
    ],
    causes:
      "Naturally well-functioning oil glands and a strong skin barrier keep sebum production and moisture levels balanced without much outside help.",
    lookFor: [
      "A gentle, pH-balanced everyday cleanser",
      "A lightweight moisturizer that adjusts with the seasons",
      "Daily SPF, even though skin looks fine without it",
    ],
    avoid: [
      "Overcomplicating the routine with unnecessary actives",
      "Skipping SPF just because skin behaves well",
    ],
    mistakes: [
      "Assuming \"normal\" means no maintenance is needed and skipping SPF",
      "Using richer or stronger products than necessary \"just in case\"",
      "Not adjusting the routine at all when seasons or environment change",
    ],
    faqs: [
      {
        q: "Does normal skin still need a full routine?",
        a: "A simple one, yes — cleanser, moisturizer, and daily SPF cover the basics well, even without visible skin concerns.",
      },
      {
        q: "Can normal skin become oily or dry over time?",
        a: "Yes — skin type can shift with age, hormones, climate, and season, so it's worth reassessing occasionally rather than assuming it never changes.",
      },
      {
        q: "Should normal skin use active ingredients like retinol or vitamin C?",
        a: "Only if targeting a specific concern — otherwise a simple routine is enough, and adding actives without a reason just raises irritation risk.",
      },
    ],
  },
  sensitive: {
    slug: "sensitive",
    title: "Sensitive",
    tagline: "Reacts easily, with redness or stinging.",
    summary:
      "Sensitive skin reacts more easily than other types — to new products, fragrance, weather changes, or certain active ingredients. The routine prioritizes fragrance-free, barrier-supporting products and introduces anything new slowly.",
    signs: [
      "Stinging or burning with new products",
      "Visible redness or flushing",
      "Reacts to fragrance or certain active ingredients",
      "Skin feels reactive to weather or temperature changes",
    ],
    causes:
      "A compromised or naturally thinner skin barrier lets irritants penetrate more easily. This can be linked to conditions like rosacea or eczema, or simply a genetic tendency toward barrier sensitivity.",
    lookFor: [
      "Fragrance-free formulas",
      "Ceramides to reinforce the skin barrier",
      "Centella asiatica or other calming ingredients",
      "Azelaic acid as a gentler active option",
      "Mineral SPF (zinc oxide) over chemical sunscreens",
    ],
    avoid: [
      "Fragranced products",
      "Alcohol-based toners",
      "Layering multiple active ingredients at once",
      "Physical scrubs",
    ],
    mistakes: [
      "Introducing too many new products at once, which makes it hard to identify a trigger",
      "Skipping patch testing before trying a new product",
      "Using harsh physical exfoliants instead of gentler chemical options",
    ],
    faqs: [
      {
        q: "How should I patch test a new product?",
        a: "Apply a small amount to your inner arm or jawline and wait 48 hours before using it on your full face.",
      },
      {
        q: "Can sensitive skin use active ingredients like retinol?",
        a: "Sometimes, but gently — starting with a low strength once or twice a week and building up slowly, or choosing gentler alternatives like azelaic acid.",
      },
      {
        q: "Why does my skin sting even with \"gentle\" products?",
        a: "Fragrance is a common hidden trigger even in products marketed as gentle — check the ingredient list for \"fragrance\" or \"parfum\" specifically.",
      },
    ],
  },
};

export const concernOrder: Concern[] = ["acne", "dullness", "aging", "dark-spots", "redness"];

export const concernContent: Record<Concern, ConcernContent> = {
  acne: {
    slug: "acne",
    title: "Acne & breakouts",
    tagline: "Treatments focus on regulating oil and clearing pores, without over-drying skin.",
    causes:
      "Breakouts form when pores get clogged with excess oil, dead skin cells, and bacteria — often worsened by hormonal shifts, touching your face, or comedogenic products.",
    whatHelps: [
      {
        title: "Niacinamide (morning)",
        description: "Helps regulate oil production and calm redness from breakouts through the day.",
      },
      {
        title: "Salicylic acid / BHA (evening, 2–3x a week)",
        description: "Clears pores and reduces breakouts — alternate with rest nights to avoid irritation.",
      },
      {
        title: "Spot treatment",
        description: "A targeted benzoyl peroxide or sulfur treatment applied directly to active breakouts.",
      },
    ],
    mistakes: [
      "Picking at breakouts, which delays healing and raises scarring risk",
      "Over-exfoliating, which irritates skin and can worsen breakouts",
      "Skipping moisturizer, which can trigger even more oil production",
    ],
    tip: "Avoid picking at breakouts, and change pillowcases weekly to cut down on bacteria transfer.",
    faqs: [
      {
        q: "How long until acne treatments start working?",
        a: "Usually 4–8 weeks of consistent use before you see a real difference — most people stop too early.",
      },
      {
        q: "Can I use salicylic acid and retinol together?",
        a: "Not on the same night without easing in — combining strong actives raises the risk of irritation. Alternate nights instead.",
      },
      {
        q: "Does diet affect acne?",
        a: "It can be a factor for some people, particularly high-sugar or high-dairy diets, but a consistent topical routine matters most.",
      },
    ],
  },
  dullness: {
    slug: "dullness",
    title: "Dullness & uneven texture",
    tagline: "Treatments brighten tone and gently resurface skin to smooth texture over time.",
    causes:
      "Dullness usually comes from a buildup of dead skin cells on the surface, plus environmental damage from UV and pollution that leaves skin looking tired and uneven.",
    whatHelps: [
      {
        title: "Vitamin C serum (morning)",
        description: "Brightens skin tone and helps protect against environmental dullness during the day.",
      },
      {
        title: "AHA exfoliating treatment (evening, 2x a week)",
        description: "Gently resurfaces skin and smooths texture over time.",
      },
      {
        title: "Hydrating essence",
        description: "A watery layer that boosts glow and preps skin before your serum.",
      },
    ],
    mistakes: [
      "Exfoliating without daily SPF — new skin is more sun-sensitive",
      "Relying on physical scrubs instead of chemical exfoliants",
      "Expecting overnight results from brightening ingredients",
    ],
    tip: "Exfoliation works best paired with daily SPF — new skin is more sensitive to sun exposure.",
    faqs: [
      {
        q: "How often should I exfoliate for dullness?",
        a: "2 nights a week with an AHA is a good starting point — more isn't better, and over-exfoliating causes irritation that makes skin look worse.",
      },
      {
        q: "Is vitamin C worth using daily?",
        a: "Yes — used consistently every morning under SPF, it both brightens over time and adds antioxidant protection.",
      },
      {
        q: "Can dry skin have dullness too?",
        a: "Yes — dullness is about surface buildup and light reflection, not skin type, so any skin type can experience it.",
      },
    ],
  },
  aging: {
    slug: "aging",
    title: "Fine lines & aging",
    tagline: "Treatments support cell turnover and firmness, paired with antioxidant protection.",
    causes:
      "Collagen and elastin production naturally slow with age, and cumulative UV exposure accelerates the loss of firmness and the appearance of fine lines.",
    whatHelps: [
      {
        title: "Vitamin C + peptide serum (morning)",
        description: "Antioxidant protection alongside peptides that support skin's firmness over time.",
      },
      {
        title: "Retinol (evening, start 2x a week)",
        description: "Build up slowly to support cell turnover and firmness.",
      },
      {
        title: "Firming essence",
        description: "An extra hydrating layer that supports skin elasticity overnight.",
      },
    ],
    mistakes: [
      "Starting retinol too strong or too often, which leads to irritation and stopping altogether",
      "Skipping SPF while using retinol — it increases sun sensitivity",
      "Expecting fast results from anti-aging actives",
    ],
    tip: "Retinol increases sun sensitivity — daily SPF isn't optional when it's in your routine.",
    faqs: [
      {
        q: "What age should I start using retinol?",
        a: "There's no fixed age — it depends on your goals and skin's tolerance, but many start in their late 20s to 30s as a preventive step.",
      },
      {
        q: "How do I introduce retinol without irritation?",
        a: "Start at 2 nights a week, always follow with moisturizer, and increase frequency gradually as your skin builds tolerance.",
      },
      {
        q: "Is SPF really that important with anti-aging products?",
        a: "Yes — UV exposure is the single biggest accelerant of visible aging, and retinol specifically increases photosensitivity.",
      },
    ],
  },
  "dark-spots": {
    slug: "dark-spots",
    title: "Dark spots & hyperpigmentation",
    tagline: "Treatments target existing spots and help prevent new ones from environmental exposure.",
    causes:
      "Dark spots form when skin overproduces melanin in response to inflammation, acne, or UV exposure — they fade slowly and can return without consistent sun protection.",
    whatHelps: [
      {
        title: "Vitamin C + niacinamide (morning)",
        description: "Brightens tone and helps prevent new spots from environmental exposure.",
      },
      {
        title: "Alpha arbutin or tranexamic acid (evening)",
        description: "Targets existing dark spots and evens out overall skin tone with consistent use.",
      },
      {
        title: "Targeted brightening spot gel",
        description: "An extra concentrated layer applied directly over stubborn dark spots.",
      },
    ],
    mistakes: [
      "Expecting fast results — this takes 8–12 weeks minimum",
      "Skipping SPF, which undoes progress on existing spots",
      "Picking at acne, which creates new dark spots",
    ],
    tip: "Results take 8–12 weeks of consistent use — daily SPF is essential to protect progress.",
    faqs: [
      {
        q: "Why won't my dark spots fade?",
        a: "The most common reason is inconsistent SPF use — new pigment forms with every unprotected sun exposure, offsetting your progress.",
      },
      {
        q: "What's the difference between vitamin C and alpha arbutin for dark spots?",
        a: "Vitamin C brightens overall tone and prevents new pigment; alpha arbutin more specifically targets existing spots. Many routines use both.",
      },
      {
        q: "Can dark spots come back after they fade?",
        a: "Yes, especially without daily SPF — sun exposure is the main trigger for new pigment to form in the same areas.",
      },
    ],
  },
  redness: {
    slug: "redness",
    title: "Redness & sensitivity",
    tagline: "Treatments soothe and strengthen skin's resilience without harsh irritation.",
    causes:
      "Persistent redness can come from a weakened skin barrier, rosacea, reactive capillaries, or repeated exposure to harsh products and environmental triggers.",
    whatHelps: [
      {
        title: "Centella or niacinamide calming serum (morning)",
        description: "Soothes visible redness and strengthens skin's resilience through the day.",
      },
      {
        title: "Azelaic acid (evening)",
        description: "A gentle option that reduces redness without the irritation harsher actives can cause.",
      },
      {
        title: "Calming essence",
        description: "An extra soothing layer to reinforce comfort before moisturizer.",
      },
    ],
    mistakes: [
      "Layering multiple active ingredients at once",
      "Skipping patch tests before trying new products",
      "Using hot water or harsh scrubs, which worsen redness",
    ],
    tip: "Patch test new products for 48 hours, and avoid layering multiple active ingredients at once.",
    faqs: [
      {
        q: "Is redness always a sign of sensitive skin?",
        a: "Not always — it can also come from a temporary reaction to a new product, weather, or over-exfoliation, rather than being a permanent skin type trait.",
      },
      {
        q: "What ingredients are safest for redness-prone skin?",
        a: "Centella asiatica, niacinamide, and azelaic acid are generally well tolerated and specifically help calm visible redness.",
      },
      {
        q: "Should I stop all actives if my skin is red?",
        a: "Simplify first — drop back to a gentle cleanser and moisturizer for a few days, then reintroduce one product at a time.",
      },
    ],
  },
};
