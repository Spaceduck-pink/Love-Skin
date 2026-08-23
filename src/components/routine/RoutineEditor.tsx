"use client";

import { useActionState, useState } from "react";
import { updateRoutine, type RoutineState } from "@/lib/routine-actions";
import type { RoutineStep } from "@/lib/types";
import styles from "./RoutineEditor.module.css";

const initialState: RoutineState = {};

export interface RoutineProduct {
  title: string;
  description: string;
}

interface RoutineEditorProps {
  am: RoutineStep[];
  pm: RoutineStep[];
  products: RoutineProduct[];
}

function emptyStep(): RoutineStep {
  return { title: "", description: "" };
}

interface RoutineListProps {
  period: "am" | "pm";
  label: string;
  steps: RoutineStep[];
  products: RoutineProduct[];
  onChange: (steps: RoutineStep[]) => void;
}

function RoutineList({ period, label, steps, products, onChange }: RoutineListProps) {
  const datalistId = `${period}-product-options`;

  const updateStep = (index: number, field: keyof RoutineStep, value: string) => {
    onChange(steps.map((step, i) => (i === index ? { ...step, [field]: value } : step)));
  };

  const updateTitle = (index: number, value: string) => {
    const matchedProduct = products.find((product) => product.title === value);
    onChange(
      steps.map((step, i) => {
        if (i !== index) return step;
        // Picking a suggested product also fills in its description, but
        // only if the user hasn't already written their own notes.
        if (matchedProduct && !step.description) {
          return { title: value, description: matchedProduct.description };
        }
        return { ...step, title: value };
      }),
    );
  };

  const removeStep = (index: number) => {
    onChange(steps.filter((_, i) => i !== index));
  };

  const moveStep = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= steps.length) return;
    const next = [...steps];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const addStep = () => {
    onChange([...steps, emptyStep()]);
  };

  return (
    <section className={styles.card} aria-labelledby={`${period}-heading`}>
      <h2 id={`${period}-heading`} className={styles.cardHeading}>
        {label}
      </h2>
      <ol className={styles.stepList}>
        {steps.map((step, index) => (
          <li key={index} className={styles.step}>
            <div className={styles.stepHeader}>
              <span className={styles.stepIndex}>{index + 1}</span>
              <input
                type="text"
                name={`${period}Title`}
                value={step.title}
                onChange={(event) => updateTitle(index, event.target.value)}
                placeholder="Step title"
                maxLength={80}
                list={datalistId}
                className={styles.titleInput}
                aria-label={`${label} step ${index + 1} title`}
                required
              />
              <div className={styles.moveControls}>
                <button
                  type="button"
                  className={styles.moveBtn}
                  onClick={() => moveStep(index, -1)}
                  disabled={index === 0}
                  aria-label={`Move ${label.toLowerCase()} step ${index + 1} up`}
                >
                  ▲
                </button>
                <button
                  type="button"
                  className={styles.moveBtn}
                  onClick={() => moveStep(index, 1)}
                  disabled={index === steps.length - 1}
                  aria-label={`Move ${label.toLowerCase()} step ${index + 1} down`}
                >
                  ▼
                </button>
              </div>
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => removeStep(index)}
                aria-label={`Remove ${label.toLowerCase()} step ${index + 1}`}
              >
                ✕
              </button>
            </div>
            <textarea
              name={`${period}Description`}
              value={step.description}
              onChange={(event) => updateStep(index, "description", event.target.value)}
              placeholder="Notes (optional)"
              maxLength={280}
              rows={3}
              className={styles.descriptionInput}
              aria-label={`${label} step ${index + 1} notes`}
            />
          </li>
        ))}
      </ol>
      <datalist id={datalistId}>
        {products.map((product) => (
          <option key={product.title} value={product.title} />
        ))}
      </datalist>
      <button type="button" className={styles.addBtn} onClick={addStep}>
        + Add step
      </button>
      <p className={styles.hint}>Start typing a step title to pick from LoveSkin&apos;s product types.</p>
    </section>
  );
}

export default function RoutineEditor({ am: initialAm, pm: initialPm, products }: RoutineEditorProps) {
  const [state, formAction, pending] = useActionState(updateRoutine, initialState);
  const [am, setAm] = useState<RoutineStep[]>(initialAm);
  const [pm, setPm] = useState<RoutineStep[]>(initialPm);

  return (
    <form action={formAction} className={styles.form}>
      <div className={styles.grid}>
        <RoutineList period="am" label="Morning" steps={am} products={products} onChange={setAm} />
        <RoutineList period="pm" label="Evening" steps={pm} products={products} onChange={setPm} />
      </div>

      <div className={styles.actions}>
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? "Saving…" : "Save changes"}
        </button>
        {state.error && (
          <p className={styles.error} role="alert">
            {state.error}
          </p>
        )}
        {state.saved && (
          <p className={styles.notice} role="status">
            Saved.
          </p>
        )}
      </div>
    </form>
  );
}
