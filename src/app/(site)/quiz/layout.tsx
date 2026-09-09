import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Take the Skin Quiz — LoveSkin",
  description:
    "Answer a few quick questions about your skin type, concerns, and habits to get a personalized AM/PM skincare routine — free, no sign-up required.",
  alternates: {
    canonical: "/quiz",
  },
};

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return children;
}
