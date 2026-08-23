"use client";

import { useActionState, useState } from "react";
import { updateRoutine, type RoutineState } from "@/lib/routine-actions";
import type { RoutineStep } from "@/lib/types";
import styles from "./RoutineEditor.module.css";

const initialState: RoutineState = {};

interface RoutineEditorProps {
  am: RoutineStep[];
  pm: RoutineStep[];
}

function emptyStep(): RoutineStep {
  return { title: "", description: "" };
}

interface RoutineListProps {
  period: "am" | "pm";
  label: string;
  steps: RoutineStep[];
  onChange: (steps: RoutineStep[]) => void;
}

function RoutineList({ period, label, steps, onChange }: RoutineListProps) {
  const updateStep = (index: number, field: keyof RoutineStep, value: string) => {
    onChange(steps.map((step, i) => (i === index ? { ...step, [field]: value } : step)));
  };

  const removeStep = (index: number) => {
    onChange(steps.filter((_, i) => i !== index));
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
                onChange={(event) => updateStep(index, "title", event.target.value)}
                placeholder="Step title"
                maxLength={80}
                className={styles.titleInput}
                aria-label={`${label} step ${index + 1} title`}
                required
              />
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
      <button type="button" className={styles.addBtn} onClick={addStep}>
        + Add step
      </button>
    </section>
  );
}

export default function RoutineEditor({ am: initialAm, pm: initialPm }: RoutineEditorProps) {
  const [state, formAction, pending] = useActionState(updateRoutine, initialState);
  const [am, setAm] = useState<RoutineStep[]>(initialAm);
  const [pm, setPm] = useState<RoutineStep[]>(initialPm);

  return (
    <form action={formAction} className={styles.form}>
      <div className={styles.grid}>
        <RoutineList period="am" label="Morning" steps={am} onChange={setAm} />
        <RoutineList period="pm" label="Evening" steps={pm} onChange={setPm} />
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
