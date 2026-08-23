import type { Metadata } from "next";
import Link from "next/link";
import styles from "./index.module.css";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const sections = [
  {
    href: "/admin/subscribers",
    title: "Subscribers",
    description: "View and delete newsletter signups.",
  },
  {
    href: "/admin/products",
    title: "Products",
    description: "Create, edit, and delete skincare products.",
  },
  {
    href: "/admin/users",
    title: "Users",
    description: "View users and change roles.",
  },
];

export default function AdminIndexPage() {
  return (
    <div className={styles.grid}>
      {sections.map((section) => (
        <Link key={section.href} href={section.href} className={styles.card}>
          <h2 className={styles.cardTitle}>{section.title}</h2>
          <p className={styles.cardDescription}>{section.description}</p>
        </Link>
      ))}
    </div>
  );
}
