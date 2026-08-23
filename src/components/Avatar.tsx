import styles from "./Avatar.module.css";

interface AvatarProps {
  avatarUrl?: string | null;
  name?: string | null;
  size?: number;
  className?: string;
}

function getInitial(name?: string | null) {
  const trimmed = name?.trim();
  return trimmed ? trimmed[0].toUpperCase() : "?";
}

export default function Avatar({ avatarUrl, name, size = 36, className }: AvatarProps) {
  const style = { width: size, height: size, fontSize: size * 0.42 };

  if (avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- external avatar hosts (Google, Supabase Storage) would need next/image remotePatterns per domain
      <img
        src={avatarUrl}
        alt={name ? `${name}'s avatar` : "Avatar"}
        className={`${styles.avatar} ${className ?? ""}`}
        style={style}
        width={size}
        height={size}
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <span
      className={`${styles.avatar} ${styles.fallback} ${className ?? ""}`}
      style={style}
      aria-hidden="true"
    >
      {getInitial(name)}
    </span>
  );
}
