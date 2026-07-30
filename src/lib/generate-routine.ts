import type {
  Concern,
  QuizAnswers,
  RoutineResult,
  RoutineStep,
  SkinType,
} from "./types";

interface SkinTypeProfile {
  label: string;
  description: string;
  cleanser: RoutineStep;
  oilCleanser: RoutineStep;
  toner: RoutineStep;
  moisturizer: RoutineStep;
  facialOil: RoutineStep;
}

interface ConcernProfile {
  label: string;
  amTreatment: RoutineStep;
  pmTreatment: RoutineStep;
  extra: RoutineStep;
  eyeCream: RoutineStep;
  tip: string;
}

const skinTypeProfiles: Record<SkinType, SkinTypeProfile> = {
  oily: {
    label: "oily",
    description:
      "your skin tends to produce extra oil, so the routine leans on lightweight, oil-free formulas that won't clog pores.",
    cleanser: {
      title: "Gel or foaming cleanser",
      description: "A gel-based cleanser that clears excess oil without over-stripping skin.",
    },
    oilCleanser: {
      title: "Oil cleanser (first cleanse)",
      description: "Melts away sunscreen and sebum buildup before your main cleanser.",
    },
    toner: {
      title: "Balancing toner",
      description: "An alcohol-free toner to remove residue and tighten the look of pores.",
    },
    moisturizer: {
      title: "Oil-free gel moisturizer",
      description: "Lightweight hydration that won't add extra shine or feel heavy.",
    },
    facialOil: {
      title: "Squalane (light layer)",
      description: "A featherweight oil that hydrates without adding greasiness — use sparingly.",
    },
  },
  dry: {
    label: "dry",
    description:
      "your skin needs consistent moisture, so the routine focuses on rich, barrier-supporting hydration.",
    cleanser: {
      title: "Cream or milk cleanser",
      description: "A non-foaming cleanser that clears the skin without pulling out moisture.",
    },
    oilCleanser: {
      title: "Nourishing oil cleanser",
      description: "Dissolves sunscreen and makeup while adding a first layer of hydration.",
    },
    toner: {
      title: "Hydrating toner",
      description: "An essence-like toner that preps skin to absorb the next steps.",
    },
    moisturizer: {
      title: "Rich cream moisturizer",
      description: "A thicker cream to lock in moisture and ease tightness or flaking.",
    },
    facialOil: {
      title: "Nourishing facial oil",
      description: "Seals in your moisturizer and softens rough or flaky patches overnight.",
    },
  },
  combination: {
    label: "combination",
    description:
      "your T-zone and cheeks behave differently, so the routine balances oil control with hydration.",
    cleanser: {
      title: "Gentle gel cleanser",
      description: "Cleans the oily T-zone thoroughly without over-drying the cheeks.",
    },
    oilCleanser: {
      title: "Light oil cleanser",
      description: "Lifts off sunscreen and impurities evenly across combination skin.",
    },
    toner: {
      title: "Balancing toner",
      description: "Helps even out oil and hydration levels across your face.",
    },
    moisturizer: {
      title: "Lightweight lotion moisturizer",
      description: "Hydrates drier areas while staying light enough for the T-zone.",
    },
    facialOil: {
      title: "Squalane (light layer)",
      description: "A thin layer on drier zones only, for extra comfort overnight.",
    },
  },
  normal: {
    label: "normal",
    description: "your skin is fairly balanced, so the routine keeps things simple and consistent.",
    cleanser: {
      title: "Gentle everyday cleanser",
      description: "A mild, pH-balanced cleanser that keeps skin comfortable.",
    },
    oilCleanser: {
      title: "Light oil cleanser",
      description: "An easy first step to fully remove sunscreen and daily buildup.",
    },
    toner: {
      title: "Hydrating toner",
      description: "Adds a light layer of hydration and preps skin for treatment steps.",
    },
    moisturizer: {
      title: "Lightweight moisturizer",
      description: "Everyday hydration that keeps skin comfortable without feeling heavy.",
    },
    facialOil: {
      title: "Light facial oil",
      description: "An optional finishing layer to lock in hydration overnight.",
    },
  },
  sensitive: {
    label: "sensitive",
    description:
      "your skin reacts easily, so the routine prioritizes fragrance-free, barrier-supporting products.",
    cleanser: {
      title: "Fragrance-free gentle cleanser",
      description: "A low-irritation, soap-free cleanser that respects your skin barrier.",
    },
    oilCleanser: {
      title: "Fragrance-free oil cleanser",
      description: "A gentle first cleanse to lift off sunscreen without rubbing or irritation.",
    },
    toner: {
      title: "Soothing, alcohol-free toner",
      description: "Calms and preps skin without stinging or added fragrance.",
    },
    moisturizer: {
      title: "Barrier-repair moisturizer",
      description: "A ceramide-rich cream that reinforces your skin barrier and reduces reactivity.",
    },
    facialOil: {
      title: "Fragrance-free calming oil",
      description: "A gentle occlusive layer to soothe and protect overnight.",
    },
  },
};

const concernProfiles: Record<Concern, ConcernProfile> = {
  acne: {
    label: "acne & breakouts",
    amTreatment: {
      title: "Niacinamide serum",
      description: "Helps regulate oil production and calm redness from breakouts through the day.",
    },
    pmTreatment: {
      title: "Salicylic acid (BHA) treatment",
      description: "Use 2–3 nights a week to clear pores and reduce breakouts. Alternate with rest nights.",
    },
    extra: {
      title: "Spot treatment",
      description: "A targeted benzoyl peroxide or sulfur treatment applied directly to active breakouts.",
    },
    eyeCream: {
      title: "Lightweight, oil-free eye cream",
      description: "Hydrates the eye area without contributing to congestion.",
    },
    tip: "Avoid picking at breakouts, and change pillowcases weekly to cut down on bacteria transfer.",
  },
  dullness: {
    label: "dullness & uneven texture",
    amTreatment: {
      title: "Vitamin C serum",
      description: "Brightens skin tone and helps protect against environmental dullness during the day.",
    },
    pmTreatment: {
      title: "AHA exfoliating treatment",
      description: "Use 2 nights a week to gently resurface skin and smooth texture over time.",
    },
    extra: {
      title: "Hydrating essence",
      description: "A watery layer that boosts glow and preps skin before your serum.",
    },
    eyeCream: {
      title: "Brightening eye cream",
      description: "Targets dullness and tiredness around the eye area.",
    },
    tip: "Exfoliation works best paired with daily SPF — new skin is more sensitive to sun exposure.",
  },
  aging: {
    label: "fine lines & aging",
    amTreatment: {
      title: "Vitamin C + peptide serum",
      description: "Antioxidant protection alongside peptides that support skin's firmness over time.",
    },
    pmTreatment: {
      title: "Retinol treatment",
      description: "Start 2 nights a week and build up slowly to support cell turnover and firmness.",
    },
    extra: {
      title: "Firming essence",
      description: "An extra hydrating layer that supports skin elasticity overnight.",
    },
    eyeCream: {
      title: "Peptide eye cream",
      description: "Targets fine lines and loss of firmness around the delicate eye area.",
    },
    tip: "Retinol increases sun sensitivity — daily SPF isn't optional when it's in your routine.",
  },
  "dark-spots": {
    label: "dark spots & hyperpigmentation",
    amTreatment: {
      title: "Vitamin C + niacinamide serum",
      description: "Brightens tone and helps prevent new spots from environmental exposure.",
    },
    pmTreatment: {
      title: "Alpha arbutin or tranexamic acid serum",
      description: "Targets existing dark spots and evens out overall skin tone with consistent use.",
    },
    extra: {
      title: "Targeted brightening spot gel",
      description: "An extra concentrated layer applied directly over stubborn dark spots.",
    },
    eyeCream: {
      title: "Brightening eye cream",
      description: "Helps address discoloration around the eye area.",
    },
    tip: "Results take 8–12 weeks of consistent use — daily SPF is essential to protect progress.",
  },
  redness: {
    label: "redness & sensitivity",
    amTreatment: {
      title: "Centella or niacinamide calming serum",
      description: "Soothes visible redness and strengthens skin's resilience through the day.",
    },
    pmTreatment: {
      title: "Azelaic acid treatment",
      description: "A gentle option that reduces redness without the irritation harsher actives can cause.",
    },
    extra: {
      title: "Calming essence",
      description: "An extra soothing layer to reinforce comfort before moisturizer.",
    },
    eyeCream: {
      title: "Soothing, fragrance-free eye cream",
      description: "Gentle hydration for a sensitive eye area.",
    },
    tip: "Patch test new products for 48 hours, and avoid layering multiple active ingredients at once.",
  },
};

function spfStep(skinType: SkinType, spfUsage: QuizAnswers["spfUsage"]): RoutineStep {
  const base =
    skinType === "oily" || skinType === "combination"
      ? "Mattifying, oil-free SPF 30+"
      : skinType === "sensitive"
        ? "Mineral SPF 30+ (zinc oxide)"
        : "Broad-spectrum SPF 30+";

  const description =
    spfUsage === "rarely"
      ? "The single most impactful step you can add — try applying it every morning, even on cloudy or indoor days."
      : spfUsage === "sometimes"
        ? "Aim to make this a daily habit — consistency is what protects your results long-term."
        : "Keep up the daily habit — it protects your skin and everything else in this routine.";

  return { title: base, description };
}

function middayNote(middayFeel: QuizAnswers["middayFeel"]): string {
  switch (middayFeel) {
    case "shiny":
      return "Since your skin gets shiny by midday, blotting paper or a light setting powder can help between steps.";
    case "tight":
      return "Since your skin feels tight by midday, keep a hydrating mist or facial spray on hand to refresh it.";
    case "varies":
      return "Since your skin varies by area, feel free to apply moisturizer unevenly — more where it's dry, less on oilier zones.";
    default:
      return "Your skin staying comfortable through the day is a good sign your routine is balanced — keep an eye on it as seasons change.";
  }
}

export function generateRoutine(answers: QuizAnswers): RoutineResult {
  const skin = skinTypeProfiles[answers.skinType];
  const concern = concernProfiles[answers.concern];
  const spf = spfStep(answers.skinType, answers.spfUsage);

  let am: RoutineStep[];
  let pm: RoutineStep[];

  if (answers.complexity === "minimal") {
    am = [skin.cleanser, skin.moisturizer, spf];
    pm = [skin.cleanser, concern.pmTreatment, skin.moisturizer];
  } else if (answers.complexity === "standard") {
    am = [skin.cleanser, concern.amTreatment, concern.eyeCream, skin.moisturizer, spf];
    pm = [skin.cleanser, skin.toner, concern.pmTreatment, concern.eyeCream, skin.moisturizer];
  } else {
    am = [
      skin.cleanser,
      skin.toner,
      concern.amTreatment,
      concern.eyeCream,
      concern.extra,
      skin.moisturizer,
      spf,
    ];
    pm = [
      skin.oilCleanser,
      skin.cleanser,
      skin.toner,
      concern.pmTreatment,
      concern.extra,
      concern.eyeCream,
      skin.facialOil,
      skin.moisturizer,
    ];
  }

  const tags = [skin.label, concern.label, `${answers.complexity} routine`];

  const capitalizedSkinDescription =
    skin.description.charAt(0).toUpperCase() + skin.description.slice(1);
  const summary = `${capitalizedSkinDescription} We've focused your treatment steps on ${concern.label} — layered from lightest to richest.`;

  const tips = [concern.tip, middayNote(answers.middayFeel)];

  return {
    headline: `Your ${skin.label} skin, ${concern.label} routine`,
    summary,
    tags,
    am,
    pm,
    tips,
  };
}
