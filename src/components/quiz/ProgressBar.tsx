import styles from "./ProgressBar.module.css";

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percent = Math.round((current / total) * 100);

  return (
    <div className={styles.wrapper}>
      <div className={styles.labelRow}>
        <span className="mono-tag">
          Question {current} of {total}
        </span>
        <span className={styles.percent}>{percent}%</span>
      </div>
      <div
        className={styles.track}
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Quiz progress: ${percent}%`}
      >
        <div className={styles.fill} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
